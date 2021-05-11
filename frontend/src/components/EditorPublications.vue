<template>
    <div class="container">
        <div style="display: flex;">
            <b-form-checkbox v-model="publication.visible" name="visible-button" switch style="align-self: center;margin-left: 30px;">Visible</b-form-checkbox>
        </div>
        <form @submit.prevent="savePublication">
            <b-row>
                <b-col cols="6">
                    <div class="form-group">
                        <label for="title" class="control-label">{{ $t('createPublication.titlePubli') }}</label>
                        <input id="title" v-model="publication.title" @change="updateCopy" class="form-control" type="text" :placeholder="$t('createPublication.titlePubli')">
                    </div>
                </b-col>
                <b-col cols="6">
                    <div class="form-group">
                        <label for="journal" class="control-label">{{ $t('createPublication.journal') }}</label>
                        <input id="journal" v-model="publication.journal" @change="updateCopy" class="form-control" type="text" :placeholder="$t('createPublication.journal')">
                    </div>
                </b-col>
            </b-row>
            
             <b-row>
                <b-col cols="3">
                    <div class="form-group">
                        <label for="volume" class="control-label">{{ $t('createPublication.volume') }}</label>
                        <input id="volume" v-model="publication.volume" @change="updateCopy" class="form-control" type="text" :placeholder="$t('createPublication.volume')">
                    </div>
                </b-col>
                <b-col cols="3">
                    <div class="form-group">
                        <label for="pages" class="control-label">{{ $t('createPublication.pages') }}</label>
                        <input id="pages" v-model="publication.pages" @change="updateCopy" class="form-control" type="text" :placeholder="$t('createPublication.pages')">
                    </div>
                </b-col>
                <b-col cols="3">
                    <div class="form-group">
                        <label for="year" class="control-label">{{ $t('createPublication.year') }}</label>
                        <input id="year" v-model="publication.year" @change="updateCopy" class="form-control" type="text" :placeholder="$t('createPublication.year')">
                    </div>
                </b-col>
                <b-col cols="3">
                    <div class="form-group">
                        <label for="publisher" class="control-label">{{ $t('createPublication.publisher') }}</label>
                        <input id="publisher" v-model="publication.publisher" @change="updateCopy" class="form-control" type="text" :placeholder="$t('createPublication.publisher')">
                    </div>
                </b-col>
            </b-row>

            <b-row>
                <b-col cols="4">
                    <div class="form-group">
                        <label for="issn" class="control-label">{{ $t('createPublication.issn') }}</label>
                        <input id="issn" v-model="publication.issn" @change="updateCopy" class="form-control" type="text" :placeholder="$t('createPublication.issn')">
                    </div>
                </b-col>
                <b-col cols="4">
                    <div class="form-group">
                        <label for="doi" class="control-label">{{ $t('createPublication.doi') }}</label>
                        <input id="doi" v-model="publication.doi" @change="updateCopy" class="form-control" type="text" :placeholder="$t('createPublication.doi')">
                    </div>
                </b-col>
                <b-col cols="4">
                    <div class="form-group">
                        <label for="url" class="control-label">{{ $t('createPublication.url') }}</label>
                        <input id="url" v-model="publication.url" @change="updateCopy" class="form-control" type="text" :placeholder="$t('createPublication.url')">
                    </div>
                </b-col>
            </b-row>

            <b-row>
                <b-col cols="12">
                    <div class="form-group">
                        <label for="keywords" class="control-label">{{ $t('createPublication.keywords') }}</label>
                        <input id="keywords" v-model="publication.keywords" @change="updateCopy" class="form-control" type="text" :placeholder="$t('createPublication.keywords')">
                    </div>
                </b-col>
            </b-row>

            <b-row>
                <b-col cols="12">
                    <div class="form-group">
                        <label for="abstract" class="control-label">{{ $t('createPublication.abstract') }}</label>
                        <textarea id="abstract" v-model="publication.abstract" @change="updateCopy" class="form-control"  style="height: 20px; min-height: 50px;" :placeholder="$t('createPublication.abstract')"></textarea> 
                    </div>
                </b-col>
            </b-row>

            <b-button v-b-modal.modal-bibtex>{{ $t('createPublication.importBibtex') }}</b-button>
            <b-modal id="modal-bibtex" title="BibTeX">
                <label for="bibtex" class="control-label">BibTeX</label>
                <textarea id="bibtex" v-model="publication.bibtex" @change="updateBibTeX" class="form-control" style="height: 200px; min-height: 200px;" :placeholder="$t('createPublication.bibtexPHolder')"></textarea>  
            </b-modal>
            <p v-if="bibtexError">{{bibtexError}}</p>

            

            <b-row>
                <b-col cols="6" style="display: flex;flex-direction: column;">
                    <h4>{{ $t('createPublication.authors') }}</h4>
                    <div class="form-group search" v-for="(theUser, index) in usersChosenToShow" :key="index" style="padding-left: 0px;display: flex;">
                        <vue-simple-suggest
                            v-model="authors[index]">
                        </vue-simple-suggest>
                        <vue-simple-suggest style="margin-left: 15px;"
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
                            {{ $t('createPublication.addAuthor') }}
                        </button>
                    </div>
                </b-col>
                
                <b-col style="display: flex;justify-content: center;">
                    <div style="display: flex;align-items: baseline;">
                        <b-form-file v-model="filePDFPublication" class="inputfile mt-3" id="inputfilePDFPublication" ref="file-input" accept=".pdf" plain></b-form-file>
                        <label class="btn btn-secondary" for="inputfilePDFPublication">{{ $t('createPublication.uploadPDF') }}</label>

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
            

            <h4>{{ $t('createPublication.relatedProblems') }}</h4>
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
                    {{ $t('createPublication.addProblem') }}
                </button>
            </div>

            <div class="body-edit">
                <div style="display: flex;">
                    <h3>{{ $t('createPublication.wizard2') }}</h3>
                    <b-form-checkbox v-model="publication.description.visible" name="visible-button" switch style="align-self: center;margin-left: 30px;">Visible</b-form-checkbox>
                </div>
                <ckeditor :editor="editor" v-model="publication.description.content" :config="editorConfig"></ckeditor>
            </div>

            <div style="display: flex;align-items: baseline;">
                <b-form-file v-model="fileDescription" class="inputfile mt-3" id="inputfileDescription" ref="file-input" multiple plain></b-form-file>
                <label class="btn btn-secondary" for="inputfileDescription">{{ $t('createPublication.chooseFile') }}</label>

                <ul>
                    <li class="item-list" v-for="(file, index) in fileArrayDescription" :key="index">
                        <span>{{ file ? file.name : '' }}</span>
                        <button type="button" @click="deleteFile(index, fileArrayDescription, file)">x</button>
                    </li> 
                </ul>
            </div>

            <div class="body-edit">
                <div style="display: flex;">
                    <h3>{{ $t('createPublication.wizard3') }}</h3>
                    <b-form-checkbox v-model="publication.state.visible" name="visible-button" switch style="align-self: center;margin-left: 30px;">Visible</b-form-checkbox>
                </div>
                <ckeditor :editor="editor" v-model="publication.state.content" :config="editorConfig"></ckeditor>
            </div>

            <div style="display: flex;align-items: baseline;">
                <b-form-file v-model="fileState" class="inputfile mt-3" id="inputfileState" ref="file-input" multiple plain></b-form-file>
                <label class="btn btn-secondary" for="inputfileState">{{ $t('createPublication.chooseFile') }}</label>

                <ul>
                    <li class="item-list" v-for="(file, index) in fileArrayState" :key="index">
                        <span>{{ file ? file.name : '' }}</span>
                        <button type="button" @click="deleteFile(index, fileArrayState, file)">x</button>
                    </li> 
                </ul>
            </div>

            <div class="body-edit">
                <div style="display: flex;">
                    <h3>{{ $t('createPublication.wizard4') }}</h3>
                    <b-form-checkbox v-model="publication.instances.visible" name="visible-button" switch style="align-self: center;margin-left: 30px;">Visible</b-form-checkbox>
                </div>
                <ckeditor :editor="editor" v-model="publication.instances.content" :config="editorConfig"></ckeditor>
            </div>

            <div style="display: flex;align-items: baseline;">
                <b-form-file v-model="fileInstances" class="inputfile mt-3" id="inputfileInstances" ref="file-input" multiple plain></b-form-file>
                <label class="btn btn-secondary" for="inputfileInstances">{{ $t('createPublication.chooseFile') }}</label>

                <ul>
                    <li class="item-list" v-for="(file, index) in fileArrayInstances" :key="index">
                        <span>{{ file ? file.name : '' }}</span>
                        <button type="button" @click="deleteFile(index, fileArrayInstances, file)">x</button>
                    </li> 
                </ul>
            </div>


            <div class="body-edit">
                <div style="display: flex;">
                    <h3 v-bind:class="{ cross: !checked}">{{ $t('createPublication.wizard5') }}</h3>
                    <b-form-checkbox v-model="checked" name="check-button" switch style="align-self: center;margin-left: 16px;">Optional</b-form-checkbox>
                    <b-form-checkbox v-if="checked" v-model="publication.computationalExperience.visible" name="visible-button" switch style="align-self: center;margin-left: 70px;">Visible</b-form-checkbox>
                </div>
                <ckeditor v-if="checked" :editor="editor" v-model="publication.computationalExperience.content" :config="editorConfig"></ckeditor>
            </div>

            <div v-if="checked" style="display: flex;align-items: baseline;">
                <b-form-file v-model="fileComputational" class="inputfile mt-3" id="inputfileComputational" ref="file-input" multiple plain></b-form-file>
                <label class="btn btn-secondary" for="inputfileComputational">{{ $t('createPublication.chooseFile') }}</label>

                <ul>
                    <li class="item-list" v-for="(file, index) in fileArrayComputational" :key="index">
                        <span>{{ file ? file.name : '' }}</span>
                        <button type="button" @click="deleteFile(index, fileArrayComputational, file)">x</button>
                    </li> 
                </ul>
            </div>

            <div class="body-edit">
                <div style="display: flex;">
                    <h3>{{ $t('createPublication.wizard6') }}</h3>
                    <b-form-checkbox v-model="publication.reference.visible" name="visible-button" switch style="align-self: center;margin-left: 30px;">Visible</b-form-checkbox>
                </div>
                <ckeditor :editor="editor" v-model="publication.reference.content" :config="editorConfig"></ckeditor>
            </div>

            <div style="display: flex;align-items: baseline;">
                <b-form-file v-model="fileReferences" class="inputfile mt-3" id="inputfileReferences" ref="file-input" multiple plain></b-form-file>
                <label class="btn btn-secondary" for="inputfileReferences">{{ $t('createPublication.chooseFile') }}</label>

                <ul>
                    <li class="item-list" v-for="(file, index) in fileArrayReferences" :key="index">
                        <span>{{ file ? file.name : '' }}</span>
                        <button type="button" @click="deleteFile(index, fileArrayReferences, file)">x</button>
                    </li> 
                </ul>
            </div>

            <div class="text-center" style="margin-bottom: 63px;">
                <button type="submit" class="btn btn-info float-right mb-50">
                    {{ $t('createPublication.save') }}
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import ClassicEditor from '../ckeditor';
import { v4 as uuid } from 'uuid';
import VueSimpleSuggest from 'vue-simple-suggest';
import 'vue-simple-suggest/dist/styles.css';
import { parseBibFile, normalizeFieldValue } from "bibtex";

export default {
    name: 'EditorPublications',
    components: {
        VueSimpleSuggest
    },
    data() {
        return {
            publication: {
                title: '',
                journal: '',
                volume: '',
                pages: '',
                year: '',
                publisher: '',
                issn: '',
                doi: '',
                url: '',
                keywords: '',
                abstract: '',
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
                attachments: [],
                bibtex: '',
                visible: true,
                authors: ''
            },
            initialized: false,
            publicationCopy: {
                user: [],
                usersNotRegistered: [],
                problems: [],
                bibtex: ''
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
            filePDFPublicationPrevious: '',
            bibtexError: '',
            usersConfirm: [],
            authors: ['']
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
        if (this.$store.state.bibtex) {
            this.publication.bibtex = this.$store.state.bibtex;
            this.$store.dispatch('bibtexFromOrcid','');
            this.updateBibTeX();
        }
    },
    methods: {
        async savePublication () {
            try {
                this.linkAuthorsUsers();
                this.prepareUsers();
                this.prepareProblems();
                this.prepareContent();
                this.computationalChecked();
                this.generateBibtex();
                
                const idPDF = await this.prepareFilePDF();
                let files;
                if (this.filesToUpload) {
                    files = await this.uploadFile();
                }
                if (this.filesToDelete) {
                    await this.deleteFiles();
                }
                const idsFiles = [...new Set([...files, ...this.prepareFiles()])];

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
            this.generateBibtex();
        },
        async getUsers() {
            const res = await this.axios.get(`users`);
            res.data.forEach( user => {
                this.userMap.set(user.name,user.userId);
                this.usersToChoose.push(user.name);
            });
        },
        addUser() {
            this.usersChosen.push('');
            this.authors.push('');
        },
        deleteUser(index) {
            this.usersChosen.splice(index, 1);
            this.authors.splice(index, 1);
        },
        linkAuthorsUsers() {
            const mapa = new Map();
            for (let i = 0; i < this.usersChosen.length; i++) {
                mapa.set(this.authors[i],this.usersChosen[i]);                
            }
            this.publication.authors = JSON.stringify(Array.from(mapa.entries()));
            this.publicationCopy.authors = this.publication.authors;
        },
        prepareUsers() {
            const users = [...new Set([...(this.usersChosen.filter(user => user))])]
            users.forEach( user => {
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
            const authorsArray = JSON.parse(this.publication.authors);
            const authorsArrayAux = [];
            const usersChosenArrayAux = [];
           
            authorsArray.forEach(user => {
                authorsArrayAux.push(user[0]);
                usersChosenArrayAux.push(user[1]);
            })

            this.authors = authorsArrayAux;
            this.usersChosen = usersChosenArrayAux;
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
            this.publicationCopy.visible = this.publication.visible;
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
            
        },
        updateBibTeX() {
            try {                
                const bibFile = parseBibFile(this.publication.bibtex);
                const id = this.publication.bibtex.substring(this.publication.bibtex.indexOf("{")+1, this.publication.bibtex.indexOf(","));
                const entry = bibFile.getEntry(id.trim());
                if (entry) {
                    this.setTitle(this.getValue(entry, "title"));
                    this.setJournal(this.getValue(entry, "journal"));
                    this.setVolume(this.getValue(entry, "volume"));
                    this.setPages(this.getValue(entry, "pages"));
                    this.setYear(this.getValue(entry, "year"));
                    this.setPublisher(this.getValue(entry, "publisher"));
                    this.setissnr(this.getValue(entry, "issn"));
                    this.setdoi(this.getValue(entry, "doi"));
                    this.seturl(this.getValue(entry, "url"));
                    this.setKeywords(this.getValue(entry, "keywords"));
                    this.setAbstract(this.getValue(entry, "abstract"));
                    this.bibtexError = '';
                    this.publicationCopy.bibtex = this.publication.bibtex;
                    if (entry.fields.author && entry.fields.author["authors$"]) {
                        this.usersConfirm = entry.fields.author["authors$"];
                        this.manageUsersBibtex();
                    }
                } else {
                    this.publication.bibtex = '';
                    this.publicationCopy.bibtex = '';
                    this.bibtexError = 'Wrong BibTeX'
                    this.clearFields();
                }
            } catch (error) {
                this.publication.bibtex = '';
                this.publicationCopy.bibtex = '';
                this.bibtexError = 'Wrong BibTeX'
                this.clearFields();
            }            
        },
        manageUsersBibtex(){
            for (let i = 0; i < this.usersConfirm.length; i++) {
                const name = this.getAuthorsNames(this.usersConfirm[i])
                if (!this.authors.includes(name)) {
                    this.authors.push(name);
                    this.usersChosen.push('');
                }
            }
        }, 
        getAuthorsNames(user){
            const firstNames = user.firstNames.reduce((text, name) => text + ` ${name}`);
            const lastNames = user.lastNames.reduce((text, name) => text + ` ${name}`);
            return `${firstNames} ${lastNames}`;
        },
        getValue(entry, value) {
            const fieldValue = normalizeFieldValue(entry.getField(value));
            return fieldValue ? fieldValue : '';
        },
        setTitle(fieldValue){
            this.publication.title = fieldValue;
            this.publicationCopy.title = fieldValue;
            
        },
        setJournal(fieldValue){
            this.publication.journal = fieldValue;
            this.publicationCopy.journal = fieldValue;
        },
        setVolume(fieldValue){
            this.publication.volume = fieldValue;
            this.publicationCopy.volume = fieldValue;
        },
        setPages(fieldValue){
            this.publication.pages = fieldValue;
            this.publicationCopy.pages = fieldValue;
        },
        setYear(fieldValue){
            this.publication.year = fieldValue;
            this.publicationCopy.year = fieldValue;
        },
        setPublisher(fieldValue){
            this.publication.publisher = fieldValue;
            this.publicationCopy.publisher = fieldValue;
        },
        setissnr(fieldValue){
            this.publication.issn = fieldValue;
            this.publicationCopy.issn = fieldValue;
        },
        setdoi(fieldValue){
            this.publication.doi = fieldValue;
            this.publicationCopy.doi = fieldValue;
        },
        seturl(fieldValue){
            this.publication.url = fieldValue;
            this.publicationCopy.url = fieldValue;
        },
        setKeywords(fieldValue){
            this.publication.keywords = fieldValue;
            this.publicationCopy.keywords = fieldValue;
        },
        setAbstract(fieldValue){
            this.publication.abstract = fieldValue;
            this.publicationCopy.abstract = fieldValue;
        },
        clearFields() {
            this.setTitle('');
            this.setJournal('');
            this.setVolume('');
            this.setPages('');
            this.setYear('');
            this.setPublisher('');
            this.setissnr('');
            this.setdoi('');
            this.seturl('');
            this.setKeywords('');
            this.setAbstract('');
        },
        generateBibtex() {
            const bibtex= `@article{id,\n${this.publication.title ? `title = {${this.publication.title}},\n` : ''}` + 
            `${this.publication.journal ? `journal = {${this.publication.journal}},\n` : ''}` +
            `${this.publication.volume ? `volume = {${this.publication.volume}},\n` : ''}` +
            `${this.publication.pages ? `pages = {${this.publication.pages}},\n` : ''}` +
            `${this.publication.year ? `year = {${this.publication.year}},\n` : ''}` +
            `${this.publication.publisher ? `publisher = {${this.publication.publisher}},\n` : ''}` +
            `${this.publication.issn ? `issn = {${this.publication.issn}},\n` : ''}` +
            `${this.publication.doi ? `doi = {${this.publication.doi}},\n` : ''}` +
            `${this.publication.url ? `url = {${this.publication.url}},\n` : ''}` +
            `${this.authors ? `author = {${this.usersToBibtex()}},\n` : ''}` +
            `${this.publication.keywords ? `keywords = {${this.publication.keywords}},\n` : ''}` +
            `${this.publication.abstract ? `abstract = {${this.publication.abstract}},\n` : ''}` + "}"
            this.publication.bibtex = bibtex;
            this.publicationCopy.bibtex = bibtex;
        },
        usersToBibtex(){
            return this.authors.reduce((text, name, index) =>  index==0 ? text + `${name}` : text + ` and ${name}`);
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