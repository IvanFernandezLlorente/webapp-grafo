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
            passPHolder: 'Password',
            button: 'Sign In',
            titleNewPerson: 'New to Grafo Research?',
            linkNewPerson: 'Request Sign Up',
            google: 'Sign In with Google',
            github: 'Sign In with GitHub',
            orcid: 'Sign In with ORCID',
            emailError: 'Email not found',
            passwordError: 'Invalid password',
            blockedError: 'Your account is blocked',
            registeredError: 'Account not registered',
            generalError: 'An error has occurred',
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
            successmsg: 'The request has been sended. We will send you a email with a decision.',
            generalError: 'An error has occurred',
            emailError: 'The email already exists',
            emailRequested: 'The email already sent a request',
            emailRequired: 'The email is required',
            wrongEmail: 'Insert a valid email',
            nameRequired: 'The name is required'
        },
        signUp: {
            title: 'Sign Up',
            email: 'Email',
            name: 'Name',
            pass: 'Password',
            passPHolder: 'Password',
            button: 'Sign Up',
            passRequired: 'Insert a password',
            emailError: 'The email already exists',
            wrongEmail: 'The email is not accepted',
            generalError: 'An error has occurred',
        },
        topNavBar: {
            create: 'Create',
            problem: 'Problem',
            publication: 'Publication',
            importORCID: 'Import from ORCID',
            requests: 'Requests',
            settings: 'Settings',
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
        settings: {
            title: 'Settings',
            tabProfile: 'Profile',
            tabPassword: 'Password',
            tabAccounts: 'Conect Accounts',
            tabDanger: 'My Account',
            email: 'E-mail',
            emailPHolder: 'example@gmail.com',
            name: 'Full Name',
            namePHolder: 'Your Name',
            idPHolder: 'id-example',
            linkedinPHolder: 'https://www.linkedin.com/in/example',
            scholarPHolder: 'https://scholar.google.es/citations?user=example',
            scopusPHolder: 'https://www.scopus.com/authid/detail.uri?authorId=94710843964',
            publonsPHolder: 'https://publons.com/researcher/8207549/example/',
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
            projects: 'Projects',
            projectsPHolder: 'Here can be yours projects...',
            saveProfile: 'Save profile',
            uploadPhoto: 'Upload photo',
            updatedProfile: 'The profile has been updated',
            tooltip: 'Set your ORCID in order to import your publications',
            currentPassword: 'Current Password',
            newPassword: 'New Password',
            confirmPassword: 'Confirm Password',
            savePassword: 'Save password',
            errorPasswordIncomplete: 'Fill in every input',
            errorPasswordDifferent: 'The new password is not the same',
            changedPassword: 'Password has been changed',
            explainText: 'Connected accounts provide flexibility in sign in options. We do not post back information to your social accounts. You can remove the connected account later if you want.',
            google: 'Connect with Google',
            github: 'Connect with GitHub',
            orcid: 'Connect with ORCID',
            disconnect: 'Disconnect',
            ban: 'Ban User',
            disable: 'Disable Account',
            delete: 'Delete Account',
            allow: 'Allow User',
            confirmDelete: 'Are you sure you want to remove the user?',
            confirmBan: 'Are you sure you want to ban the user?',
            showPeople: 'Show user in the people list'
        },
        people: {
            title: 'People',
            showMore: 'Show more'
        },
        profile: {
            title: 'Researcher',
            problems: 'Problems',
            publications: 'Publications',
            projects: 'Projects',
            edit: 'Edit',
            showMore: 'Show more'
        },
        publications: {
            title: 'Publications',
            showMore: 'Show more',
            search: 'Search'
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
            title: 'Problems',
            showMore: 'Show more',
            tagsPHolder: 'Filter by tag',
            noRequests: 'There aren\'t any problem',
            searchName: 'Search by problem name'
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
            rejectRequest: 'Reject Request',
            noRequests: 'There aren\'t any requests'
        },
        importORCID: {
            title: 'Import from ORCID',
            titlePubli: 'Title',
            journal: 'Journal',
            date: 'Date',
            citation: 'Citation',
            import: 'Import publication',
            msg: 'You cannot import a publication without citation',
            noPublications: 'There aren\'t any publications',
            explication: 'If you want to import your publications from orcid, you need to fill in the ORCID field in your profile.',
            settings: 'Go to settings',
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
            noTitle: 'Title is required',
            noURL: 'URL is required',
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
            scientificName: 'Scientific name',
            userName: 'User name',
            relatedProblems: 'Related Problems',
            addProblem: 'Add Problem',
            chooseFile: 'Choose a File',
            optional: 'Optional',
            next: 'Next',
            back: 'Back',
            save: 'Save Publication',
            error: 'The publication title or the URL already exists',
            errorAuthors: 'It\'s mandatory to enter at least one author'
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
            noTitle: 'Name is required',
            noURL: 'URL is required',
            alias: 'Alias',
            managers: 'Managers',
            addUser: 'Add User',
            relatedPublications: 'Related Publications',
            tags: 'Tags',
            addPublication: 'Add Publication',
            chooseFile: 'Choose a File',
            next: 'Next',
            back: 'Back',
            save: 'Save Problem',
            tagsPHolder: 'Añade una etiqueta',
            tooltip: 'Select labels or add new ones by hitting enter',
            error: 'The problem name or the URL already exists',
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
            github: 'Iniciar sesión con GitHub',
            orcid: 'Iniciar sesión con ORCID',
            emailError: 'Email no encontrado',
            passwordError: 'Contraseña erronea',
            blockedError: 'La cuenta está bloqueada',
            registeredError: 'Cuenta no registrada',
            generalError: 'Ha ocurrido un error',
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
            successmsg: 'La solicitud ha sido enviada. Te enviaremos un correo con la decisión.',
            generalError: 'Ha ocurrido un error',
            emailError: 'El correo ya existe',
            emailRequested: 'Este email ya envió una solicitud',
            emailRequired: 'El email es obligatorio',
            wrongEmail: 'Introduzca un email válido',
            nameRequired: 'El nombre es obligatorio'
        },
        signUp: {
            title: 'Registro',
            email: 'Email',
            name: 'Nombre',
            pass: 'Contraseña',
            passPHolder: 'contraseña',
            button: 'Registrarse',
            passRequired: 'Inserte una contraseña',
            emailError: 'El email ya está registrado',
            wrongEmail: 'El email no es correcto',
            generalError: 'Ha ocurrido un error',
        },
        topNavBar: {
            create: 'Crear',
            problem: 'Problema',
            publication: 'Publicación',
            importORCID: 'Importar de ORCID',
            requests: 'Solicitudes',
            settings: 'Ajustes',
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
        settings: {
            title: 'Ajustes',
            tabProfile: 'Perfil',
            tabPassword: 'Contraseña',
            tabAccounts: 'Conectar Cuentas',
            tabDanger: 'Mi cuenta',
            email: 'E-mail',
            emailPHolder: 'ejemplo@gmail.com',
            name: 'Nombre completo',
            namePHolder: 'Tu nombre',
            idPHolder: 'id-ejemplo',
            linkedinPHolder: 'https://www.linkedin.com/in/example',
            scholarPHolder: 'https://scholar.google.es/citations?user=example',
            scopusPHolder: 'https://www.scopus.com/authid/detail.uri?authorId=94710843964',
            publonsPHolder: 'https://publons.com/researcher/8207549/example/',
            organization: 'Organización',
            organizationPHolder: 'Tu organización',
            department: 'Departamento',
            departmentPHolder: 'Tu departamento',
            researchGroup: 'Grupo de investigación',
            researchGroupPHolder: 'Tu grupo de investigación',
            area: 'Área',
            areaPHolder: 'Tu área',
            description: 'Descripción',
            descriptionPHolder: 'Aquí puedes escribir la description...',
            projects: 'Proyectos',
            projectsPHolder: 'Aquí puedes escribir tus proyectos...',
            saveProfile: 'Guardar perfil',
            uploadPhoto: 'Añadir foto',
            updatedProfile: 'El perfil ha sido actualizado',
            tooltip: 'Introduce tu ORCID para importar tus publicaciones',
            currentPassword: 'Contraseña actual',
            newPassword: 'Nueva Contraseña',
            confirmPassword: 'Confirma la contraseña',
            savePassword: 'Guardar contraseña',
            errorPasswordIncomplete: 'Rellena todos los campos',
            errorPasswordDifferent: 'La contraseña nueva no coincide',
            changedPassword: 'La contraseña ha sido cambiada',
            explainText: 'Las cuentas conectadas brindan flexibilidad en las opciones de inicio de sesión. No publicamos información en sus cuentas sociales. Puede eliminar la cuenta conectada más tarde si lo desea.',
            google: 'Conectar con Google',
            github: 'Conectar con GitHub',
            orcid: 'Conectar con ORCID',
            disconnect: 'Desconectar',
            ban: 'Bloquear usuario',
            disable: 'Deshabilitar cuenta',
            delete: 'Borrar cuenta',
            allow: 'Permitir usuario',
            confirmDelete: '¿Estás seguro de eliminar este usuario?',
            confirmBan: '¿Estás seguro de bloquear al usuario?',
            showPeople: 'Mostrar usuario en la lista de personas'
        },
        people: {
            title: 'Personas',
            showMore: 'Mostrar más'
        },
        profile: {
            title: 'Investigador',
            problems: 'Problemas',
            publications: 'Publicaciones',
            projects: 'Proyectos',
            edit: 'Editar',
            showMore: 'Mostrar más'
        },
        publications: {
            title: 'Publicaciones',
            showMore: 'Mostrar más',
            search: 'Buscar'
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
            title: 'Problemas',
            showMore: 'Mostrar más',
            tagsPHolder: 'Filtra por etiqueta',
            noRequests: 'No hay problemas',
            searchName: 'Buscar por el nombre del problema'
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
            rejectRequest: 'Rechazar solicitud',
            noRequests: 'No hay solicitudes'
        },
        importORCID: {
            title: 'Importar de ORCID',
            titlePubli: 'Título',
            journal: 'Revista',
            date: 'Fecha',
            citation: 'Citación',
            import: 'Importar publicación',
            msg: 'No puedes importar una publicación sin la cita',
            noPublications: 'No hay publicaciones',
            explication: 'Si desea importar sus publicaciones desde ORCID, debe completar el campo ORCID en su perfil.',
            settings: 'Ir a ajustes',
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
            noTitle: 'El titulo es obligatorio',
            noURL: 'La URL es obligatoria',
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
            scientificName: 'Nombre científico',
            userName: 'Nombre de usuario',
            addAuthor: 'Añadir autor',
            relatedProblems: 'Problemas relacionados',
            addProblem: 'Añadir Problema',
            chooseFile: 'Elige un archivo',
            optional: 'Opcional',
            next: 'Siguiente',
            back: 'Atrás',
            save: 'Guardar Publicación',
            error: 'El titulo o la URL de la publicación ya existe',
            errorAuthors: 'Es necesario introducir mínimo un author'
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
            noTitle: 'El nombre es obligatorio',
            noURL: 'La URL es obligatoria',
            alias: 'Alias',
            managers: 'Gestores',
            addUser: 'Añadir usuario',
            relatedPublications: 'Publicaciones relacionadas',
            tags: 'Etiquetas',
            addPublication: 'Añadir publicación',
            chooseFile: 'Elige un archivo',
            next: 'Siguiente',
            back: 'Atrás',
            save: 'Guardar Problema',
            tagsPHolder: 'Añade una etiqueta',
            tooltip: 'Selecciona etiquetas o añade nuevas pulsando enter',
            error: 'El nombre o el URL del problema ya existe'
        }
    }
};

const i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'es',
    messages,
});

export default i18n;