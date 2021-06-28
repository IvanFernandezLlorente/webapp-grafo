<template>
    <b-row style="justify-content: center;">
        <b-col cols="12" class="padding-box">
            <div class="content-box title">
                <h1>{{ $t('problem.title') }}</h1>
                <div class="black-line"></div>
                <div class="red-line"></div>
            </div>
        </b-col>

        <b-row class="body padding-box">
            <b-col cols="12" xl="3" class="content-box choices-box">
                <div class="choices">
                    <div @click="setChoice(1)" :class="[choice == 1 ? activeClass : '']">{{ $t('problem.introduction') }}</div>
                    <div v-if="problem.description.visible" @click="setChoice(2)" :class="[choice == 2 ? activeClass : '']">{{ $t('problem.description') }}</div>    
                    <div v-if="problem.state.visible" @click="setChoice(3)" :class="[choice == 3 ? activeClass : '']">{{ $t('problem.state') }}</div>  
                    <div v-if="problem.instances.visible" @click="setChoice(4)" :class="[choice == 4 ? activeClass : '']">{{ $t('problem.instances') }}</div>  
                    <div v-if="problem.computationalExperience.visible" @click="setChoice(5)" :class="[choice == 5 ? activeClass : '']">{{ $t('problem.computationalExperience') }}</div>  
                    <div v-if="problem.reference.visible" @click="setChoice(6)" :class="[choice == 6 ? activeClass : '']">{{ $t('problem.references') }}</div>            
                </div>
            </b-col>
        

            <b-col cols="12" xl="9" class="info-box">
                <div v-if="choice == 1" class="content-box info">
                    <b-row style="position: relative;">
                        <b-col cols="12" md="11">
                            <h3 id="title">{{problem.name}}</h3>
                        </b-col>
                        <b-col class="buttons-box">
                            <div class="buttons">
                                <b-link v-if="canEdit()" :to="{path: `/editproblems/${problem.problemId}`}"> 
                                    <button class="btn modify-buttons">
                                        {{ $t('problem.edit') }}
                                    </button>
                                </b-link>

                                <b-button v-if="canEdit()" v-b-modal.modal-1 class="modify-buttons" > 
                                    {{ $t('problem.delete') }}
                                </b-button>
                                <b-modal v-if="canEdit()" id="modal-1" centered @ok="deleteP()">
                                    <p class="my-4">{{ $t('problem.confirmDelete') }}</p>
                                </b-modal>
                            </div>
                        </b-col>
                    </b-row>

                    <div class="basic-info">
                        <div v-if="problem.alias" class="subtitle">{{ problem.alias }}</div>
                    
                        <div class="authors">
                            <div v-if="users.length != 0">
                                <div v-for="(user,index) in users" :key="index">
                                    <div class="author">
                                        <b-link :to="{path: `/profile/${user.userId}`}" style="color: rgb(229, 9, 20);"> 
                                            <p>{{ user.name }};</p>
                                        </b-link>
                                    </div>
                                </div>
                            </div>
                            <div v-if="problem.usersNotRegistered.length != 0">
                                <div v-for="(name,index) in problem.usersNotRegistered" :key="index"> 
                                    {{ name }};
                                </div>
                            </div>
                        </div>

                        <div v-if="publications.length != 0" style="margin-top: 13px;">
                            <div style="font-size: 1.2rem;">{{ $t('problem.relatedPublications') }}</div>
                            <div class="publications">
                                <b-link v-for="(publication,index) in publications" :key="index" :to="{path: `/publications/${publication.publicationId}`}" style="color: rgb(229, 9, 20);"> 
                                    <p>{{ publication.title }};</p>
                                </b-link>
                            </div>
                        </div>

                        
                        <div v-if="problem.tags.length != 0" class="subtitle" style="margin-top: 13px;">{{ $t('problem.tags') }}</div> 
                        <div v-if="problem.tags.length != 0" class="tag-box">
                            <div v-for="(tag,index) in problem.tags" :key="index" class="tag">
                                {{ tag.value }}
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="choice == 2" class="content-box info">
                    <b-row>
                        <div>
                            <h3 id="title">{{ problem.name }}</h3>
                        </div>

                        <div v-if="problem.description.visible" class="editable-content">
                            <h4 class="subtitle">{{ $t('problem.description') }}</h4>
                            <div v-html="problem.description.content"></div>
                        </div>
                    </b-row>
                </div>

                <div v-if="choice == 3" class="content-box info">
                    <b-row>
                        <div>
                            <h3 id="title">{{ problem.name }}</h3>
                        </div>

                        <div v-if="problem.state.visible" class="editable-content">
                            <h4 class="subtitle">{{ $t('problem.state') }}</h4>
                            <div v-html="problem.state.content"></div>
                        </div>
                    </b-row>
                </div>

                <div v-if="choice == 4" class="content-box info">
                    <b-row>
                        <div>
                            <h3 id="title">{{ problem.name }}</h3>
                        </div>

                        <div v-if="problem.instances.visible" class="editable-content">
                            <h4 class="subtitle">{{ $t('problem.instances') }}</h4>
                            <div v-html="problem.instances.content"></div>
                        </div>
                    </b-row>
                </div>

                <div v-if="choice == 5" class="content-box info">
                    <b-row>
                        <div>
                            <h3 id="title">{{ problem.name }}</h3>
                        </div>

                        <div v-if="problem.computationalExperience.visible" class="editable-content">
                            <h4 class="subtitle">{{ $t('problem.computationalExperience') }}</h4>
                            <div v-html="problem.computationalExperience.content"></div>
                        </div>
                    </b-row>
                </div>

                <div v-if="choice == 6" class="content-box info">
                    <b-row>
                        <div>
                            <h3 id="title">{{ problem.name }}</h3>
                        </div>

                        <div v-if="problem.reference.visible" class="editable-content">
                            <h4 class="subtitle">{{ $t('problem.references') }}</h4>
                            <div v-html="problem.reference.content"></div>
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
                tags: []
            },
            url: '',
            users: [],
            publications: [],
            choice: 1,
            activeClass: 'active',
        }
    },
    created () {
        this.url = this.$route.params.problemId;
        this.fetchData();
    },
    methods: {
        setChoice(value) {
            this.choice = value;
        },
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

<style scoped src="@/assets/css/problem.css">
</style>