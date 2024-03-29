import User from "../../src/models/User";


describe('User Model', () => {
    const user = new User({
        name: "el nombre 1",
        email: "el email 1",
        password: "la pass 1",
        userId: "el-userId-1",
        organization: "la orga 1",
        department: "el depar 1",
        area: "el area 1",
        researchgroup: "el research 1",
        description: "la descri 1",
        linkedinUrl: "el linked 1",
        scopusUrl: "el scopus 1",
        scholarUrl: "el scholar 1",
        publonsUrl: "el publons 1",
        projects: "los projects 1",
        imagenProfile: "la imagen",
        banned: false,
        roles: ['user'],
        publications: ['una-publicacion'],
        problems: ['un-problema'],
        google: {
            name: '',
            email: '',
            methodId: ''
        },
        github: {
            name: '',
            methodId: ''
        },
        orcid: {
            name: '',
            orcid: ''
        }
    })    

    it('Encrypt password in User model', async () => {
        const pass = await User.encryptPassword('la pass')
        expect(pass).toBeDefined()
    });

    it('Compare same password in User model', async () => {
        const res = await User.comparePassword('hola', '$2y$12$JfrjdHofU8xGfyKgj5mnYelxfAlxobiIxglxg9isxOTJMSbt3Qnw.');
        expect(res).toBe(true)
    });

    it('Compare different password in User model', async () => {
        const res = await User.comparePassword('wrong pass', '$2y$12$JfrjdHofU8xGfyKgj5mnYelxfAlxobiIxglxg9isxOTJMSbt3Qnw.');
        expect(res).toBe(false)
    });

    it('_id is defined in User model', () => {
        expect(user._id).toBeDefined()
    });
    it('Name is defined in User model', () => {
        expect(user.name).toBeDefined()
    });
    it('Email is defined in User model', () => {
        expect(user.email).toBeDefined()
    });
    it('Password is defined in User model', () => {
        expect(user.password).toBeDefined()
    });
    it('userId is defined in User model', () => {
        expect(user.userId).toBeDefined()
    });
    it('Organization is defined in User model', () => {
        expect(user.organization).toBeDefined()
    });
    it('Department is defined in User model', () => {
        expect(user.department).toBeDefined()
    });
    it('Area is defined in User model', () => {
        expect(user.area).toBeDefined()
    });
    it('Researchgroup is defined in User model', () => {
        expect(user.researchgroup).toBeDefined()
    });
    it('Description is defined in User model', () => {
        expect(user.description).toBeDefined()
    });
    it('LinkedinUrl is defined in User model', () => {
        expect(user.linkedinUrl).toBeDefined()
    });
    it('UrjcUrl is defined in User model', () => {
        expect(user.scopusUrl).toBeDefined()
    });
    it('ScholarUrl is defined in User model', () => {
        expect(user.scholarUrl).toBeDefined()
    });
    it('PublonsUrl is defined in User model', () => {
        expect(user.publonsUrl).toBeDefined()
    });
    it('Projects is defined in User model', () => {
        expect(user.projects).toBeDefined()
    });
    it('Roles is defined in User model', () => {
        expect(user.roles).toBeDefined()
    });
    it('Publications is defined in User model', () => {
        expect(user.publications).toBeDefined()
    });
    it('Problems is defined in User model', () => {
        expect(user.problems).toBeDefined()
    });
    it('Google is defined in User model', () => {
        expect(user.google).toBeDefined()
    });
    it('GitHub is defined in User model', () => {
        expect(user.github).toBeDefined()
    });
    it('ORCID is defined in User model', () => {
        expect(user.orcid).toBeDefined()
    });
    it('imagenProfile is defined in User model', () => {
        expect(user.imagenProfile).toBeDefined()
    });
    it('banned is defined in User model', () => {
        expect(user.banned).toBeDefined()
    });
});
