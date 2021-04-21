<template>
  <div>
    <h1>{{ $t('createPublication.new') }}</h1>
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