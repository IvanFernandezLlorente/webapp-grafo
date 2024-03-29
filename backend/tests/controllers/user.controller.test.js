import User from "../../src/models/User";
import Application from '../../src/models/Application';
import Problem from "../../src/models/Problem";
import Publication from "../../src/models/Publication";
const userController = require('../../src/controllers/user.controller');
import request from 'supertest';
import jwt from 'jsonwebtoken';

jest.mock('../../src/middlewares/auth.jwt');
jest.mock('../../src/middlewares/verifySignUp');
const authJwt = require('../../src/middlewares/auth.jwt');
const verifySignUp = require('../../src/middlewares/verifySignUp');
import app from '../../src/app';


let mockUsers;
let mockApplications;
let mockPublications;
let mockProblems;
describe('User controller', () => {
    beforeEach(() => {
        mockUsers = [
            {
                _id: 1,
                name: "el nombre 1",
                email: "el email 1",
                password: "la pass 1",
                userId: "el-userId-1",
                roles: ['user']
            },
            {
                _id: 2,
                name: "el nombre 2",
                email: "el email 2",
                password: "la pass 2",
                userId: "el-userId-2",
                roles: ['user']
            },
            {
                _id: 3,
                name: "el nombre 3",
                email: "el email 3",
                password: "la pass 3",
                userId: "no-copiar-id",
                roles: ['user'],
                banned: true
            }
        ],
        mockProblems = [
            {
                _id: 1,
                name: "el problem 1",
                problemId: "el-problemId-1",
                user: ["el-userId-2"]
            }       
        ],
        mockPublications = [
            {
                _id: 2,
                title: "el publication 2",
                publicationId: "el-publicationId-2",
                user: ["el-userId-2"],
            },
        ],
        mockApplications = [
            {
                _id: 1,
                name: 'the name',
                email: 'new email',
                accepted: true,
                token: 'the token'
            }
        ]
    });

    describe('Get Users', () => {
        
        it('Get all users', async () => {
            User.find = jest.fn(() => mockUsers);
            const res = await request(app).get('/api/users');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(3);
        });

        it('Get user by userId', async () => {
            User.findOne = jest.fn(() => mockUsers.filter( user => user.userId == 'el-userId-2'));
            const res = await request(app).get('/api/users/el-userId-2');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(1);
            expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({_id: 2})]));
        });

        it('Get user by userId not found', async () => {
            User.findOne = jest.fn(() => mockUsers.some( user => user.userId == "no-exist"));
            const res = await request(app).get('/api/users/no-exist');
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({ message: "User not found" }));
        });

        it('Get user by userId error', async () => {
            User.findOne = jest.fn(() => {throw Error});
            const res = await request(app).get('/api/users/no-exist');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });

        it('Get user by id', async () => {
            User.findOne = jest.fn(() => mockUsers.filter( user => user.userId == 'el-userId-2'));
            const res = await request(app).get('/api/users/id/el-userId-2');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(1);
            expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({_id: 2})]));
        });

        it('Get user by id not found', async () => {
            User.findOne = jest.fn(() => mockUsers.some( user => user.userId == "no-exist"));
            const res = await request(app).get('/api/users/id/no-exist');
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({ message: "User not found" }));
        });

        it('Get user by id error', async () => {
            User.findOne = jest.fn(() => {throw Error});
            const res = await request(app).get('/api/users/id/no-exist');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });
    });

    describe('User image profile', () => {
        beforeEach(() => {
            authJwt.verifyToken.mockImplementation((req, res, next) => next());
        });
        
        it('Get user not found', async () => {
            User.findOne = jest.fn(() => mockUsers.some( user => user.userId == "no-exist"));
            const res = await request(app).post('/api/users/images/no-exist');
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({ message: "User not found" }));
        });

        it('Get user error', async () => {
            User.findOne = jest.fn(() => {throw Error});
            const res = await request(app).post('/api/users/images/no-exist');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });

        it('User doesnt have rights to upload the image', async () => {
            User.findOne = jest.fn(() => mockUsers.filter( user => user.userId == 'el-userId-2'));
            authJwt.verifyToken.mockImplementation((req, res, next) => { 
                req.isAdmin = false; 
                req.userId = 'el-userId-2'
                next() 
            });

            const res = await request(app).post('/api/users/images/no-exist');
            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual(expect.objectContaining({ message: "Unauthorized" }));
        });

        it('User can upload the image', async () => {
            User.findOne = jest.fn(() => mockUsers.some( user => user.userId == 'el-userId-2'));
            User.findOneAndUpdate = jest.fn(() => {
                mockUsers[1] = {
                    _id: 2,
                    name: "el nombre 2",
                    email: "el email 2",
                    password: "la pass 2",
                    userId: "el-userId-2",
                    roles: ['user'],
                    imagenProfile: 'imagen'
                };
                return mockUsers[1];
            });
            authJwt.verifyToken.mockImplementation((req, res, next) => { 
                req.isAdmin = false; 
                req.userId = 'el-userId-2'
                next() 
            });

            const res = await request(app).post('/api/users/images/el-userId-2').send({
                imagenProfile: 'imagen'
            });
            expect(res.statusCode).toEqual(200);
            expect(mockUsers).toEqual(expect.arrayContaining([{
                _id: 2,
                name: "el nombre 2",
                email: "el email 2",
                password: "la pass 2",
                userId: "el-userId-2",
                roles: ['user'],
                imagenProfile: 'imagen'
            }]));
        });
    });

    describe('Update User', () => {
        beforeEach(() => {
            authJwt.verifyToken.mockImplementation((req, res, next) => next());
            verifySignUp.checkDuplicateNameOrEmail.mockImplementation((req, res, next) => next());
        });

        it('User not found', async () => {
            User.findOne = jest.fn(() => mockUsers.some( user => user.userId == "no-exist"));
            const res = await request(app).put('/api/users/no-exist');
            expect(authJwt.verifyToken).toHaveBeenCalledTimes(1);
            expect(verifySignUp.checkDuplicateNameOrEmail).toHaveBeenCalledTimes(1);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({ message: "User not found" }));
        });

        it('Update user error', async () => {
            User.findOne = jest.fn(() => {throw Error});
            const res = await request(app).put('/api/users/el-userId-2');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });

        it('User doesnt have rights to update', async () => {
            User.findOne = jest.fn(() => mockUsers.filter( user => user.userId == 'el-userId-2'));
            authJwt.verifyToken.mockImplementation((req, res, next) => { 
                req.isAdmin = false; 
                req.userId = 'el-userId-2'
                next() 
            });

            const res = await request(app).put('/api/users/no-exist');
            expect(authJwt.verifyToken).toHaveBeenCalledTimes(1);
            expect(verifySignUp.checkDuplicateNameOrEmail).toHaveBeenCalledTimes(1);
            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual(expect.objectContaining({ message: "Unauthorized" }));
        });

        it('User updates a userId no unique', async () => {
            User.findOne = jest.fn(() => mockUsers.filter( user => user.userId == 'el-userId-2'));
            authJwt.verifyToken.mockImplementation((req, res, next) => { 
                req.isAdmin = false; 
                req.userId = 'el-userId-2'
                next() 
            });
            
            const res = await request(app).put('/api/users/el-userId-2').send({
                userId: 'no-copiar-id'
            });
            expect(authJwt.verifyToken).toHaveBeenCalledTimes(1);
            expect(verifySignUp.checkDuplicateNameOrEmail).toHaveBeenCalledTimes(1);
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(expect.objectContaining({ message: "The userId already exists" }));
        });

        it('User updates a password', async () => {
            User.findOne = jest.fn(() => mockUsers.filter( user => user.userId == 'el-userId-2'));
            User.findOneAndUpdate = jest.fn(() => (mockUsers[1] = {
                _id: 2,
                name: "el nombre 2",
                email: "el email 2",
                password: "encrypted password",
                userId: "el-userId-2"
            }));
            User.encryptPassword = jest.fn(() => 'encrypted password')
            authJwt.verifyToken.mockImplementation((req, res, next) => { 
                req.isAdmin = false; 
                req.userId = 'el-userId-2'
                next() 
            });

            const res = await request(app).put('/api/users/el-userId-2').send({
                password: "another pass",
            });
            expect(authJwt.verifyToken).toHaveBeenCalledTimes(1);
            expect(verifySignUp.checkDuplicateNameOrEmail).toHaveBeenCalledTimes(1);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({
                _id: 2,
                name: "el nombre 2",
                email: "el email 2",
                password: "encrypted password",
                userId: "el-userId-2"
            }));
            expect(mockUsers).toHaveLength(3);
            expect(mockUsers).toEqual(expect.arrayContaining([{
                _id: 2,
                name: "el nombre 2",
                email: "el email 2",
                password: "encrypted password",
                userId: "el-userId-2"
            }]));
        });

        it('User isnt admin but can update', async () => {
            User.findOne = jest.fn(() => mockUsers.filter( user => user.userId == 'el-userId-2'));
            User.findOneAndUpdate = jest.fn(() => (mockUsers[1] = {
                _id: 2,
                name: "new name",
                email: "new email",
                password: "la pass 2",
                userId: "el-userId-2"
            }));
            authJwt.verifyToken.mockImplementation((req, res, next) => { 
                req.isAdmin = false; 
                req.userId = 'el-userId-2'
                next() 
            });

            const res = await request(app).put('/api/users/el-userId-2').send({
                name: "new name",
                email: "new email"
            });
            expect(authJwt.verifyToken).toHaveBeenCalledTimes(1);
            expect(verifySignUp.checkDuplicateNameOrEmail).toHaveBeenCalledTimes(1);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({
                _id: 2,
                name: "new name",
                email: "new email",
                password: "la pass 2",
                userId: "el-userId-2"
            }));
            expect(mockUsers).toHaveLength(3);
            expect(mockUsers).toEqual(expect.arrayContaining([{
                _id: 2,
                name: "new name",
                email: "new email",
                password: "la pass 2",
                userId: "el-userId-2"
            }]));
        });
    });

    describe('Delete Users', () => {
        beforeEach(() => {
            authJwt.verifyToken.mockImplementation((req, res, next) => next());
        });
        
        it('User not found', async () => {
            User.findOne = jest.fn(() => mockUsers.some( user => user.userId == "no-exist"));
            const res = await request(app).delete('/api/users/no-exist');
            expect(authJwt.verifyToken).toHaveBeenCalledTimes(1);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({ message: "User not found" }));
        });

        it('Delete user error', async () => {
            User.findOne = jest.fn(() => {throw Error});
            const res = await request(app).delete('/api/users/el-userId-2');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });

        it('User doesnt have rights to delete', async () => {
            User.findOne = jest.fn(() => mockUsers.filter( user => user.userId == 'el-userId-2'));
            authJwt.verifyToken.mockImplementation((req, res, next) => { 
                req.isAdmin = false; 
                req.userId = 'el-userId-2'
                next() 
            });

            const res = await request(app).delete('/api/users/no-exist');
            expect(authJwt.verifyToken).toHaveBeenCalledTimes(1);
            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual(expect.objectContaining({ message: "Unauthorized" }));
        });

        it('User isnt admin but can delete', async () => {
            User.findOne = jest.fn(() => mockUsers.filter( user => user.userId == 'el-userId-2'));
            User.findOneAndDelete = jest.fn(() => mockUsers.splice(1,1));
            authJwt.verifyToken.mockImplementation((req, res, next) => { 
                req.isAdmin = false; 
                req.userId = 'el-userId-2'
                next() 
            });

            Publication.find = jest.fn(() => mockPublications.filter(publication => publication.user.includes('el-userId-2')));
            Problem.find = jest.fn(() => mockProblems.filter(problem => problem.user.includes('el-userId-2')));
            
            const deleteReferencesMock = jest.fn()
            .mockImplementationOnce(() => {
                mockProblems[0] = {
                    _id: 1,
                    name: "el problem 1",
                    problemId: "el-problemId-1",
                    user: []
                }  
                return mockProblems
            })
            .mockImplementationOnce(() => {
                mockPublications[0] = {
                    _id: 2,
                    title: "el publication 2",
                    publicationId: "el-publicationId-2",
                    user: []
                }
                return mockPublications
            });
            userController.__Rewire__('deleteReferences', deleteReferencesMock)


            const res = await request(app).delete('/api/users/el-userId-2');
            expect(authJwt.verifyToken).toHaveBeenCalledTimes(1);
            expect(res.statusCode).toEqual(200);
            expect(mockUsers).toHaveLength(2);
            expect(mockUsers).toEqual(expect.not.arrayContaining([{
                _id: 2,
                name: "el nombre 2",
                email: "el email 2",
                password: "la pass 2",
                userId: "el-userId-2"
            }]));
            expect(mockProblems).toEqual(expect.not.arrayContaining([{
                _id: 2,
                name: "el problem 2",
                problemId: "el-problemId-2",
                user: []
            }]));
            expect(mockPublications).toEqual(expect.arrayContaining([{
                _id: 2,
                title: "el publication 2",
                publicationId: "el-publicationId-2",
                user: []
            }]));
        });
    });

    describe('User Sign In Local', () => {
        
        it('User not found', async () => {
            User.findOne = jest.fn(() => mockUsers.some( user => user.email == "email no exist"));
            const res = await request(app).post('/api/users/signin');
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({ message: "Email not found" }));
        });

        it('User sign in error', async () => {
            User.findOne = jest.fn(() => {throw Error});
            const res = await request(app).post('/api/users/signin');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });

        it('Password is not equal', async () => {
            User.findOne = jest.fn(() => mockUsers.filter( user => user.email == "el email 2"));
            User.comparePassword = jest.fn(() => 'la pass 2' == 'password typed');
            const res = await request(app).post('/api/users/signin');
            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual(expect.objectContaining({ message: "Invalid password" }));
        });

        it('User is banned', async () => {
            User.findOne = jest.fn(() => mockUsers.filter( user => user.email == "el email 3")[0]);
            User.comparePassword = jest.fn(() => 'la pass 3' == 'la pass 3');
            const res = await request(app).post('/api/users/signin');
            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual(expect.objectContaining({ message: "Your account is blocked"}));
        });

        it('Sign in user', async () => {
            User.findOne = jest.fn(() => mockUsers.filter( user => user.email == "el email 2")[0]);
            User.comparePassword = jest.fn(() => 'la pass 2' == 'la pass 2');
            const res = await request(app).post('/api/users/signin');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({
                id: 2,
                userId: "el-userId-2",
                roles: ['user']
            }));
            expect(res.body.token).toBeDefined();
        });
    });

    describe('User Sign Up Local', () => {
        beforeEach(() => {
            verifySignUp.checkDuplicateNameOrEmail.mockImplementation((req, res, next) => next());
            verifySignUp.checkRolesExisted.mockImplementation((req, res, next) => next());
        });
        
        it('User already exist', async () => {
            User.findOne = jest.fn(() => mockUsers.some( user => user.email == "el email 2"));
            const res = await request(app).post('/api/users/signup');
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(expect.objectContaining({ message: "The email already exists" }));
        });

        it('User sign up error', async () => {
            User.findOne = jest.fn(() => {throw Error});
            const res = await request(app).post('/api/users/signup');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });

        it('Email application is not accepted', async () => {
            User.findOne = jest.fn(() => mockUsers.some(user => user.email == "email no accepted"));
            Application.findOne = jest.fn(() => mockApplications.some(application => application.email == "email no accepted"));
            const res = await request(app).post('/api/users/signup').send({
                name: 'the name',
                email: 'email no accepted',
                password: 'la pass'
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(expect.objectContaining({ message: "The email is not accepted" }));
        });

        it('Invalid application token', async () => {
            User.findOne = jest.fn(() => mockUsers.some( user => user.email == "new email"));
            User.encryptPassword = jest.fn(() => 'encrypted password');
            Application.findOne = jest.fn(() => mockApplications.filter(application => application.email == "new email")[0]);
            Application.findOneAndDelete = jest.fn(() => mockApplications.splice(0, 1));
            jwt.verify = jest.fn(() => { return { email: 'new email', token: 'the token' } });

            const res = await request(app).post('/api/users/signup').send({
                name: 'the name',
                email: 'email no accepted',
                password: 'la pass',
                token: 'invalid'
            });
            expect(res.statusCode).toEqual(403);
            expect(res.body).toEqual(expect.objectContaining({ message: "Invalid token" }));
        });

        it('User sign up without rol', async () => {
            User.findOne = jest.fn(() => mockUsers.some( user => user.email == "new email"));
            User.encryptPassword = jest.fn(() => 'encrypted password');
            Application.findOne = jest.fn(() => mockApplications.filter(application => application.email == "new email")[0]);
            Application.findOneAndDelete = jest.fn(() => mockApplications.splice(0, 1));
            jwt.verify = jest.fn(() => { return { email: 'new email', token: 'the token' } });

            const saveNewUser = jest.fn(() => {
                mockUsers.push({ _id: 4, name: "the name", userId: 4, email: "new email", password: 'encrypted password', roles: ['user'] });
                return { _id: 4, name: "the name", userId: 4, email: "new email", password: 'encrypted password', roles: ['user'] }
            });
            userController.__Rewire__('saveNewUser', saveNewUser)

            const res = await request(app).post('/api/users/signup').send({
                name: 'the name',
                email: 'new email',
                password: 'la pass',
                token: 'the token'
            });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({
                id: 4,
                userId: 4,
                roles: ['user']
            }));
            expect(res.body.token).toBeDefined();
            expect(mockUsers).toHaveLength(4);
            expect(mockApplications).toHaveLength(0);
        });

        it('User sign up with rol admin', async () => {
            User.findOne = jest.fn(() => mockUsers.some( user => user.email == "new email"));
            User.encryptPassword = jest.fn(() => 'encrypted password');
            Application.findOne = jest.fn(() => mockApplications.filter(application => application.email == "new email")[0]);
            Application.findOneAndDelete = jest.fn(() => mockApplications.splice(0, 1));     
            jwt.verify = jest.fn(() => { return { email: 'new email', token: 'the token' } });

            const saveNewUser = jest.fn(() => {
                mockUsers.push({ _id: 4, name: "the name", userId: 4, email: "new email", password: 'encrypted password', roles: ['admin'] });
                return { _id: 4, name: "the name", userId: 4, email: "new email", password: 'encrypted password', roles: ['admin'] }
            });
            userController.__Rewire__('saveNewUser', saveNewUser)

            const res = await request(app).post('/api/users/signup').send({
                name: 'the name',
                email: 'new email',
                password: 'la pass',
                roles: ['admin'],
                token: 'the token'
            });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({
                id: 4,
                userId: 4,
                roles: ['admin']
            }));
            expect(res.body.token).toBeDefined();
            expect(mockUsers).toHaveLength(4);
            expect(mockApplications).toHaveLength(0);
        });
    });

    describe('Get Token', () => {
        beforeEach(() => {
            authJwt.verifyToken.mockImplementation((req, res, next) => next());
        });

        it('Get token by user not found', async () => {
            User.findById = jest.fn(() => mockUsers.some( user => user._id == 4));
            const res = await request(app).get('/api/users/token');
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({ message: "User not found" }));
        });

        it('Get user by userId error', async () => {
            User.findById = jest.fn(() => {throw Error});
            const res = await request(app).get('/api/users/token');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });

        it('Get token', async () => {
            User.findById = jest.fn(() => mockUsers.filter( user => user._id == 2)[0]);
            const res = await request(app).get('/api/users/token');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({
                id: 2,
                userId: "el-userId-2",
                roles: ['user']
            }));
            expect(res.body.token).toBeDefined();
        });
    });

    describe('Change Password', () => {
        beforeEach(() => {
            authJwt.verifyToken.mockImplementation((req, res, next) => next());
        });

        it('User not found', async () => {
            User.findOne = jest.fn(() => mockUsers.some( user => user.userId == "no-exist"));
            const res = await request(app).put('/api/users/password/no-exist');
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({ message: "User not found" }));
        });

        it('Change Password error', async () => {
            User.findOne = jest.fn(() => {throw Error});
            const res = await request(app).put('/api/users/password/el-userId-2');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });

        it('User doesnt have rights to change the password', async () => {
            User.findOne = jest.fn(() => mockUsers.filter( user => user.userId == 'el-userId-2'));
            authJwt.verifyToken.mockImplementation((req, res, next) => { 
                req.isAdmin = false; 
                req.userId = 'el-userId-2'
                next() 
            });

            const res = await request(app).put('/api/users/password/el-userId-1');
            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual(expect.objectContaining({ message: "Unauthorized" }));
        });

        it('The current password is not the same', async () => {
            User.findOne = jest.fn(() => mockUsers.filter( user => user.userId == 'el-userId-2'));
            
            authJwt.verifyToken.mockImplementation((req, res, next) => { 
                req.isAdmin = false; 
                req.userId = 'el-userId-2'
                next() 
            });

            User.comparePassword = jest.fn(() => 'la pass 2' == 'is not the pass');
            const res = await request(app).put('/api/users/password/el-userId-2').send({
                currentPassword: "is not the pass",
                newPassword: "new pass"
            });

            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual(expect.objectContaining({ message: "The current password is not the same" }));
            
        });

        it('User update the password', async () => {
            User.findOne = jest.fn(() => mockUsers.filter( user => user.userId == 'el-userId-2'));
            
            authJwt.verifyToken.mockImplementation((req, res, next) => { 
                req.isAdmin = false; 
                req.userId = 'el-userId-2'
                next() 
            });

            User.comparePassword = jest.fn(() => 'la pass 2' == 'la pass 2');
            User.encryptPassword = jest.fn(() => 'encrypted password');

            User.findOneAndUpdate = jest.fn(() => {
                mockUsers[1] = {
                    _id: 2,
                    name: "el nombre 2",
                    email: "el email 2",
                    password: "encrypted password",
                    userId: "el-userId-2",
                    roles: ['user'],
                };
                return mockUsers[1];
            });


            const res = await request(app).put('/api/users/password/el-userId-2').send({
                currentPassword: "la pass 2",
                newPassword: "new pass"
            });
            
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({
                _id: 2,
                name: "el nombre 2",
                email: "el email 2",
                password: "encrypted password",
                userId: "el-userId-2",
                roles: ['user']
            }));
        });
    });
});