<template>
  <div class="body-content">
      <div class="buttons">
        <b-link v-if="canEdit()" class="edit" :to="{path: `/editproblems/${problem.problemId}`}"> 
            <button class="btn btn-success">
                {{ $t('problem.edit') }}
            </button>
        </b-link>
        <b-link v-if="canEdit()" class="edit"  @click="deleteP()"> 
            <button class="btn btn-danger">
                {{ $t('problem.delete') }}
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
        <h4>{{ $t('problem.relatedPublications') }}</h4>
        <b-link v-for="(publication,index) in publications"
          :key="index"
          :to="{path: `/publications/${publication.publicationId}`}"> 
            <p>{{publication.title}}</p>
        </b-link>
      </div>
      
      <div v-if="problem.description.visible">
        <h4>{{ $t('problem.description') }}</h4>
        <div v-html="problem.description.content"></div>
      </div>
      
      <div v-if="problem.state.visible">
        <h4>{{ $t('problem.state') }}</h4>
        <div v-html="problem.state.content"></div>
      </div>

      <div v-if="problem.instances.visible">
        <h4>{{ $t('problem.instances') }}</h4>
        <div v-html="problem.instances.content"></div>
      </div>
      

      <div v-if="problem.computationalExperience.visible">
        <h4>{{ $t('problem.computationalExperience') }}</h4>
        <div v-html="problem.computationalExperience.content"></div>
      </div>

      <div v-if="problem.reference.visible">
        <h4>{{ $t('problem.references') }}</h4>
        <div v-html="problem.reference.content"></div>
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'Problem',

    data: () => {
        return {
            problem: {
                user:[],
                publications: [],
                usersNotRegistered: [],
                attachments: [],
                description: {},
                state: {},
                instances: {},
                computationalExperience: {},
                reference: {},
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
            const res = await this.axios.get(`problems/${this.url}`);
            this.problem = res.data;

            const promises = []
            this.problem.user.forEach( userId => promises.push(this.axios.get(`users/${userId}`)));
            const users = await Promise.all(promises);
            this.users = users.map( user => user.data);

            promises.splice(0,promises.length);

            this.problem.publications.forEach( publicationId => promises.push(this.axios.get(`publications/${publicationId}`)));
            const publications = await Promise.all(promises);
            this.publications = publications.map( publication => publication.data).filter(publication => publication.visible == true);
        },
        canEdit() {
            return (this.isAdmin) || (this.problem.user.some( user => user == this.id));
        },
        async deleteP() {
            const promises = []
            this.problem.attachments.forEach( fileId => {
                promises.push(this.axios.delete(`files/${fileId}`,{
                    headers: { token: this.$store.state.token}
                }))
            })
            await Promise.all(promises)

            const res = await this.axios.delete(`problems/${this.url}`,{
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