<template>
    <b-row style="justify-content: center;">
        <b-col cols="12" class="padding-box">
            <div class="content-box title">
                <h1>{{ $t('createProblem.edit') }}</h1>
                <div class="black-line"></div>
                <div class="red-line"></div>
            </div>
        </b-col>
        <EditorProblems v-bind:isNew="false" />   
    </b-row>
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
.title {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    position: relative;
}

.title > h1 {
    padding: 2rem 4rem;
    font-weight: bold;
    font-size: 2rem;
}

.black-line {
    border-top: 1px solid #707070;
    width: 13rem;
    position: absolute;
    bottom: 1.5rem;
}

.red-line {
    border-top: 4px solid #B81D24;
    width: 3.5rem;
    position: absolute;
    bottom: 1.434rem;
}

.title > h1 {
    padding: 1.8rem 0rem !important;
}

@media (min-width: 992px){
    .padding-box {
        padding: 0px 40px;
    }
}
</style>