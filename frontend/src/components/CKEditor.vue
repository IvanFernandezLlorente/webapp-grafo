<template>
    <div class="container">
        <form @submit.prevent="savePublication">
            <div class="form-group">
                <label for="title" class="control-label">Title</label>
                <input id="title" v-model="publication.title" @change="updateCopy" class="form-control" type="text" placeholder="Title">
            </div>

            <div class="form-group">
                <label for="userName" class="control-label">Name</label>
                <input id="userName" v-model="publication.userName" @change="updateCopy" class="form-control" type="text" placeholder="Name">
            </div>

            <div class="form-group">
                <label for="organization" class="control-label">Organization</label>
                <input id="organization" v-model="publication.organization" @change="updateCopy" class="form-control" type="text" placeholder="Organization">
            </div>

            <div class="body-edit">
                <h3>Problem Description</h3>
                <ckeditor :editor="editor" v-model="publication.description" :config="editorConfig"></ckeditor>
            </div>

            <div class="body-edit">
                <h3>State of the Art Methods</h3>
                <ckeditor :editor="editor" v-model="publication.state" :config="editorConfig"></ckeditor>
            </div>

            <div class="body-edit">
                <h3>Instances</h3>
                <ckeditor :editor="editor" v-model="publication.instances" :config="editorConfig"></ckeditor>
            </div>

            <div class="body-edit">
                <h3>Computational Experience</h3>
                <ckeditor :editor="editor" v-model="publication.computationalExperience" :config="editorConfig"></ckeditor>
            </div>

            <div class="body-edit">
                <h3>References</h3>
                <ckeditor :editor="editor" v-model="publication.reference" :config="editorConfig"></ckeditor>
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
import axios from 'axios';

export default {
    name: 'CKEditor',
    data() {
        return {
            publication: {
                title: '',
                userName: '',
                organization: '',
                description: '<p>Here can be your description...</p>',
                state: '<p>Here can be your State of the Art Methods...</p>',
                instances: '<p>Here can be your instances...</p>',
                computationalExperience: '<p>Here can be your computational experience...</p>',
                reference: '<p>Here can be your references...</p>'
            },
            initialized: false,
            publicationCopy: {},                
            editor: ClassicEditor,
            editorConfig: ClassicEditor.defaultConfig
        };
    },
    props: {
        isNew: {
            type: Boolean,
            default: true
        }
    },
    created () {
        if (!this.isNew) {
            this.fetchData();
        }
    },
    methods: {
        async savePublication () {
            try {
                if (this.isNew) {
                    const res = await axios.post(`http://localhost:4000/api/publications`,this.publication,{
                        headers: { token: this.$store.state.token}
                    });
                } else {
                    const res = await axios.put(`http://localhost:4000/api/publications/${this.$route.params.publicationId}`,this.publicationCopy,{
                        headers: { token: this.$store.state.token}
                    });
                }
                
                this.$router.push({path: '/'})
            } catch (error) {
                console.log(error)
            }
        },
        async fetchData() {
            const res = await axios.get(`http://localhost:4000/api/publications/${this.$route.params.publicationId}`);
            this.publication = res.data;
            this.$nextTick(() => {
                this.initialized = true;
            })
        },
        updateCopy (valor) {
            this.publicationCopy[valor.target.id] = valor.target.value;
        }
        
    },
    watch: {
        'publication.description': function (newValue){
            if (this.initialized) {
                this.publicationCopy.description = newValue
            }
        },
        'publication.state': function (newValue){
            if (this.initialized) {
                this.publicationCopy.state = newValue
            }            
        },
        'publication.instances': function (newValue){
            if (this.initialized) {
                this.publicationCopy.instances = newValue
            }            
        },
        'publication.computationalExperience': function (newValue){
            if (this.initialized) {
                this.publicationCopy.computationalExperience = newValue
            }            
        },
        'publication.reference': function (newValue){
            if (this.initialized) {
                this.publicationCopy.reference = newValue
            }            
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
</style>