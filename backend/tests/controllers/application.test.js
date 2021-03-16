import Application from "../../src/models/Application";
import User from "../../src/models/User";
import * as emailSend from '../../src/libs/email';
import request from 'supertest';
jest.mock('../../src/middlewares/auth.jwt');
const authJwt = require('../../src/middlewares/auth.jwt');
import app from '../../src/app';


let mockApplications;
let mockUsers;
describe('Application controller', () => {
    beforeEach(() => {
        mockApplications = [
            {
                _id: 1,
                name: 'the name 1',
                email: 'new email 1',
                description: 'desc 1'
            },
            {
                _id: 2,
                name: 'the name 2',
                email: 'new email 2',
                description: 'desc 2'
            },
            {
                _id: 3,
                name: 'the name 3',
                email: 'new email 3',
                description: 'desc 3'
            },
            {
                _id: 4,
                name: 'the name 4',
                email: 'new email 4',
                description: 'desc 4'
            }
        ],
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
        ],
        authJwt.verifyToken.mockImplementation((req, res, next) => { 
            req.isAdmin = true;
            next() 
        });
    });

    describe('Get Applications', () => {
        it('Get all Applications', async () => {
            Application.find = jest.fn(() => mockApplications);
            const res = await request(app).get('/api/applications');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(4);
        });

        it('Get Applications error', async () => {
            Application.find = jest.fn(() => {throw Error});
            const res = await request(app).get('/api/applications');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });

        it('Get applications by id', async () => {
            Application.findById = jest.fn(() => mockApplications.filter( application => application._id == 2));
            const res = await request(app).get('/api/applications/2');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(1);
            expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({ _id: 2, name: 'the name 2', email: 'new email 2', description: 'desc 2'})]));
        });

        it('Get application by id not found', async () => {
            Application.findById = jest.fn(() => mockApplications.some( application => application._id == 'no-exist'));
            const res = await request(app).get('/api/applications/no-exist');
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({ message: "Application not found" }));
        });

        it('Get applications by id error', async () => {
            Application.findById = jest.fn(() => {throw Error});
            const res = await request(app).get('/api/applications/no-exist');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });
        
        it('User is not admin', async () => {
            authJwt.verifyToken.mockImplementation((req, res, next) => { 
                req.isAdmin = false; 
                next() 
            });
            const res = await request(app).get('/api/applications');
            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual(expect.objectContaining({ message: "Unauthorized" }));
        });  
    });

    describe('Create Application', () => {
        it('Email already exist', async () => {
            User.findOne = jest.fn(() => mockUsers.filter( user => user.email == 'el email 2'));
            const res = await request(app).post('/api/applications').send({
                email: 'el email 2'
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(expect.objectContaining({ message: "The email already exists" }));
        });

        it('Application already exist with this email', async () => {
            User.findOne = jest.fn(() => mockUsers.some(user => user.email == 'new email 4'));
            Application.findOne = jest.fn(() => mockApplications.some( application => application.email == 'new email 4'));
            const res = await request(app).post('/api/applications').send({
                email: 'new email 4'
            });;
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(expect.objectContaining({ message: "The email already send a request" }));
        });

        it('Create Applications error', async () => {
            User.findOne = jest.fn(() => {throw Error});
            const res = await request(app).post('/api/applications');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });

        it('Create a Application', async () => {
            User.findOne = jest.fn(() => mockUsers.some(user => user.email == 'new email 5'));
            Application.findOne = jest.fn(() => mockApplications.some(application => application.email == 'new email 5'));
            
            jest.spyOn(Application.prototype, 'save')
            .mockImplementationOnce(() => {
                mockApplications.push({
                    _id: 5,
                    name: 'the name 5',
                    email: 'new email 5',
                    description: 'desc 5'
                });
                return { _id: 5, name: 'the name 5', email: 'new email 5', description: 'desc 5' }
            });

            const res = await request(app).post('/api/applications').send({
                name: 'the name 5',
                email: 'new email 5',
                description: 'desc 5'
            });;
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({ _id: 5, name: 'the name 5', email: 'new email 5', description: 'desc 5' }));
            expect(mockApplications).toHaveLength(5);
            expect(mockApplications).toEqual(expect.arrayContaining([{ _id: 5, name: 'the name 5', email: 'new email 5', description: 'desc 5' }]));
        });
    });

    describe('Accept Application', () => {
        it('Application doesnt exist', async () => {
            Application.findById = jest.fn(() => mockApplications.some( application => application._id == 'no-exist'));
            const res = await request(app).put('/api/applications/accept/no-exist');
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({ message: "Application not found" }));
        }); 
        
        it('Application is not accepted', async () => {
            Application.findById = jest.fn(() => mockApplications.filter( application => application._id == 2));
            const res = await request(app).put('/api/applications/accept/2').send({
                accepted: false
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(expect.objectContaining({ message: "Application not accepted" }));
        });

        it('Application accepted error', async () => {
            Application.findById = jest.fn(() => {throw Error});
            const res = await request(app).put('/api/applications/accept/2');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });

        it('User is not admin', async () => {
            authJwt.verifyToken.mockImplementation((req, res, next) => { 
                req.isAdmin = false; 
                next() 
            });
            const res = await request(app).put('/api/applications/accept/2').send({
                accepted: true
            });
            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual(expect.objectContaining({ message: "Unauthorized" }));
        });

        // it('Application is accepted', async () => {
        //     Application.findById = jest.fn(() => mockApplications.filter(application => application._id == 2)[0]);
        //     emailSend.emailAccepted = jest.fn()
        //     jest.spyOn(Application.prototype, 'save')
        //     .mockImplementationOnce(() => {
        //         mockApplications[1] = {
        //             _id: 2,
        //             name: 'the name 2',
        //             email: 'new email 2',
        //             description: 'desc 2',
        //             accepted: true
        //         }
        //         return { _id: 2, name: 'the name 2', email: 'new email 2', description: 'desc 2', accepted: true }
        //     });

        //     const res = await request(app).put('/api/applications/accept/2').send({
        //         accepted: true
        //     });
        //     expect(res.statusCode).toEqual(200);
        //     expect(res.body).toEqual(expect.objectContaining({ _id: 2, name: 'the name 2', email: 'new email 2', description: 'desc 2', accepted: true }));
        //     expect(mockApplications).toHaveLength(4);
        //     expect(mockApplications).toEqual(expect.arrayContaining([{ _id: 2, name: 'the name 2', email: 'new email 2', description: 'desc 2', accepted: true }]));
        // });
    });

    describe('Reject Application', () => {
        it('Application doesnt exist', async () => {
            Application.findById = jest.fn(() => mockApplications.some( application => application._id == 'no-exist'));
            const res = await request(app).delete('/api/applications/reject/no-exist');
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({ message: "Application not found" }));
        });        

        it('Application reject error', async () => {
            Application.findById = jest.fn(() => {throw Error});
            const res = await request(app).delete('/api/applications/reject/2');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });

        it('Application is rejected', async () => {
            Application.findById = jest.fn(() => mockApplications.some(application => application._id == 2));
            Application.findOneAndDelete = jest.fn(() => mockApplications.splice(1,1));
            emailSend.emailRejected = jest.fn()
            const res = await request(app).delete('/api/applications/reject/2');
            expect(res.statusCode).toEqual(200);
            expect(mockApplications).toHaveLength(3);
            expect(mockApplications).toEqual(expect.not.arrayContaining([{ _id: 2, name: 'the name 2', email: 'new email 2', description: 'desc 2' }]));
        });

        it('User is not admin', async () => {
            authJwt.verifyToken.mockImplementation((req, res, next) => { 
                req.isAdmin = false; 
                next() 
            });
            const res = await request(app).delete('/api/applications/reject/2');
            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual(expect.objectContaining({ message: "Unauthorized" }));
        });
    });;
});