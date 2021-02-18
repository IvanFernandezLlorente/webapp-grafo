import passport from 'passport';
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
        const existingUser = await User.findOne({ methodId: profile.id, method: "google" });
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


passport.use('signupGoogle', new GoogleStrategy({
    clientID: config.OAUTH.GOOGLE.CLIENT_ID,
    clientSecret: config.OAUTH.GOOGLE.CLIENT_SECRET,
    callbackURL: 'http://localhost:4000/api/users/oauth/google/callback/signup'
}, async (accessToken, refreshToken, profile, done) => {
        try {
        const existingUser = await User.findOne({ email: profile.emails[0].value });
        if (existingUser) {
            return done(null, { message: "Account already used." });
        }

        return done(null, profile, { method: "google"});
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