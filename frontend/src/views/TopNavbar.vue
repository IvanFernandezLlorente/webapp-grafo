<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Dashboard</a>
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
          <li class="nav-item">
            <a class="nav-link" href="#">
              Account
            </a>
          </li>
          
          <li class="nav-item">
            <b-link v-if="!tokenId" :to="{path: '/login'}" class="nav-link">
              Sign In 
            </b-link>
            <b-link @click="logOut" v-else class="nav-link">
              Log Out
            </b-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
import { mapState } from 'vuex';

export default {
    name: 'TopNavbar',

    methods: {
        logOut () {
            this.$store.dispatch('logout');
        }
    },
    computed: mapState(['tokenId'])
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
    background-color: hsla(0,0%,100%,.96);
    border-bottom: 1px solid rgba(0,0,0,.1);
    padding: 5px 15px;
}
</style>
