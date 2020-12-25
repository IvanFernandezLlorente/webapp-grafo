<template>
  <div class="body-content">
      <div class="buttons">
        <b-link v-if="canEdit()" class="edit" :to="{path: `/editproblems/${problem.problemId}`}"> 
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
      

      <h3>{{problem.name}}</h3>
      <p>{{problem.organization}}</p>
      <p>{{problem.alias}}</p>
      <div v-if="problem.relatedProblems.length">
        <h4>Related Problems</h4>
        <b-link class="edit" v-for="(problemRelated,index) in problem.relatedProblems"
          :key="index"
          :to="{path: `/problems/${problemRelated.problemId}`}"> 
            <p>{{problemRelated.name}}</p>
        </b-link>
      </div>

      <div v-if="problem.publications.length">
        <h4>Related Publications</h4>
        <b-link class="edit" v-for="(publication,index) in problem.publications"
          :key="index"
          :to="{path: `/publications/${publications.publicationId}`}"> 
            <p>{{publications.title}}</p>
        </b-link>
      </div>
      
      <h4>Problem Description</h4>
      <div v-html="problem.description"></div>
      <h4>State of the Art Methods</h4>
      <div v-html="problem.state"></div>
      <h4>Instances</h4>
      <div v-html="problem.instances"></div>
      <h4>Computational Experience</h4>
      <div v-html="problem.computationalExperience"></div>
      <h4>References</h4>
      <div v-html="problem.reference"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';

export default {
    name: 'Problem',

    data: () => {
        return {
            problem: {
                user:[],
                relatedProblems: [],
                publications: []
            },
            url: ''
        }
    },
    created () {
        this.url = this.$route.params.problemId;
        this.fetchData();
    },
    methods: {
        async fetchData() {
            const res = await axios.get(`http://localhost:4000/api/problems/${this.url}`);
            this.problem = res.data;
        },
        canEdit() {
            return (this.isAdmin) || (this.problem.user[0] === this.id)
        },
        async deleteP() {
            const res = await axios.delete(`http://localhost:4000/api/problems/${this.url}`,{
                headers: { token: this.$store.state.token}
            });
            this.$router.push({path: '/'})
        }
    },
    computed: mapState(['isAdmin','id']),

    beforeRouteUpdate(to, from, next) {
        this.url = to.params.problemId
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