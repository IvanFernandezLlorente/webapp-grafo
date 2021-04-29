<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
    export default {
        name: 'App',

    }
</script>

<style>
#app{
    font-family: "Verdana","Helvetica Neue",Arial,sans-serif;
}

.content-box {
    background: #FFFFFF 0% 0% no-repeat padding-box;
    box-shadow: 3px 3px 7px #000000B3;
    border-radius: 17px;
    opacity: 1;
}

.btn-red{
    background: #E50914 0% 0% no-repeat padding-box;
    border-radius: 38px;
    opacity: 1;
}
</style>