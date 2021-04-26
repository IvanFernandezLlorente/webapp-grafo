import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import CKEditor from '@ckeditor/ckeditor5-vue2';
import axios from 'axios'
import VueAxios from 'vue-axios'
import i18n from './i18n';

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(CKEditor)
Vue.use(VueAxios, axios)

axios.defaults.baseURL = 'https://localhost:3443/api';

new Vue({
  i18n,
  router,
  store,
  beforeCreate() {
    this.$store.dispatch('initialiseStorage');
  },
  render: h => h(App)
}).$mount('#app')
