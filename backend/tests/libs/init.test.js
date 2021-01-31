import Role from "../../src/models/Rol";
const init = require('../../src/libs/init');

const roles = ['admin', 'user']
describe('Init', () => {
    it('Roles already created', async () => {
        Role.estimatedDocumentCount = jest.fn(() => roles.length);
        const res = await init.createRoles();
        expect(res).toBeUndefined();
    }); 

    it('Create roles', async () => {
        Role.estimatedDocumentCount = jest.fn(() => 0);
        Promise.all = jest.fn().mockImplementation(() => Promise.resolve([['admin', 'user']]))
        const res = await init.createRoles();
        expect(res).toBeUndefined();
    }); 

    it('Create roles error', async () => {
        Role.estimatedDocumentCount = jest.fn(() =>{throw Error});
        const res = await init.createRoles();
        expect(res).toBeUndefined();
    }); 
});