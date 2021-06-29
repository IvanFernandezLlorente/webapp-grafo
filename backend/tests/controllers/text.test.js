import Text from "../../src/models/Text";
import request from 'supertest';

jest.mock('../../src/middlewares/auth.jwt');
const authJwt = require('../../src/middlewares/auth.jwt');
import app from '../../src/app';

let mockText;
describe('Text controller', () => {
    beforeEach(() => {
        mockText = {
            _id: 1,
            type: "description",
            en: "description en 1",
            es: "description es 1"
        }        
        
        authJwt.verifyToken.mockImplementation((req, res, next) => { 
            req.isAdmin = true;
            next() 
        });
    });

    describe('Get Text', () => {
        it('Get Text', async () => {
            Text.findOne = jest.fn(() => mockText);
            const res = await request(app).get('/api/texts/description');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({ type: "description", en: "description en 1", es: "description es 1" }));
        });
        it('Get text error', async () => {
            Text.findOne = jest.fn(() => {throw Error});
            const res = await request(app).get('/api/texts/description');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });
    });

    describe('Update text', () => {
        it('User is not admin', async () => {
            authJwt.verifyToken.mockImplementation((req, res, next) => { 
                req.isAdmin = false; 
                next() 
            });
            
            const res = await request(app).put('/api/texts/description');
            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual(expect.objectContaining({ message: "Unauthorized" }));
        });

        it('Update text error', async () => {
            Text.findOne = jest.fn(() => {throw Error});
            const res = await request(app).put('/api/texts/description');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });
    });
});