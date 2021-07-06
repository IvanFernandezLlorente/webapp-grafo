<template>
  <footer class="footer">
    <div class="container-fluid">
      <div class="copyright text-center">
        Copyright &copy; {{ new Date().getFullYear() }}. All Rights Reserved.  
        <router-link class="nav-link" to="/privacy">
            {{ $t('privacy.title') }}.
        </router-link>
      </div>
    </div>
  </footer>
</template>
<script>
  export default {}

</script>
<style scoped>
.main-panel > .footer {
    border-top: 1px solid #e7e7e7;
    height: 60px;
    background-color: #EAEAEA;
    display: flex;
    align-items: center;
}

.copyright {
    display: flex;
    justify-content: center;
}

.copyright a {
    padding: 0;
    color: #B81D24;
    margin-left: 10px;
}
</style>
