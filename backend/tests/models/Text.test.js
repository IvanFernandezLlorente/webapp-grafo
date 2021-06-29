import Text from "../../src/models/Text";

describe('Text Model', () => {
    const text = new Text({
        type: "description",
        en: "description en",
        es: "description es"
    })    
 
    it('_id is defined in Text model', () => {
        expect(text._id).toBeDefined()
    });
    it('type is defined in Text model', () => {
        expect(text.type).toBeDefined()
    });
    it('en is defined in Text model', () => {
        expect(text.en).toBeDefined()
    });
    it('es is defined in Text model', () => {
        expect(text.es).toBeDefined()
    });
});
