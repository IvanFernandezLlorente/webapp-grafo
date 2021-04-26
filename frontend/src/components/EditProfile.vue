<template>
  <b-row style="justify-content: center;">
      <b-col class="card" cols="8">
        <div class="card-header">
            <h4 class="card-title">{{ $t('settigns.title') }}</h4>
            <b-form-checkbox-group v-if="isAdmin" :disabled='!isAdmin' v-model="selected" :options="options"></b-form-checkbox-group>
        </div>
        <div class="card-body">
            <form @submit.prevent="updateProfile"> 
                <b-row>
                    <b-col cols="3">
                        <div class="form-group">
                            <label for="name" class="control-label">{{ $t('settigns.name') }}</label>
                            <input id="name" v-model="user.name" @change="updateCopy"  class="form-control" type="text" :placeholder="$t('settigns.namePHolder')">
                        </div>
                    </b-col>
                    <b-col cols="5">
                        <div class="form-group">
                            <label for="lastname" class="control-label">Last Name</label>
                            <input id="lastname" class="form-control" type="text" placeholder="Last Name">
                        </div>
                    </b-col>
                    <b-col cols="4">
                        <div class="form-group">
                            <label for="email" class="control-label">{{ $t('settigns.email') }}</label>
                            <input id="email" v-model="user.email"  @change="updateCopy" class="form-control" type="text" :placeholder="$t('settigns.emailPHolder')">
                        </div>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="3">
                        <div class="form-group">
                            <label for="newPassword" class="control-label">{{ $t('settigns.newPassword') }}</label>
                            <input id="newPassword" v-model="newPassword" class="form-control" type="password" :placeholder="$t('settigns.newPassword')">
                        </div>
                    </b-col>
                    <b-col cols="3">
                        <div class="form-group">
                            <label for="confirmPassword" class="control-label">{{ $t('settigns.confirmPassword') }}</label>
                            <input id="confirmPassword" v-model="confirmPassword" class="form-control" type="password" :placeholder="$t('settigns.confirmPassword')">
                        </div>
                    </b-col>
                    <b-col cols="6"> 
                        <div class="form-group">
                            <label for="userId" class="control-label">http://localhost:8080/users/</label>
                            <input id="userId" v-model="user.userId" @change="updateCopy" class="form-control" type="text" :placeholder="$t('settigns.idPHolder')">
                        </div>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="8">
                        <div class="form-group">
                            <label for="organization" class="control-label">{{ $t('settigns.organization') }}</label>
                            <input id="organization" v-model="user.organization" @change="updateCopy" class="form-control" type="text" :placeholder="$t('settigns.organizationPHolder')">
                        </div>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="8">
                        <div class="form-group">
                            <label for="department" class="control-label">{{ $t('settigns.department') }}</label>
                            <input id="department" v-model="user.department" @change="updateCopy" class="form-control" type="text" :placeholder="$t('settigns.departmentPHolder')">
                        </div>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="8">
                        <div class="form-group">
                            <label for="area" class="control-label">{{ $t('settigns.area') }}</label>
                            <input id="area" v-model="user.area" @change="updateCopy" class="form-control" type="text" :placeholder="$t('settigns.areaPHolder')">
                        </div>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="8">
                        <div class="form-group">
                            <label for="researchgroup" class="control-label">{{ $t('settigns.researchGroup') }}</label>
                            <input id="researchgroup" v-model="user.researchgroup" @change="updateCopy" class="form-control" type="text" :placeholder="$t('settigns.researchGroupPHolder')">
                        </div>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="12">
                        <div class="form-group">
                            <label for="description" class="control-label">{{ $t('settigns.description') }}</label>
                            <textarea id="description" v-model="user.description" @change="updateCopy" class="form-control" rows="10" style="height: 20px; min-height: 50px;" :placeholder="$t('settigns.descriptionPHolder')"></textarea>    
                        </div>
                    </b-col>
                </b-row>
                
                <p v-if="errorGoogle">{{errorGoogleText}}</p>
                <button v-if="!(user.google) || ((user.google) && !(user.google.methodId))" type="button" @click="google">{{ $t('settigns.google') }}</button>
                
                <div v-else style="display: flex;">
                    <p>{{user.google.email}}</p>
                    <button type="button" @click="disconnectGoogle">{{ $t('settigns.disconnect') }}</button>
                </div>


                <p v-if="errorGithub">{{errorGithubText}}</p>
                <button v-if="!(user.github) || ((user.github) && !(user.github.methodId))" type="button" @click="github">{{ $t('settigns.github') }}</button>
                
                <div v-else style="display: flex;">
                    <p>{{user.github.name}}</p>
                    <button type="button" @click="disconnectGithub">{{ $t('settigns.disconnect') }}</button>
                </div>

                <p v-if="errorORCID">{{errorORCIDText}}</p>
                <button v-if="!(user.orcid) || ((user.orcid) && !(user.orcid.orcid))" type="button" @click="orcid">{{ $t('settigns.orcid') }}</button>
                
                <div v-else style="display: flex;">
                    <p>https://sandbox.orcid.org/{{user.orcid.orcid}}</p>
                    <button type="button" @click="disconnectORCID">{{ $t('settigns.disconnect') }}</button>
                </div>

                <div class="text-center">
                    <button type="submit" class="btn btn-info float-right">
                        {{ $t('settigns.saveProfile') }}
                    </button>
                </div>
            </form>
        </div>
      </b-col>
      <div class="profile-image">
        <img :src="imgDataUrl">
        <a class="btn btn-info" @click="toggleShow">{{ $t('settigns.uploadPhoto') }}</a>
        <my-upload 
            @crop-success="cropSuccess"
            v-model="show"
            lang-type="en"></my-upload>
      </div>
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
          }
        },
        userCopy: {},
        newPassword: '',
        confirmPassword: '',
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
      }
    },
    components: {
        'my-upload': myUpload
    },
    created () {
        this.fetchData();
    },
    methods: {
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
                if (this.newPassword && this.newPassword===this.confirmPassword) {
                    this.userCopy.password = this.newPassword;
                }
                this.userCopy.roles = this.selected;
                const res = await this.axios.put(`users/${this.$route.params.userId ? this.$route.params.userId : this.$store.state.userId}`,this.userCopy,{
                    headers: { token: this.$store.state.token}
                });
                if (!this.$route.params.userId) {
                    const res = await this.axios.get(`users/token`, {
                        headers: { token: this.$store.state.token}
                    });
                    const { token, id, userId, isAdmin } = res.data;
                    const sended = {
                        token, 
                        id, 
                        userId, 
                        isAdmin
                    }
                    this.$store.dispatch('updateUser',sended);
                    this.$store.dispatch('setStorage');
                }
                this.$router.push({path: '/'})
            } catch (error) {
                console.log(error)                
            }
        },
        updateCopy (valor) {
            this.userCopy[valor.target.id] = valor.target.value
        },
        google(){
            window.open(`https://localhost:3443/api/users/oauth/google/connect/${this.$store.state.userId}/${this.$store.state.token}`,"windowProfile","location=1,status=1,scrollbars=1,width=800,height=800");          
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
            window.open(`https://localhost:3443/api/users/oauth/github/connect/${this.$store.state.userId}/${this.$store.state.token}`,"windowProfile","location=1,status=1,scrollbars=1,width=800,height=800");          
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
            window.open(`https://localhost:3443/api/users/oauth/orcid/connect/${this.$store.state.userId}/${this.$store.state.token}`,"windowProfile","location=1,status=1,scrollbars=1,width=800,height=800");          
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
        
    },
    computed: mapState(['isAdmin']),
}
</script>

<style scoped>
.card {
    border-radius: 4px;
    background-color: #fff;
    margin-bottom: 30px;
}

.card-header{
    padding: 15px 15px 0;
    background-color: #fff;
    border-bottom: none !important;
    display: flex;
    justify-content: space-between;
}

.card-header>h4 {
    margin: 0;
    color: #333;
    font-weight: 300;
}

.control-label {
    font-size: 12px;
    margin-bottom: 5px;
    text-transform: uppercase;
    font-weight: 400;
    color: #9a9a9a;
}

.form-group {
    margin-bottom: 1rem;
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

.profile-image {
    left: 50px;
    position: relative;
}

.profile-image a {
    display: flex;
    margin-top: 10px;
}
</style>