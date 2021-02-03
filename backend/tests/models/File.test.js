import File from "../../src/models/File";


describe('File Model', () => {
    const file = new File({
        name: "datos.txt",
        fileId: "0982365gh235897",
        section: "staste",
        path: "uploads/0982365gh235897",
    })    
 
    it('_id is defined in File model', () => {
        expect(file._id).toBeDefined()
    });
    it('Name is defined in File model', () => {
        expect(file.name).toBeDefined()
    });
    it('fileId is defined in File model', () => {
        expect(file.fileId).toBeDefined()
    });
    it('Section is defined in File model', () => {
        expect(file.section).toBeDefined()
    });
    it('Path is defined in File model', () => {
        expect(file.path).toBeDefined()
    });
});
