import Publication from "../../src/models/Publication";


describe('Publication Model', () => {
    const publication = new Publication({
        title: "publication title",
        publicationId: "el-publicationId-1",
        description: "la descri 1",
        state: "el staste",
        instances: "las instacias",
        computationalExperience: "la experience",
        reference: "las referencias",
        user: ['el-userId-2'],
        relatedProblems: ['un-problem'],
        usersNotRegistered: ['pepe'],
        attachments: ['file-attachment']
    })    
 
    it('_id is defined in Publication model', () => {
        expect(publication._id).toBeDefined()
    });
    it('Title is defined in Publication model', () => {
        expect(publication.title).toBeDefined()
    });
    it('publicationId is defined in Publication model', () => {
        expect(publication.publicationId).toBeDefined()
    });
    it('Description is defined in Publication model', () => {
        expect(publication.description).toBeDefined()
    });
    it('State is defined in Publication model', () => {
        expect(publication.state).toBeDefined()
    });
    it('Instances is defined in Publication model', () => {
        expect(publication.instances).toBeDefined()
    });
    it('Computational Experience is defined in Publication model', () => {
        expect(publication.computationalExperience).toBeDefined()
    });
    it('Reference is defined in Publication model', () => {
        expect(publication.reference).toBeDefined()
    });
    it('User is defined in Publication model', () => {
        expect(publication.user).toBeDefined()
    });
    it('Publications is defined in Publication model', () => {
        expect(publication.relatedProblems).toBeDefined()
    });
    it('Users Not Registered is defined in Publication model', () => {
        expect(publication.usersNotRegistered).toBeDefined()
    });
    it('Attachments is defined in Publication model', () => {
        expect(publication.attachments).toBeDefined()
    });
});
