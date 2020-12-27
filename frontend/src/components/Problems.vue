<template>
  <b-row v-if="problems" style="justify-content: center;">
    <b-col tag="h4" cols="12">Problems</b-col> 
    <b-col cols="9" class="problem" v-for="(problem,index) in problems"
        :key="index"
    >
        <b-link class="nav-link" :to="{path: `/problems/${problem.problemId}`}">
            <p>{{problem.name}}</p> 
            <p>{{problem.alias}}</p>
        </b-link>
    </b-col>
  </b-row>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Problems',

    data: () => {
        return {
            problems: [] 
        }
    },
    created () {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            const res = await axios.get("http://localhost:4000/api/problems");
            this.problems = res.data;
        }
    },
}
</script>

<style scoped>
.problem {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    margin: 19px;
    justify-content: space-between;
    display: flex;
}

.problem a {
    justify-content: space-between;
    display: flex;
    width: 100%;
}
</style>