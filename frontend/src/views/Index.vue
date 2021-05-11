<template>
  <div class="wrapper">
    <Drawer />
    <div class="main-panel mobile" :class="{ toggled: $sidebar.showSidebar }">
        <TopNavbar />
        <Content />
        <Footer />
    </div>
  </div>
</template>

<script>

export default {
  name: 'Index',
  components: {
    Drawer: () => import('./Drawer'),
    Content: () => import('./Content'),
    Footer: () => import('./Footer'),
    TopNavbar: () => import('./TopNavbar')
  }
}
</script>

<style scoped>

.wrapper {
    position: relative;
    top: 0;
    height: 100vh;
}

.main-panel{
    overflow: auto;
    max-height: 100%;
    height: 100%;
    background: #EAEAEA;
    position: relative;
    float: right;
    width: calc(100% - 345px);
    min-height: 100%;
    transition: all .2s cubic-bezier(.4,0,.2,1);
}

.main-panel.toggled {
    width: calc(100% - 100px);
    transition: all .2s cubic-bezier(.4,0,.2,1);
}

@media (max-width: 991px){
    .main-panel.mobile {
        width: 100%;
        transition: all .2s cubic-bezier(.4,0,.2,1);
    }
}
</style>
