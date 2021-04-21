<template>
  <b-row v-if="publications" style="justify-content: center;">
    <b-col tag="h4" cols="12">{{ $t('publications.title') }}</b-col> 
    <b-col cols="9" class="publication" v-for="(publication,index) in publications"
        :key="index"
    >
        <div v-if="publication.visible">
            <b-link class="nav-link" :to="{path: `/publications/${publication.publicationId}`}">
                <p>{{publication.title}}</p> 
                <p>{{publication.userName}}</p>
            </b-link>
        </div>        
    </b-col>
  </b-row>
</template>

<script>

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
            const res = await this.axios.get("publications");
            this.publications = res.data;
        }
    },
}
</script>

<style scoped>
.publication {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    margin: 19px;
    justify-content: space-between;
    display: flex;
}

.publication a {
    justify-content: space-between;
    display: flex;
    width: 100%;
}
</style>