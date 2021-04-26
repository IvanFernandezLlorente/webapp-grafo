<template>
  <div class="body-content">
      <div class="buttons">
        <b-link v-if="canEdit()" class="edit" :to="{path: `/editpublications/${publication.publicationId}`}"> 
            <button class="btn btn-success">
                {{ $t('publication.edit') }}
            </button>
        </b-link>
        <b-link v-if="canEdit()" class="edit"  @click="deleteP()"> 
            <button class="btn btn-danger">
                {{ $t('publication.delete') }}
            </button>
        </b-link>
      </div>
      

      <h3>{{publication.title}}</h3>
      <div v-if="publication.bibtex" class="form-group">
        <a :href="`https://localhost:3443/api/files/bibtex/${publication.publicationId}`">
            <button type="button" class="btn btn-secondary">
                {{ $t('publication.cite') }}
            </button>
        </a>
      </div>
      <p><strong>Journal: </strong>{{publication.journal}}</p>
      <p><strong>Volume: </strong>{{publication.volume}}</p>
      <p><strong>Pages: </strong>{{publication.pages}}</p>
      <p><strong>Year: </strong>{{publication.year}}</p>
      <p><strong>Publisher: </strong>{{publication.publisher}}</p>
      <p><strong>issn: </strong>{{publication.issn}}</p>
      <p><strong>doi: </strong>{{publication.doi}}</p>
      <p><strong>URL: </strong>{{publication.url}}</p>
      <p><strong>Keywords: </strong>{{publication.keywords}}</p>
      <p><strong>Abstract: </strong>{{publication.abstract}}</p>
      <p v-if="publication.pdf"><a :href="`https://localhost:3443/api/files/downloads/${publication.pdf}`">{{ $t('publication.pdf') }}</a></p>
      <h4 v-if="users.length || publication.usersNotRegistered.length">Users</h4>
      <div v-if="users.length">
        <b-link v-for="(user,index) in users"
          :key="index"
          :to="{path: `/profile/${user.userId}`}"> 
            <p>{{authorById(user.name)}}</p>
        </b-link>
      </div>

      <div v-if="publication.usersNotRegistered.length">
        <p v-for="(name,index) in publication.usersNotRegistered" :key="index"> 
            {{authorById(name)}}
        </p>
      </div>

      <div v-if="problems.length">
        <h4>{{ $t('publication.relatedProblems') }}</h4>
        <b-link v-for="(problem,index) in problems"
          :key="index"
          :to="{path: `/problems/${problem.problemId}`}"> 
            <p>{{problem.name}}</p>
        </b-link>
      </div>
      
      <div v-if="publication.description.visible">
        <h4>{{ $t('publication.description') }}</h4>
        <div v-html="publication.description.content"></div>
      </div>

      <div v-if="publication.state.visible">
        <h4>{{ $t('publication.state') }}</h4>
        <div v-html="publication.state.content"></div>
      </div>
      
      <div v-if="publication.instances.visible">
        <h4>{{ $t('publication.instances') }}</h4>
        <div v-html="publication.instances.content"></div>
      </div>
            
      <div v-if="publication.computationalExperience.visible">
            <h4>{{ $t('publication.computationalExperience') }}</h4>
        <div v-html="publication.computationalExperience.content"></div>
      </div>

      <div v-if="publication.reference.visible">
        <h4>{{ $t('publication.references') }}</h4>
        <div v-html="publication.reference.content"></div>
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'Publication',

    data: () => {
        return {
            publication: {
                user:[],
                usersNotRegistered: [],
                problems: [],
                attachments: [],
                description: {},
                state: {},
                instances: {},
                computationalExperience: {},
                reference: {},
                pdf: '',
                bibtex: '',
            },
            url: '',
            users: [],
            problems: [],
            authors: {}
        }
    },
    created () {
        this.url = this.$route.params.publicationId;
        this.fetchData();
    },
    methods: {
        async fetchData() {
            const res = await this.axios.get(`publications/${this.url}`);
            this.publication = res.data;
            this.authors = JSON.parse(this.publication.authors);
            const promises = []
            this.publication.user.forEach( userId => promises.push(this.axios.get(`users/${userId}`)));
            const users = await Promise.all(promises);
            this.users = users.map( user => user.data);

            promises.splice(0,promises.length);
            
            this.publication.problems.forEach( problemId => promises.push(this.axios.get(`problems/${problemId}`)));
            const problems = await Promise.all(promises);
            this.problems = problems.map( problem => problem.data).filter(problem => problem.visible == true);
        },
        canEdit() {
            return (this.isAdmin) || (this.publication.user.some( user => user == this.id));
        },
        async deleteP() {
            const promises = []
            this.publication.attachments.forEach( fileId => {
                promises.push(this.axios.delete(`files/${fileId}`,{
                    headers: { token: this.$store.state.token}
                }))
            })
            if (this.publication.pdf) {
                promises.push(this.axios.delete(`files/${this.publication.pdf}`,{
                    headers: { token: this.$store.state.token}
                }))
            }
            await Promise.all(promises)

            const res = await this.axios.delete(`publications/${this.url}`,{
                headers: { token: this.$store.state.token}
            });
            this.$router.push({path: '/'})
        },
        authorById(userId) {
            return this.authors.filter(({ 1: v}) => v==userId).map(([k])=>k)[0];
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