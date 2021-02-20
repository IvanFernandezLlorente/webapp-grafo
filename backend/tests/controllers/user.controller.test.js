import User from "../../src/models/User";
const userController = require('../../src/controllers/user.controller');
import request  from 'supertest';

jest.mock('../../src/middlewares/auth.jwt');
jest.mock('../../src/middlewares/verifySignUp');
const authJwt = require('../../src/middlewares/auth.jwt');
const verifySignUp = require('../../src/middlewares/verifySignUp');
import app from '../../src/app';


let mockUsers;
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
                roles: ['user']
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

        it('Sign in user', async () => {
            User.findOne = jest.fn(() => mockUsers.filter( user => user.email == "el email 2")[0]);
            User.comparePassword = jest.fn(() => 'la pass 2' == 'la pass 2');
            const res = await request(app).post('/api/users/signin');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({
                id: 2,
                userId: "el-userId-2",
                isAdmin: false
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

        it('User sign up without rol', async () => {
            User.findOne = jest.fn(() => mockUsers.some( user => user.email == "new email"));
            User.encryptPassword = jest.fn(() => 'encrypted password');
            
            const saveNewUser = jest.fn(() => {
                mockUsers.push({ _id: 4, name: "the name", userId: 4, email: "new email", password: 'encrypted password', roles: ['user'] });
                return { _id: 4, name: "the name", userId: 4, email: "new email", password: 'encrypted password', roles: ['user'] }
            });
            userController.__Rewire__('saveNewUser', saveNewUser)

            const res = await request(app).post('/api/users/signup').send({
                name: 'the name',
                email: 'new email',
                password: 'la pass'
            });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({
                id: 4,
                userId: 4,
                isAdmin: false
            }));
            expect(res.body.token).toBeDefined();
            expect(mockUsers).toHaveLength(4);
        });

        it('User sign up with rol admin', async () => {
            User.findOne = jest.fn(() => mockUsers.some( user => user.email == "new email"));
            User.encryptPassword = jest.fn(() => 'encrypted password');

            const saveNewUser = jest.fn(() => {
                mockUsers.push({ _id: 4, name: "the name", userId: 4, email: "new email", password: 'encrypted password', roles: ['admin'] });
                return { _id: 4, name: "the name", userId: 4, email: "new email", password: 'encrypted password', roles: ['admin'] }
            });
            userController.__Rewire__('saveNewUser', saveNewUser)

            const res = await request(app).post('/api/users/signup').send({
                name: 'the name',
                email: 'new email',
                password: 'la pass',
                roles: ['admin']
            });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({
                id: 4,
                userId: 4,
                isAdmin: true
            }));
            expect(res.body.token).toBeDefined();
            expect(mockUsers).toHaveLength(4);
        });
    });
});