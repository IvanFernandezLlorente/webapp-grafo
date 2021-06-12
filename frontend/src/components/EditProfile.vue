<template>
  <b-row style="justify-content: center;">
        <b-col cols="12" class="padding-box">
            <div class="content-box title">
                <h1>{{ $t('settigns.title') }}</h1>
                <div class="black-line"></div>
                <div class="red-line"></div>
            </div>
        </b-col>
        <b-col cols="12" class="padding-box">
            <div class="content-box" style="margin-top: 20px;">
                <div class="body">
                    <div class="choices">
                        <div @click="setChoice(1)" :class="[choice == 1 ? activeClass : '']">{{ $t('settigns.tabProfile') }}</div>
                        <div @click="setChoice(2)" :class="[choice == 2 ? activeClass : '']">{{ $t('settigns.tabPassword') }}</div>
                        <div @click="setChoice(3)" :class="[choice == 3 ? activeClass : '']">{{ $t('settigns.tabAccounts') }}</div>
                        <div @click="setChoice(4)" :class="[choice == 4 ? activeClass : '']">{{ $t('settigns.tabDanger') }}</div>
                        
                    </div>

                    <div v-if="choice == 1">
                        <form @submit.prevent="updateProfile" class="form-data">
                                <b-row>
                                    <b-col cols="12" xl="9" class="data-box">
                                        <b-row>
                                            <b-col cols="12" md="4">
                                                <div class="form-group">
                                                    <label for="name" class="control-label required">{{ $t('settigns.name') }}</label>
                                                    <input id="name" @keydown.enter.prevent='' v-model="user.name" @change="updateCopy"  type="text" :placeholder="$t('settigns.namePHolder')">
                                                </div>
                                            </b-col>
                                            <b-col cols="12" md="4">
                                                <div class="form-group">
                                                    <label for="email" class="control-label required">{{ $t('settigns.email') }}</label>
                                                    <input id="email" @keydown.enter.prevent='' v-model="user.email"  @change="updateCopy" type="text" :placeholder="$t('settigns.emailPHolder')">
                                                </div>
                                            </b-col>
                                            <b-col cols="12" md="4"> 
                                                <div class="form-group">
                                                    <label for="userId" class="control-label required">ID</label>
                                                    <input id="userId" @keydown.enter.prevent='' v-model="user.userId" @change="updateCopy" type="text" :placeholder="$t('settigns.idPHolder')">
                                                </div>
                                            </b-col>
                                        </b-row>

                                        <b-row>
                                            <b-col cols="12" md="6">
                                                <div class="form-group">
                                                    <label for="linkedinUrl" class="control-label">LinkedIn</label>
                                                    <input id="linkedinUrl" @keydown.enter.prevent='' v-model="user.linkedinUrl" @change="updateCopy"  type="text" :placeholder="$t('settigns.linkedinPHolder')">
                                                </div>
                                            </b-col>
                                            <b-col cols="12" md="6">
                                                <div class="form-group">
                                                    <label for="scholarUrl" class="control-label">Scholar</label>
                                                    <input id="scholarUrl" @keydown.enter.prevent='' v-model="user.scholarUrl"  @change="updateCopy" type="text" :placeholder="$t('settigns.scholarPHolder')">
                                                </div>
                                            </b-col>
                                        </b-row>

                                        <b-row>
                                            <b-col cols="12" md="6">
                                                <div class="form-group">
                                                    <label for="organization" class="control-label">{{ $t('settigns.organization') }}</label>
                                                    <input id="organization" @keydown.enter.prevent='' v-model="user.organization" @change="updateCopy" type="text" :placeholder="$t('settigns.organizationPHolder')">
                                                </div>
                                            </b-col>
                                            <b-col cols="12" md="6">
                                                <div class="form-group">
                                                    <label for="department" class="control-label">{{ $t('settigns.department') }}</label>
                                                    <input id="department" @keydown.enter.prevent='' v-model="user.department" @change="updateCopy" type="text" :placeholder="$t('settigns.departmentPHolder')">
                                                </div>
                                            </b-col>
                                        </b-row>

                                        
                                        <b-row>
                                             <b-col cols="12" md="6">
                                                <div class="form-group">
                                                    <label for="researchgroup" class="control-label">{{ $t('settigns.researchGroup') }}</label>
                                                    <input id="researchgroup" @keydown.enter.prevent='' v-model="user.researchgroup" @change="updateCopy" type="text" :placeholder="$t('settigns.researchGroupPHolder')">
                                                </div>
                                            </b-col>
                                            <b-col cols="12" md="6">
                                                <div class="form-group">
                                                    <label for="area" class="control-label">{{ $t('settigns.area') }}</label>
                                                    <input id="area" @keydown.enter.prevent='' v-model="user.area" @change="updateCopy" type="text" :placeholder="$t('settigns.areaPHolder')">
                                                </div>
                                            </b-col>
                                        </b-row>

                                        <b-row>
                                            <b-col cols="12">
                                                <div class="form-group">
                                                    <label for="description" class="control-label">{{ $t('settigns.description') }}</label>
                                                    <textarea id="description" v-model="user.description" @change="updateCopy" rows="10" style="height: 20px; min-height: 50px;" :placeholder="$t('settigns.descriptionPHolder')"></textarea>    
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                    <b-col cols="12" xl="3" class="image-box">
                                        <b-form-checkbox-group v-if="isAdmin" :disabled='!isAdmin' v-model="selected" :options="options" class="admin-selection" style="position: unset;"></b-form-checkbox-group>
                                        <div class="profile-image">
                                            <img v-if="imgDataUrl" :src="imgDataUrl">
                                            <a class="btn btn-image" @click="toggleShow" style="width: 200px;">{{ $t('settigns.uploadPhoto') }}</a>
                                            <my-upload 
                                                @crop-success="cropSuccess"
                                                v-model="show"
                                                lang-type="en"></my-upload>
                                        </div>
                                    </b-col>
                                </b-row>  

                                <p v-if="errorProfile" class="msgResponse-error msgResponse col-md-6 col-xl-4 col-12" style="margin-left: 0;">{{errorProfile}}</p>  
                                <p v-if="updatedProfile" class="msgResponse-success msgResponse col-md-6 col-xl-4 col-12" style="margin-left: 0;">{{updatedProfile}}</p>
                            <input type="submit" name="commit" :value="$t('settigns.saveProfile')">
                        </form>
                    </div>

                    <div v-if="choice == 2">
                        <b-row style="flex-direction: column;margin-top: 3rem;">
                            <form @submit.prevent="updatePassword">
                                <b-col cols="12" md="6" xl="4">
                                    <div class="form-group">
                                        <label for="currentPassword" class="control-label required">{{ $t('settigns.currentPassword') }}</label>
                                        <input id="currentPassword" @keydown.enter.prevent='' v-model="currentPassword" class="form-control" type="password" :placeholder="$t('settigns.currentPassword')">
                                    </div>
                                </b-col>
                                <b-col cols="12" md="6" xl="4">
                                    <div class="form-group">
                                        <label for="newPassword" class="control-label required">{{ $t('settigns.newPassword') }}</label>
                                        <input id="newPassword" @keydown.enter.prevent='' v-model="newPassword" class="form-control" type="password" :placeholder="$t('settigns.newPassword')">
                                    </div>
                                </b-col>
                                <b-col cols="12" md="6" xl="4">
                                    <div class="form-group">
                                        <label for="confirmPassword" class="control-label required">{{ $t('settigns.confirmPassword') }}</label>
                                        <input id="confirmPassword" @keydown.enter.prevent='' v-model="confirmPassword" class="form-control" type="password" :placeholder="$t('settigns.confirmPassword')">
                                    </div>
                                </b-col>
                                <p v-if="errorPassword" class="msgResponse-error msgResponse col-md-6 col-xl-4 col-12">{{errorPassword}}</p>  
                                <p v-if="changedPassword" class="msgResponse-success msgResponse col-md-6 col-xl-4 col-12">{{changedPassword}}</p>
                                <input type="submit" name="commit" :value="$t('settigns.savePassword')" style="margin-left: 15px;margin-top: 4rem;">
                            </form>
                        </b-row>
                    </div>
                    <div v-if="choice == 3">
                        <div class="connect-btns">
                            <div class="account-box">
                                <div class="google-wrapper">
                                    <div class="google-icon-wrapper">
                                        <img class="google-icon" src="../assets/google.svg"/>
                                    </div>
                                </div>

                                <button v-if="!(user.google) || ((user.google) && !(user.google.methodId))" class="google-btn" type="button" @click="google">{{ $t('settigns.google') }}</button>                                                       
                                <div v-else style="display: flex; flex-wrap: wrap;">
                                    <p class="social-text">{{user.google.email}}</p>
                                    <button type="button" class="google-remove-btn" @click="disconnectGoogle">{{ $t('settigns.disconnect') }}</button>
                                </div>  

                                <p v-if="errorGoogle" class="social-text social-text-error">{{errorGoogleText}}</p>    
                            </div>

                            <div class="account-box">
                                <div class="github-icon-wrapper">
                                    <img class="github-icon" src="../assets/github.svg"/>
                                </div>

                                <button v-if="!(user.github) || ((user.github) && !(user.github.methodId))" class="github-btn" type="button" @click="github">{{ $t('settigns.github') }}</button>
                                <div v-else style="display: flex; flex-wrap: wrap;">
                                    <p class="social-text">{{user.github.name}}</p>
                                    <button type="button" class="github-remove-btn" @click="disconnectGithub">{{ $t('settigns.disconnect') }}</button>
                                </div>

                                <p v-if="errorGithub" class="social-text social-text-error">{{errorGithubText}}</p>
                            </div>

                            <div class="account-box">
                                <div class="orcid-icon-wrapper">
                                    <img class="orcid-icon" src="../assets/orcid.svg"/>
                                </div>
        
                                <button v-if="!(user.orcid) || ((user.orcid) && !(user.orcid.orcid))" class="orcid-btn" type="button" @click="orcid">{{ $t('settigns.orcid') }}</button>
                                <div v-else style="display: flex; flex-wrap: wrap;">
                                    <p class="social-text">https://sandbox.orcid.org/{{user.orcid.orcid}}</p>
                                    <button type="button" class="orcid-remove-btn" @click="disconnectORCID">{{ $t('settigns.disconnect') }}</button>
                                </div>

                                <p v-if="errorORCID" class="social-text social-text-error">{{errorORCIDText}}</p>
                            </div>
                        </div>
                    </div>

                    <div v-if="choice == 4" class="danger-btns">
                        <b-button v-b-modal.modal-1 class="delete-btn" > 
                            {{ $t('settigns.delete') }}
                        </b-button>
                        <b-modal id="modal-1" centered @ok="deleteU()">
                            <p class="my-4">{{ $t('settigns.confirmDelete') }}</p>
                        </b-modal>


                        <b-button v-if="isAdmin && !user.banned" v-b-modal.modal-2 class="ban-btn"> 
                                {{ $t('settigns.ban') }}
                        </b-button>
                        <b-modal id="modal-2" centered @ok="banUser()">
                            <p class="my-4">{{ $t('settigns.confirmBan') }}</p>
                        </b-modal>


                        <div v-if="isAdmin && user.banned" @click="allowUser()"> 
                            <button class="btn ban-btn">
                                {{ $t('settigns.allow') }}
                            </button>
                        </div>
                    </div>
                    
                </div>
                
            </div>
        </b-col>
  </b-row>
</template>

<script>
import { mapState } from 'vuex';
import myUpload from 'vue-image-crop-upload';

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
          urjcUrl: '',
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
          banned: false
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
      }
    },
    components: {
        'my-upload': myUpload
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
                const res = await this.axios.get(`users/${this.$route.params.userId ? this.$route.params.userId : this.$store.state.userId}`);
                this.user = res.data;
                this.selected = this.user.roles
                this.imgDataUrl = this.user.imagenProfile ? this.user.imagenProfile : '' 
            } catch (error) {
                console.log(error)                
            }
        },
        async updateProfile () {
            try {
                this.userCopy.roles = this.selected;
                const res = await this.axios.put(`users/${this.$route.params.userId ? this.$route.params.userId : this.$store.state.userId}`,this.userCopy,{
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
                        orcid: orcid?.orcid ? orcid.orcid : undefined
                    }
                    this.$store.dispatch('updateUser',sended);
                    this.$store.dispatch('setStorage');
                }

                if (res.status == 200) {
                    this.errorProfile = '';
                    this.updatedProfile = this.$t('settigns.updatedProfile');
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
            window.open(`https://${this.$hostname}:3443/api/users/oauth/google/connect/${this.$store.state.userId}/${this.$store.state.token}`,"windowProfile","location=1,status=1,scrollbars=1,width=800,height=800");          
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
            const res = await this.axios.put(`users/${this.$route.params.userId ? this.$route.params.userId : this.$store.state.userId}`,this.userCopy,{
                headers: { token: this.$store.state.token}
            });
            delete this.userCopy.google
            this.user = res.data;
        },
        github(){
            window.open(`https://${this.$hostname}:3443/api/users/oauth/github/connect/${this.$store.state.userId}/${this.$store.state.token}`,"windowProfile","location=1,status=1,scrollbars=1,width=800,height=800");          
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
            const res = await this.axios.put(`users/${this.$route.params.userId ? this.$route.params.userId : this.$store.state.userId}`,this.userCopy,{
                headers: { token: this.$store.state.token}
            });
            delete this.userCopy.github;
            this.user = res.data;
        },
        orcid(){
            window.open(`https://${this.$hostname}:3443/api/users/oauth/orcid/connect/${this.$store.state.userId}/${this.$store.state.token}`,"windowProfile","location=1,status=1,scrollbars=1,width=800,height=800");          
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
            const res = await this.axios.put(`users/${this.$route.params.userId ? this.$route.params.userId : this.$store.state.userId}`,this.userCopy,{
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
                const res = await this.axios.post(`users/images/${this.$route.params.userId ? this.$route.params.userId : this.$store.state.userId}`,{ imagenProfile: this.imgDataUrl },{
                    headers: { token: this.$store.state.token}
                });
            } catch (error) {
                console.log(error);
            }
        },
        async deleteU() {
            const res = await this.axios.delete(`users/${this.user.userId}`,{
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
                const res = await this.axios.put(`users/${this.user.userId}`,{ banned: true }, {
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
                const res = await this.axios.put(`users/${this.user.userId}`,{ banned: false }, {
                    headers: { token: this.$store.state.token}
                });
                this.user.banned = res.data.banned;
            } catch (error) {
                console.log(error);
            }
        },
        async updatePassword() {
            try {
                if (this.currentPassword && this.newPassword && this.confirmPassword) {
                    const body = {
                        currentPassword: this.currentPassword,
                        newPassword: this.newPassword
                    }
                    const res = await this.axios.put(`users/password/${this.user.userId}`, body, {
                        headers: { token: this.$store.state.token}
                    });
                    if (res.status == 200) {
                        this.errorPassword = '';
                        this.changedPassword = this.$t('settigns.changedPassword');
                    }
                } else if (this.newPassword != this.confirmPassword) {
                    this.changedPassword = '';
                    this.errorPassword = this.$t('settigns.errorPasswordDifferent');
                } else {
                    this.changedPassword = '';
                    this.errorPassword = this.$t('settigns.errorPasswordIncomplete');
                }
            } catch (error) {
                console.log(error); 
                this.changedPassword = '';
                this.errorPassword = error.response.data.message;
            }
        },
        
    },
    computed: mapState(['isAdmin','id']),
}
</script>

<style scoped src="@/assets/css/editProfile.css">
</style>