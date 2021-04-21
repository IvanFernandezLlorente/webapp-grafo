<template>
  <div>
    <h1>{{ $t('createPublication.edit') }}</h1>
    <EditorPublications v-bind:isNew="false" />    
  </div>
</template>

<script>
export default {
  name: 'EditPublication',
  components: {
    EditorPublications: () => import('./EditorPublications'),
  }
}
</script> 

<style scoped>

</style>