<template>
  <div class="content">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
    name: 'Content'
}
</script>

<style>
.content{
    padding: 30px 15px;
    min-height: calc(100% - 160px);
}
</style>