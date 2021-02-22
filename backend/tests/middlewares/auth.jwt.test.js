import User from "../../src/models/User";
import Application from "../../src/models/Application";
import request from 'supertest';
import jwt from 'jsonwebtoken';
jest.mock('../../src/middlewares/verifySignUp');
const verifySignUp = require('../../src/middlewares/verifySignUp');
import app from '../../src/app';


let mockUsers;
describe('Auth JWT Middleware', () => {
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
                roles: ['user', 'collaborator']
            }
        ]
    });
    verifySignUp.checkDuplicateNameOrEmail.mockImplementation((req, res, next) => next());

    describe('Verify Token Middleware', () => {
        
        it('No token', async () => {
            const res = await request(app).put('/api/users/el-userId-2')

            expect(res.statusCode).toEqual(403);
            expect(res.body).toEqual(expect.objectContaining({ message: "No token" }));
        });

        it('Invalid token', async () => {
            User.findById = jest.fn(() => mockUsers.some(user => user._id == 'wrong id'));
            jwt.verify = jest.fn(() => ({ id: 'wrong id', userId: 'wrong userId'}))
            const res = await request(app).put('/api/users/wrong-id').set('token', 'this is a invalid token')

            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({ message: "Invalid token" }));
        });
        
        it('Check correct , next()', async () => {
            User.findById = jest.fn(() => mockUsers.filter(user => user._id == 2)[0]);
            User.findOne = jest.fn();
            jwt.verify = jest.fn(() => ({ id: 2, userId: 'el-userId-2'}))
            const res = await request(app).put('/api/users/el-userId-2').set('token', 'valid token')

            expect(res.statusCode).toEqual(404);
        });

        it('Check error', async () => {
            User.findById = jest.fn(() => {throw Error});
            const res = await request(app).put('/api/users/el-userId-2').set('token', 'valid token')

            expect(res.statusCode).toEqual(500);
        });
    });

    describe('Collaborator Middleware', () => {
        
        it('The user is collaborator', async () => {
            User.findById = jest.fn(() => mockUsers.filter(user => user._id == 3)[0]);
            User.findOne = jest.fn(() => mockUsers.filter(user => user._id == 3)[0]);
            Application.find = jest.fn(() => []);
            jwt.verify = jest.fn(() => ({ id: 3, userId: 'el-userId-3'}))
            const res = await request(app).get('/api/applications').set('token', 'valid token')
            expect(res.statusCode).toEqual(200);
        });

        it('The user is not collaborator', async () => {
            User.findById = jest.fn(() => mockUsers.filter(user => user._id == 2)[0]);
            User.findOne = jest.fn(() => mockUsers.filter(user => user._id == 2)[0]);
            jwt.verify = jest.fn(() => ({ id: 2, userId: 'el-userId-2'}))
            const res = await request(app).get('/api/applications').set('token', 'valid token')
            expect(res.statusCode).toEqual(403);
            expect(res.body).toEqual(expect.objectContaining({ message: "Require Collaborator Role!" }));
        });

        it('Check error', async () => {
            User.findById = jest.fn(() => mockUsers.filter(user => user._id == 2)[0]);
            User.findOne = jest.fn(() => {throw Error});
            jwt.verify = jest.fn(() => ({ id: 2, userId: 'el-userId-2'}))
            const res = await request(app).get('/api/applications').set('token', 'valid token')
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });

    });
});
