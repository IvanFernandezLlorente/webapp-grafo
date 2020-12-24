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
        path: '/edit/:publicationId',
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
        path: '/myprofile',
        name: 'EditProfile',
        component: EditProfile,
        props: true,
        beforeEnter: (to, from, next) => {
            if (store.state.isAdmin) {
                next({params: {userIdProp: from.params.userId}})
            }
            else if (store.state.token) {
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
    } 
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  }
]

const canEditPublication = async (publicationId) => {
    const publication = await axios.get(`http://localhost:4000/api/publications/${publicationId}`);
    return ((store.state.isAdmin) || (publication.data.user[0] === store.state.id))
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
