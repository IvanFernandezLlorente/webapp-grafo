<template>
    <b-col cols="12" class="padding-box">
        <b-row v-show="spin" class="preloader-box" style="min-height: 500px;">
            <div id="preloader" class="content-box" style="position: relative;"></div>
        </b-row>

        <form-wizard v-show="!spin" @on-complete="saveProblem()" color="#e50914" class="my-wizard"  
            :back-button-text="$t('createProblem.back')"
            :next-button-text="$t('createProblem.next')"
            :finish-button-text="$t('createProblem.save')">

            <h2 slot="title" style="display: none;"></h2>

            <tab-content :title="$t('createProblem.wizard1')" :before-change="checkEmptyFields">
                <b-row>
                    <b-col cols="12" class="first-items">
                        <div style="display: flex; justify-content: flex-end;">
                            <img v-if="problem.visible" src="../assets/eye.svg" @click="changeVisibility('problem')" style="cursor: pointer;">
                            <img v-if="!problem.visible" src="../assets/eyex.svg" @click="changeVisibility('problem')" style="cursor: pointer;">
                        </div>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="12" xl="6">
                        <div class="form-group">
                            <label for="name" class="required">{{ $t('createProblem.titlePro') }}</label>
                            <input id="name" v-model="problem.name" @change="updateCopy" type="text" :placeholder="$t('createProblem.titlePro')">
                            <p v-if="noTitle" style="color: red;">{{ $t('createProblem.noTitle') }}</p>
                        </div>
                    </b-col>
                    <b-col cols="12" xl="6">
                        <div class="form-group">
                            <label for="problemId" class="required">URL</label>
                            <input id="problemId" v-model="problem.problemId" @change="updateCopy" type="text" placeholder="URL">
                            <p v-if="noURL" style="color: red;">{{ $t('createProblem.noURL') }}</p>
                        </div>
                    </b-col>
                    <b-col cols="12" xl="6">
                        <div class="form-group">
                            <label for="alias">{{ $t('createProblem.alias') }}</label>
                            <input id="alias" v-model="problem.alias" @change="updateCopy" type="text" :placeholder="$t('createProblem.alias')">
                        </div>
                    </b-col>
                </b-row>

                <b-row style="margin-bottom: 1rem;">
                    <b-col cols="12" md="9" xl="6" style="display: flex;flex-direction: column;">
                        <h4>{{ $t('createProblem.managers') }}</h4>
                        <div class="form-group search" v-for="(theUser, index) in usersChosenToShow" :key="index" style="padding-left: 0px;display: flex;">
                            <vue-simple-suggest
                                v-model="usersChosenToShow[index]"
                                :list="usersToChoose"
                                :min-length="2"
                                :filter-by-query="true">
                            </vue-simple-suggest>
                            <button type="button" class="btn" @click="deleteUser(index)">
                                <b-icon-x-square></b-icon-x-square> 
                            </button>
                        </div>
                
                        <div class="form-group">
                            <button @click="addUser" type="button" class="btn add">
                                {{ $t('createProblem.addUser') }}
                            </button>
                        </div>
                    </b-col>
                </b-row>

                <b-row style="margin-bottom: 1rem;">
                    <b-col cols="12" md="9" xl="6" style="display: flex;flex-direction: column;">
                        <h4>{{ $t('createProblem.relatedPublications') }}</h4>
                        <div class="form-group search" v-for="(thePublication, index) in publicationsChosenToShow" :key="`${index} - p`" style="padding-left: 0px;display: flex;">
                            <vue-simple-suggest
                                v-model="publicationsChosenToShow[index]"
                                :list="publicationsToChoose"
                                :min-length="2"
                                :filter-by-query="true">
                            </vue-simple-suggest>
                            <button type="button" class="btn" @click="deletePublication(index)">
                                <b-icon-x-square></b-icon-x-square> 
                            </button>
                        </div>

                        <div class="form-group">
                            <button @click="addPublication" type="button" class="btn add">
                                {{ $t('createProblem.addPublication') }}
                            </button>
                        </div>
                    </b-col>
                </b-row>

                <b-row style="margin-bottom: 3rem;">
                    <b-col cols="12" md="9" xl="6" class="tags-component" style="display: flex;flex-direction: column;">
                        <div style="display: flex;">
                            <h4 style="margin-right: 0.5rem;">{{ $t('createProblem.tags') }}</h4>
                            <button v-b-tooltip.hover.right :title="$t('createProblem.tooltip')" class="tooltip-button">
                                <img src="../assets/question.svg" id="tooltip">
                                <span class="tooltiptext">Tooltip text</span>
                            </button>
                        </div>
                        <tags-input v-model="selectedTags" :existing-tags="suggestions" :typeahead="true" :typeahead-max-results=10 :placeholder="$t('createProblem.tagsPHolder')"></tags-input>
                    </b-col>
                </b-row>
            </tab-content>


            <tab-content :title="$t('createProblem.wizard2')">
                <div class="body-edit">
                    <div class="section-title">
                        <h3>{{ $t('createProblem.wizard2') }}</h3>
                        <img v-if="problem.description.visible" src="../assets/eye.svg" @click="changeVisibility('description')" class="eye">
                        <img v-if="!problem.description.visible" src="../assets/eyex.svg" @click="changeVisibility('description')" class="eye">
                    </div>
                    <ckeditor :editor="editor" v-model="problem.description.content" :config="editorConfig"></ckeditor>
                </div>

                <div class="file-box">
                    <b-form-file v-model="fileDescription" class="inputfile mt-3" id="inputfileDescription" ref="file-input" multiple plain></b-form-file>
                    <label class="btn" for="inputfileDescription">{{ $t('createProblem.chooseFile') }}</label>

                    <ul>
                        <li class="item-list" v-for="(file, index) in fileArrayDescription" :key="index">
                            <span>{{ file ? file.name : '' }}</span>
                            <button type="button" @click="deleteFile(index, fileArrayDescription, file)">x</button>
                        </li> 
                    </ul>
                </div>
            </tab-content>


            <tab-content :title="$t('createProblem.wizard3')">
                <div class="body-edit">
                    <div class="section-title">
                        <h3>{{ $t('createProblem.wizard3') }}</h3>
                        <img v-if="problem.state.visible" src="../assets/eye.svg" @click="changeVisibility('state')" class="eye">
                        <img v-if="!problem.state.visible" src="../assets/eyex.svg" @click="changeVisibility('state')" class="eye">
                    </div>
                    <ckeditor :editor="editor" v-model="problem.state.content" :config="editorConfig"></ckeditor>
                </div>

                <div class="file-box">
                    <b-form-file v-model="fileState" class="inputfile mt-3" id="inputfileState" ref="file-input" multiple plain></b-form-file>
                    <label class="btn" for="inputfileState">{{ $t('createProblem.chooseFile') }}</label>

                    <ul>
                        <li class="item-list" v-for="(file, index) in fileArrayState" :key="index">
                            <span>{{ file ? file.name : '' }}</span>
                            <button type="button" @click="deleteFile(index, fileArrayState, file)">x</button>
                        </li> 
                    </ul>
                </div>
            </tab-content>


            <tab-content :title="$t('createProblem.wizard4')">
                <div class="body-edit">
                    <div class="section-title">
                        <h3>{{ $t('createProblem.wizard4') }}</h3>
                        <img v-if="problem.instances.visible" src="../assets/eye.svg" @click="changeVisibility('instances')" class="eye">
                        <img v-if="!problem.instances.visible" src="../assets/eyex.svg" @click="changeVisibility('instances')" class="eye">
                    </div>
                    <ckeditor :editor="editor" v-model="problem.instances.content" :config="editorConfig"></ckeditor>
                </div>

                <div class="file-box">
                    <b-form-file v-model="fileInstances" class="inputfile mt-3" id="inputfileInstances" ref="file-input" multiple plain></b-form-file>
                    <label class="btn" for="inputfileInstances">{{ $t('createProblem.chooseFile') }}</label>

                    <ul>
                        <li class="item-list" v-for="(file, index) in fileArrayInstances" :key="index">
                            <span>{{ file ? file.name : '' }}</span>
                            <button type="button" @click="deleteFile(index, fileArrayInstances, file)">x</button>
                        </li> 
                    </ul>
                </div>
            </tab-content>


            <tab-content :title="$t('createProblem.wizard5')">
                <div class="body-edit">
                    <div class="section-title">
                        <h3>{{ $t('createProblem.wizard5') }}</h3>
                        <img v-if="problem.computationalExperience.visible" src="../assets/eye.svg" @click="changeVisibility('computationalExperience')" class="eye">
                        <img v-if="!problem.computationalExperience.visible" src="../assets/eyex.svg" @click="changeVisibility('computationalExperience')" class="eye">
                    </div>
                    <ckeditor :editor="editor" v-model="problem.computationalExperience.content" :config="editorConfig"></ckeditor>
                </div>

                <div class="file-box">
                    <b-form-file v-model="fileComputational" class="inputfile mt-3" id="inputfileComputational" ref="file-input" multiple plain></b-form-file>
                    <label class="btn" for="inputfileComputational">{{ $t('createProblem.chooseFile') }}</label>

                    <ul>
                        <li class="item-list" v-for="(file, index) in fileArrayComputational" :key="index">
                            <span>{{ file ? file.name : '' }}</span>
                            <button type="button" @click="deleteFile(index, fileArrayComputational, file)">x</button>
                        </li> 
                    </ul>
                </div>
            </tab-content>


            <tab-content :title="$t('createPublication.wizard6')">
                <div class="body-edit">
                    <div class="section-title">
                        <h3>{{ $t('createProblem.wizard6') }}</h3>
                        <img v-if="problem.reference.visible" src="../assets/eye.svg" @click="changeVisibility('reference')" class="eye">
                        <img v-if="!problem.reference.visible" src="../assets/eyex.svg" @click="changeVisibility('reference')" class="eye">
                    </div>
                    <ckeditor :editor="editor" v-model="problem.reference.content" :config="editorConfig"></ckeditor>
                </div>

                <div class="file-box">
                    <b-form-file v-model="fileReferences" class="inputfile mt-3" id="inputfileReferences" ref="file-input" multiple plain></b-form-file>
                    <label class="btn" for="inputfileReferences">{{ $t('createProblem.chooseFile') }}</label>

                    <ul>
                        <li class="item-list" v-for="(file, index) in fileArrayReferences" :key="index">
                            <span>{{ file ? file.name : '' }}</span>
                            <button type="button" @click="deleteFile(index, fileArrayReferences, file)">x</button>
                        </li> 
                    </ul>
                </div>
                <p v-if="error" class="msgResponse col-md-6 col-xl-4 col-12" style="margin-left: 0;">{{ errorMsg }}</p>
            </tab-content>
        </form-wizard>
    </b-col>
    
</template>

<script>
import ClassicEditor from '../ckeditor';
import { v4 as uuid } from 'uuid';
import VueSimpleSuggest from 'vue-simple-suggest';
import 'vue-simple-suggest/dist/styles.css';
import { FormWizard, TabContent } from 'vue-form-wizard';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';
import VoerroTagsInput from '@voerro/vue-tagsinput';

export default {
    name: 'EditorProblems',
    components: {
        VueSimpleSuggest,
        FormWizard,
        TabContent,
        "tags-input": VoerroTagsInput
    },
    data() {
        return {
            problem: {
                name: '',
                problemId: '',
                alias: '',
                description: {
                    content: '',
                    visible: true,
                },
                state: {
                    content: '',
                    visible: true,
                },
                instances: {
                    content: '',
                    visible: true,
                },
                computationalExperience: {
                    content: '',
                    visible: true,
                },
                reference: {
                    content: '',
                    visible: true,
                },
                user: [],
                usersNotRegistered: [],
                attachments: [],
                publications: [],
                visible: true,
                tags: []
            },
            initialized: false,
            problemCopy: {
                user: [],
                usersNotRegistered: [],
                publications: [],
                tags: []
            },                
            editor: ClassicEditor,
            editorConfig: ClassicEditor.defaultConfig,
            usersToChoose: [],
            userMap: new Map(),
            usersChosen: [''],
            publicationsToChoose: [],
            publicationsMap: new Map(),
            publicationsChosen: [''],
            filesToUpload: [],
            filesToDelete: [],
            fileDescription: null, 
            fileArrayDescription: [],
            fileState: null, 
            fileArrayState: [],
            fileInstances: null,
            fileArrayInstances: [],
            fileReferences: null,
            fileArrayReferences: [],
            fileComputational: null,
            fileArrayComputational: [],
            spin: false,
            noTitle: false,
            noURL: false,
            error: false,
            errorMsg: '',
            selectedTags: [],
            suggestions: []
        };
    },
    props: {
        isNew: {
            type: Boolean,
            default: true
        }
    },
    async created () {
        try {
            this.spin = true;
            await this.getUsers();
            await this.getPublications();
            if (!this.isNew) {
                await this.fetchData();
            }
            await this.getTags();
            this.spin = false;
        } catch (error) {
            this.spin = false;
            console.log(error)
        }
    },
    methods: {
        async saveProblem() {
            try {
                this.spin = true;

                if (!(await this.checkUniqueProblem())) {
                    this.error = true;
                    this.errorMsg = this.$t('createProblem.error');
                    this.spin = false;
                    return;
                }  

                this.prepareUsers();
                this.preparePublications();
                this.prepareContent();
                await this.prepareTags();

                let files;
                if (this.filesToUpload) {
                    files = await this.uploadFile();
                }
                if (this.filesToDelete) {
                    await this.deleteFiles();
                }
                const idsFiles = [...new Set([...files, ...this.prepareFiles()])];

                let res;
                if (this.isNew) {
                    res = await this.axios.post(`problems`,{...this.problem, "attachments": idsFiles},{
                        headers: { token: this.$store.state.token}
                    });
                } else {
                    res = await this.axios.put(`problems/${this.$route.params.problemId}`,{...this.problemCopy, "attachments": idsFiles},{
                        headers: { token: this.$store.state.token}
                    });
                }
                
                this.error = false;
                this.errorMsg = ''
                this.spin = false;
                this.$router.push({path: `/problems/${res.data.problemId}`})
            } catch (error) {
                this.spin = false;
                this.error = true;
                this.errorMsg =
                console.log(error)
            }
        },
        async checkUniqueProblem() {
            try {
                if (this.isNew) {
                    const res = await this.axios.get(`problems/check/${this.problem.name}/${this.problem.problemId}`);
                    if (res.status == 200){
                        return true;
                    }
                    
                } else {
                    const res = await this.axios.get(`problems/check/${this.problemCopy.name}/${this.problemCopy.problemId}`);
                    if (res.status == 200){
                        return true;
                    }
                }
                return false;
            } catch (error) {
                console.log(error);
                return false;
            }
            
        },
        async fetchData() {
            const res = await this.axios.get(`problems/${this.$route.params.problemId}`);
            this.problem = res.data;
            this.checked = res.data.computationalExperience.content ? true : false;
            this.selectedTags = res.data.tags;
            this.pushToChosen();
            this.pushToPublicationsChosen();
            await this.organiceFiles();
            this.$nextTick(() => {
                this.initialized = true;
            })
        },
        updateCopy (valor) {
            this.problemCopy[valor.target.id] = valor.target.value;
        },
        async getUsers() {
            const res = await this.axios.get(`users`);
            res.data.forEach( user => {
                this.userMap.set(user.name,user._id);
                this.usersToChoose.push(user.name);
            });
        },
        addUser() {
            this.usersChosen.push('')
        },
        deleteUser(index) {
            this.usersChosen.splice(index, 1);
        },
        prepareUsers() {
            const users = [...new Set([...(this.usersChosen.filter(user => user))])]
            users.forEach( user => {
                if (this.userMap.has(user)) {
                    this.problem.user.push(this.userMap.get(user));
                    this.problemCopy.user.push(this.userMap.get(user));
                } else {
                    this.problem.usersNotRegistered.push(user);
                    this.problemCopy.usersNotRegistered.push(user);
                }
            });
        },
        pushToChosen() {
            this.usersChosen = [...this.userMap.entries()].filter(({ 1: v }) => this.problem.user.includes(v)).map(([k]) => k);
            if (this.problem.usersNotRegistered) {
                this.problem.usersNotRegistered.forEach( user => this.usersChosen.push(user));
            }
        },
        async getPublications() {
            const res = await this.axios.get(`publications`);
            res.data.forEach( publication => {
                this.publicationsMap.set(publication.title,publication._id);
                this.publicationsToChoose.push(publication.title);
            });
        },
        addPublication() {
            this.publicationsChosen.push('')
        },
        deletePublication(index) {
            this.publicationsChosen.splice(index, 1);
        },
        preparePublications() {
            this.publicationsChosen.forEach( publication => {
                if (this.publicationsMap.has(publication)) {
                    this.problem.publications.push(this.publicationsMap.get(publication));
                    this.problemCopy.publications.push(this.publicationsMap.get(publication));
                }
            });
        },
        pushToPublicationsChosen() {
            this.publicationsChosen = [...this.publicationsMap.entries()].filter(({ 1: v }) => this.problem.publications.includes(v)).map(([k]) => k);
        },
        deleteFile(index, array, file) {
            if ((this.initialized) && !(this.filesToUpload.includes(file))) {
                this.filesToDelete.push(file)
            }
            if (this.filesToUpload.includes(file)) {
                const index2 = this.filesToUpload.indexOf(file);
                this.filesToUpload.splice(index2, 1);
            } 
            array.splice(index, 1)
        },
        async uploadFile() {
            const promises = []
            this.filesToUpload.forEach( file => {
                let fd = new FormData();
                fd.append('fileId',file.fileId)
                fd.append('section',file.section)
                fd.append('file',file)
                promises.push(this.axios.post(`files`,fd,{
                    headers: { token: this.$store.state.token, 'Content-Type': 'multipart/form-data'}
                }))
            })
            const res = await Promise.all(promises)
            const response = res.map( res => res.data.fileId) 
            return response;
        },
        async deleteFiles() {
            const promises = []
            this.filesToDelete.forEach( file => {
                promises.push(this.axios.delete(`files/${file.fileId}`,{
                    headers: { token: this.$store.state.token}
                }))
            })
            await Promise.all(promises)
        },
        async organiceFiles() {
            const promises = [];
            this.problem.attachments.forEach( fileId => promises.push(this.axios.get(`files/${fileId}`)))
            const res = await Promise.all(promises)
            const files = res.map( res => res.data);
            this.fileArrayDescription = files.filter( file => file.section == 'description')
            this.fileArrayState = files.filter( file => file.section == 'state')
            this.fileArrayInstances = files.filter( file => file.section == 'instances')
            this.fileArrayReferences = files.filter( file => file.section == 'references')
            this.fileArrayComputational = files.filter( file => file.section == 'computational')
        },
        prepareFiles() {
            let ids = []
            if (this.initialized) {
                const files = [...this.fileArrayDescription, ...this.fileArrayState, ...this.fileArrayInstances, ...this.fileArrayReferences, ...this.fileArrayComputational]
                ids = files.map( file => file.fileId)
            }
            return ids            
        },
        prepareContent() {
            this.problemCopy.description = { ...this.problem.description };
            this.problemCopy.state = { ...this.problem.state };
            this.problemCopy.instances = { ...this.problem.instances };
            this.problemCopy.computationalExperience = { ...this.problem.computationalExperience };
            this.problemCopy.reference = { ...this.problem.reference };
            this.problemCopy.visible = this.problem.visible;
        },
        changeVisibility(field) {
            switch (field) {
                case 'problem':
                    this.problem.visible = !this.problem.visible
                    break;
                case 'description':
                    this.problem.description.visible = !this.problem.description.visible
                    break;
                case 'state':
                    this.problem.state.visible = !this.problem.state.visible
                    break;
                case 'instances':
                    this.problem.instances.visible = !this.problem.instances.visible
                    break;
                case 'computationalExperience':
                    this.problem.computationalExperience.visible = !this.problem.computationalExperience.visible
                    break;
                case 'reference':
                    this.problem.reference.visible = !this.problem.reference.visible
                    break;
            }
        },
        checkEmptyFields: function() {
            this.noTitle = this.problem.name ? false : true;
            this.noURL = this.problem.problemId ? false : true;
            
            return (!this.noTitle) && (!this.noURL);
        },
        async getTags(){
            const res = await this.axios.get(`tags`);
            this.suggestions = res.data;
        },
        async prepareTags() {
            try {
                const newTags = [];
                const tags = this.selectedTags.map(tagObject => {
                    if (!tagObject.key) {
                        tagObject.key = tagObject.value.split(" ").join("-").toLowerCase();
                        newTags.push(tagObject);
                    }
                    return tagObject;    
                });
                this.problem.tags = tags;
                this.problemCopy.tags = tags;
                if (newTags.length !== 0) {
                    await this.axios.post(`tags`, newTags, {
                        headers: { token: this.$store.state.token}
                    });
                }
            } catch (error) {
                console.log(error)
            }
        }
    },
    watch: {
        fileDescription() {
            this.fileDescription.forEach(file => {
                const fileId = uuid()
                file.fileId = fileId
                file.section = 'description'
                this.filesToUpload.push(file)
                this.fileArrayDescription.push(file)
                this.problem.description.content += `<p>Download <a href="https://${this.$hostname}/api/files/downloads/${file.fileId}">${file.name}</a></p>`
            })
        },
        fileState() {
            this.fileState.forEach(file => {
                const fileId = uuid()
                file.fileId = fileId
                file.section = 'state'
                this.filesToUpload.push(file)
                this.fileArrayState.push(file)
                this.problem.state.content += `<p>Download <a href="https://${this.$hostname}/api/files/downloads/${file.fileId}">${file.name}</a></p>`
            })
        },
        fileInstances() {
            this.fileInstances.forEach(file => {
                const fileId = uuid()
                file.fileId = fileId
                file.section = 'instances'
                this.filesToUpload.push(file)
                this.fileArrayInstances.push(file)
                this.problem.instances.content += `<p>Download <a href="https://${this.$hostname}/api/files/downloads/${file.fileId}">${file.name}</a></p>`
            })
        },
        fileReferences() {
            this.fileReferences.forEach(file => {
                const fileId = uuid()
                file.fileId = fileId
                file.section = 'references'
                this.filesToUpload.push(file)
                this.fileArrayReferences.push(file)
                this.problem.reference.content += `<p>Download <a href="https://${this.$hostname}/api/files/downloads/${file.fileId}">${file.name}</a></p>`
            })
        },
        fileComputational() {
            this.fileComputational.forEach(file => {
                const fileId = uuid()
                file.fileId = fileId
                file.section = 'computational'
                this.filesToUpload.push(file)
                this.fileArrayComputational.push(file)
                this.problem.computationalExperience.content += `<p>Download <a href="https://${this.$hostname}/api/files/downloads/${file.fileId}">${file.name}</a></p>`
            })
        }
    },
    computed: {
        usersChosenToShow() {
            return this.usersChosen;
        },
        publicationsChosenToShow() {
            return this.publicationsChosen;
        }
    }
};
</script> 

<style scoped src="@/assets/css/editorProblems.css">
</style>