import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from '../config';
import User from '../models/User';
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const OAuth2Strategy  = require('passport-oauth2').Strategy;
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';


passport.use('signinGoogle', new GoogleStrategy({
    clientID: config.OAUTH.GOOGLE.CLIENT_ID,
    clientSecret: config.OAUTH.GOOGLE.CLIENT_SECRET,
    callbackURL: 'https://localhost:3443/api/users/oauth/google/callback/signin'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findOne({ 'google.methodId': profile.id, 'google.email': profile.emails[0].value });
        if (existingUser) {
            if (existingUser.banned) {
                return done(null, { message: "Your account is blocked", method: 'signinGoogle' });
            }
            return done(null, { user: existingUser, method: 'signinGoogle' });
        }

        return done(null, { message: "Account not registered.", method: 'signinGoogle' });
    } catch(error) {
        return done(error, false, error.message);
    }
}));

passport.use('signinGitHub', new GitHubStrategy({
    clientID: config.OAUTH.GITHUB.CLIENT_ID,
    clientSecret: config.OAUTH.GITHUB.CLIENT_SECRET,
    callbackURL: 'https://localhost:3443/api/users/oauth/github/callback/signin'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findOne({ 'github.methodId': profile.id, 'github.name': profile.username });
        if (existingUser) {
            if (existingUser.banned) {
                return done(null, { message: "Your account is blocked", method: 'signinGitHub' });
            }
            return done(null, { user: existingUser, method: 'signinGitHub' });
        }

        return done(null, { message: "Account not registered.", method: 'signinGitHub' });
    } catch(error) {
        return done(error, false, error.message);
    }
}));

passport.use('signinORCID', new OAuth2Strategy({
    authorizationURL: `https://sandbox.orcid.org/oauth/authorize?client_id=${config.OAUTH.ORCID.CLIENT_ID}&response_type=code&scope=/authenticate&redirect_uri=https://localhost:3443/api/users/oauth/orcid/callback/signin`,
    tokenURL: `https://sandbox.orcid.org/oauth/authorize?client_id=${config.OAUTH.ORCID.CLIENT_ID}&response_type=token&scope=openid&redirect_uri=https://localhost:3443/api/users/oauth/orcid/callback/signin`,
    scope: '/authenticate',
    clientID: config.OAUTH.ORCID.CLIENT_ID,
    clientSecret: config.OAUTH.ORCID.CLIENT_SECRET,
    callbackURL: 'https://localhost:3443/api/users/oauth/orcid/callback/signin',
    passReqToCallback: true,
}, async (req,accessToken, refreshToken, profile, done) => {
    try {
        const body = new URLSearchParams({
            'client_id': config.OAUTH.ORCID.CLIENT_ID,
            'client_secret': config.OAUTH.ORCID.CLIENT_SECRET,
            'grant_type': 'authorization_code',
            'code': req.query.code
        });
        const response = await fetch('https://sandbox.orcid.org/oauth/token', {
            method: 'post',
            body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json' 
            }
        });
        const data = await response.json();
        const existingUser = await User.findOne({ 'orcid.orcid': data.orcid, 'orcid.name': data.name });
        if (existingUser) {
            if (existingUser.banned) {
                return done(null, { message: "Your account is blocked", method: 'signinORCID' });
            }
            return done(null, { user: existingUser, method: 'signinORCID' });
        }

        return done(null, { message: "Account not registered.", method: 'signinORCID' });
    } catch(error) {
        return done(error, false, error.message);
    }
}));

passport.use('connectGoogle', new GoogleStrategy({
    clientID: config.OAUTH.GOOGLE.CLIENT_ID,
    clientSecret: config.OAUTH.GOOGLE.CLIENT_SECRET,
    callbackURL: 'https://localhost:3443/api/users/oauth/google/callback/connect',
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        const res = JSON.parse(req.query.state);   
        const { userId, token } = res;
        const decoded = jwt.verify(token, config.SECRET);

        if (decoded.userId == userId) {
            const user = await User.findOne({ userId });
            if (!user) {
                return done(null, { message: "Invalid token", method: 'connectGoogle' });
            }

            if ((user.google) && (user.google.hasOwnProperty('methodId')) && (user.google.methodId)) {
                return done(null, { message: "Your account has already been connected.", method: 'connectGoogle' });
            }

            const existingUser = await User.findOne({ 'google.email': profile.emails[0].value, 'google.methodId': profile.id });
            if (existingUser) {
                return done(null, { message: "Account already used.", method: 'connectGoogle' });
            }         

            user.google.methodId = profile.id;
            user.google.email = profile.emails[0].value;
            user.google.name = profile.displayName;
            const userSaved = await user.save();
            return done(null, { user: userSaved, method: 'connectGoogle' });
        }        

        return done(null, { message: "Unauthorized", method: 'connectGoogle' });
    } catch(error) {
        return done(error, false, error.message);
    }
}));

passport.use('connectGithub',new GitHubStrategy({
    clientID: config.OAUTH.GITHUB.CLIENT_ID,
    clientSecret: config.OAUTH.GITHUB.CLIENT_SECRET,
    callbackURL: 'https://localhost:3443/api/users/oauth/github/callback/connect',
    passReqToCallback: true,
}, async (req,accessToken, refreshToken, profile, done) => {
    try {
        const res = JSON.parse(req.query.state);   
        const { userId, token } = res;
        const decoded = jwt.verify(token, config.SECRET);

        if (decoded.userId == userId) {
            const user = await User.findOne({ userId });
            if (!user) {
                return done(null, { message: "Invalid token", method: 'connectGithub' });
            }

            if ((user.github) && (user.github.hasOwnProperty('methodId')) && (user.github.methodId)) {
                return done(null, { message: "Your account has already been connected.", method: 'connectGithub' });
            }

            const existingUser = await User.findOne({ 'github.name': profile.username, 'github.methodId': profile.id });
            if (existingUser) {
                return done(null, { message: "Account already used.", method: 'connectGithub' });
            }         

            user.github.methodId = profile.id;
            user.github.name = profile.username;
            const userSaved = await user.save();
            return done(null, { user: userSaved, method: 'connectGithub' });
        }        

        return done(null, { message: "Unauthorized", method: 'connectGithub' });
    } catch(error) {
        return done(error, false, error.message);
    }
}));

passport.use('connectORCID', new OAuth2Strategy({
    authorizationURL: `https://sandbox.orcid.org/oauth/authorize?client_id=${config.OAUTH.ORCID.CLIENT_ID}&response_type=code&scope=/authenticate&redirect_uri=https://localhost:3443/api/users/oauth/orcid/callback/connect`,
    tokenURL: `https://sandbox.orcid.org/oauth/authorize?client_id=${config.OAUTH.ORCID.CLIENT_ID}&response_type=token&scope=openid&redirect_uri=https://localhost:3443/api/users/oauth/orcid/callback/connect`,
    scope: '/authenticate',
    clientID: config.OAUTH.ORCID.CLIENT_ID,
    clientSecret: config.OAUTH.ORCID.CLIENT_SECRET,
    callbackURL: 'https://localhost:3443/api/users/oauth/orcid/callback/connect',
    passReqToCallback: true,
}, async (req,accessToken, refreshToken, profile, done) => {
    try {
        const res = JSON.parse(req.query.state);   
        const { userId, token } = res;
        const decoded = jwt.verify(token, config.SECRET);

        if (decoded.userId == userId) {
            const user = await User.findOne({ userId });
            if (!user) {
                return done(null, { message: "Invalid token", method: 'connectORCID' });
            }

            if ((user.orcid) && (user.orcid.hasOwnProperty('orcid')) && (user.orcid.orcid)) {
                return done(null, { message: "Your account has already been connected.", method: 'connectORCID' });
            }

            const body = new URLSearchParams({
                'client_id': config.OAUTH.ORCID.CLIENT_ID,
                'client_secret': config.OAUTH.ORCID.CLIENT_SECRET,
                'grant_type': 'authorization_code',
                'code': req.query.code
            });
            const response = await fetch('https://sandbox.orcid.org/oauth/token', {
                method: 'post',
                body,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json' 
                }
            });
            const data = await response.json();

            const existingUser = await User.findOne({ 'orcid.orcid': data.orcid, 'orcid.name': data.name });
            if (existingUser) {
                return done(null, { message: "Account already used.", method: 'connectORCID' });
            }         

            user.orcid.orcid = data.orcid;
            user.orcid.name = data.name;
            const userSaved = await user.save();
            return done(null, { user: userSaved, method: 'connectORCID' });
        }        

        return done(null, { message: "Unauthorized", method: 'connectORCID' });
    } catch(error) {
        return done(error, false, error.message);
    }
}));