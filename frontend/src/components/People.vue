<template>
<b-row v-if="people">
    <b-col tag="h4" cols="12">People</b-col> 
    <b-col cols="4" v-for="(person,index) in people"
    :key="index"
    >
    <b-link class="nav-link" :to="{path: `/profile/${person.userId}`}">
        <b-card
        :title=person.name
        :img-src="`${person.imagenProfile ? person.imagenProfile : 'https://icon-library.com/images/blank-person-icon/blank-person-icon-12.jpg'}`"
        img-alt="Image"
        img-top
        style="height: 76%;width: 76%;"
        >
            
        </b-card>
    </b-link>
    
  </b-col>
</b-row>
</template>

<script>

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
            const res = await this.axios.get("users");
            this.people = res.data;
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