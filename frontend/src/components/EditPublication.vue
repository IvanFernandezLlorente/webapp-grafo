<template>
  <div>
    <h1>Edit Publication</h1>
    <CKEditor v-bind:isNew="false" />    
  </div>
</template>

<script>
export default {
  name: 'EditPublication',
  components: {
    CKEditor: () => import('./CKEditor'),
  }
}
</script> 

<style scoped>

</style>