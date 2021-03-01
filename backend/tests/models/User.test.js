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
        urjcUrl: "el urjc 1",
        scholarUrl: "el scholar 1",
        imagenPath: "la imagen",
        roles: ['user'],
        publications: ['una-publicacion'],
        problems: ['un-problema'],
        google: {
            name: '',
            email: '',
            methodId: ''
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
        expect(user.urjcUrl).toBeDefined()
    });
    it('ScholarUrl is defined in User model', () => {
        expect(user.scholarUrl).toBeDefined()
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
});
