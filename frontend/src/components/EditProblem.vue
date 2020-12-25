<template>
  <div>
    <h1>Edit Problem</h1>
    <EditorProblems v-bind:isNew="false" />    
  </div>
</template>

<script>
export default {
  name: 'EditProblem',
  components: {
    EditorProblems: () => import('./EditorProblems'),
  }
}
</script> 

<style scoped>

</style>