<template>
  <b-row v-if="publications" style="justify-content: center;">
    <b-col tag="h4" cols="12">Publications</b-col> 
    <b-col cols="9" class="publi" v-for="(publication,index) in publications"
        :key="index"
    >
         <p>{{publication.title}}</p> 
         <p>{{publication.userName}}</p>
    </b-col>
  </b-row>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Publications',

    data: () => {
        return {
            publications: [] 
        }
    },
    created () {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            const res = await axios.get("http://localhost:4000/api/publications");
            this.publications = res.data;
        }
    },
}
</script>

<style scoped>
.publi {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    margin: 19px;
    justify-content: space-between;
    display: flex;
}
</style>