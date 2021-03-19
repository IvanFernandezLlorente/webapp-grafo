<template>
    <div class="container">
        <form @submit.prevent="savePublication">
            <div class="form-group">
                <label for="title" class="control-label">Title</label>
                <input id="title" v-model="publication.title" @change="updateCopy" class="form-control" type="text" placeholder="Title">
            </div>

            <b-row>
                <b-col cols="6" style="display: flex;flex-direction: column;">
                    <h4>Authors</h4>
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
                        <button @click="addUser" type="button" class="btn btn-secondary">
                            Add User
                        </button>
                    </div>
                </b-col>
                
                <b-col style="display: flex;justify-content: center;">
                    <div style="display: flex;align-items: baseline;">
                        <b-form-file v-model="filePDFPublication" class="inputfile mt-3" id="inputfilePDFPublication" ref="file-input" accept=".pdf" plain></b-form-file>
                        <label class="btn btn-secondary" for="inputfilePDFPublication">Upload PDF</label>

                        <ul>
                            <li class="item-list" v-if="filePDFPublication">
                                <span>{{ filePDFPublication.name }}</span>
                                <button type="button" @click="deleteFilePDF()">x</button>
                            </li> 
                            <li class="item-list" v-else-if="filePDFPublicationPrevious">
                                <span>{{ filePDFPublicationPrevious.name }}</span>
                                <button type="button" @click="deleteFilePDFPrevious()">x</button>
                            </li> 
                        </ul>
                    </div>
                </b-col>
            </b-row>
            

            <h4>Related Problems</h4>
            <div class="form-group col-md-6 search" v-for="(theProblem, index) in problemsChosenToShow" :key="`${index} - p`" style="padding-left: 0px;display: flex;">
                <vue-simple-suggest
                    v-model="problemsChosenToShow[index]"
                    :list="problemsToChoose"
                    :min-length="2"
                    :filter-by-query="true">
                </vue-simple-suggest>
                <button type="button" class="btn" @click="deleteProblem(index)">
                    <b-icon-x-square></b-icon-x-square> 
                </button>
            </div>
    
            <div class="form-group">
                <button @click="addProblem" type="button" class="btn btn-secondary">
                    Add Problem
                </button>
            </div>

            <div class="body-edit">
                <div style="display: flex;">
                    <h3>Publication Description</h3>
                    <b-form-checkbox v-model="publication.description.visible" name="visible-button" switch style="align-self: center;margin-left: 30px;">Visible</b-form-checkbox>
                </div>
                <ckeditor :editor="editor" v-model="publication.description.content" :config="editorConfig"></ckeditor>
            </div>

            <div style="display: flex;align-items: baseline;">
                <b-form-file v-model="fileDescription" class="inputfile mt-3" id="inputfileDescription" ref="file-input" multiple plain></b-form-file>
                <label class="btn btn-secondary" for="inputfileDescription">Choose a file</label>

                <ul>
                    <li class="item-list" v-for="(file, index) in fileArrayDescription" :key="index">
                        <span>{{ file ? file.name : '' }}</span>
                        <button type="button" @click="deleteFile(index, fileArrayDescription, file)">x</button>
                    </li> 
                </ul>
            </div>

            <div class="body-edit">
                <div style="display: flex;">
                    <h3>State of the Art Methods</h3>
                    <b-form-checkbox v-model="publication.state.visible" name="visible-button" switch style="align-self: center;margin-left: 30px;">Visible</b-form-checkbox>
                </div>
                <ckeditor :editor="editor" v-model="publication.state.content" :config="editorConfig"></ckeditor>
            </div>

            <div style="display: flex;align-items: baseline;">
                <b-form-file v-model="fileState" class="inputfile mt-3" id="inputfileState" ref="file-input" multiple plain></b-form-file>
                <label class="btn btn-secondary" for="inputfileState">Choose a file</label>

                <ul>
                    <li class="item-list" v-for="(file, index) in fileArrayState" :key="index">
                        <span>{{ file ? file.name : '' }}</span>
                        <button type="button" @click="deleteFile(index, fileArrayState, file)">x</button>
                    </li> 
                </ul>
            </div>

            <div class="body-edit">
                <div style="display: flex;">
                    <h3>Instances</h3>
                    <b-form-checkbox v-model="publication.instances.visible" name="visible-button" switch style="align-self: center;margin-left: 30px;">Visible</b-form-checkbox>
                </div>
                <ckeditor :editor="editor" v-model="publication.instances.content" :config="editorConfig"></ckeditor>
            </div>

            <div style="display: flex;align-items: baseline;">
                <b-form-file v-model="fileInstances" class="inputfile mt-3" id="inputfileInstances" ref="file-input" multiple plain></b-form-file>
                <label class="btn btn-secondary" for="inputfileInstances">Choose a file</label>

                <ul>
                    <li class="item-list" v-for="(file, index) in fileArrayInstances" :key="index">
                        <span>{{ file ? file.name : '' }}</span>
                        <button type="button" @click="deleteFile(index, fileArrayInstances, file)">x</button>
                    </li> 
                </ul>
            </div>


            <div class="body-edit">
                <div style="display: flex;">
                    <h3 v-bind:class="{ cross: !checked}">Computational Experience</h3>
                    <b-form-checkbox v-model="checked" name="check-button" switch style="align-self: center;margin-left: 16px;">Optional</b-form-checkbox>
                    <b-form-checkbox v-if="checked" v-model="publication.computationalExperience.visible" name="visible-button" switch style="align-self: center;margin-left: 70px;">Visible</b-form-checkbox>
                </div>
                <ckeditor v-if="checked" :editor="editor" v-model="publication.computationalExperience.content" :config="editorConfig"></ckeditor>
            </div>

            <div v-if="checked" style="display: flex;align-items: baseline;">
                <b-form-file v-model="fileComputational" class="inputfile mt-3" id="inputfileComputational" ref="file-input" multiple plain></b-form-file>
                <label class="btn btn-secondary" for="inputfileComputational">Choose a file</label>

                <ul>
                    <li class="item-list" v-for="(file, index) in fileArrayComputational" :key="index">
                        <span>{{ file ? file.name : '' }}</span>
                        <button type="button" @click="deleteFile(index, fileArrayComputational, file)">x</button>
                    </li> 
                </ul>
            </div>

            <div class="body-edit">
                <div style="display: flex;">
                    <h3>References</h3>
                    <b-form-checkbox v-model="publication.reference.visible" name="visible-button" switch style="align-self: center;margin-left: 30px;">Visible</b-form-checkbox>
                </div>
                <ckeditor :editor="editor" v-model="publication.reference.content" :config="editorConfig"></ckeditor>
            </div>

            <div style="display: flex;align-items: baseline;">
                <b-form-file v-model="fileReferences" class="inputfile mt-3" id="inputfileReferences" ref="file-input" multiple plain></b-form-file>
                <label class="btn btn-secondary" for="inputfileReferences">Choose a file</label>

                <ul>
                    <li class="item-list" v-for="(file, index) in fileArrayReferences" :key="index">
                        <span>{{ file ? file.name : '' }}</span>
                        <button type="button" @click="deleteFile(index, fileArrayReferences, file)">x</button>
                    </li> 
                </ul>
            </div>

            <div class="text-center" style="margin-bottom: 63px;">
                <button type="submit" class="btn btn-info float-right mb-50">
                    Save Publication
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import ClassicEditor from '../ckeditor';
import { v4 as uuid } from 'uuid';
import VueSimpleSuggest from 'vue-simple-suggest'
import 'vue-simple-suggest/dist/styles.css'

export default {
    name: 'EditorPublications',
    components: {
        VueSimpleSuggest
    },
    data() {
        return {
            publication: {
                title: '',
                description: {
                    content: '<p>Here can be your description...</p>',
                    visible: true,
                },
                state: {
                    content: '<p>Here can be your State of the Art Methods...</p>',
                    visible: true,
                },
                instances: {
                    content: '<p>Here can be your instances...</p>',
                    visible: true,
                },
                computationalExperience: {
                    content: '<p>Here can be your computational experience...</p>',
                    visible: true,
                },
                reference: {
                    content: '<p>Here can be your references...</p>',
                    visible: true,
                },
                user: [],
                usersNotRegistered: [],
                problems: [],
                attachments: []
            },
            initialized: false,
            publicationCopy: {
                user: [],
                usersNotRegistered: [],
                problems: []
            },                
            editor: ClassicEditor,
            editorConfig: ClassicEditor.defaultConfig,
            usersToChoose: [],
            userMap: new Map(),
            usersChosen: [''],
            problemsToChoose: [],
            problemsMap: new Map(),
            problemsChosen: [''],
            checked: true,
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
            filePDFPublication: null,
            filePDFPublicationPrevious: ''
        };
    },
    props: {
        isNew: {
            type: Boolean,
            default: true
        }
    },
    async created () {
        await this.getUsers();
        this.getProblems();
        if (!this.isNew) {
            this.fetchData();
        }
    },
    methods: {
        async savePublication () {
            try {
                this.prepareUsers();
                this.prepareProblems();
                this.prepareContent();
                this.computationalChecked();
                const idPDF = await this.prepareFilePDF();
                let files;
                if (this.filesToUpload) {
                    files = await this.uploadFile();
                }
                if (this.filesToDelete) {
                    await this.deleteFiles();
                }
                const idsFiles = [...new Set([...files, ...this.prepareFiles()])]

                if (this.isNew) {
                    const res = await this.axios.post(`publications`,{...this.publication, "attachments": idsFiles, "pdf": idPDF},{
                        headers: { token: this.$store.state.token}
                    });
                } else {
                    const res = await this.axios.put(`publications/${this.$route.params.publicationId}`,{...this.publicationCopy, "attachments": idsFiles, "pdf": idPDF},{
                        headers: { token: this.$store.state.token}
                    });
                }
                
                this.$router.push({path: '/'})
            } catch (error) {
                console.log(error)
            }
        },
        async fetchData() {
            const res = await this.axios.get(`publications/${this.$route.params.publicationId}`);
            this.publication = res.data;
            this.checked = res.data.computationalExperience.content ? true : false;
            this.pushToUsersChosen();
            this.pushToProblemsChosen();
            await this.organiceFiles();
            this.$nextTick(() => {
                this.initialized = true;
            })
        },
        updateCopy (valor) {
            this.publicationCopy[valor.target.id] = valor.target.value;
        },
        async getUsers() {
            const res = await this.axios.get(`users`);
            res.data.forEach( user => {
                this.userMap.set(user.name,user.userId);
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
            this.usersChosen.forEach( user => {
                if (this.userMap.has(user)) {
                    this.publication.user.push(this.userMap.get(user));
                    this.publicationCopy.user.push(this.userMap.get(user));
                } else {
                    this.publication.usersNotRegistered.push(user);
                    this.publicationCopy.usersNotRegistered.push(user);
                }
            });
        },
        pushToUsersChosen() {
            this.usersChosen = [...this.userMap.entries()].filter(({ 1: v }) => this.publication.user.includes(v)).map(([k]) => k);
            if (this.publication.usersNotRegistered) {
                this.publication.usersNotRegistered.forEach( user => this.usersChosen.push(user));
            }
        },
        async getProblems() {
            const res = await this.axios.get(`problems`);
            res.data.forEach( problem => {
                this.problemsMap.set(problem.name,problem.problemId);
                this.problemsToChoose.push(problem.name);
            });
        },
        addProblem() {
            this.problemsChosen.push('')
        },
        deleteProblem(index) {
            this.problemsChosen.splice(index, 1);
        },
        prepareProblems() {
            this.problemsChosen.forEach( problem => {
                if (this.problemsMap.has(problem)) {
                    this.publication.problems.push(this.problemsMap.get(problem));
                    this.publicationCopy.problems.push(this.problemsMap.get(problem));
                }
            });
        },
        pushToProblemsChosen() {
            this.problemsChosen = [...this.problemsMap.entries()].filter(({ 1: v }) => this.publication.problems.includes(v)).map(([k]) => k);
        },
        computationalChecked () {
            if (!this.checked) {
                this.publication.computationalExperience.content = '';
                this.publication.computationalExperience.visible = false;
                this.publicationCopy.computationalExperience.content = '';
                this.publicationCopy.computationalExperience.visible = false;
                const length = this.fileArrayComputational.length;
                for (let i = 0; i < length; i++) {
                    this.deleteFile(0, this.fileArrayComputational, this.fileArrayComputational[0])
                    
                }
            }
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
            this.publication.attachments.forEach( fileId => promises.push(this.axios.get(`files/${fileId}`)))
            if (this.publication.pdf) {
                promises.push(this.axios.get(`files/${this.publication.pdf}`))
            }
            const res = await Promise.all(promises)
            const files = res.map( res => res.data);
            this.fileArrayDescription = files.filter( file => file.section == 'description')
            this.fileArrayState = files.filter( file => file.section == 'state')
            this.fileArrayInstances = files.filter( file => file.section == 'instances')
            this.fileArrayReferences = files.filter( file => file.section == 'references')
            this.fileArrayComputational = files.filter( file => file.section == 'computational')
            this.filePDFPublicationPrevious = files.filter( file => file.section == 'pdfPublication')[0]
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
            this.publicationCopy.description = { ...this.publication.description };
            this.publicationCopy.state = { ...this.publication.state };
            this.publicationCopy.instances = { ...this.publication.instances };
            this.publicationCopy.computationalExperience = { ...this.publication.computationalExperience };
            this.publicationCopy.reference = { ...this.publication.reference };
        },
        deleteFilePDF(){
            this.filePDFPublication = null
        },
        deleteFilePDFPrevious() {
            this.filesToDelete.push(this.filePDFPublicationPrevious)
            this.filePDFPublicationPrevious = ''
        },
        async prepareFilePDF(){
            if (this.filePDFPublication) {
                let fd = new FormData();
                fd.append('fileId',this.filePDFPublication.fileId)
                fd.append('section',this.filePDFPublication.section)
                fd.append('file',this.filePDFPublication)
                const res = await this.axios.post(`files`,fd,{
                    headers: { token: this.$store.state.token, 'Content-Type': 'multipart/form-data'}
                });
                return res.data.fileId;
            } else if (this.filePDFPublicationPrevious) {
                return this.filePDFPublicationPrevious.fileId;
            }
            return '';
            
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
                this.publication.description.content += `<p>Download <a href="https://localhost:3443/api/files/downloads/${file.fileId}">${file.name}</a></p>`
            })
        },
        fileState() {
            this.fileState.forEach(file => {
                const fileId = uuid()
                file.fileId = fileId
                file.section = 'state'
                this.filesToUpload.push(file)
                this.fileArrayState.push(file)
                this.publication.state.content += `<p>Download <a href="https://localhost:3443/api/files/downloads/${file.fileId}">${file.name}</a></p>`
            })
        },
        fileInstances() {
            this.fileInstances.forEach(file => {
                const fileId = uuid()
                file.fileId = fileId
                file.section = 'instances'
                this.filesToUpload.push(file)
                this.fileArrayInstances.push(file)
                this.publication.instances.content += `<p>Download <a href="https://localhost:3443/api/files/downloads/${file.fileId}">${file.name}</a></p>`
            })
        },
        fileReferences() {
            this.fileReferences.forEach(file => {
                const fileId = uuid()
                file.fileId = fileId
                file.section = 'references'
                this.filesToUpload.push(file)
                this.fileArrayReferences.push(file)
                this.publication.reference.content += `<p>Download <a href="https://localhost:3443/api/files/downloads/${file.fileId}">${file.name}</a></p>`
            })
        },
        fileComputational() {
            this.fileComputational.forEach(file => {
                const fileId = uuid()
                file.fileId = fileId
                file.section = 'computational'
                this.filesToUpload.push(file)
                this.fileArrayComputational.push(file)
                this.publication.computationalExperience.content += `<p>Download <a href="https://localhost:3443/api/files/downloads/${file.fileId}">${file.name}</a></p>`
            })
        },
        filePDFPublication() {
            const fileId = uuid()
            if (this.filePDFPublication) {
                this.filePDFPublication.fileId = fileId
                this.filePDFPublication.section = 'pdfPublication'
                if (this.filePDFPublicationPrevious) {
                    this.filesToDelete.push(this.filePDFPublicationPrevious)
                    this.filePDFPublicationPrevious = ''
                }
            }
        }
    },
    computed: {
        usersChosenToShow() {
            return this.usersChosen;
        },
        problemsChosenToShow() {
            return this.problemsChosen;
        }
    }
};
</script> 

<style scoped>
.container {
    border-radius: 4px;
    background-color: #fff;
    margin-bottom: 30px;
}

.body-edit {
    margin-top: 40px;
    margin-bottom: 40px;
}

.control-label {
    font-size: 12px;
    margin-bottom: 5px;
    text-transform: uppercase;
    font-weight: 400;
    color: #9a9a9a;
}

.form-control {
    border: 1px solid #e3e3e3;
    border-radius: 4px;
    color: #565656;
    padding: 8px 12px;
    height: 40px;
    display: block;
    width: 100%;
    font-size: 1rem;
    line-height: 1.5;
    background-image: none;
    background-clip: padding-box;
}

.form-control::-moz-placeholder {
  color: #cfcfca;
  opacity: 1;
  filter: alpha(opacity=100);
}

.search > div {
    width: 100%
}

.cross {
    text-decoration: line-through;
}

.inputfile {
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
}

.item-list {
    display: inline-flex;
    color: #fff;
    background-color: #007bff;
    padding: 4px 10px;
    border-radius: 10rem;
    margin-right: 7px;
}

.item-list span {
    color: #fff;
    font-size: 75%;
}

.item-list button {
    color: inherit;
    line-height: 1;
    margin-left: .25rem;
    cursor: pointer;
    padding: 0;
    background-color: transparent;
    border: 0;
    text-shadow: 0 1px 0 #fff;
    opacity: .5;
    font-weight: 700;
}
.item-list button:hover {
    opacity: .75;
    font-weight: 700;
}
</style>