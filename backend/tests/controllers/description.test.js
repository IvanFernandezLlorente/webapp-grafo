import Description from "../../src/models/Description";
import request from 'supertest';

jest.mock('../../src/middlewares/auth.jwt');
const authJwt = require('../../src/middlewares/auth.jwt');
import app from '../../src/app';

let mockDescription;
describe('Description controller', () => {
    beforeEach(() => {
        mockDescription = {
            _id: 1,
            en: "description en 1",
            es: "description es 1"
        }        
        
        authJwt.verifyToken.mockImplementation((req, res, next) => { 
            req.isAdmin = true;
            next() 
        });
    });

    describe('Get Description', () => {
        it('Get description', async () => {
            Description.findOne = jest.fn(() => mockDescription);
            const res = await request(app).get('/api/description');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({ en: "description en 1", es: "description es 1" }));
        });
        it('Get description error', async () => {
            Description.findOne = jest.fn(() => {throw Error});
            const res = await request(app).get('/api/description');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });
    });

    describe('Update Description', () => {
        it('User is not admin', async () => {
            authJwt.verifyToken.mockImplementation((req, res, next) => { 
                req.isAdmin = false; 
                next() 
            });
            
            const res = await request(app).put('/api/description');
            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual(expect.objectContaining({ message: "Unauthorized" }));
        });

        it('Update description error', async () => {
            Description.findOne = jest.fn(() => {throw Error});
            const res = await request(app).put('/api/description');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });

        // it('Description doesnt exist', async () => {
        //     Description.findOne = jest.fn(() => null);
        //     const res = await request(app).delete('/api/tags/no-exist');
        //     expect(res.statusCode).toEqual(404);
        //     expect(res.body).toEqual(expect.objectContaining({ message: "Tag not found" }));
        // });

        // it('Update Description', async () => {
        //     Description.findOne = jest.fn(() => mockDescription);
        //     const res = await request(app).delete('/api/tags/no-exist');
        //     expect(res.statusCode).toEqual(404);
        //     expect(res.body).toEqual(expect.objectContaining({ message: "Tag not found" }));
        // });
    });
});