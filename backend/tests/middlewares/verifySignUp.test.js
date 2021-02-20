import User from "../../src/models/User";
import request  from 'supertest';
jest.mock('../../src/middlewares/auth.jwt');
const authJwt = require('../../src/middlewares/auth.jwt');
import app from '../../src/app';


let mockUsers;
describe('Verify SigUp Middleware', () => {
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
    authJwt.verifyToken.mockImplementation((req, res, next) => next());

    describe('Check Duplicate Name or Email', () => {
        
        it('Duplicate email', async () => {
            User.findOne = jest.fn(() => mockUsers.filter( user => user.email == 'el email 2'));
            
            const res = await request(app).put('/api/users/el-userId-2').send({
                name: "new name",
                email: "el email 2"
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(expect.objectContaining({message: "The email already exists"}));
        });

        it('Duplicate name', async () => {
            User.findOne = jest.fn()
            .mockReturnValueOnce(mockUsers.some( user => user.email == 'new email'))
            .mockReturnValueOnce(mockUsers.filter( user => user.name == 'el name 2'));
            
            const res = await request(app).put('/api/users/el-userId-2').send({
                name: "el nombre 2",
                email: "new email"
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(expect.objectContaining({message: "The user already exists"}));
        });

        it('Check correct , next()', async () => {
            User.findOne = jest.fn()
            .mockReturnValueOnce(mockUsers.some( user => user.email == 'new email'))
            .mockReturnValueOnce(mockUsers.some( user => user.name == 'new name'));
            
            const res = await request(app).put('/api/users/el-userId-2').send({
                name: "new name",
                email: "new email"
            });

            expect(res.statusCode).toEqual(404);
        });

        it('Check error', async () => {
            User.findOne = jest.fn(() => {throw Error});
            
            const res = await request(app).put('/api/users/el-userId-2').send({
                name: "el nombre 2",
                email: "new email"
            });

            expect(res.statusCode).toEqual(500);
        });
    });
});
