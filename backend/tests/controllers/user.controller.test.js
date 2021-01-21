import User from "../../src/models/User";
import request  from 'supertest';

jest.mock('../../src/middlewares/auth.jwt');
jest.mock('../../src/middlewares/verifySignUp');
const authJwt = require('../../src/middlewares/auth.jwt');
const verifySignUp = require('../../src/middlewares/verifySignUp');
import app from '../../src/app';

describe('User controller', () => {
    const mockUsers = [
        {
            _id: 1,
            name: "el nombre 1",
            email: "el email 1",
            password: "la pass 1",
            userId: "el-userId-1"
        },
        {
            _id: 2,
            name: "el nombre 2",
            email: "el email 2",
            password: "la pass 2",
            userId: "el-userId-2"
        }
    ]

    describe('Get Users', () => {
        
        it('Get all users', async () => {
            User.find = jest.fn(() => mockUsers);
            const res = await request(app).get('/api/users');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(2);
        });

        it('Get user by userId', async () => {
            User.findOne = jest.fn(() => mockUsers.filter( user => user.userId == 'el-userId-2'));
            const res = await request(app).get('/api/users/el-userId-2');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(1);
            expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({_id: 2})]));
        });

        it('Get user by userId not found', async () => {
            User.findOne = jest.fn(() => null);
            const res = await request(app).get('/api/users/no-exist');
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({message: "User not found"}));
        });

        it('Get user by userId error', async () => {
            User.findOne = jest.fn(() => {throw Error});
            const res = await request(app).get('/api/users/no-exist');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({message: "Error"}));
        });
    });

    describe('Update User', () => {
        
        authJwt.verifyToken.mockImplementation((req, res, next) => next());
        verifySignUp.checkDuplicateNameOrEmail.mockImplementation((req, res, next) => next());

        it('User not found', async () => {
            User.findOne = jest.fn(() => null);
            const res = await request(app).put('/api/users/no-exist');
            expect(authJwt.verifyToken).toHaveBeenCalledTimes(1);
            expect(verifySignUp.checkDuplicateNameOrEmail).toHaveBeenCalledTimes(1);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({message: "User not found"}));
        });

        it('User doesnt have rights', async () => {
            User.findOne = jest.fn(() => mockUsers.filter( user => user.userId == 'el-userId-2'));
            const res = await request(app).put('/api/users/no-exist').set("isAdmin", true);
            expect(authJwt.verifyToken).toHaveBeenCalledTimes(1);
            expect(verifySignUp.checkDuplicateNameOrEmail).toHaveBeenCalledTimes(1);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({message: "Unauthorized"}));
        });

    });

    // {
    //     _id: 1,
    //     name: "el nombre 1",
    //     email: "el email 1",
    //     password: "la pass 1",
    //     userId: "el-userId-1",
    //     organization: "la orga 1",
    //     department: "el depar 1",
    //     area: "el area 1",
    //     researchgroup: "el research 1",
    //     description: "la descri 1",
    //     linkedinUrl: "el linked 1",
    //     urjcUrl: "el urjc 1",
    //     scholarUrl: "el scholar 1",
    //     imagenPath: "la imagen",
    //     roles: ['user'],
    //     publications: ['una-publicacion'],
    //     problems: ['un-problema'],
    // },
    // {
    //     _id: 2,
    //     name: "el nombre 2",
    //     email: "el email 2",
    //     password: "la pass 2",
    //     userId: "el-userId-2",
    //     organization: "la orga 2",
    //     department: "el depar 2",
    //     area: "el area 2",
    //     researchgroup: "el research 2",
    //     description: "la descri 2",
    //     linkedinUrl: "el linked 2",
    //     urjcUrl: "el urjc 2",
    //     scholarUrl: "el scholar 2",
    //     imagenPath: "la imagen",
    //     roles: ['user'],
    //     publications: ['una-publicacion'],
    //     problems: ['un-problema'],
    // }

});