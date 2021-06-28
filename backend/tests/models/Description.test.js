import Description from "../../src/models/Description";

describe('Description Model', () => {
    const description = new Description({
        en: "description en",
        es: "description es"
    })    
 
    it('_id is defined in Description model', () => {
        expect(description._id).toBeDefined()
    });
    it('en is defined in Description model', () => {
        expect(description.en).toBeDefined()
    });
    it('es is defined in Description model', () => {
        expect(description.es).toBeDefined()
    });
});
