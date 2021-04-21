<template>
  <div>
    <h3>{{user.name}}</h3>
    <div class="buttons">
        <b-link v-if="canEditVariable" class="edit" :to="{path: linkToEdit}"> 
            <button class="btn btn-success">
                {{ $t('profile.edit') }}
            </button>
        </b-link>
        <b-link v-if="canEditVariable && !user.banned" class="edit" @click="banUser()"> 
            <button class="btn btn-warning">
                Ban
            </button>
        </b-link>
        <b-link v-if="canEditVariable && user.banned" class="edit" @click="allowUser()"> 
            <button class="btn btn-warning">
                Allow
            </button>
        </b-link>
        <b-link v-if="canEditVariable" class="edit"  @click="deleteU()"> 
            <button class="btn btn-danger">
                Delete
            </button>
        </b-link>
    </div>
    <b-row style="justify-content: center;">
        <b-col cols="9">
            <b-tabs content-class="mt-3" v-model="tabIndex" justified>
                <b-tab title="About" active>
                    <b-list-group>
                        <b-list-group-item>{{user.name}}</b-list-group-item>
                        <b-list-group-item>{{user.email}}</b-list-group-item>
                        <b-list-group-item>{{user.area}}</b-list-group-item>
                        <b-list-group-item>{{user.department}}</b-list-group-item>
                        <b-list-group-item>{{user.organization}}</b-list-group-item>
                        <b-list-group-item>{{user.researchgroup}}</b-list-group-item>
                        <b-list-group-item>{{user.description}}</b-list-group-item>
                        <b-list-group-item>{{user.linkedinUrl}}</b-list-group-item>
                        <b-list-group-item>{{user.scholarUrl}}</b-list-group-item>
                        <b-list-group-item>{{user.urjcUrl}}</b-list-group-item>
                    </b-list-group>
                </b-tab>
                <b-tab :title="$t('profile.problems')">
                    <b-list-group>
                        <div v-for="(problem,index) in problems" :key="index">
                            <b-list-group-item  class="tabs-2-3"  v-if="problem.visible">
                                <b-link class="nav-link" :to="{path: `/problems/${problem.problemId}`}">
                                    <p>{{problem.name}}</p> 
                                </b-link>
                            </b-list-group-item>
                            <b-list-group-item  class="tabs-2-3"  v-else-if="!problem.visible && canEditVariable">
                                <b-link class="nav-link" :to="{path: `/problems/${problem.problemId}`}">
                                    <p>{{problem.name}}</p> 
                                    <b-icon-eye-slash-fill></b-icon-eye-slash-fill>
                                </b-link>
                            </b-list-group-item>
                        </div>
                    </b-list-group>
                </b-tab>
                <b-tab :title="$t('profile.publications')">
                    <b-list-group>
                        <div v-for="(publication,index) in publications" :key="index">
                            <b-list-group-item  class="tabs-2-3"  v-if="publication.visible">
                                <b-link class="nav-link" :to="{path: `/publications/${publication.publicationId}`}">
                                    <p>{{publication.title}}</p> 
                                </b-link>
                            </b-list-group-item>
                            <b-list-group-item  class="tabs-2-3"  v-else-if="!publication.visible && canEditVariable">
                                <b-link class="nav-link" :to="{path: `/publications/${publication.publicationId}`}">
                                    <p>{{publication.title}}</p> 
                                    <b-icon-eye-slash-fill></b-icon-eye-slash-fill>
                                </b-link>
                            </b-list-group-item>
                        </div>
                    </b-list-group>
                </b-tab>
            </b-tabs>
        </b-col>  
    </b-row>
  </div>
  
</template>

<script>
import { mapState } from 'vuex';

export default {
     name: 'Profile',
    
    data: () => {
        return {
          user: {
                problems: [],
                publications: []
          },
          tabIndex: 0,
          problems: [],
          problemsFetched: false,
          publications: [],
          publicationsFetched: false,
          linkToEdit: '',
          canEditVariable: false
        }
    },
    created () {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            try {
                const res = await this.axios.get(`users/${this.$route.params.userId}`);
                this.user = res.data;
                this.canEdit()
            } catch (error) {
                console.log(error)                
            }
        },
        canEdit() {
            this.linkToEdit = this.user._id === this.id ? '/settings' : `/admin/edit-profile/${this.user._id}`
            this.canEditVariable = (this.isAdmin) || (this.user._id === this.id)
        },
        async deleteU() {
            const res = await this.axios.delete(`users/${this.$route.params.userId}`,{
                headers: { token: this.$store.state.token}
            });
            if (this.user._id === this.id) {
                this.$store.dispatch('logout');
                this.$router.push({path: '/login'})                
            } else {
               this.$router.push({path: '/'})
            }
        },
        async banUser() {
            try {
                const res = await this.axios.put(`users/${this.$route.params.userId}`,{ banned: true }, {
                    headers: { token: this.$store.state.token}
                });
                if (this.user._id === this.id) {
                    this.$store.dispatch('logout');
                    this.$router.push({path: '/login'})                
                } else {
                    this.$router.push({path: '/'})
                }
            } catch (error) {
                console.log(error);
            }      
        },
        async allowUser() {
            try {
                const res = await this.axios.put(`users/${this.$route.params.userId}`,{ banned: false }, {
                    headers: { token: this.$store.state.token}
                });
                this.$router.push({path: '/'})
            } catch (error) {
                console.log(error);
            }
        },
        async fetchProblems() {
            const promises = [];
            this.user.problems.forEach( problemId => promises.push(this.axios.get(`problems/${problemId}`)));
            const problems = await Promise.all(promises);
            this.problems = problems.map( problem => problem.data);
            this.problemsFetched = true;
        },
        async fetchPublications() {
            const promises = [];
            this.user.publications.forEach( publicationId => promises.push(this.axios.get(`publications/${publicationId}`)));
            const publications = await Promise.all(promises);
            this.publications = publications.map( publication => publication.data);
            this.publicationsFetched = true;
        }
    },
    computed: mapState(['isAdmin','id']),
    watch: {
        async tabIndex(newIndex) {
            if ((newIndex === 1) && !this.problemsFetched ) {
                await this.fetchProblems();
            } else if ((newIndex === 2) && !this.publicationsFetched) {
                this.fetchPublications();
            }
        }
    }
}
</script>

<style scoped>
.tabs-2-3  a{
    justify-content: space-between;
    display: flex;
}

.edit {
    margin-right: 15px;
}

.buttons {
    display: flex;
    justify-content: flex-end;
}
</style>