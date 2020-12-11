<template>
<b-row v-if="people">
    <b-col tag="h4" cols="12">People</b-col> 
    <b-col cols="4" v-for="(person,index) in people"
    :key="index"
    >
    <b-card
        :title=person.name
        img-src="https://icon-library.com/images/blank-person-icon/blank-person-icon-12.jpg"
        img-alt="Image"
        img-top
        style="height: 76%;width: 76%;"
    >
        
    </b-card>
  </b-col>
</b-row>
</template>

<script>
import axios from 'axios';

export default {
    name: 'People',

    data: () => {
        return {
            people: [] 
        }
    },
    created () {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            const res = await axios.get("http://localhost:4000/api/users");
            this.people = res.data;
            console.log(this.people)
        }
    },
    computed: {

    }
}
</script>

<style scoped>
img {
    width: 100%;
    height: 78%;
}
</style>