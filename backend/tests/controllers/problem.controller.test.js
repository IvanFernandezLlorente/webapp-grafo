import Problem from "../../src/models/Problem";
import User from "../../src/models/User";
import Publication from "../../src/models/Publication";
const problemController = require('../../src/controllers/problem.controller');
import request  from 'supertest';

jest.mock('../../src/middlewares/auth.jwt');
const authJwt = require('../../src/middlewares/auth.jwt');
import app from '../../src/app';


let mockProblems;
let mockUsers;
let mockPublications;
describe('Problem controller', () => {
    beforeEach(() => {
        mockProblems = [
            {
                _id: 1,
                name: "el problem 1",
                problemId: "el-problemId-1",
                user: ["el-userId-1"]
            },
            {
                _id: 2,
                name: "el problem 2",
                problemId: "el-problemId-2",
                user: ["el-userId-2"]
            },
            {
                _id: 3,
                name: "el problem 3",
                problemId: "el-problemId-3",
                user: ["el-userId-3"]
            }
        ]
        mockUsers = [
            {
                _id: 1,
                name: "el nombre 1",
                email: "el email 1",
                password: "la pass 1",
                userId: "el-userId-1",
                roles: ['5f94531373dbf256c8900501'],
                problems: []
            },
            {
                _id: 2,
                name: "el nombre 2",
                email: "el email 2",
                password: "la pass 2",
                userId: "el-userId-2",
                roles: ['5f94531373dbf256c8900501'],
                problems: ["el-problemId-2"]
            },
            {
                _id: 3,
                name: "el nombre 3",
                email: "el email 3",
                password: "la pass 3",
                userId: "no-copiar-id",
                roles: ['5f94531373dbf256c8900501'],
                problems: []
            }
        ],
        mockPublications = [
            {
                _id: 2,
                title: "el publication 2",
                publicationId: "el-publicationId-2",
                user: ["el-userId-2"],
                problems: ["el-problemId-2"]
            },
        ]
    });

    describe('Get Problems', () => {
        
        it('Get all Problems', async () => {
            Problem.find = jest.fn(() => mockProblems);
            const res = await request(app).get('/api/problems');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(3);
        });
        
        it('Get problem by userId', async () => {
            Problem.findOne = jest.fn(() => mockProblems.filter( problem => problem.problemId == 'el-problemId-2'));
            const res = await request(app).get('/api/problems/el-problemId-2');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(1);
            expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({_id: 2})]));
        });

        it('Get problem by userId not found', async () => {
            Problem.findOne = jest.fn(() => mockProblems.some( problem => problem.problemId == 'no-exist'));
            const res = await request(app).get('/api/problems/no-exist');
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({ message: "Problem not found" }));
        });

        it('Get problem by userId error', async () => {
            Problem.findOne = jest.fn(() => {throw Error});
            const res = await request(app).get('/api/problems/no-exist');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });
    });

    describe('Create Problems', () => {
        beforeEach(() => {
            authJwt.verifyToken.mockImplementation((req, res, next) => next());
        });

        it('Create problem error', async () => {
            Problem.findOne = jest.fn(() => {throw Error});
            const res = await request(app).post('/api/problems');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });

        it('The problem already exist', async () => {
            Problem.findOne = jest.fn(() => mockProblems.some( problem => problem.problemId == 'el-problemId-2'));
            const res = await request(app).post('/api/problems').send({
                name: 'el problema 2'
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(expect.objectContaining({ message: "The problem already exists" }));
        });

        it('Create a new problem', async () => {
            Problem.findOne = jest.fn(() => mockProblems.some(problem => problem.problemId == 'new-problem'));
            User.findOne = jest.fn(() => (mockUsers.filter(user => user.userId == 'el-userId-2')[0]));
            jest.spyOn(Problem.prototype, 'save')
            .mockImplementationOnce(() => {
                mockProblems.push({
                    _id: 4,
                    name: "new problem",
                    problemId: "new-problem",
                    user: ["el-userId-2"]
                });
                return { _id: 4, name: "new problem", problemId: "new-problem", user: ["el-userId-2"] }
            });
            
            const saveReferencesMock = jest.fn(() => {
                mockUsers[1] = {
                    _id: 2,
                    name: "el nombre 2",
                    email: "el email 2",
                    password: "la pass 2",
                    userId: "el-userId-2",
                    roles: ['5f94531373dbf256c8900501'],
                    problems: ["el-problemId-2", "new-problem"]
                }
                return mockUsers
            });
            problemController.__Rewire__('saveReferences', saveReferencesMock)
            
            const res = await request(app).post('/api/problems').send({
                name: "new problem",
                problemId: "new-problem",
                user: ["el-userId-2"]
            });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({ _id: 4, name: "new problem", problemId: "new-problem", user: ["el-userId-2"] }));
            expect(mockProblems).toHaveLength(4);
            expect(mockProblems).toEqual(expect.arrayContaining([{ _id: 4, name: "new problem", problemId: "new-problem", user: ["el-userId-2"] }]));
            expect(mockUsers).toEqual(expect.arrayContaining([{
                _id: 2,
                name: "el nombre 2",
                email: "el email 2",
                password: "la pass 2",
                userId: "el-userId-2",
                roles: ['5f94531373dbf256c8900501'],
                problems: ["el-problemId-2", "new-problem"]
            }]));
        });

    });

    describe('Update Problem', () => {
        beforeEach(() => {
            authJwt.verifyToken.mockImplementation((req, res, next) => next());
        });

        it('Problem not found', async () => {
            Problem.findOne = jest.fn(() => mockProblems.some( problem => problem.problemId == "no-exist"));
            const res = await request(app).put('/api/problems/no-exist');
            expect(authJwt.verifyToken).toHaveBeenCalledTimes(1);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({ message: "Problem not found" }));
        });

        it('Update problem error', async () => {
            Problem.findOne = jest.fn(() => {throw Error});
            const res = await request(app).put('/api/problems/el-problemId-2');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });

        it('User doesnt have rights to update a problem', async () => {
            authJwt.verifyToken.mockImplementation((req, res, next) => { 
                req.isAdmin = false; 
                req.id = 3
                next() 
            });
            Problem.findOne = jest.fn(() => mockProblems.filter( problem => problem.problemId == 'el-problemId-2'));
            User.find = jest.fn(() => mockUsers.filter( user => user.userId == 'el-userId-2'));
            

            const res = await request(app).put('/api/problems/el-problemId-2');
            expect(authJwt.verifyToken).toHaveBeenCalledTimes(1);
            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual(expect.objectContaining({ message: "Unauthorized" }));
        });

        it('User updates a problemId no unique', async () => {
            authJwt.verifyToken.mockImplementation((req, res, next) => { 
                req.isAdmin = false; 
                req.id = 2
                next() 
            });
            Problem.findOne = jest.fn(() => mockProblems.filter( problem => problem.problemId == 'el-problemId-2'));
            User.find = jest.fn(() => mockUsers.filter( user => user.userId == 'el-userId-2'));
            
            const res = await request(app).put('/api/problems/el-problemId-2').send({
                problemId: 'no-copiar-id'
            });
            expect(authJwt.verifyToken).toHaveBeenCalledTimes(1);
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(expect.objectContaining({ message: "The problem already exists" }));
        });

        it('Update a problem', async () => {
            authJwt.verifyToken.mockImplementation((req, res, next) => { 
                req.isAdmin = false; 
                req.id = 2
                next() 
            });
            Problem.findOne = jest.fn(() => mockProblems.filter( problem => problem.problemId == 'el-problemId-2'));
            User.find = jest.fn(() => mockUsers.filter(user => user.userId == 'el-userId-2'));
            User.findOne = jest.fn(() => (mockUsers.filter(user => user.userId == 'el-userId-2')[0]));

            const deleteReferencesMock = jest.fn(() => {
                mockUsers[1] = {
                    _id: 2,
                    name: "el nombre 2",
                    email: "el email 2",
                    password: "la pass 2",
                    userId: "el-userId-2",
                    roles: ['5f94531373dbf256c8900501'],
                    problems: []
                }
                return mockUsers
            });
            problemController.__Rewire__('deleteReferences', deleteReferencesMock)

            Problem.findOneAndUpdate = jest.fn(() => (mockProblems[1] = {
                _id: 2,
                name: "new name",
                problemId: "el-problemId-2",
                user: ["el-userId-2"]
            }));

            const saveReferencesMock = jest.fn(() => {
                mockUsers[1] = {
                    _id: 2,
                    name: "el nombre 2",
                    email: "el email 2",
                    password: "la pass 2",
                    userId: "el-userId-2",
                    roles: ['5f94531373dbf256c8900501'],
                    problems: ["el-problemId-2"]
                }
                return mockUsers
            });
            problemController.__Rewire__('saveReferences', saveReferencesMock)

            const res = await request(app).put('/api/problems/el-problemId-2').send({
                name: 'new name'
            });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({ _id: 2, name: "new name", problemId: "el-problemId-2", user: ["el-userId-2"] }));
            expect(mockProblems).toHaveLength(3);
            expect(mockProblems).toEqual(expect.arrayContaining([{ _id: 2, name: "new name", problemId: "el-problemId-2", user: ["el-userId-2"] }]));
            expect(mockUsers).toEqual(expect.arrayContaining([{
                _id: 2,
                name: "el nombre 2",
                email: "el email 2",
                password: "la pass 2",
                userId: "el-userId-2",
                roles: ['5f94531373dbf256c8900501'],
                problems: ["el-problemId-2"]
            }]));
        });
    });


    describe('Delete Problem', () => {
        beforeEach(() => {
            authJwt.verifyToken.mockImplementation((req, res, next) => next());
        });

        it('The problem doesnt exist', async () => {
            Problem.findOne = jest.fn(() => mockProblems.some( problem => problem.problemId == 'no-exist'));
            const res = await request(app).delete('/api/problems/no-exist');
            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual(expect.objectContaining({ message: "Problem not found" }));
        });

        it('Delete problem error', async () => {
            Problem.findOne = jest.fn(() => {throw Error});
            const res = await request(app).delete('/api/problems/no-exist');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });

        it('User doesnt have rights to delete a problem', async () => {
            authJwt.verifyToken.mockImplementation((req, res, next) => { 
                req.isAdmin = false; 
                req.id = 3
                next() 
            });
            Problem.findOne = jest.fn(() => mockProblems.filter( problem => problem.problemId == 'el-problemId-2'));
            User.find = jest.fn(() => mockUsers.filter( user => user.userId == 'el-userId-2'));
            

            const res = await request(app).delete('/api/problems/el-problemId-2');
            expect(authJwt.verifyToken).toHaveBeenCalledTimes(1);
            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual(expect.objectContaining({ message: "Unauthorized" }));
        });
        
        it('Delete a problem', async () => {
            authJwt.verifyToken.mockImplementation((req, res, next) => { 
                req.isAdmin = false; 
                req.id = 2
                next() 
            });

            const deleteReferencesMock = jest.fn()
            .mockImplementationOnce(() => {
                mockUsers[1] = {
                    _id: 2,
                    name: "el nombre 2",
                    email: "el email 2",
                    password: "la pass 2",
                    userId: "el-userId-2",
                    roles: ['5f94531373dbf256c8900501'],
                    problems: []
                }
                return mockUsers
            })
            .mockImplementationOnce(() => {
                mockPublications[0] = {
                    _id: 2,
                    title: "el publication 2",
                    publicationId: "el-publicationId-2",
                    user: ["el-userId-2"],
                    problems: []
                }
                return mockPublications
            });
            problemController.__Rewire__('deleteReferences', deleteReferencesMock)
              
            Problem.findOne = jest.fn(() => mockProblems.filter( problem => problem.problemId == 'el-problemId-2'));
            User.find = jest.fn(() => mockUsers.filter(user => user.userId == 'el-userId-2'));
            Problem.findOneAndDelete = jest.fn(() => mockProblems.splice(1,1));
            Publication.find = jest.fn(() => mockPublications.filter(publication => publication.problems.includes('el-problemId-2')));

            const res = await request(app).delete('/api/problems/el-problemId-2');
            expect(res.statusCode).toEqual(200);
            expect(mockProblems).toHaveLength(2);
            expect(mockProblems).toEqual(expect.not.arrayContaining([{
                _id: 2,
                name: "el problem 2",
                problemId: "el-problemId-2",
                user: ["el-userId-2"]
            }]));
            expect(mockUsers).toEqual(expect.arrayContaining([{
                _id: 2,
                name: "el nombre 2",
                email: "el email 2",
                password: "la pass 2",
                userId: "el-userId-2",
                roles: ['5f94531373dbf256c8900501'],
                problems: []
            }]));
            expect(mockPublications).toHaveLength(1);
            expect(mockPublications).toEqual(expect.arrayContaining([{
                _id: 2,
                title: "el publication 2",
                publicationId: "el-publicationId-2",
                user: ["el-userId-2"],
                problems: []
            }]));
        });

    });
});