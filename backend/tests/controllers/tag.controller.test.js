import Tag from "../../src/models/Tag";
import Problem from "../../src/models/Problem";
import * as tagController from '../../src/controllers/tag.controller';
import request from 'supertest';

jest.mock('../../src/middlewares/auth.jwt');
const authJwt = require('../../src/middlewares/auth.jwt');
import app from '../../src/app';

let mockTags;
let mockProblems;
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
        mockProblems = [
            {
                _id: 1,
                name: "el problem 1",
                problemId: "el-problemId-1",
                user: ["el-userId-1"],
                tags: ["tag1", "tag2", "tag3"]
            }
        ]
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
            });
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('Delete Tags', () => {
        it('Delte tags error', async () => {
            Tag.findOne = jest.fn(() => {throw Error});
            const res = await request(app).delete('/api/tags/tag1');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });

        it('Tag doesnt exist', async () => {
            Tag.findOne = jest.fn(() => mockTags.some(tag => tag == 'no-exist'));
            const res = await request(app).delete('/api/tags/no-exist');
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({ message: "Tag not found" }));
        });

        it('Delete tag', async () => {
            Tag.findOne = jest.fn(() => mockTags.some(tag => tag.key == 'tag-3'));
            Problem.find = jest.fn(() => mockProblems.filter(problem => problem.tags.includes('tag3')));

            Problem.findOneAndUpdate = jest.fn(() => (mockProblems[0] = {
                id: 1,
                name: "el problem 1",
                problemId: "el-problemId-1",
                user: ["el-userId-1"],
                tags: ["tag1", "tag2"]
            }));

            Tag.findOneAndDelete = jest.fn(() => mockTags.splice(2,1));
            
            const res = await request(app).delete('/api/tags/tag-3');
            expect(res.statusCode).toEqual(200);
        });
    });
});