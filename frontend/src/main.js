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


const sidebarMenu = {
  showSidebar: false,
  displaySidebar(value) {
    this.showSidebar = value;
  }
};

const SidebarPlugin = {
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          sidebarStore: sidebarMenu
        };
      }
    });

    Object.defineProperty(Vue.prototype, "$sidebar", {
      get() {
        return this.$root.sidebarStore;
      }
    });
  }
};

Vue.config.devtools = false;
Vue.config.debug = false;
Vue.config.silent = true;

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(CKEditor)
Vue.use(VueAxios, axios)
Vue.use(SidebarPlugin)

Vue.prototype.$hostname = 'nuevawebgrafoapi.numa.host'
axios.defaults.baseURL = 'https://nuevawebgrafoapi.numa.host/api';

new Vue({
  i18n,
  router,
  store,
  beforeCreate() {
    this.$store.dispatch('initialiseStorage');
  },
  render: h => h(App)
}).$mount('#app')
