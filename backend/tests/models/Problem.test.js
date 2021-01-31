import Problem from "../../src/models/Problem";


describe('Problem Model', () => {
    const problem = new Problem({
        name: "problem name",
        problemId: "el-problemId-1",
        alias: "problem alias",
        description: "la descri 1",
        state: "el staste",
        instances: "las instacias",
        computationalExperience: "la experience",
        reference: "las referencias",
        user: ['el-userId-2'],
        publications: ['una-publicacion'],
        usersNotRegistered: ['pepe'],
    })    
 
    it('_id is defined in Problem model', () => {
        expect(problem._id).toBeDefined()
    });
    it('Name is defined in Problem model', () => {
        expect(problem.name).toBeDefined()
    });
    it('problemId is defined in Problem model', () => {
        expect(problem.problemId).toBeDefined()
    });
    it('Alias is defined in Problem model', () => {
        expect(problem.alias).toBeDefined()
    });
    it('Description is defined in Problem model', () => {
        expect(problem.description).toBeDefined()
    });
    it('State is defined in Problem model', () => {
        expect(problem.state).toBeDefined()
    });
    it('Instances is defined in Problem model', () => {
        expect(problem.instances).toBeDefined()
    });
    it('Computational Experience is defined in Problem model', () => {
        expect(problem.computationalExperience).toBeDefined()
    });
    it('Reference is defined in Problem model', () => {
        expect(problem.reference).toBeDefined()
    });
    it('User is defined in Problem model', () => {
        expect(problem.user).toBeDefined()
    });
    it('Publications is defined in Problem model', () => {
        expect(problem.publications).toBeDefined()
    });
    it('Users Not Registered is defined in Problem model', () => {
        expect(problem.usersNotRegistered).toBeDefined()
    });
});
