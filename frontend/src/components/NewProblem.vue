<template>
  <div>
    <h1>{{ $t('createProblem.new') }}</h1>
    <EditorProblems />    
  </div>
</template>

<script>
export default {
  name: 'NewProblem',
  components: {
    EditorProblems: () => import('./EditorProblems'),
  }
}
</script> 

<style scoped>

</style>