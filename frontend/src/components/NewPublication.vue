<template>
  <div>
    <h1>New Publication</h1>
    <EditorPublications />    
  </div>
</template>

<script>
export default {
  name: 'NewPublication',
  components: {
    EditorPublications: () => import('./EditorPublications'),
  }
}
</script> 

<style scoped>

</style>