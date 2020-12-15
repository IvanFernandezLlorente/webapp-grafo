import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import Publications from '../components/Publications';
import People from '../components/People';
import Home from '../components/Home';
import Login from '../pages/Login';
import EditProfile from '../components/EditProfile';
import store from '../store';
import NewPublication from '../components/NewPublication';

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
        path: '/people',
        name: 'People',
        component: People,
     },  
     {
        path: '/myprofile',
        name: 'EditProfile',
        component: EditProfile,
        beforeEnter: (to, from, next) => {
            if (store.state.tokenId) {
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
            if (store.state.tokenId) {
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

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
