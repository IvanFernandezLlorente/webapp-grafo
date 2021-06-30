<template>
    <b-row style="justify-content: center;">
        <b-col cols="12" class="padding-box">
            <div class="content-box title">
                <h1>{{ $t('profile.title') }}</h1>
                <div class="black-line"></div>
                <div class="red-line"></div>
            </div>
        </b-col>
        <b-row class="body padding-box">
            <b-col cols="12" v-if="spin" style="display: flex;justify-content: center;">
                <div id="preloader" class="content-box" style="height: 550px;"></div>
            </b-col>

            <b-col cols="12" v-if="!spin" class="content-box info">
                
                <router-link v-if="canEditVariable" class="edit-button-box" :to="{path: linkToEdit}">
                    {{ $t('profile.edit') }}
                </router-link>

                <b-row>
                    <b-col cols="12" xl="2" class="images">
                        <img v-if="user.imagenProfile" :src="user.imagenProfile" class="image-person">
                        <img v-else src="../assets/blank-person.jpg" class="image-person">
                        <div class="networks">
                            <a v-if="user.linkedinUrl" :href="user.linkedinUrl" target="_blank">
                                <img src="../assets/linkedin.svg" class="image-network">
                            </a>

                            <a v-if="user.scholarUrl" :href="user.scholarUrl" target="_blank">
                                <img src="../assets/scholar.svg" class="image-network">
                            </a>
                            <a v-if="user.scopusUrl" :href="user.scopusUrl" target="_blank">
                                <img src="../assets/scopus.svg" class="image-network">
                            </a>
                            <a v-if="user.publonsUrl" :href="user.publonsUrl" target="_blank">
                                <img src="../assets/publons.svg" class="image-network">
                            </a>
                        </div>    
                    </b-col>
                    <b-col cols="12" xl="10" class="info-person">
                        <div id="name" :class="{ marginName: canEditVariable }">{{ user.name }}</div>
                        <b-row>
                            <b-col cols="12" xl="6" class="data">
                                <div v-if="user.organization">{{ user.organization }}</div>
                                <div v-if="user.area">{{ user.area }}</div>
                                <div v-if="user.department">{{ user.department }}</div>
                                <div v-if="user.researchgroup">{{ user.researchgroup }}</div>
                            </b-col>
                            <b-col cols="12" xl="6">
                                <div class="description" v-if="user.description">{{ user.description }}</div>
                            </b-col>
                        </b-row>
                        
                        
                        
                    </b-col>
                </b-row>
            </b-col>
        </b-row>

        <b-row class="body padding-box" v-if="!spin" style="margin-top: 20px;">
            <b-col cols="12" xl="3" class="content-box choices-box" v-if="(user.projects) || (publications.length != 0) || (problems.length != 0)">
                <div class="choices">
                    <div v-if="publications.length != 0" @click="setChoice(1)" :class="[choice == 1 ? activeClass : '']">{{ $t('profile.publications') }}</div>
                    <div v-if="problems.length != 0" @click="setChoice(2)" :class="[choice == 2 ? activeClass : '']">{{ $t('profile.problems') }}</div>
                    <div v-if="user.projects" @click="setChoice(3)" :class="[choice == 3 ? activeClass : '']">{{ $t('profile.projects') }}</div>                   
                </div>
            </b-col>

            <b-col cols="12" xl="9" class="articles-box">
                <div v-if="choice == 1" class="list-items">
                    <div v-for="(publication,index) in publications" :key="index">
                        <div class="info-article content-box publication" v-if="(publication.visible) || (!publication.visible && canEditVariable)">
                            <b-link :to="{path: `/publications/${publication.publicationId}`}">
                                <div style="margin-bottom: 10px;">{{ publication.title }}</div> 
                            </b-link>

                            <div>
                                {{ getAuthors(publication.authors) }}      
                            </div>

                            <div class="journal-info">
                                <div v-if="publication.journal" style="font-style: italic; margin-right: 8px;">{{ publication.journal }},</div>
                                <div v-if="publication.volume" style="margin-right: 8px;">{{ publication.volume }},</div>
                                <div v-if="publication.pages" style="margin-right: 8px;">{{ publication.pages }}.</div>
                                <div v-if="publication.year" >({{ publication.year }})</div>
                            </div>
                            
                            <a v-if="publication.doi" :href="publication.doi" target="_blank" style="color: #E50914; word-wrap: break-word;">
                                {{ getDoi(publication.doi) }}        
                            </a>
                            <img v-if="!publication.visible && canEditVariable" src="../assets/eyex.svg" class="eye">
                        </div> 
                    </div>
                    <input v-if="!publicationsFetched" type="button" @click="fetchPublications()" :value="$t('profile.showMore')">
                </div>

                <div v-if="choice == 2" class="list-items">
                    <div v-for="(problem,index) in problems" :key="index">
                        <div class="content-box problem info-article" v-if="(problem.visible) || (!problem.visible && canEditVariable)">
                            <b-link :to="{path: `/problems/${problem.problemId}`}">
                                <div>{{ problem.name }}</div> 
                            </b-link>

                            <div v-if="problem.alias">{{ problem.alias }}</div> 
                            <div v-if="problem.tags.length != 0" class="tag-box" >
                                <div v-for="(tag,index) in problem.tags" :key="index" class="tag">
                                    {{ tag.value }}
                                </div>
                            </div>
                            <img v-if="!problem.visible && canEditVariable" src="../assets/eyex.svg" class="eye">
                        </div> 
                    </div>
                    <input v-if="!problemsFetched" type="button" @click="fetchProblems()" :value="$t('profile.showMore')">
                </div>
                <div v-if="choice == 3" class="list-items">
                    <b-col cols="12" class="content-box">
                        <div class="projects" v-if="user.projects" v-html="user.projects"></div>
                    </b-col>
                </div>
            </b-col>
        </b-row>
    </b-row>
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
          problems: [],
          problemsFetched: false,
          publications: [],
          publicationsFetched: false,
          linkToEdit: '',
          canEditVariable: false,
          choice: 1,
          activeClass: 'active',
          indexPublication: 0,
          indexProblem: 0,
          url: '',
          spin: false,
        }
    },
    created () {
        this.url = this.$route.params.userId;
        this.fetchData();
    },
    methods: {
        setChoice(value) {
            this.choice = value;
        },
        async fetchData() {
            try {
                this.spin = true;
                const res = await this.axios.get(`users/${this.url}`);
                this.user = res.data;
                this.canEdit();
                this.indexPublication = (this.user.publications.length) - 1;
                this.indexProblem = (this.user.problems.length) - 1;
                this.fetchPublications();
                await this.fetchProblems();
                this.choice = (this.publications.length) != 0 ? 1 : (this.problems.length != 0) ? 2 : (this.user.projects) ? 3 : 0;
                this.spin = false;
            } catch (error) {
                console.log(error);
                this.spin = false;
                this.$router.push({path: '/error'});              
            }
        },
        canEdit() {
            this.linkToEdit = this.user._id === this.id ? '/settings' : `/admin/edit-profile/${this.user.userId}`
            this.canEditVariable = (this.isAdmin) || (this.user._id === this.id)
        },
        async fetchProblems() {
            const promises = [];
            const max = Math.max(-1,(this.indexProblem) - 10);
            for (let i = this.indexProblem; i > max; i--) {
                promises.push(this.axios.get(`problems/id/${this.user.problems[i]}`))
            }
            const problems = await Promise.all(promises);
            this.problems.push(...problems.map( problem => problem.data));
            this.indexProblem -= 10;

            if (max === -1) {
                this.problemsFetched = true;
            }
        },
        async fetchPublications() {
            const promises = [];
            const max = Math.max(-1,(this.indexPublication) - 10);
            for (let i = this.indexPublication; i > max; i--) {
                promises.push(this.axios.get(`publications/id/${this.user.publications[i]}`))
            }
            const publications = await Promise.all(promises);
            this.publications.push(...publications.map( publication => publication.data));
            this.indexPublication -= 10;

            if (max === -1) {
                this.publicationsFetched = true;
            }
        },
        getDoi(doi) {
            return doi.split("https://doi.org/")[1];
        },
        getAuthors(authors) {
            const authorsArray = JSON.parse(authors);
            return authorsArray.map(user=> user[0]).reduce((text, user) => text + `, ${user}`);
        },
        restartData() {
            this.problems = [];
            this.problemsFetched = false;
            this.publications = [];
            this.publicationsFetched = false;
            this.linkToEdit = '';
            this.canEditVariable = false;
            this.choice = 1;
            this.activeClass = 'active';
            this.indexPublication = 0;
            this.indexProblem = 0;
        }
    },
    computed: mapState(['isAdmin','id']),
    watch: {
        async choice(newIndex) {
            if ((newIndex === 2) && !this.problemsFetched ) {
                await this.fetchProblems();
            }
        }
    },
    beforeRouteUpdate(to, from, next) {
        this.url = to.params.userId;
        this.restartData();
        this.fetchData();
        next();
    }
}
</script>

<style scoped src="@/assets/css/profile.css">
</style>