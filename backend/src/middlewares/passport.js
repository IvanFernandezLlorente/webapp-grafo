import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from '../config';
import User from '../models/User';
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;


passport.use('signinGoogle', new GoogleStrategy({
    clientID: config.OAUTH.GOOGLE.CLIENT_ID,
    clientSecret: config.OAUTH.GOOGLE.CLIENT_SECRET,
    callbackURL: 'http://localhost:4000/api/users/oauth/google/callback/signin'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findOne({ 'google.methodId': profile.id, 'google.email': profile.emails[0].value });
        if (existingUser) {
            return done(null, existingUser);
        }

        return done(null, { message: "Account not registered." });
    } catch(error) {
        return done(error, false, error.message);
    }
}));

passport.use('signinGitHub', new GitHubStrategy({
    clientID: config.OAUTH.GITHUB.CLIENT_ID,
    clientSecret: config.OAUTH.GITHUB.CLIENT_SECRET,
    callbackURL: 'http://localhost:4000/api/users/oauth/github/callback/signin'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findOne({ methodId: profile.id, method: "github" });
        if (existingUser) {
            return done(null, existingUser);
        }

        return done(null, { message: "Account not registered." });
    } catch(error) {
        return done(error, false, error.message);
    }
}));


passport.use('connectGoogle', new GoogleStrategy({
    clientID: config.OAUTH.GOOGLE.CLIENT_ID,
    clientSecret: config.OAUTH.GOOGLE.CLIENT_SECRET,
    callbackURL: 'http://localhost:4000/api/users/oauth/google/callback/connect',
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

passport.use('signupGithub',new GitHubStrategy({
    clientID: config.OAUTH.GITHUB.CLIENT_ID,
    clientSecret: config.OAUTH.GITHUB.CLIENT_SECRET,
    callbackURL: 'http://localhost:4000/api/users/oauth/github/callback/signup',
    scope: [ 'user:email' ]
}, async (accessToken, refreshToken, profile, done) => {
        try {
        const existingUser = await User.findOne({ method: profile.provider, methodId: profile.id });
        if (existingUser) {
            return done(null, { message: "Account already used." });
        }

        return done(null, profile, { method: "github"});
    } catch(error) {
        return done(error, false, error.message);
    }
}));