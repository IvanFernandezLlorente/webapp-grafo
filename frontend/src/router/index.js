import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import Hello from '../components/Hello';
import pepe from '../components/Pepe';
import Home from '../components/Home';

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
        path: '/hola',
        name: 'Hello',
        component: Hello,
     }, 
     {
        path: '/pepe',
        name: 'pepe',
        component: pepe,
     },   
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
