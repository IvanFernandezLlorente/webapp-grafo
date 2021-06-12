import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios';
import Index from '../views/Index.vue'
import Publications from '../components/Publications';
import People from '../components/People';
import Home from '../components/Home';
import Login from '../pages/Login';
import EditProfile from '../components/EditProfile';
import store from '../store';
import NewPublication from '../components/NewPublication';
import Profile from '../components/Profile';
import Publication from '../components/Publication';
import EditPublication from '../components/EditPublication';
import Problems from '../components/Problems';
import Problem from '../components/Problem';
import EditProblem from '../components/EditProblem';
import NewProblem from '../components/NewProblem';
import Register from '../pages/Register';
import RequestSignUp from '../pages/RequestSignUp';
import Applications from '../components/Applications';
import ImportOrcid from '../components/ImportOrcid';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    children: [
     {
        path: '/',
        name: 'Home',
        component: Home,
     }, 
     {
        path: '/publications',
        name: 'Publications',
        component: Publications,
     }, 
     {
        path: '/publications/:publicationId',
        name: 'Publication',
        component: Publication,
     }, 
     {
        path: '/editpublications/:publicationId',
        name: 'EditPublication',
        component: EditPublication,
        beforeEnter: async (to, from, next) => {
            if (await canEditPublication(to.params.publicationId)) {
                next();
            } else {
                next({path: '/login'})
            }
        }
     },
     {
        path: '/newpublication',
        name: 'NewPublication',
        component: NewPublication,
        beforeEnter: (to, from, next) => {
            if (store.state.token) {
                next();
            } else {
                next({path: '/login'})
            }
        }
     },
     {
        path: '/problems',
        name: 'Problems',
        component: Problems,
     },
     {
        path: '/problems/:problemId',
        name: 'Problem',
        component: Problem,
     }, 
     {
        path: '/editproblems/:problemId',
        name: 'EditProblem',
        component: EditProblem,
        beforeEnter: async (to, from, next) => {
            if (await canEditProblem(to.params.problemId)) {
                next();
            } else {
                next({path: '/login'})
            }
        }
     },
     {
        path: '/newproblem',
        name: 'NewProblem',
        component: NewProblem,
        beforeEnter: (to, from, next) => {
            if (store.state.token) {
                next();
            } else {
                next({path: '/login'})
            }
        }
     },
     {
        path: '/people',
        name: 'People',
        component: People,
     },  
     {
        path: '/profile/:userId',
        name: 'Profile',
        component: Profile,
     },
     {
        path: '/settings',
        name: 'EditProfile',
        component: EditProfile,
        beforeEnter: (to, from, next) => {
            if (store.state.token) {
                next();
            } else {
                next({path: '/login'})
            }
        }
     }, 
     {
        path: '/admin/edit-profile/:userId',
        name: 'EditProfile',
        component: EditProfile,
        beforeEnter: (to, from, next) => {
            if (store.state.isAdmin) {
                next();
            } else {
                next({path: '/'})
            }
        }
     },
     {
        path: '/requests',
        name: 'Applications',
        component: Applications,
        beforeEnter: (to, from, next) => {
            if (store.state.isAdmin) {
                next();
            } else {
                next({path: '/'})
            }
        }
     }, 
     {
        path: '/import-orcid',
        name: 'Import-Orcid',
        component: ImportOrcid,
        beforeEnter: (to, from, next) => {
            if (store.state.orcid) {
                next();
            } else {
                next({path: '/'})
            }
        }
     }, 
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register/:id/:token',
    name: 'Register',
    component: Register,
  },
  {
    path: '/request-signUp',
    name: 'RequestSignUp',
    component: RequestSignUp,
},
  { path: '*', redirect: '/login' }
]

const canEditPublication = async (publicationId) => {
    const publication = await axios.get(`https://${this.$hostname}:3443/api/publications/${publicationId}`);
    return ((store.state.isAdmin) || (publication.data.user.some(user => user == store.state.id)));
}

const canEditProblem = async (problemId) => {
    const problem = await axios.get(`https://${this.$hostname}:3443/api/problems/${problemId}`);
    return ((store.state.isAdmin) || (problem.data.user.some(user => user == store.state.id)));
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
