<template>
    <b-row style="justify-content: center;">
        <b-col cols="12" class="padding-box">
            <div class="content-box title" style="margin-top: 0px;">
                <h1>{{ $t('profile.title') }}</h1>
                <div class="black-line"></div>
                <div class="red-line"></div>
            </div>
        </b-col>
        <b-row class="body padding-box">
            <b-col cols="12" class="content-box info">
                
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

        <b-row class="body padding-box" style="margin-top: 30px;">
            <b-col cols="12" xl="3" class="content-box choices-box">
                <div class="choices">
                    <div @click="setChoice(1)" :class="[choice == 1 ? activeClass : '']">{{ $t('profile.publications') }}</div>
                    <div @click="setChoice(2)" :class="[choice == 2 ? activeClass : '']">{{ $t('profile.problems') }}</div>                    
                </div>
            </b-col>

            <b-col cols="12" xl="9" class="articles-box">
                <div v-if="choice == 1">
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
                </div>

                <div v-if="choice == 2">
                    <div v-for="(problem,index) in problems" :key="index">
                        <div class="content-box problem info-article" v-if="(problem.visible) || (!problem.visible && canEditVariable)">
                            <b-link :to="{path: `/problems/${problem.problemId}`}">
                                <div>{{ problem.name }}</div> 
                            </b-link>

                            <div>{{ problem.alias }}</div> 
                            <img v-if="!problem.visible && canEditVariable" src="../assets/eyex.svg" class="eye">
                        </div> 
                    </div>
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
        }
    },
    created () {
        this.fetchData();
    },
    methods: {
        setChoice(value) {
            this.choice = value;
        },
        async fetchData() {
            try {
                const res = await this.axios.get(`users/${this.$route.params.userId}`);
                this.user = res.data;
                this.canEdit();
                await this.fetchPublications();
            } catch (error) {
                console.log(error)                
            }
        },
        canEdit() {
            this.linkToEdit = this.user._id === this.id ? '/settings' : `/admin/edit-profile/${this.user.userId}`
            this.canEditVariable = (this.isAdmin) || (this.user._id === this.id)
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
        },
        getDoi(doi) {
            return doi.split("https://doi.org/")[1];
        },
        getAuthors(authors) {
            const authorsArray = JSON.parse(authors);
            return authorsArray.map(user=> user[0]).reduce((text, user) => text + `, ${user}`);
        }
    },
    computed: mapState(['isAdmin','id']),
    watch: {
        async choice(newIndex) {
            if ((newIndex === 2) && !this.problemsFetched ) {
                await this.fetchProblems();
            }
        }
    }
}
</script>

<style scoped src="@/assets/css/profile.css">
</style>