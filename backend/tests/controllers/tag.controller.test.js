import Tag from "../../src/models/Tag";
import * as tagController from '../../src/controllers/tag.controller';
import request from 'supertest';

jest.mock('../../src/middlewares/auth.jwt');
const authJwt = require('../../src/middlewares/auth.jwt');
import app from '../../src/app';

let mockTags;
describe('Tag controller', () => {
    beforeEach(() => {
        mockTags = [
            {
                _id: 1,
                key: 'tag-1',
                value: 'tag 1'
            },
            {
                _id: 2,
                key: 'tag-2',
                value: 'tag 2'
            },
            {
                _id: 3,
                key: 'tag-3',
                value: 'tag 3'
            }            
        ],
        authJwt.verifyToken.mockImplementation((req, res, next) => next());
    });


    describe('Get Tags', () => {
        it('Get all Tags', async () => {
            Tag.find = jest.fn(() => mockTags);
            const res = await request(app).get('/api/tags');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(3);
        });
    });

    describe('Create Tags', () => {
        it('Create tags error', async () => {
            Tag.insertMany = jest.fn(() => {throw Error});
            const res = await request(app).post('/api/tags');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });

        it('Create tags', async () => {
            Tag.insertMany = jest.fn(() => { mockTags.push({
                _id: 4,
                key: 'tag-4',
                value: 'tag 4'
            })});
            
            const res = await request(app).post('/api/tags').send({
                key: 'tag-4',
                value: 'tag 4'
            });;
            expect(res.statusCode).toEqual(200);
        });


    });
});