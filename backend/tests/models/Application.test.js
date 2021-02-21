import Application from "../../src/models/Application";


describe('Application Model', () => {
    const application = new Application({
        name: "pepe",
        email: "pepe@gmail.com",
        description: "hi",
        accepted: true,
    })    
 
    it('_id is defined in Application model', () => {
        expect(application._id).toBeDefined()
    });
    it('Name is defined in Application model', () => {
        expect(application.name).toBeDefined()
    });
    it('Email is defined in Application model', () => {
        expect(application.email).toBeDefined()
    });
    it('Description is defined in Application model', () => {
        expect(application.description).toBeDefined()
    });
    it('Accepted is defined in Application model', () => {
        expect(application.accepted).toBeDefined()
    });
});
