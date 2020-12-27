<template>
    <div class="container">
        <form @submit.prevent="saveProblem">
            <div class="form-group">
                <label for="name" class="control-label">Name</label>
                <input id="name" v-model="problem.name" @change="updateCopy" class="form-control" type="text" placeholder="Name">
            </div>

            <div class="form-group">
                <label for="alias" class="control-label">Alias</label>
                <input id="alias" v-model="problem.alias" @change="updateCopy" class="form-control" type="text" placeholder="Alias">
            </div>

        
            <div class="form-group col-md-6 search" v-for="(theUser, index) in usersChosenToShow" :key="index" style="padding-left: 0px;display: flex;">
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

            <div class="body-edit">
                <h3>Problem Description</h3>
                <ckeditor :editor="editor" v-model="problem.description" :config="editorConfig"></ckeditor>
            </div>

            <div class="body-edit">
                <h3>State of the Art Methods</h3>
                <ckeditor :editor="editor" v-model="problem.state" :config="editorConfig"></ckeditor>
            </div>

            <div class="body-edit">
                <h3>Instances</h3>
                <ckeditor :editor="editor" v-model="problem.instances" :config="editorConfig"></ckeditor>
            </div>

            <div class="body-edit">
                <h3>Computational Experience</h3>
                <ckeditor :editor="editor" v-model="problem.computationalExperience" :config="editorConfig"></ckeditor>
            </div>

            <div class="body-edit">
                <h3>References</h3>
                <ckeditor :editor="editor" v-model="problem.reference" :config="editorConfig"></ckeditor>
            </div>

            <div class="text-center" style="margin-bottom: 63px;">
                <button type="submit" class="btn btn-info float-right mb-50">
                    Save Problem
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import ClassicEditor from '../ckeditor';
import axios from 'axios';
import VueSimpleSuggest from 'vue-simple-suggest'
import 'vue-simple-suggest/dist/styles.css'

export default {
    name: 'EditorProblems',
    components: {
        VueSimpleSuggest
    },
    data() {
        return {
            problem: {
                name: '',
                alias: '',
                description: '<p>Here can be your description...</p>',
                state: '<p>Here can be your State of the Art Methods...</p>',
                instances: '<p>Here can be your instances...</p>',
                computationalExperience: '<p>Here can be your computational experience...</p>',
                reference: '<p>Here can be your references...</p>',
                user: [],
                usersNotRegistered: []
            },
            initialized: false,
            problemCopy: {
                user: [],
                usersNotRegistered: []
            },                
            editor: ClassicEditor,
            editorConfig: ClassicEditor.defaultConfig,
            usersToChoose: [],
            userMap: new Map(),
            usersChosen: [''],
            
        };
    },
    props: {
        isNew: {
            type: Boolean,
            default: true
        }
    },
    created () {
        this.getUsers();
        if (!this.isNew) {
            this.fetchData();
        }
    },
    methods: {
        async saveProblem () {
            try {
                this.prepareUsers();
                if (this.isNew) {
                    const res = await axios.post(`http://localhost:4000/api/problems`,this.problem,{
                        headers: { token: this.$store.state.token}
                    });
                } else {
                    const res = await axios.put(`http://localhost:4000/api/problems/${this.$route.params.problemId}`,this.problemCopy,{
                        headers: { token: this.$store.state.token}
                    });
                }
                
                this.$router.push({path: '/'})
            } catch (error) {
                console.log(error)
            }
        },
        async fetchData() {
            const res = await axios.get(`http://localhost:4000/api/problems/${this.$route.params.problemId}`);
            this.problem = res.data;
            this.pushToChosen();
            this.$nextTick(() => {
                this.initialized = true;
            })
        },
        updateCopy (valor) {
            this.problemCopy[valor.target.id] = valor.target.value;
        },
        async getUsers() {
            const res = await axios.get(`http://localhost:4000/api/users`);
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
            this.usersChosen.forEach( user => {
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
        }
    },
    watch: {
        'problem.description': function (newValue){
            if (this.initialized) {
                this.problemCopy.description = newValue
            }
        },
        'problem.state': function (newValue){
            if (this.initialized) {
                this.problemCopy.state = newValue
            }            
        },
        'problem.instances': function (newValue){
            if (this.initialized) {
                this.problemCopy.instances = newValue
            }            
        },
        'problem.computationalExperience': function (newValue){
            if (this.initialized) {
                this.problemCopy.computationalExperience = newValue
            }            
        },
        'problem.reference': function (newValue){
            if (this.initialized) {
                this.problemCopy.reference = newValue
            }            
        }
    },
    computed: {
        usersChosenToShow() {
            return this.usersChosen;
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
</style>