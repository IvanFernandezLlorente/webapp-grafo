import File from "../../src/models/File";
import * as fileController from '../../src/controllers/file.controller';
import fs from 'fs-extra';
import request from 'supertest';
import path from 'path';
import { response } from 'express';

const multer = require('multer');

jest.mock('../../src/middlewares/auth.jwt');
const authJwt = require('../../src/middlewares/auth.jwt');
import app from '../../src/app';


let mockFiles;
describe('File controller', () => {
    beforeEach(() => {
        mockFiles = [
            {
                _id: 1,
                name: "datos.txt",
                fileId: "fdh45674",
                section: "staste",
                path: "uploads/fdh45674",
            },
            {
                _id: 2,
                name: "datos.zip",
                fileId: "0982365gh235897",
                section: "instances",
                path: "uploads/0982365gh235897",
            },
            {
                _id: 3,
                name: "datos.docs",
                fileId: "opu3426sgs",
                section: "references",
                path: "uploads/opu3426sgs",
            },
        ]
    });

    describe('Get File', () => {

        it('Get file by fileId', async () => {
            File.findOne = jest.fn(() => mockFiles.filter( file => file.fileId == '0982365gh235897'));
            const res = await request(app).get('/api/files/0982365gh235897');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(1);
            expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({_id: 2})]));
        });

        it('Get file by fileId not found', async () => {
            File.findOne = jest.fn(() => mockFiles.some( file => file.fileId == 'no-exist'));
            const res = await request(app).get('/api/files/no-exist');
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({ message: "File not found" }));
        });

        it('Get file by fileId error', async () => {
            File.findOne = jest.fn(() => {throw Error});
            const res = await request(app).get('/api/files/no-exist');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });

        it('Download file by fileId', async () => {
            File.findOne = jest.fn(() => mockFiles.filter( file => file.fileId == '0982365gh235897'));
            const res = await request(app).get('/api/files/0982365gh235897');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(1);
            expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({_id: 2})]));
        });

    });

    describe('Download File', () => {

        // it('Download file by fileId', async () => {
        //     response.download = jest.fn(() => done());
        //     jest.spyOn(response, 'download').mockReturnValueOnce('');
        //     jest.spyOn(path, 'join').mockReturnValueOnce('uploads/0982365gh235897');
        //     File.findOne = jest.fn(() => mockFiles.filter( file => file.fileId == '0982365gh235897'));
        //     const res = await request(app).get('/api/files/downloads/0982365gh235897');
        //     expect(res.statusCode).toEqual(200);
        // });

        it('Download file by fileId not found', async () => {
            File.findOne = jest.fn(() => mockFiles.some( file => file.fileId == 'no-exist'));
            const res = await request(app).get('/api/files/downloads/no-exist');
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({ message: "File not found" }));
        });

        it('Download file by fileId error', async () => {
            File.findOne = jest.fn(() => {throw Error});
            const res = await request(app).get('/api/files/downloads/no-exist');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });
    });

    describe('Upload File', () => {
        beforeEach(() => {
            authJwt.verifyToken.mockImplementation((req, res, next) => next());
            jest.mock('multer', () => jest.fn())
        })

        // it('Upload File', async () => {
        //     authJwt.verifyToken.mockImplementation((req, res, next) => {
        //         req.file.originalname = "newfile.zip"
        //         req.file.path = "uploads/wasesgagv2354"
        //     });
        //     jest.spyOn(File.prototype, 'save')
        //     .mockImplementation(() => {
        //         // mockFiles.push({
        //         //     _id: 4,
        //         //     name: "newfile.zip",
        //         //     section: "instances",
        //         //     fileId: "wasesgagv2354",
        //         //     path: "uploads/wasesgagv2354"
        //         // });
        //         return { _id: 4, name: "newfile.zip", section: "instances", fileId: "wasesgagv2354", path: "uploads/wasesgagv2354" }
        //     });

        //     const res = await request(app).post('/api/files').send({
        //         fileId: "wasesgagv2354",
        //         section: "instances",
        //     });
        //     expect(res.statusCode).toEqual(200);
        //     expect(res.body).toEqual(expect.objectContaining({ _id: 4, name: "newfile.zip", fileId: "wasesgagv2354", path: "uploads/wasesgagv2354" }));
        //     expect(mockFiles).toHaveLength(4);
        // });

        it('Upload File error', async () => {
            jest.spyOn(File.prototype, 'save').mockImplementation(() => {throw Error});
            const res = await request(app).post('/api/files');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });
    });

    describe('Delete File', () => {
        beforeEach(() => {
            authJwt.verifyToken.mockImplementation((req, res, next) => next());
        });
        
        it('File not found', async () => {
            File.findOne = jest.fn(() => mockFiles.some( file => file.fileId == 'no-exist'));
            const res = await request(app).delete('/api/files/no-exist');
            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual(expect.objectContaining({ message: "File not found" }));
        });

        it('Delete file error', async () => {
            File.findOne = jest.fn(() => {throw Error});
            const res = await request(app).delete('/api/files/no-exist');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual(expect.objectContaining({ message: "Error" }));
        });

        it('Delete file', async () => {
            File.findOne = jest.fn(() => mockFiles.filter( file => file.fileId == '0982365gh235897'));
            File.findOneAndDelete = jest.fn(() => mockFiles.splice(1, 1));
            jest.spyOn(fs, 'unlink').mockReturnValueOnce('');
            jest.spyOn(path, 'resolve').mockReturnValueOnce('/fakepath');
            const res = await request(app).delete('/api/files/0982365gh235897');
            expect(res.statusCode).toEqual(200);
            expect(mockFiles).toHaveLength(2);
            expect(mockFiles).toEqual(expect.not.arrayContaining([{
                _id: 2,
                name: "datos.zip",
                fileId: "0982365gh235897",
                section: "instances",
                path: "uploads/0982365gh235897",
            }]));
        });
    });

});