import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const messages = {
    'en': {
        home: {
            title: 'Home'
        },
        login: {
            title: 'Sign in to Grafo Research',
            email: 'Email',
            emailPHolder: 'example@gmail.com',
            pass: 'Password',
            passPHolder: 'password',
            button: 'Sign In',
            titleNewPerson: 'New to Grafo Research?',
            linkNewPerson: 'Request Sign Up',
            google: 'Sign In Google',
            github: 'Sign In Github',
            orcid: 'Sign In ORCID'
        },
        requestSignUp: {
            title: 'Request Sign Up',
            email: 'Email',
            emailPHolder: 'example@gmail.com',
            name: 'Name',
            namePHolder: 'Your Name',
            description: 'Description',
            descriptionPHolder: 'Here can be your description...',
            button: 'Request Sign Up',
            successmsg: 'The request has been sended'
        },
        signUp: {
            title: 'Sign Up',
            email: 'Email',
            name: 'Name',
            pass: 'Password',
            passPHolder: 'password',
            button: 'Sign Up'
        },
        topNavBar: {
            create: 'Create',
            problem: 'Problem',
            publication: 'Publication',
            importORCID: 'Import from ORCID',
            requests: 'Requests',
            settigns: 'Settings',
            signIn: 'Sign In',
            signUp: 'Sign Up',
            logout: 'Log out'
        },
        drawer: {
            home: 'Home',
            people: 'People',
            publications: 'Publications', 
            problems: 'Problems',
        },
        settigns: {
            title: 'Settings',
            tabProfile: 'Profile',
            tabPassword: 'Password',
            tabAccounts: 'Accounts',
            tabDanger: 'Danger Zone',
            email: 'E-mail',
            emailPHolder: 'example@gmail.com',
            name: 'Name',
            namePHolder: 'Your Name',
            idPHolder: 'id-example',
            linkedinPHolder: 'https://www.linkedin.com/in/example',
            scholarPHolder: 'https://scholar.google.es/citations?user=example',
            organization: 'Organization',
            organizationPHolder: 'Your organization',
            department: 'Department',
            departmentPHolder: 'Your department',
            researchGroup: 'Research Group',
            researchGroupPHolder: 'Your research group',
            area: 'Area',
            areaPHolder: 'Your area',
            description: 'Description',
            descriptionPHolder: 'Here can be your description...',
            saveProfile: 'Save profile',
            uploadPhoto: 'Upload photo',
            currentPassword: 'Current Password',
            newPassword: 'New Password',
            confirmPassword: 'Confirm Password',
            google: 'Connect with Google',
            github: 'Connect with GitHub',
            orcid: 'Connect with ORCID',
            disconnect: 'Disconnect',
            ban: 'Ban User',
            disable: 'Disable Account',
            delete: 'Delete Account',
            allow: 'Allow User'

        },
        people: {
            title: 'People'
        },
        profile: {
            title: 'Researcher',
            problems: 'Problems',
            publications: 'Publications',
            edit: 'Edit'
        },
        publications: {
            title: 'Publications'
        },
        publication: {
            title: 'Publication',
            edit: 'Edit',
            delete: 'Delete',
            pdf: 'Get PDF',
            cite: 'Cite',
            url: 'URL',
            relatedProblems: 'Related Problems',
            abstract: 'Abstract',
            keywords: 'Keywords',
            introduction: 'Introduction',
            description: 'Description',
            state: 'State of the Art Methods',
            instances: 'Instances',
            computationalExperience: 'Computational Experience',
            references: 'References'
        },
        problems: {
            title: 'Problems'
        },
        problem: {
            title: 'Problem',
            edit: 'Edit',
            delete: 'Delete',
            relatedPublications: 'Related Publications',
            introduction: 'Introduction',
            description: 'Description',
            state: 'State of the Art Methods',
            instances: 'Instances',
            computationalExperience: 'Computational Experience',
            references: 'References'
        },
        applications: {
            title: 'Requests',
            acceptAll: 'Accept All',
            rejectAll: 'Reject All',
            name: 'Name',
            email: 'Email',
            description: 'Description',
            acceptRequest: 'Accept Request',
            rejectRequest: 'Reject Request'
        },
        importORCID: {
            title: 'Import from ORCID',
            titlePubli: 'Title',
            journal: 'Journal',
            date: 'Date',
            citation: 'Citation',
            import: 'Import publication',
            msg: 'You cannot import a publication without citation'
        },
        createPublication: {
            new: 'New Publication',
            edit: 'Edit Publication',
            wizard1: 'Publication details',
            wizard2: 'Description',
            wizard3: 'State of the Art Methods',
            wizard4: 'Instances',
            wizard5: 'Computational Experience',
            wizard6: 'References',
            wizard7: 'Confirm',
            importBibtex: 'Import BibTeX',
            bibtexPHolder: 'Insert BibTeX here:',
            uploadPDF: 'Upload PDF',
            titlePubli: 'Title',
            journal: 'Journal',
            volume: 'Volume',
            pages: 'Pages',
            year: 'Year',
            publisher: 'Publisher',
            issn: 'ISSN',
            doi: 'DOI',
            url: 'URL',
            keywords: 'Keywords',
            abstract: 'Abstract',
            authors: 'Authors',
            addAuthor: 'Add Author',
            relatedProblems: 'Related Problems',
            addProblem: 'Add Problem',
            chooseFile: 'Choose a File',
            next: 'Next',
            back: 'Back',
            save: 'Save Publication'
        },
        createProblem: {
            new: 'New Problem',
            edit: 'Edit Problem',
            wizard1: 'Problem details',
            wizard2: 'Description',
            wizard3: 'State of the Art Methods',
            wizard4: 'Instances',
            wizard5: 'Computational Experience',
            wizard6: 'References',
            wizard7: 'Confirm',
            titlePro: 'Name',
            alias: 'Alias',
            managers: 'Managers',
            addUser: 'Add User',
            relatedPublications: 'Related Publications',
            addPublication: 'Add Publication',
            chooseFile: 'Choose a File',
            next: 'Next',
            back: 'Back',
            save: 'Save Problem'
        }
        
    },
    'es': {
        home: {
            title: 'Inicio'
        },
        login: {
            title: 'Iniciar sesión en Grafo Research',
            email: 'Email',
            emailPHolder: 'ejemplo@gmail.com',
            pass: 'Contraseña',
            passPHolder: 'contraseña',
            button: 'Iniciar Sesión',
            titleNewPerson: '¿Nuevo en Grafo Research?',
            linkNewPerson: 'Solicita el registro',
            google: 'Iniciar sesión con Google',
            github: 'Iniciar sesión con Github',
            orcid: 'Iniciar sesión con ORCID'
        },
        requestSignUp: {
            title: 'Solicitar Registro',
            email: 'Email',
            emailPHolder: 'ejemplo@gmail.com',
            name: 'Nombre',
            namePHolder: 'Escribe tu nombre',
            description: 'Descripción',
            descriptionPHolder: 'Aquí puedes escribir la description...',
            button: 'Solicitar Registro',
            successmsg: 'La solicitud ha sido enviada'
        },
        signUp: {
            title: 'Registro',
            email: 'Email',
            name: 'Nombre',
            pass: 'Contraseña',
            passPHolder: 'contraseña',
            button: 'Registrarse'
        },
        topNavBar: {
            create: 'Crear',
            problem: 'Problema',
            publication: 'Publicación',
            importORCID: 'Importar de ORCID',
            requests: 'Solicitudes',
            settigns: 'Ajustes',
            signIn: 'Iniciar Sesión',
            signUp: 'Registro',
            logout: 'Cerrar Sesión'
        },
        drawer: {
            home: 'Inicio',
            people: 'Personas',
            publications: 'Publicaciones', 
            problems: 'Problemas',
        },
        settigns: {
            title: 'Ajuste',
            tabProfile: 'Perfil',
            tabPassword: 'Contraseña',
            tabAccounts: 'Cuentas',
            tabDanger: 'Zona Peligrosa',
            email: 'E-mail',
            emailPHolder: 'ejemplo@gmail.com',
            name: 'Nombre',
            namePHolder: 'Tu nombre',
            idPHolder: 'id-ejemplo',
            linkedinPHolder: 'https://www.linkedin.com/in/example',
            scholarPHolder: 'https://scholar.google.es/citations?user=example',
            organization: 'Organización',
            organizationPHolder: 'Tu organización',
            department: 'Departamento',
            departmentPHolder: 'Tu departamento',
            researchGroup: 'Research Group',
            researchGroupPHolder: 'Tu grupo de investigación',
            area: 'Área',
            areaPHolder: 'Tu área',
            description: 'Descripción',
            descriptionPHolder: 'Aquí puedes escribir la description...',
            saveProfile: 'Guardar perfil',
            uploadPhoto: 'Añadir foto',
            currentPassword: 'Contraseña actual',
            newPassword: 'Nueva Contraseña',
            confirmPassword: 'Confirma la contraseña',
            google: 'Conectar con Google',
            github: 'Conectar con GitHub',
            orcid: 'Conectar con ORCID',
            disconnect: 'Desconectar',
            ban: 'Bloquear usuario',
            disable: 'Deshabilitar cuenta',
            delete: 'Borrar cuenta',
            allow: 'Permitir usuario'
        },
        people: {
            title: 'Personas'
        },
        profile: {
            title: 'Investigador',
            problems: 'Problemas',
            publications: 'Publicaciones',
            edit: 'Editar'
        },
        publications: {
            title: 'Publicaciones'
        },
        publication: {
            title: 'Publicación',
            edit: 'Editar',
            delete: 'Borrar',
            pdf: 'PDF',
            cite: 'Cita',
            url: 'URL',
            relatedProblems: 'Problemas relacionados',
            abstract: 'Resumen',
            keywords: 'Palabras claves',
            introduction: 'Introdución',
            description: 'Descripción',
            state: 'Estado del arte',
            instances: 'Instancias',
            computationalExperience: 'Experiencia computacional',
            references: 'Referencias'
        },
        problems: {
            title: 'Problemas'
        },
        problem: {
            title: 'Problema',
            edit: 'Editar',
            delete: 'Borrar',
            relatedPublications: 'Publicaciones relacionadas',
            introduction: 'Introdución',
            description: 'Descripción',
            state: 'Estado del arte',
            instances: 'Instancias',
            computationalExperience: 'Experiencia computacional',
            references: 'Referencias'
        },
        applications: {
            title: 'Solicitudes',
            acceptAll: 'Aceptar todas',
            rejectAll: 'Rechazar todas',
            name: 'Nombre',
            email: 'Email',
            description: 'Descripción',
            acceptRequest: 'Aceptar solicitud',
            rejectRequest: 'Rechazar solicitud'
        },
        importORCID: {
            title: 'Importar de ORCID',
            titlePubli: 'Título',
            journal: 'Revista',
            date: 'Fecha',
            citation: 'Citación',
            import: 'Importar publicación',
            msg: 'No puedes importar una publicación sin la cita'
        },
        createPublication: {
            new: 'Nueva Publicación',
            edit: 'Editar Publicación',
            wizard1: 'Detalles',
            wizard2: 'Descripción',
            wizard3: 'Estado del arte',
            wizard4: 'Instancias',
            wizard5: 'Experiencia computacional',
            wizard6: 'Referencias',
            wizard7: 'Confirmar',
            importBibtex: 'Importar BibTeX',
            bibtexPHolder: 'Inserta BibTeX aquí:',
            uploadPDF: 'Añadir PDF',
            titlePubli: 'Título',
            journal: 'Revista',
            volume: 'Volumen',
            pages: 'Paginas',
            year: 'Año',
            publisher: 'Editorial',
            issn: 'ISSN',
            doi: 'DOI',
            url: 'URL',
            keywords: 'Palabras claves',
            abstract: 'Resumen',
            authors: 'Autores',
            addAuthor: 'Añadir autor',
            relatedProblems: 'Problemas relacionados',
            addProblem: 'Añadir Problema',
            chooseFile: 'Elige un archivo',
            next: 'Siguiente',
            back: 'Atrás',
            save: 'Guardar Publicación'
        },
        createProblem: {
            new: 'Nuevo Problema',
            edit: 'Editar Problema',
            wizard1: 'Detalles',
            wizard2: 'Descripción',
            wizard3: 'Estado del arte',
            wizard4: 'Instancias',
            wizard5: 'Experiencia computacional',
            wizard6: 'Referencias',
            wizard7: 'Confirmar',
            titlePro: 'Nombre',
            alias: 'Alias',
            managers: 'Gestores',
            addUser: 'Añadir usuario',
            relatedPublications: 'Publicaciones relacionadas',
            addPublication: 'Añadir publicación',
            chooseFile: 'Elige un archivo',
            next: 'Siguiente',
            back: 'Atrás',
            save: 'Guardar Problema'
        }
    }
};

const i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'es',
    messages,
});

export default i18n;