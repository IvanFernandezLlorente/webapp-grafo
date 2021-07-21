<template>
  <b-row style="justify-content: center;">
        <b-col cols="12" class="padding-box">
            <div class="content-box title">
                <h1>{{ $t('settings.title') }}</h1>
                <div class="black-line"></div>
                <div class="red-line"></div>
            </div>
        </b-col>
        <b-col cols="12" class="padding-box">
            <div v-if="spin" style="width: 100%;margin-top: 1rem;">
                <div id="preloader" class="content-box" style="height: 550px; position: relative;"></div>
            </div>

            <div class="content-box" v-else style="margin-top: 20px;">
                <div class="body">
                    <div class="choices">
                        <div @click="setChoice(1)" :class="[choice == 1 ? activeClass : '']">{{ $t('settings.tabProfile') }}</div>
                        <div @click="setChoice(2)" :class="[choice == 2 ? activeClass : '']">{{ $t('settings.tabPassword') }}</div>
                        <div @click="setChoice(3)" :class="[choice == 3 ? activeClass : '']">{{ $t('settings.tabAccounts') }}</div>
                        <div @click="setChoice(4)" :class="[choice == 4 ? activeClass : '']">{{ $t('settings.tabDanger') }}</div>
                        <div v-if="isAdmin" @click="setChoice(5)" :class="[choice == 5 ? activeClass : '']">{{ $t('settings.tabTags') }}</div>
                        <div v-if="isAdmin" @click="setChoice(6)" :class="[choice == 6 ? activeClass : '']">{{ $t('settings.webDescription') }}</div>
                        <div v-if="isAdmin" @click="setChoice(7)" :class="[choice == 7 ? activeClass : '']">{{ $t('settings.tabPrivacy') }}</div>
                        <div v-if="isAdmin" @click="setChoice(8)" :class="[choice == 8 ? activeClass : '']">{{ $t('settings.tabAdminPassword') }}</div>
                    </div>

                    <div v-if="choice == 1">
                        <form @submit.prevent="updateProfile" class="form-data">
                                <b-row>
                                    <b-col cols="12" xl="9" class="data-box">
                                        <b-row>
                                            <b-col cols="12" md="4">
                                                <div class="form-group">
                                                    <label for="name" class="control-label required">{{ $t('settings.name') }}</label>
                                                    <input id="name" @keydown.enter.prevent='' v-model="user.name" @change="updateCopy"  type="text" :placeholder="$t('settings.namePHolder')">
                                                </div>
                                            </b-col>
                                            <b-col cols="12" md="4">
                                                <div class="form-group">
                                                    <label for="email" class="control-label required">{{ $t('settings.email') }}</label>
                                                    <input id="email" @keydown.enter.prevent='' v-model="user.email"  @change="updateCopy" type="text" :placeholder="$t('settings.emailPHolder')">
                                                </div>
                                            </b-col>
                                            <b-col cols="12" md="4"> 
                                                <div class="form-group">
                                                    <label for="userId" class="control-label required">{{ $t('settings.idPHolder') }}</label>
                                                    <input id="userId" @keydown.enter.prevent='' v-model="user.userId" @change="updateCopy" type="text" :placeholder="$t('settings.idPHolder')">
                                                </div>
                                            </b-col>
                                        </b-row>

                                        <b-row>
                                            <b-col cols="12" md="6">
                                                <div class="form-group">
                                                    <label for="organization" class="control-label">{{ $t('settings.organization') }}</label>
                                                    <input id="organization" @keydown.enter.prevent='' v-model="user.organization" @change="updateCopy" type="text" :placeholder="$t('settings.organizationPHolder')">
                                                </div>
                                            </b-col>
                                            <b-col cols="12" md="6">
                                                <div class="form-group">
                                                    <label for="department" class="control-label">{{ $t('settings.department') }}</label>
                                                    <input id="department" @keydown.enter.prevent='' v-model="user.department" @change="updateCopy" type="text" :placeholder="$t('settings.departmentPHolder')">
                                                </div>
                                            </b-col>
                                        </b-row>

                                        <b-row>
                                             <b-col cols="12" md="6">
                                                <div class="form-group">
                                                    <label for="researchgroup" class="control-label">{{ $t('settings.researchGroup') }}</label>
                                                    <input id="researchgroup" @keydown.enter.prevent='' v-model="user.researchgroup" @change="updateCopy" type="text" :placeholder="$t('settings.researchGroupPHolder')">
                                                </div>
                                            </b-col>
                                            <b-col cols="12" md="6">
                                                <div class="form-group">
                                                    <label for="area" class="control-label">{{ $t('settings.area') }}</label>
                                                    <input id="area" @keydown.enter.prevent='' v-model="user.area" @change="updateCopy" type="text" :placeholder="$t('settings.areaPHolder')">
                                                </div>
                                            </b-col>
                                        </b-row>


                                        <b-row>
                                            <b-col cols="12" md="6">
                                                <div class="form-group">
                                                    <div>
                                                        <label for="orcidPlainText" class="control-label" style="margin-right: 0.5rem">ORCID</label>
                                                        <button v-b-tooltip.hover.right :title="$t('settings.tooltip')" class="tooltip-button">
                                                            <img src="../assets/question.svg" id="tooltip">
                                                            <span class="tooltiptext">Tooltip text</span>
                                                        </button>
                                                        
                                                    </div>
                                                    <input id="orcidPlainText" @keydown.enter.prevent='' v-model="user.orcidPlainText" @change="updateCopy"  type="text" placeholder="0000-0003-2936-1478">
                                                </div>
                                            </b-col>
                                            <b-col cols="12" md="6">
                                                <div class="form-group">
                                                    <label for="linkedinUrl" class="control-label">LinkedIn</label>
                                                    <input id="linkedinUrl" @keydown.enter.prevent='' v-model="user.linkedinUrl" @change="updateCopy"  type="text" :placeholder="$t('settings.linkedinPHolder')">
                                                </div>
                                            </b-col>
                                            <b-col cols="12" md="6">
                                                <div class="form-group">
                                                    <label for="scholarUrl" class="control-label">Google Scholar</label>
                                                    <input id="scholarUrl" @keydown.enter.prevent='' v-model="user.scholarUrl"  @change="updateCopy" type="text" :placeholder="$t('settings.scholarPHolder')">
                                                </div>
                                            </b-col>
                                            <b-col cols="12" md="6">
                                                <div class="form-group">
                                                    <label for="scopusUrl" class="control-label">Scopus</label>
                                                    <input id="scopusUrl" @keydown.enter.prevent='' v-model="user.scopusUrl" @change="updateCopy"  type="text" :placeholder="$t('settings.scopusPHolder')">
                                                </div>
                                            </b-col>
                                            <b-col cols="12" md="6">
                                                <div class="form-group">
                                                    <label for="publonsUrl" class="control-label">Publons</label>
                                                    <input id="publonsUrl" @keydown.enter.prevent='' v-model="user.publonsUrl" @change="updateCopy"  type="text" :placeholder="$t('settings.publonsPHolder')">
                                                </div>
                                            </b-col>
                                        </b-row>

                                        <b-row>
                                            <b-col cols="12">
                                                <div class="form-group">
                                                    <label for="projects" class="control-label">{{ $t('settings.projects') }}</label>
                                                    <ckeditor :editor="editor" v-model="projects" :config="editorConfig" @ready="prefill()"></ckeditor>
                                                </div>
                                            </b-col>
                                        </b-row>

                                        <b-row>
                                            <b-col cols="12">
                                                <div class="form-group">
                                                    <label for="description" class="control-label">{{ $t('settings.description') }}</label>
                                                    <textarea id="description" v-model="user.description" @change="updateCopy" rows="10" style="height: 20px; min-height: 150px;" :placeholder="$t('settings.descriptionPHolder')"></textarea>    
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                    <b-col cols="12" xl="3" class="image-box">
                                        <div class="profile-image">
                                            <img v-if="imgDataUrl" :src="imgDataUrl">
                                            <a class="btn btn-image" @click="toggleShow" style="width: 200px;">{{ $t('settings.uploadPhoto') }}</a>
                                            <my-upload 
                                                @crop-success="cropSuccess"
                                                v-model="show"
                                                lang-type="en"></my-upload>
                                        </div>
                                        <div class="check-group">
                                            <b-form-checkbox-group v-if="isAdmin" :disabled='!isAdmin' v-model="selected" :options="options" class="admin-selection"></b-form-checkbox-group>
                                            <b-form-checkbox v-if="isAdmin" v-model="user.showPeople" value=true unchecked-value=false style="margin-bottom: 1rem;">{{ $t('settings.showPeople') }}</b-form-checkbox>
                                        </div>
                                    </b-col>
                                </b-row>  

                                <p v-if="errorProfile" class="msgResponse-error msgResponse col-md-6 col-xl-4 col-12" style="margin-left: 0;">{{errorProfile}}</p>  
                                <p v-if="updatedProfile" class="msgResponse-success msgResponse col-md-6 col-xl-4 col-12" style="margin-left: 0;">{{updatedProfile}}</p>
                            <input type="submit" name="commit" :value="$t('settings.saveProfile')">
                        </form>
                    </div>

                    <div v-if="choice == 2">
                        <b-row style="flex-direction: column;margin-top: 3rem;">
                            <form @submit.prevent="updatePassword">
                                <b-col cols="12" md="6" xl="4">
                                    <div class="form-group">
                                        <label for="currentPassword" class="control-label required">{{ $t('settings.currentPassword') }}</label>
                                        <input id="currentPassword" @keydown.enter.prevent='' v-model="currentPassword" class="form-control" type="password" :placeholder="$t('settings.currentPassword')">
                                    </div>
                                </b-col>
                                <b-col cols="12" md="6" xl="4">
                                    <div class="form-group">
                                        <label for="newPassword" class="control-label required">{{ $t('settings.newPassword') }}</label>
                                        <input id="newPassword" @keydown.enter.prevent='' v-model="newPassword" class="form-control" type="password" :placeholder="$t('settings.newPassword')">
                                    </div>
                                </b-col>
                                <b-col cols="12" md="6" xl="4">
                                    <div class="form-group">
                                        <label for="confirmPassword" class="control-label required">{{ $t('settings.confirmPassword') }}</label>
                                        <input id="confirmPassword" @keydown.enter.prevent='' v-model="confirmPassword" class="form-control" type="password" :placeholder="$t('settings.confirmPassword')">
                                    </div>
                                </b-col>
                                <p v-if="errorPassword" class="msgResponse-error msgResponse col-md-6 col-xl-4 col-12">{{errorPassword}}</p>  
                                <p v-if="changedPassword" class="msgResponse-success msgResponse col-md-6 col-xl-4 col-12">{{changedPassword}}</p>
                                <input type="submit" name="commit" :value="$t('settings.savePassword')" style="margin-left: 15px;margin-top: 4rem;">
                            </form>
                        </b-row>
                    </div>
                    <div v-if="choice == 3">
                        <p>{{ $t('settings.explainText') }}</p>
                        <div class="connect-btns">
                            <div class="account-box">
                                <div class="google-wrapper">
                                    <div class="google-icon-wrapper">
                                        <img class="google-icon" src="../assets/google.svg"/>
                                    </div>
                                </div>

                                <button v-if="!(user.google) || ((user.google) && !(user.google.methodId))" class="google-btn" type="button" @click="google">{{ $t('settings.google') }}</button>                                                       
                                <div v-else style="display: flex; flex-wrap: wrap;">
                                    <p class="social-text">{{user.google.email}}</p>
                                    <button type="button" class="google-remove-btn" @click="disconnectGoogle">{{ $t('settings.disconnect') }}</button>
                                </div>  

                                <p v-if="errorGoogle" class="social-text social-text-error">{{errorGoogleText}}</p>    
                            </div>

                            <div class="account-box">
                                <div class="github-icon-wrapper">
                                    <img class="github-icon" src="../assets/github.svg"/>
                                </div>

                                <button v-if="!(user.github) || ((user.github) && !(user.github.methodId))" class="github-btn" type="button" @click="github">{{ $t('settings.github') }}</button>
                                <div v-else style="display: flex; flex-wrap: wrap;">
                                    <p class="social-text">{{user.github.name}}</p>
                                    <button type="button" class="github-remove-btn" @click="disconnectGithub">{{ $t('settings.disconnect') }}</button>
                                </div>

                                <p v-if="errorGithub" class="social-text social-text-error">{{errorGithubText}}</p>
                            </div>

                            <div class="account-box">
                                <div class="orcid-icon-wrapper">
                                    <img class="orcid-icon" src="../assets/orcid.svg"/>
                                </div>
        
                                <button disabled v-if="!(user.orcid) || ((user.orcid) && !(user.orcid.orcid))" class="orcid-btn" type="button" @click="orcid" style="cursor: no-drop;">{{ $t('settings.orcid') }}</button>
                                <div v-else style="display: flex; flex-wrap: wrap;">
                                    <p class="social-text">https://sandbox.orcid.org/{{user.orcid.orcid}}</p>
                                    <button type="button" class="orcid-remove-btn" @click="disconnectORCID">{{ $t('settings.disconnect') }}</button>
                                </div>

                                <p v-if="errorORCID" class="social-text social-text-error">{{errorORCIDText}}</p>
                            </div>
                        </div>
                    </div>

                    <div v-if="choice == 4" class="danger-btns">
                        <b-button v-b-modal.modal-1 class="delete-btn" > 
                            {{ $t('settings.delete') }}
                        </b-button>
                        <b-modal id="modal-1" centered @ok="deleteU()">
                            <p class="my-4">{{ $t('settings.confirmDelete') }}</p>
                        </b-modal>


                        <b-button v-if="isAdmin && !user.banned" v-b-modal.modal-2 class="ban-btn"> 
                                {{ $t('settings.ban') }}
                        </b-button>
                        <b-modal id="modal-2" centered @ok="banUser()">
                            <p class="my-4">{{ $t('settings.confirmBan') }}</p>
                        </b-modal>


                        <div v-if="isAdmin && user.banned" @click="allowUser()"> 
                            <button class="btn ban-btn">
                                {{ $t('settings.allow') }}
                            </button>
                        </div>
                    </div>

                    <div v-if="(choice == 5) && isAdmin" class="tags">
                        <div class="add-tags">
                            <div style="display: flex;">
                                <h4 class="subtitle" style="margin-right: 0.5rem;">{{ $t('settings.addTagsTitle') }}</h4>
                                <button v-b-tooltip.hover.right :title="$t('settings.tooltipTags')" class="tooltip-button">
                                    <img src="../assets/question.svg" id="tooltip">
                                    <span class="tooltiptext">Tooltip text</span>
                                </button>
                            </div>
                            <p>{{ $t('settings.newTagsText') }}</p>
                            <tags-input v-model="newTags" :existing-tags="tags" :typeahead="true" :typeahead-max-results=10 :placeholder="$t('settings.tagsPHolder')"></tags-input>
                            
                            <button class="delete-tags-button" @click="createTags"> 
                                {{ $t('settings.createTags') }}
                            </button>
                            <p v-if="errorMsgTagNew" class="msgResponse-error msgResponse col-md-6 col-xl-4 col-12">{{errorMsgTagNew}}</p>  
                            <p v-if="msgTagNew" class="msgResponse-success msgResponse col-md-6 col-xl-4 col-12">{{msgTagNew}}</p>
                        </div>

                        <div class="delete-tags"> 
                            <h4 class="subtitle">{{ $t('settings.deleteTagsTitle') }}</h4>
                            <p>{{ $t('settings.deleteTagsText') }}</p>
                            <v-multiselect-listbox :options="tags"
                                :reduce-display-property="(option) => option.value"
                                :reduce-value-property="(option) => option.key"
                                v-model="selectedTags"
                                :search-options-placeholder="$t('settings.searchTags')"
                                :selected-options-placeholder="$t('settings.searchTagsDelete')"
                                :selected-no-options-text="$t('settings.searchNoTags')">
                            </v-multiselect-listbox>
                            <button class="delete-tags-button" @click="deleteTags"> 
                                {{ $t('settings.deleteTags') }}
                            </button>
                            <p v-if="errorMsgTagDelete" class="msgResponse-error msgResponse col-md-6 col-xl-4 col-12">{{errorMsgTagDelete}}</p>  
                            <p v-if="msgTagDelete" class="msgResponse-success msgResponse col-md-6 col-xl-4 col-12">{{msgTagDelete}}</p>
                        </div>
                    </div>
                    
                    <div v-if="(choice == 6) && isAdmin">
                        <form @submit.prevent="updateDescription" class="form-data">
                            <b-row>
                                <b-col cols="12">
                                    <div class="form-group">
                                        <label for="webDescriptionEN" class="control-label">{{ $t('settings.webDescriptionEN') }}</label>
                                        <ckeditor :editor="editor" v-model="description.en" :config="editorConfig"></ckeditor>
                                    </div>
                                </b-col>
                            </b-row>
                            <b-row style="margin-top: 4rem;">
                                <b-col cols="12">
                                    <div class="form-group">
                                        <label for="webDescriptionES" class="control-label">{{ $t('settings.webDescriptionES') }}</label>
                                        <ckeditor :editor="editor" v-model="description.es" :config="editorConfig"></ckeditor>
                                    </div>
                                </b-col>
                            </b-row>
                            <input type="submit" name="commit" :value="$t('settings.updateDescription')" style="margin-left: 15px;margin-top: 4rem;">
                        </form>
                    </div>

                    <div v-if="(choice == 7) && isAdmin">
                        <form @submit.prevent="updatePrivacy" class="form-data">
                            <b-row>
                                <b-col cols="12">
                                    <div class="form-group">
                                        <label for="privacyEN" class="control-label">{{ $t('settings.privacyEN') }}</label>
                                        <ckeditor :editor="editor" v-model="privacy.en" :config="editorConfig"></ckeditor>
                                    </div>
                                </b-col>
                            </b-row>
                            <b-row style="margin-top: 4rem;">
                                <b-col cols="12">
                                    <div class="form-group">
                                        <label for="privacyES" class="control-label">{{ $t('settings.privacyES') }}</label>
                                        <ckeditor :editor="editor" v-model="privacy.es" :config="editorConfig"></ckeditor>
                                    </div>
                                </b-col>
                            </b-row>
                            <input type="submit" name="commit" :value="$t('settings.updatePrivacy')" style="margin-left: 15px;margin-top: 4rem;">
                        </form>
                    </div>

                    <div v-if="choice == 8">
                        <b-row style="flex-direction: column;margin-top: 3rem;">
                            <form @submit.prevent="updatePasswordAdmin">
                                <b-col cols="12" md="6" xl="4">
                                    <div class="form-group">
                                        <label for="newPassword" class="control-label required">{{ $t('settings.newPassword') }}</label>
                                        <input id="newPassword" @keydown.enter.prevent='' v-model="newPassword" class="form-control" type="password" :placeholder="$t('settings.newPassword')">
                                    </div>
                                </b-col>
                                <b-col cols="12" md="6" xl="4">
                                    <div class="form-group">
                                        <label for="confirmPassword" class="control-label required">{{ $t('settings.confirmPassword') }}</label>
                                        <input id="confirmPassword" @keydown.enter.prevent='' v-model="confirmPassword" class="form-control" type="password" :placeholder="$t('settings.confirmPassword')">
                                    </div>
                                </b-col>
                                <p v-if="errorPassword" class="msgResponse-error msgResponse col-md-6 col-xl-4 col-12">{{errorPassword}}</p>  
                                <p v-if="changedPassword" class="msgResponse-success msgResponse col-md-6 col-xl-4 col-12">{{changedPassword}}</p>
                                <input type="submit" name="commit" :value="$t('settings.savePassword')" style="margin-left: 15px;margin-top: 4rem;">
                            </form>
                        </b-row>
                    </div>
                </div>
                
            </div>
        </b-col>
  </b-row>
</template>

<script>
import { mapState } from 'vuex';
import myUpload from 'vue-image-crop-upload';
import ClassicEditor from '../ckeditor';
import vMultiselectListbox from 'vue-multiselect-listbox';
import 'vue-multiselect-listbox/dist/vue-multi-select-listbox.css';
import VoerroTagsInput from '@voerro/vue-tagsinput';

export default {
    name:'EditProfile',

    data () {
      return {
        user: {
          name: '',
          email: '',
          userId: '',
          area: '',
          department: '',
          organization: '',
          researchgroup: '',
          description: '',
          linkedinUrl: '',
          scholarUrl: '',
          scopusUrl: '',
          projects: '',
          google: {
                methodId: '',
                email: ''
          },
          github: {
                methodId: '',
                name: ''
          },
          orcid: {
                orcid: '',
                name: ''
          },
          banned: false,
          orcidPlainText: '',
          showPeople: true,
          projects: ''
        },
        userCopy: {},
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        errorPassword: '',
        changedPassword: '',
        errorProfile: '',
        updatedProfile: '',
        selected: [],
        options: [
            { text: 'Admin', value: 'admin' }
        ],
        errorGoogle: false,
        errorGoogleText: '',
        errorGithub: false,
        errorGithubText: '',
        errorORCID: false,
        errorORCIDText: '',
        show: false,
        imgDataUrl: '',
        choice: 1,
        activeClass: 'active',
        url: '',
        editor: ClassicEditor,
        editorConfig: ClassicEditor.defaultConfig,
        projects: '',
        ckeditorReady: false,
        tags: [],
        tagsFetched: false,
        selectedTags: [],
        newTags: [],
        msgTagDelete: '',
        errorMsgTagDelete: '',
        msgTagNew: '',
        errorMsgTagNew: '',
        description: {
            type: 'description',
            en: '',
            es: ''
        },
        privacy: {
            type: 'privacy',
            en: '',
            es: ''
        },
        spin: false
      }
    },
    components: {
        'my-upload': myUpload,
        'v-multiselect-listbox': vMultiselectListbox,
        "tags-input": VoerroTagsInput
    },
    async created () {
        this.restartData();
        this.url = this.$route.params.userId ? this.$route.params.userId : this.$store.state.userId;
        await this.fetchData();
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

                if (this.ckeditorReady) {
                    this.projects = this.user.projects
                }
                this.selected = this.user.roles
                this.imgDataUrl = this.user.imagenProfile ? this.user.imagenProfile : '' 

                if (this.isAdmin) {
                    const resDescription = await this.axios.get(`texts/description`);
                    if((resDescription.data) && (Object.keys(resDescription.data).length !== 0)){
                        this.description = resDescription.data;
                    }

                    const resPrivacy = await this.axios.get(`texts/privacy`);
                    if((resPrivacy.data) && (Object.keys(resPrivacy.data).length !== 0)){
                        this.privacy = resPrivacy.data;
                    }
                }
                this.spin = false;                
            } catch (error) {
                console.log(error);
                this.spin = false;                
            }
        },
        async updateProfile () {
            try {
                this.userCopy.roles = this.selected;
                this.userCopy.showPeople = this.user.showPeople;
                this.userCopy.projects = this.projects;

                const res = await this.axios.put(`users/${this.url}`,this.userCopy,{
                    headers: { token: this.$store.state.token}
                });
                if (!this.$route.params.userId) {
                    const res = await this.axios.get(`users/token`, {
                        headers: { token: this.$store.state.token}
                    });
                    const { token, id, userId, roles, orcid } = res.data;
                    const sended = {
                        token, 
                        id, 
                        userId, 
                        isAdmin: roles.includes('admin'),
                        // orcid: orcid?.orcid ? orcid.orcid : undefined
                        orcid
                    }
                    this.$store.dispatch('updateUser',sended);
                    this.$store.dispatch('setStorage');
                    this.url = this.$store.state.userId;
                }

                if (res.status == 200) {
                    this.errorProfile = '';
                    this.updatedProfile = this.$t('settings.updatedProfile');
                }
            } catch (error) {
                console.log(error);
                this.updatedProfile = '';
                this.errorProfile = error.response.data.message;
            }
        },
        updateCopy (valor) {
            this.userCopy[valor.target.id] = valor.target.value
        },
        google(){
            window.open(`https://${this.$hostname}/api/users/oauth/google/connect/${this.$store.state.userId}/${this.$store.state.token}`,"windowProfile","location=1,status=1,scrollbars=1,width=800,height=800");          
            let listener = window.addEventListener('message', (message) => {
                if ((message.data.method == 'connectGoogle') && (message.data.message)) {
                    this.errorGoogle = true; 
                    this.errorGoogleText = message.data.message;
                } else if ((message.data.user) && (message.data.user.method == 'connectGoogle')) {
                    this.user = message.data.user.user;
                }
            });
            
        },
        async disconnectGoogle() {
            this.userCopy.roles = this.selected;
            this.userCopy.google = { name: '', email: '', methodId: '' };
            const res = await this.axios.put(`users/${this.url}`,this.userCopy,{
                headers: { token: this.$store.state.token}
            });
            delete this.userCopy.google
            this.user = res.data;
        },
        github(){
            window.open(`https://${this.$hostname}/api/users/oauth/github/connect/${this.$store.state.userId}/${this.$store.state.token}`,"windowProfile","location=1,status=1,scrollbars=1,width=800,height=800");          
            let listener = window.addEventListener('message', (message) => {
                if ((message.data.method == 'connectGithub') && (message.data.message)) {
                    this.errorGithub = true; 
                    this.errorGithubText = message.data.message;
                } else if ((message.data.user) && (message.data.user.method == 'connectGithub')) {
                    this.user = message.data.user.user;
                }
            });
            
        },
        async disconnectGithub() {
            this.userCopy.roles = this.selected;
            this.userCopy.github = { name: '', methodId: '' };
            const res = await this.axios.put(`users/${this.url}`,this.userCopy,{
                headers: { token: this.$store.state.token}
            });
            delete this.userCopy.github;
            this.user = res.data;
        },
        orcid(){
            window.open(`https://${this.$hostname}/api/users/oauth/orcid/connect/${this.$store.state.userId}/${this.$store.state.token}`,"windowProfile","location=1,status=1,scrollbars=1,width=800,height=800");          
            let listener = window.addEventListener('message', (message) => {
                if ((message.data.method == 'connectORCID') && (message.data.message)) {
                    this.errorORCID = true; 
                    this.errorORCIDText = message.data.message;
                } else if ((message.data.user) && (message.data.user.method == 'connectORCID')) {
                    this.user = message.data.user.user;
                    this.$store.dispatch('updateOrcid', message.data.user.user.orcid.orcid);
                    this.$store.dispatch('setStorage');
                }
            });
            
        },
        async disconnectORCID() {
            this.userCopy.roles = this.selected;
            this.userCopy.orcid = { name: '', orcid: '' };
            const res = await this.axios.put(`users/${this.url}`,this.userCopy,{
                headers: { token: this.$store.state.token}
            });
            delete this.userCopy.orcid;
            this.user = res.data;
            this.$store.dispatch('updateOrcid', undefined);
            this.$store.dispatch('setStorage');
        },
        toggleShow() {
            this.show = !this.show;
        },
        async cropSuccess(imgDataUrl, field){
            this.imgDataUrl = imgDataUrl;
            try {
                const res = await this.axios.post(`users/images/${this.url}`,{ imagenProfile: this.imgDataUrl },{
                    headers: { token: this.$store.state.token}
                });
            } catch (error) {
                console.log(error);
            }
        },
        async deleteU() {
            const res = await this.axios.delete(`users/${this.url}`,{
                headers: { token: this.$store.state.token}
            });
            if (this.user._id === this.id) {
                this.$store.dispatch('deleteStorage');
                this.$store.dispatch('logout');
                this.$router.push({path: '/login'})                
            } else {
               this.$router.push({path: '/'})
            }
        },
        async banUser() {
            try {
                const res = await this.axios.put(`users/${this.url}`,{ banned: true }, {
                    headers: { token: this.$store.state.token}
                });
                if (this.user._id === this.id) {
                    this.$store.dispatch('deleteStorage');
                    this.$store.dispatch('logout');
                    this.$router.push({path: '/login'})                
                } else {
                    this.user.banned = res.data.banned;
                }
            } catch (error) {
                console.log(error);
            }      
        },
        async allowUser() {
            try {
                const res = await this.axios.put(`users/${this.url}`,{ banned: false }, {
                    headers: { token: this.$store.state.token}
                });
                this.user.banned = res.data.banned;
            } catch (error) {
                console.log(error);
            }
        },
        async updatePassword() {
            try {
                if (this.newPassword != this.confirmPassword) {
                    this.changedPassword = '';
                    this.errorPassword = this.$t('settings.errorPasswordDifferent');
                } else if (this.currentPassword && this.newPassword && this.confirmPassword) {
                    const body = {
                        currentPassword: this.currentPassword,
                        newPassword: this.newPassword
                    }
                    const res = await this.axios.put(`users/password/${this.url}`, body, {
                        headers: { token: this.$store.state.token}
                    });
                    if (res.status == 200) {
                        this.errorPassword = '';
                        this.changedPassword = this.$t('settings.changedPassword');
                        this.currentPassword = '';
                        this.newPassword = '';
                        this.confirmPassword = '';
                    }
                } else {
                    this.changedPassword = '';
                    this.errorPassword = this.$t('settings.errorPasswordIncomplete');
                }
            } catch (error) {
                console.log(error); 
                this.changedPassword = '';
                this.errorPassword = error.response.data.message;
            }
        },
        async updatePasswordAdmin() {
            try {
                if (this.newPassword != this.confirmPassword) {
                    this.changedPassword = '';
                    this.errorPassword = this.$t('settings.errorPasswordDifferent');
                } else if (this.newPassword && this.confirmPassword) {
                    const res = await this.axios.put(`users/password/${this.url}`, { newPassword: this.newPassword }, {
                        headers: { token: this.$store.state.token}
                    });
                    if (res.status == 200) {
                        this.errorPassword = '';
                        this.changedPassword = this.$t('settings.changedPassword');
                        this.newPassword = '';
                        this.confirmPassword = '';
                    }
                } else {
                    this.changedPassword = '';
                    this.errorPassword = this.$t('settings.errorPasswordIncomplete');
                }
            } catch (error) {
                console.log(error); 
                this.changedPassword = '';
                this.errorPassword = error.response.data.message;
            }
        },
        restartData() {
            this.userCopy = {};
            this.currentPassword = ''
            this.newPassword = ''
            this.confirmPassword = ''
            this.errorPassword = ''
            this.changedPassword = ''
            this.errorProfile = ''
            this.updatedProfile = ''
            this.errorGoogle = false
            this.errorGoogleText = ''
            this.errorGithub = false
            this.errorGithubText = ''
            this.errorORCID = false
            this.errorORCIDText = ''
            this.choice = 1
            this.activeClass = 'active'
            this.projects = ''
            this.ckeditorReady = false
        },     
        prefill(editor) {
			this.projects = this.user.projects;
            this.ckeditorReady = true;
		},
        async fetchTags() {
            const res = await this.axios.get(`tags`);
            this.tags = res.data;
            this.tagsFetched = true;
        },   
        async deleteTags() {
            try {
                const promises = [];
                this.selectedTags.forEach(key => {
                    promises.push(this.axios.delete(`tags/${key}`,{
                        headers: { token: this.$store.state.token}
                    }));
                });
                
                await Promise.all(promises);
                this.selectedTags = [];
                this.errorMsgTagDelete = '';
                this.msgTagDelete = this.$t('settings.msgTagsDelete');
                await this.fetchTags();
            } catch (error) {
                console.log(error);
                this.msgTagDelete = '';
                this.errorMsgTagDelete = 'Error';
            }
        },
        async createTags() {
            try {
                const newTagsToCreate = [];
                this.newTags.forEach(tagObject => {
                    if (!tagObject.key) {
                        tagObject.key = tagObject.value.split(" ").join("-").toLowerCase();
                        newTagsToCreate.push(tagObject);
                    }
                });

                if (newTagsToCreate.length !== 0) {
                    await this.axios.post(`tags`, newTagsToCreate, {
                        headers: { token: this.$store.state.token}
                    });
                }

                this.newTags = [];
                this.errorMsgTagNew = '';
                this.msgTagNew = this.$t('settings.msgTagsNew');
                await this.fetchTags();
            } catch (error) {
                console.log(error);
                this.msgTagNew = '';
                this.errorMsgTagNew = 'Error';
            }
        },
        async updateDescription() {
            try {
                const res = await this.axios.put(`texts/description`, this.description, {
                    headers: { token: this.$store.state.token}
                });
                this.$router.push({path: '/'})
            } catch (error) {
                console.log(error);
            }
        },
        async updatePrivacy() {
            try {
                const res = await this.axios.put(`texts/privacy`, this.privacy, {
                    headers: { token: this.$store.state.token}
                });
                this.$router.push({path: '/privacy'})
            } catch (error) {
                console.log(error);
            }
        }
    },
    watch: {
        async choice(newIndex) {
            if ((newIndex === 5) && !this.tagsFetched ) {
                await this.fetchTags();
            }
        }
    },
    computed: mapState(['isAdmin','id']),

    beforeRouteLeave(to, from, next) {
        if ((to.path == "/settings") || (to.path.startsWith("/admin/edit-profile"))) {
            this.url = to.params.userId ? to.params.userId : this.$store.state.userId;;
            this.restartData();
            this.fetchData();
        }
        next();
    }
}
</script>

<style scoped src="@/assets/css/editProfile.css">
</style>