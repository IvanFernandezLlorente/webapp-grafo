<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <b-link class="nav-link" :to="{path: '/'}">
        Home
      </b-link>
      <button type="button">
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end">
        <ul class="nav navbar-nav mr-auto">
          <li class="nav-item">
            <a class="nav-link" href="#" data-toggle="dropdown">
              <i class="nc-icon nc-palette"></i>
            </a>
          </li>

          <li class="nav-item">
            <a href="#" class="nav-link">
              <i class="nc-icon nc-zoom-split"></i>
              <span class="d-lg-block">&nbsp;Search</span>
            </a>
          </li>
        </ul>
        <ul class="navbar-nav ml-auto">
          <li v-if="token" class="nav-item">
            <b-link class="nav-link" :to="{name: 'NewProblem'}">
                {{ $t('topNavBar.problem') }}
            </b-link>
          </li>
          <li v-if="token" class="nav-item">
            <b-link class="nav-link" :to="{name: 'NewPublication'}">
                {{ $t('topNavBar.publication') }}
            </b-link>
          </li>
          <li v-if="token" class="nav-item">
            <b-link class="nav-link" :to="{path: '/settings'}">
                {{ $t('topNavBar.settigns') }}
            </b-link>
          </li>

          <li v-if="isAdmin" class="nav-item">
            <b-link class="nav-link" :to="{path: '/applications'}">
                {{ $t('topNavBar.requests') }}
            </b-link>
          </li>

          <li v-if="orcid" class="nav-item">
            <b-link class="nav-link" :to="{path: '/import-orcid'}">
                {{ $t('topNavBar.importORCID') }}
            </b-link>
          </li>
          
          <li class="nav-item">
            <b-link class="nav-link" @click="changeLanguage('en')">
              EN
            </b-link>
          </li>

          <li class="nav-item">
            <b-link class="nav-link" @click="changeLanguage('es')">
              ES
            </b-link>
          </li>

          <li class="nav-item">
            <div v-if="!token" style="display: flex;">
                <b-link  :to="{path: '/login'}" class="nav-link">
                    {{ $t('topNavBar.signIn') }}
                </b-link>
                <b-link  :to="{path: '/request-signUp'}" class="nav-link">
                    {{ $t('topNavBar.signUp') }}
                </b-link>
            </div>
            <b-link @click="logOut" v-else class="nav-link">
                {{ $t('topNavBar.logout') }}
            </b-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
import { mapState } from 'vuex';
import i18n from '../i18n';

export default {
    name: 'TopNavbar',

    data: () => {
        return {
        }
    },
    methods: {
        logOut () {
            this.$store.dispatch('deleteStorage');
            this.$store.dispatch('logout');
            this.$router.push({path: '/login'})
        },
        changeLanguage(lang) {
            i18n.locale = lang;
        }
    },
    computed: mapState(['token', 'isAdmin','orcid'])
}

</script>
<style scoped>
.navbar {
    border: 0;
    border-bottom-color: currentcolor;
    border-bottom-style: none;
    border-bottom-width: 0px;
    font-size: 16px;
    border-radius: 0;
    min-height: 50px;
    background-color: #EAEAEA;
    padding: 5px 15px;
}
</style>
