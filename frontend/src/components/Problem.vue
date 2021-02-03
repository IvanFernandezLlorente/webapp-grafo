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

      <h4 v-if="users.length || problem.usersNotRegistered.length">Users</h4>
      <div v-if="users.length">
        <b-link v-for="(user,index) in users"
          :key="index"
          :to="{path: `/profile/${user.userId}`}"> 
            <p>{{user.name}}</p>
        </b-link>
      </div>

      <div v-if="problem.usersNotRegistered.length">
        <p v-for="(name,index) in problem.usersNotRegistered" :key="index"> 
            {{name}}
        </p>
      </div>

      <div v-if="publications.length">
        <h4>Related Publications</h4>
        <b-link v-for="(publication,index) in publications"
          :key="index"
          :to="{path: `/publications/${publication.publicationId}`}"> 
            <p>{{publication.title}}</p>
        </b-link>
      </div>
      
      <h4>Problem Description</h4>
      <div v-html="problem.description"></div>
      <h4>State of the Art Methods</h4>
      <div v-html="problem.state"></div>
      <h4>Instances</h4>
      <div v-html="problem.instances"></div>
      <div v-if="problem.computationalExperience">
        <h4>Computational Experience</h4>
        <div v-html="problem.computationalExperience"></div>
      </div>
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
                publications: [],
                usersNotRegistered: [],
                attachments: []
            },
            url: '',
            users: [],
            publications: []
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

            const promises = []
            this.problem.user.forEach( userId => promises.push(axios.get(`http://localhost:4000/api/users/${userId}`)));
            const users = await Promise.all(promises);
            this.users = users.map( user => user.data);

            promises.splice(0,promises.length);

            this.problem.publications.forEach( publicationId => promises.push(axios.get(`http://localhost:4000/api/publications/${publicationId}`)));
            const publications = await Promise.all(promises);
            this.publications = publications.map( publication => publication.data);
        },
        canEdit() {
            return (this.isAdmin) || (this.problem.user.some( user => user == this.id));
        },
        async deleteP() {
            const promises = []
            this.problem.attachments.forEach( fileId => {
                promises.push(axios.delete(`http://localhost:4000/api/files/${fileId}`,{
                    headers: { token: this.$store.state.token}
                }))
            })
            await Promise.all(promises)

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