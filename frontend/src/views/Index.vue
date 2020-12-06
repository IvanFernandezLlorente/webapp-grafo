<template>
  <div class="wrapper">
    <Drawer />
    <div class="main-panel">
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
    background: hsla(240,7%,81%,.15);
    position: relative;
    float: right;
    width: calc(100% - 260px);
    min-height: 100%;
}
</style>
