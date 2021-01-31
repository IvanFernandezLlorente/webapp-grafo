import Publication from "../../src/models/Publication";
import User from "../../src/models/User";
import Problem from "../../src/models/Problem";
const publicationController = require('../../src/controllers/publication.controller');
import request  from 'supertest';

jest.mock('../../src/middlewares/auth.jwt');
const authJwt = require('../../src/middlewares/auth.jwt');
import app from '../../src/app';


let mockPublications;
let mockUsers;
let mockProblems;
describe('Publications controller', () => {
    beforeEach(() => {
        mockPublications = [
            {
                _id: 1,
                title: "el publication 1",
                publicationId: "el-publicationId-1",
                user: ["el-userId-1"],
                relatedProblems: ["el-problemId-1"]
            },
            {
                _id: 2,
                title: "el publication 2",
                publicationId: "el-publicationId-2",
                user: ["el-userId-2"],
                relatedProblems: ["el-problemId-2"]
            },
            {
                _id: 3,
                title: "el publication 3",
                publicationId: "el-publicationId-3",
                user: ["el-userId-3"],
                relatedProblems: ["el-problemId-3"]
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
                publications: ["el-publicationId-1"]
            },
            {
                _id: 2,
                name: "el nombre 2",
                email: "el email 2",
                password: "la pass 2",
                userId: "el-userId-2",
                roles: ['5f94531373dbf256c8900501'],
                publications: ["el-publicationId-2"]
            },
            {
                _id: 3,
                name: "el nombre 3",
                email: "el email 3",
                password: "la pass 3",
                userId: "no-copiar-id",
                roles: ['5f94531373dbf256c8900501'],
                publications: ["el-publicationId-3"]
            }
        ],
        mockProblems = [
            {
                _id: 1,
                name: "el problem 1",
                problemId: "el-problemId-1",
                user: ["el-userId-1"],
                publications: ["el-publicationId-1"]
            },
            {
                _id: 2,
                name: "el problem 2",
                problemId: "el-problemId-2",
                user: ["el-userId-2"],
                publications: ["el-publicationId-2"]
            },
            {
                _id: 3,
                name: "el problem 3",
                problemId: "el-problemId-3",
                user: ["el-userId-3"],
                publications: ["el-publicationId-3"]
            }
        ]
    });

    describe('Get Publications', () => {
        
        it('Get all Publications', async () => {
            Publication.find = jest.fn(() => mockPublications);
            const res = await request(app).get('/api/publications');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(3);
        });
        
        it('Get publication by userId', async () => {
            Publication.findOne = jest.fn(() => mockPublications.filter( publication => publication.publicationId == 'el-publicationId-2'));
            const res = await request(app).get('/api/publications/el-publicationId-2');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(1);
            expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({_id: 2})]));
        });

        it('Get publication by userId not found', async () => {
            Publication.findOne = jest.fn(() => mockPublications.some( publication => publication.publicationId == 'no-exist'));
            const res = await request(app).get('/api/publications/no-exist');
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({ message: "Publication not found" }));
        });

        it('Get publication by userId error', async () => {
            Publication.findOne = jest.fn(() => {throw Error});
            const res = await request(app).get('/api/publications/no-exist');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });
    });

    describe('Create Publications', () => {
        beforeEach(() => {
            authJwt.verifyToken.mockImplementation((req, res, next) => next());
        });

        it('Admin can not create a publication', async () => {
            authJwt.verifyToken.mockImplementation((req, res, next) => { 
                req.isAdmin = true; 
                next() 
            });
            const res = await request(app).post('/api/publications');
            expect(res.statusCode).toEqual(403);
            expect(res.body).toEqual(expect.objectContaining({ message: "You can not create a publication" }));
        });
        
        it('Create publication error', async () => {
            Publication.findOne = jest.fn(() => {throw Error});
            const res = await request(app).post('/api/publications');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });

        it('The publication already exist', async () => {
            Publication.findOne = jest.fn(() => mockPublications.some( publication => publication.publicationId == 'el-publicationId-2'));
            const res = await request(app).post('/api/publications').send({
                title: 'el publication 2'
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(expect.objectContaining({ message: "The publication already exists" }));
        });

        it('Create a new publication', async () => {
            Publication.findOne = jest.fn(() => mockPublications.some( publication => publication.publicationId == 'new-publication'));
            User.findOne = jest.fn(() => mockUsers.filter(user => user.userId == 'el-userId-2')[0]);
            Problem.findOne = jest.fn(() => mockProblems.filter( problem => problem.problemId == 'el-problemId-2'));

            jest.spyOn(Publication.prototype, 'save')
            .mockImplementationOnce(() => {
                mockPublications.push({
                    _id: 4,
                    title: "new publication",
                    publicationId: "new-publication",
                    user: ["el-userId-2"],
                    relatedProblems: ["el-problemId-2"]
                });
                return { _id: 4, title: "new publication", publicationId: "new-publication", user: ["el-userId-2"], relatedProblems: ["el-problemId-2"]}
            });

            const saveReferencesMock = jest.fn()
            .mockImplementationOnce(() => {
                mockUsers[1] = {
                    _id: 2,
                    name: "el nombre 2",
                    email: "el email 2",
                    password: "la pass 2",
                    userId: "el-userId-2",
                    roles: ['5f94531373dbf256c8900501'],
                    publications: ["el-publicationId-2","new-publication"]
                }
                return mockUsers
            })
            .mockImplementationOnce(() => {
                mockProblems[1] = {
                    _id: 2,
                    name: "el problem 2",
                    problemId: "el-problemId-2",
                    user: ["el-userId-2"],
                    publications: ["el-publicationId-2","new-publication"]
                }
                return mockProblems
            });
            publicationController.__Rewire__('saveReferences', saveReferencesMock)

            const res = await request(app).post('/api/publications').send({
                title: "new publication",
                publicationId: "new-publication",
                user: ["el-userId-2"],
                relatedProblems: ["el-problemId-2"]
            });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({ _id: 4, title: "new publication", publicationId: "new-publication", user: ["el-userId-2"], relatedProblems: ["el-problemId-2"]}));
            expect(mockPublications).toHaveLength(4);
            expect(mockPublications).toEqual(expect.arrayContaining([{ _id: 4, title: "new publication", publicationId: "new-publication", user: ["el-userId-2"], relatedProblems: ["el-problemId-2"]}]));
            
            expect(mockUsers).toHaveLength(3);
            expect(mockUsers).toEqual(expect.arrayContaining([{
                _id: 2,
                name: "el nombre 2",
                email: "el email 2",
                password: "la pass 2",
                userId: "el-userId-2",
                roles: ['5f94531373dbf256c8900501'],
                publications: ["el-publicationId-2","new-publication"]
            }]));

            expect(mockProblems).toHaveLength(3);
            expect(mockProblems).toEqual(expect.arrayContaining([{
                _id: 2,
                name: "el problem 2",
                problemId: "el-problemId-2",
                user: ["el-userId-2"],
                publications: ["el-publicationId-2","new-publication"]
            }]));
        });

    });

    describe('Update Publication', () => {
        beforeEach(() => {
            authJwt.verifyToken.mockImplementation((req, res, next) => next());
        });

        it('Publication not found', async () => {
            Publication.findOne = jest.fn(() => mockPublications.some( publication => publication.publicationId == "no-exist"));
            const res = await request(app).put('/api/publications/no-exist');
            expect(authJwt.verifyToken).toHaveBeenCalledTimes(1);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({ message: "Publication not found" }));
        
        });

        it('Update publication error', async () => {
            Publication.findOne = jest.fn(() => {throw Error});
            const res = await request(app).put('/api/publications/el-publicationId-2');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });

        it('User doesnt have rights to update a publication', async () => {
            authJwt.verifyToken.mockImplementation((req, res, next) => { 
                req.isAdmin = false; 
                req.id = 3
                next() 
            });
            Publication.findOne = jest.fn(() => mockPublications.filter( publication => publication.publicationId == 'el-publicationId-2'));
            User.find = jest.fn(() => mockUsers.filter( user => user.userId == 'el-userId-2'));
            

            const res = await request(app).put('/api/publications/el-publicationId-2');
            expect(authJwt.verifyToken).toHaveBeenCalledTimes(1);
            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual(expect.objectContaining({ message: "Unauthorized" }));
        });

        it('User updates a publicationId no unique', async () => {
            authJwt.verifyToken.mockImplementation((req, res, next) => { 
                req.isAdmin = false; 
                req.id = 2
                next() 
            });
            Publication.findOne = jest.fn(() => mockPublications.filter( publication => publication.publicationId == 'el-publicationId-2'));
            User.find = jest.fn(() => mockUsers.filter( user => user.userId == 'el-userId-2'));
            
            const res = await request(app).put('/api/publications/el-publicationId-2').send({
                publicationId: 'no-copiar-id'
            });
            expect(authJwt.verifyToken).toHaveBeenCalledTimes(1);
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(expect.objectContaining({ message: "The publicationId already exists" }));
        });

        it('Update a publication', async () => {
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
                    publications: []
                }
                return mockUsers
            })
            .mockImplementationOnce(() => {
                mockProblems[1] = {
                    _id: 2,
                    name: "el problem 2",
                    problemId: "el-problemId-2",
                    user: ["el-userId-2"],
                    publications: []
                }
                return mockProblems
            });
            publicationController.__Rewire__('deleteReferences', deleteReferencesMock)

            const saveReferencesMock = jest.fn()
            .mockImplementationOnce(() => {
                mockUsers[1] = {
                    _id: 2,
                    name: "el nombre 2",
                    email: "el email 2",
                    password: "la pass 2",
                    userId: "el-userId-2",
                    roles: ['5f94531373dbf256c8900501'],
                    publications: ["el-publicationId-2"]
                }
                return mockUsers
            })
            .mockImplementationOnce(() => {
                mockProblems[1] = {
                    _id: 2,
                    name: "el problem 2",
                    problemId: "el-problemId-2",
                    user: ["el-userId-2"],
                    publications: ["el-publicationId-2"]
                }
                return mockProblems
            });
            publicationController.__Rewire__('saveReferences', saveReferencesMock)

            Publication.findOne = jest.fn(() => mockPublications.filter( publication => publication.publicationId == 'el-publicationId-2'));
            User.find = jest.fn(() => mockUsers.filter( user => user.userId == 'el-userId-2'));
            Problem.find = jest.fn(() => mockProblems.filter(problem => problem.publications.includes('el-publicationId-2')));
            Problem.findOne = jest.fn(() => mockProblems.filter(problem => problem.publications.includes('el-publicationId-2'))[0]);
            User.findOne = jest.fn(() => mockUsers.filter(user => user.userId == 'el-userId-2')[0]);
            Publication.findOneAndUpdate = jest.fn(() => (mockPublications[1] = {
                _id: 2,
                title: "new title",
                publicationId: "el-publicationId-2",
                user: ["el-userId-2"],
                relatedProblems: ["el-problemId-2"]
            }));

            const res = await request(app).put('/api/publications/el-publicationId-2').send({
                title: 'new title'
            });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({ _id: 2, title: "new title", publicationId: "el-publicationId-2", user: ["el-userId-2"], relatedProblems: ["el-problemId-2"] }));
            expect(mockPublications).toHaveLength(3);
            expect(mockPublications).toEqual(expect.arrayContaining([{ _id: 2, title: "new title", publicationId: "el-publicationId-2", user: ["el-userId-2"], relatedProblems: ["el-problemId-2"]}]));
            expect(mockUsers).toEqual(expect.arrayContaining([{
                _id: 2,
                name: "el nombre 2",
                email: "el email 2",
                password: "la pass 2",
                userId: "el-userId-2",
                roles: ['5f94531373dbf256c8900501'],
                publications: ["el-publicationId-2"]
            }]));
            expect(mockProblems).toEqual(expect.arrayContaining([{
                _id: 2,
                name: "el problem 2",
                problemId: "el-problemId-2",
                user: ["el-userId-2"],
                publications: ["el-publicationId-2"]
            }]));
        });
    });

    describe('Delete Publication', () => {
        beforeEach(() => {
            authJwt.verifyToken.mockImplementation((req, res, next) => next());
        });

        it('The publication doesnt exist', async () => {
            Publication.findOne = jest.fn(() => mockPublications.some( publication => publication.publicationId == 'no-exist'));
            const res = await request(app).delete('/api/publications/no-exist');
            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual(expect.objectContaining({ message: "Publication not found" }));
        });

        it('Delete publication error', async () => {
            Publication.findOne = jest.fn(() => {throw Error});
            const res = await request(app).delete('/api/publications/no-exist');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });

        it('User doesnt have rights to delete a publication', async () => {
            authJwt.verifyToken.mockImplementation((req, res, next) => { 
                req.isAdmin = false; 
                req.id = 3
                next() 
            });
            Publication.findOne = jest.fn(() => mockPublications.filter( publication => publication.publicationId == 'el-publicationId-2'));
            User.find = jest.fn(() => mockUsers.filter( user => user.userId == 'el-userId-2'));
            

            const res = await request(app).delete('/api/publications/el-publicationId-2');
            expect(authJwt.verifyToken).toHaveBeenCalledTimes(1);
            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual(expect.objectContaining({ message: "Unauthorized" }));
        });
        
        it('Delete publication', async () => {
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
                    publications: []
                }
                return mockUsers
            })
            .mockImplementationOnce(() => {
                mockProblems[1] = {
                    _id: 2,
                    name: "el problem 2",
                    problemId: "el-problemId-2",
                    user: ["el-userId-2"],
                    publications: []
                }
                return mockProblems
            });
            publicationController.__Rewire__('deleteReferences', deleteReferencesMock)

            Publication.findOne = jest.fn(() => mockPublications.filter( publication => publication.publicationId == 'el-publicationId-2'));
            Problem.find = jest.fn(() => mockProblems.filter( problem => problem.publications.includes('el-publicationId-2')));
            User.find = jest.fn(() => mockUsers.filter(user => user.userId == 'el-userId-2'));
            Publication.findOneAndDelete = jest.fn(() => mockPublications.splice(1,1));

            const res = await request(app).delete('/api/publications/el-problemId-2');
            expect(res.statusCode).toEqual(200);
            expect(mockPublications).toHaveLength(2);
            expect(mockPublications).toEqual(expect.not.arrayContaining([{
                _id: 2,
                title: "el publication 2",
                publicationId: "el-publicationId-2",
                user: ["el-userId-2"],
                relatedProblems: []
            }]));

            expect(mockUsers).toHaveLength(3);
            expect(mockUsers).toEqual(expect.arrayContaining([{
                _id: 2,
                name: "el nombre 2",
                email: "el email 2",
                password: "la pass 2",
                userId: "el-userId-2",
                roles: ['5f94531373dbf256c8900501'],
                publications: []
            }]));

            expect(mockProblems).toHaveLength(3);
            expect(mockProblems).toEqual(expect.arrayContaining([{
                _id: 2,
                name: "el problem 2",
                problemId: "el-problemId-2",
                user: ["el-userId-2"],
                publications: []
            }]));
        });

    });

});