import Tag from "../../src/models/Tag";

describe('Tag Model', () => {
    const tag = new Tag({
        key: "tag-name",
        value: "Tag Name"
    })    
 
    it('_id is defined in Tag model', () => {
        expect(tag._id).toBeDefined()
    });
    it('Key is defined in Tag model', () => {
        expect(tag.key).toBeDefined()
    });
    it('Value is defined in Tag model', () => {
        expect(tag.value).toBeDefined()
    });
});
