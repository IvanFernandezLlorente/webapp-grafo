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
        problems: ['un-problem'],
        usersNotRegistered: ['pepe'],
        attachments: ['file-attachment'],
        pdf: "606eaa24-9262-4146-a583-6faf75e64788",
        journal: "Computers and Operations Research",
        volume: "78",
        pages: "500--512",
        year: "2017",
        publisher: "Elsevier",
        issn: '0305-0548',
        doi: 'https://doi.org/10.1016/j.cor.2020.105116',
        url: 'https://www.sciencedirect.com/science/article/pii/S0305054820302331',
        keywords: 'Cyclic cutwidth, Graph layout problem, Circular embedding',
        abstract: 'The Cyclic Cutwidth Minimization Problem (CCMP) is a Graph Layout',
        bibtex: 'the bibtex'
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
    it('Problems is defined in Publication model', () => {
        expect(publication.problems).toBeDefined()
    });
    it('Users Not Registered is defined in Publication model', () => {
        expect(publication.usersNotRegistered).toBeDefined()
    });
    it('Attachments is defined in Publication model', () => {
        expect(publication.attachments).toBeDefined()
    });
    it('PDF is defined in Publication model', () => {
        expect(publication.pdf).toBeDefined()
    });
    it('Journal is defined in Publication model', () => {
        expect(publication.journal).toBeDefined()
    });
    it('Volume is defined in Publication model', () => {
        expect(publication.volume).toBeDefined()
    });
    it('Pages is defined in Publication model', () => {
        expect(publication.pages).toBeDefined()
    });
    it('Year is defined in Publication model', () => {
        expect(publication.year).toBeDefined()
    });
    it('Publisher is defined in Publication model', () => {
        expect(publication.publisher).toBeDefined()
    });
    it('issn is defined in Publication model', () => {
        expect(publication.issn).toBeDefined()
    });
    it('doi is defined in Publication model', () => {
        expect(publication.doi).toBeDefined()
    });
    it('url is defined in Publication model', () => {
        expect(publication.url).toBeDefined()
    });
    it('keywords is defined in Publication model', () => {
        expect(publication.keywords).toBeDefined()
    });
    it('abstract is defined in Publication model', () => {
        expect(publication.abstract).toBeDefined()
    });
    it('bibtex is defined in Publication model', () => {
        expect(publication.bibtex).toBeDefined()
    });
});
