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

#preloader {
    position: absolute;
    z-index: 9999;
    overflow: hidden;
    background-color: #fff;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

#preloader:before {
    content: "";
    border: 6px solid #f2f2f2;
    border-top: 6px solid #E50914;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    -webkit-animation: animate-preloader 1s linear infinite;
    animation: animate-preloader 1s linear infinite;
}

@-webkit-keyframes animate-preloader {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

@keyframes animate-preloader {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}
</style>