<template>
  <div class="body-content">
      <div class="buttons">
        <b-link v-if="canEdit()" class="edit" :to="{path: `/editpublications/${publication.publicationId}`}"> 
            <button class="btn btn-success">
                Edit
            </button>
        </b-link>
        <b-link v-if="canEdit()" class="edit"  @click="deleteP()"> 
            <button class="btn btn-danger">
                Delete
            </button>
        </b-link>
      </div>
      

      <h3>{{publication.title}}</h3>
      <p>{{publication.userName}}</p>
      <p>{{publication.organization}}</p>
      <h4>Problem Description</h4>
      <div v-html="publication.description"></div>
      <h4>State of the Art Methods</h4>
      <div v-html="publication.state"></div>
      <h4>Instances</h4>
      <div v-html="publication.instances"></div>
      <h4>Computational Experience</h4>
      <div v-html="publication.computationalExperience"></div>
      <h4>References</h4>
      <div v-html="publication.reference"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';

export default {
    name: 'Publication',

    data: () => {
        return {
            publication: {
                user:[]
            },
            url: ''
        }
    },
    created () {
        this.url = this.$route.params.publicationId;
        this.fetchData();
    },
    methods: {
        async fetchData() {
            const res = await axios.get(`http://localhost:4000/api/publications/${this.url}`);
            this.publication = res.data;
        },
        canEdit() {
            return (this.isAdmin) || (this.publication.user[0] === this.id)
        },
        async deleteP() {
            const res = await axios.delete(`http://localhost:4000/api/publications/${this.url}`,{
                headers: { token: this.$store.state.token}
            });
            this.$router.push({path: '/'})
        }
    },
    computed: mapState(['isAdmin','id']),

    beforeRouteUpdate(to, from, next) {
        this.url = to.params.publicationId
        this.fetchData()
        next()
    }
}
</script>

<style scoped>
.body-content >>> blockquote {
  background: #f9f9f9;
  border-left: 10px solid #ccc;
  margin: 1.5em 10px;
  padding: 0.5em 10px;
  quotes: "\201C""\201D""\2018""\2019";
}
.body-content >>> blockquote:before {
  color: #ccc;
  content: open-quote;
  font-size: 4em;
  line-height: 0.1em;
  margin-right: 0.25em;
  vertical-align: -0.4em;
}
.body-content >>> blockquote p {
  display: inline;
  font-style: italic;
}

.edit {
    margin-right: 15px;
}

.buttons {
    display: flex;
    justify-content: flex-end;
}
</style>