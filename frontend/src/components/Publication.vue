<template>
    <b-row style="justify-content: center;">
        <b-col cols="12" class="padding-box">
            <div class="content-box title">
                <h1>{{ $t('publication.title') }}</h1>
                <div class="black-line"></div>
                <div class="red-line"></div>
            </div>
        </b-col>

        <b-row class="body padding-box">
            <b-col cols="12" xl="3" class="content-box choices-box">
                <div class="choices">
                    <div @click="setChoice(1)" :class="[choice == 1 ? activeClass : '']">{{ $t('publication.introduction') }}</div>
                    <div v-if="publication.description.visible" @click="setChoice(2)" :class="[choice == 2 ? activeClass : '']">{{ $t('publication.description') }}</div>    
                    <div v-if="publication.state.visible" @click="setChoice(3)" :class="[choice == 3 ? activeClass : '']">{{ $t('publication.state') }}</div>  
                    <div v-if="publication.instances.visible" @click="setChoice(4)" :class="[choice == 4 ? activeClass : '']">{{ $t('publication.instances') }}</div>  
                    <div v-if="publication.computationalExperience.visible" @click="setChoice(5)" :class="[choice == 5 ? activeClass : '']">{{ $t('publication.computationalExperience') }}</div>  
                    <div v-if="publication.reference.visible" @click="setChoice(6)" :class="[choice == 6 ? activeClass : '']">{{ $t('publication.references') }}</div>            
                </div>
            </b-col>
            <b-col cols="12" xl="9" class="info-box">
                <div v-if="choice == 1" class="content-box info">
                    <b-row style="position: relative;">
                        <b-col cols="12" md="11">
                            <h3 id="title">{{publication.title}}</h3>
                        </b-col>
                        <b-col class="buttons-box">
                            <div class="buttons">
                                <b-link v-if="canEdit()" :to="{path: `/editpublications/${publication.publicationId}`}"> 
                                    <button class="btn modify-buttons">
                                        {{ $t('publication.edit') }}
                                    </button>
                                </b-link>

                                <b-button v-if="canEdit()" v-b-modal.modal-1 class="modify-buttons" > 
                                    {{ $t('publication.delete') }}
                                </b-button>
                                <b-modal v-if="canEdit()" id="modal-1" centered @ok="deleteP()">
                                    <p class="my-4">{{ $t('publication.confirmDelete') }}</p>
                                </b-modal>
                            </div>
                        </b-col>
                    </b-row>
                    

                    <div style="display: flex;margin-bottom: 0.5rem;">
                        <div v-if="publication.pdf" class="resource">
                            <a :href="`https://${this.$hostname}:3443/api/files/downloads/${publication.pdf}`">
                                <img src="../assets/pdf.svg">
                                <p>{{ $t('publication.pdf') }}</p>
                            </a>
                        </div>

                        <div v-if="publication.bibtex" class="resource">
                            <a :href="`https://${this.$hostname}:3443/api/files/bibtex/${publication.publicationId}`">
                                <img src="../assets/cite.svg">
                                <p>{{ $t('publication.cite') }}</p>
                            </a>
                        </div>

                        <div v-if="publication.url" class="resource">
                            <a :href="publication.url" target="_blank">
                                <img src="../assets/url.svg">
                                <p>URL</p>
                            </a>
                        </div>
                    </div>            
                    
                    <div class="basic-info">
                        <div v-if="publication.journal">{{ publication.journal }}</div>

                        <div class="vopaye">
                            <div v-if="publication.volume">{{ $t('publication.volume') }} {{ publication.volume }}</div>
                            <div v-if="publication.pages">{{ $t('publication.pages') }} {{ publication.pages }}</div>
                            <div v-if="publication.year">({{ publication.year }})</div>
                        </div>
                        
                        <div class="publissn">
                            <div v-if="publication.publisher">{{ publication.publisher }}</div>
                            <div v-if="publication.issn">ISSN {{ publication.issn }}</div>
                        </div>
                        
                        <a v-if="publication.doi" :href="publication.doi" target="_blank" style="color: #E50914; word-wrap: break-word; margin-bottom: 5px;">
                            {{ getDoi(publication.doi) }}
                        </a>
                        <div v-if="authors" class="authors">
                            <div v-for="(user,index) in authors" :key="index">
                                <div v-if="authorIsRegistered(user[1])" class="author">
                                    <b-link :to="{path: `/profile/${getUserId(user[1])}`}" style="color: rgb(229, 9, 20);"> 
                                        <p>{{ user[0] }};</p>
                                    </b-link>
                                </div>
                                
                                <div v-else class="author">{{ user[0] }};</div>
                            </div>
                        </div>

                        <div v-if="problems.length != 0" style="margin-top: 13px;">
                            <div style="font-size: 1.2rem;">{{ $t('publication.relatedProblems') }}</div>
                            <div class="problems">
                                <b-link v-for="(problem,index) in problems" :key="index" :to="{path: `/problems/${problem.problemId}`}" style="color: rgb(229, 9, 20);"> 
                                    <p>{{ problem.name }};</p>
                                </b-link>
                            </div>
                        </div>
                    </div>
                    
                    <div v-if="publication.abstract" style="margin-bottom: 2rem;">
                        <div class="subtitle">{{ $t('publication.abstract') }}</div>    
                        <div id="abstract">{{ publication.abstract }}</div>
                    </div>
                    
                    <div v-if="publication.keywords">
                        <div class="subtitle">{{ $t('publication.keywords') }}</div>    
                        <div>{{ publication.keywords }}</div>
                    </div>
                </div>

                <div v-if="choice == 2" class="content-box info">
                    <b-row>
                        <div>
                            <h3 id="title">{{ publication.title }}</h3>
                        </div>

                        <div v-if="publication.description.visible" class="editable-content">
                            <h4 class="subtitle">{{ $t('publication.description') }}</h4>
                            <div v-html="publication.description.content"></div>
                        </div>
                    </b-row>
                </div>

                <div v-if="choice == 3" class="content-box info">
                    <b-row>
                        <div>
                            <h3 id="title">{{ publication.title }}</h3>
                        </div>

                        <div v-if="publication.state.visible" class="editable-content">
                            <h4 class="subtitle">{{ $t('publication.state') }}</h4>
                            <div v-html="publication.state.content"></div>
                        </div>
                    </b-row>
                </div>

                <div v-if="choice == 4" class="content-box info">
                    <b-row>
                        <div>
                            <h3 id="title">{{ publication.title }}</h3>
                        </div>

                        <div v-if="publication.instances.visible" class="editable-content">
                            <h4 class="subtitle">{{ $t('publication.instances') }}</h4>
                            <div v-html="publication.instances.content"></div>
                        </div>
                    </b-row>
                </div>

                <div v-if="choice == 5" class="content-box info">
                    <b-row>
                        <div>
                            <h3 id="title">{{ publication.title }}</h3>
                        </div>

                        <div v-if="publication.computationalExperience.visible" class="editable-content">
                            <h4 class="subtitle">{{ $t('publication.computationalExperience') }}</h4>
                            <div v-html="publication.computationalExperience.content"></div>
                        </div>
                    </b-row>
                </div>

                <div v-if="choice == 6" class="content-box info">
                    <b-row>
                        <div>
                            <h3 id="title">{{ publication.title }}</h3>
                        </div>

                        <div v-if="publication.reference.visible" class="editable-content">
                            <h4 class="subtitle">{{ $t('publication.references') }}</h4>
                            <div v-html="publication.reference.content"></div>
                        </div>
                    </b-row>
                </div>
            </b-col>
        </b-row>        
    </b-row>
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
            authors: {},
            choice: 1,
            activeClass: 'active',
        }
    },
    created () {
        this.url = this.$route.params.publicationId;
        this.fetchData();
    },
    methods: {
        setChoice(value) {
            this.choice = value;
        },
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
        authorIsRegistered(value) {
            if (value) {
                return this.users.filter(user => user.name == value)[0];
            }
            return false;
        },
        getUserId(value) {
            return this.users.filter(user => user.name == value)[0].userId;
        },
        getDoi(doi) {
            return doi.split("https://doi.org/")[1];
        },
    },
    computed: mapState(['isAdmin','id']),

    beforeRouteUpdate(to, from, next) {
        this.url = to.params.publicationId
        this.fetchData()
        next()
    }
}
</script>

<style scoped src="@/assets/css/publication.css">
</style>