<template>
  <div class="wrapper">
    <b-row style="margin: 2rem auto;">
        <b-col cols="12">
            <div class="content-img">
                <b-link :to="{path: '/'}"> 
                    <img src="../assets/logo_grafo.png" alt="logo-grafo">
                </b-link>
            </div>
            <div class="content-box title">
                <h1>{{ $t('login.title') }}</h1>
                <div class="black-line"></div>
                <div class="red-line"></div>
            </div>
            <div class="content-box body">
                <div class="error-alert" v-if="error">{{error}}</div>
                <form @submit.prevent="login">
                    <div class="form-body">
                        <label for="email" name="login">{{ $t('login.email') }}</label>
                        <input id="email" v-model="email" type="text" :placeholder="$t('login.emailPHolder')">

                        <label for="password" style="margin-top: 15px;">{{ $t('login.pass') }}</label>
                        <input id="password" v-model="password" name="password" :placeholder="$t('login.passPHolder')" type="password">

                        <input type="submit" name="commit" :value="$t('login.button')">
                    </div>
                </form>
            </div>

            <div class="new">
                <p style="margin: 1rem;">{{ $t('login.titleNewPerson') }} <b-link :to="{path: '/request-signUp'}">{{ $t('login.linkNewPerson') }}</b-link>.</p>
            </div>

            <div class="connect-btns">
                <div class="google-btn" @click="google">
                    <div class="google-icon-wrapper">
                        <img class="google-icon" src="../assets/google.svg"/>
                    </div>
                    <p class="btn-text"><b>{{ $t('login.google') }}</b></p>
                </div>
                <div class="github-btn" @click="github">
                    <div class="github-icon-wrapper">
                        <img class="github-icon" src="../assets/github.svg"/>
                    </div>
                    <p class="btn-text"><b>{{ $t('login.github') }}</b></p>
                </div>
                <div class="orcid-btn" @click="orcid">
                    <div class="orcid-icon-wrapper">
                        <img class="orcid-icon" src="../assets/orcid.svg"/>
                    </div>
                    <p class="btn-text"><b>{{ $t('login.orcid') }}</b></p>
                </div>                
            </div>
        </b-col>
    </b-row>        
  </div>
</template>

<script>
export default {
    name: 'Login',
    
    data: () => {
        return {
            email: '',
            password: '',
            error: ''
        }
    },
    methods: {
        async login () {
            try {
                const info = {
                    email: this.email,
                    password: this.password
                }
                const res = await this.axios.post("users/signin", info);
                this.manageSignIn(res.data);
            } catch (error) {
                console.log(error.response.data)
                this.error = this.manageError(error.response.data.message);
            }            
        },
        google(){
            window.open(`https://${this.$hostname}:3443/api/users/oauth/google/signin`,"windowLoginGoogle","location=1,status=1,scrollbars=1,width=800,height=800");
            let listener = window.addEventListener('message', (message) => {
                if ((message.data.method == 'signinGoogle') && (message.data.message)) {
                    this.error = this.manageError(message.data.message);
                } else if ((message.data.token) && (message.data.method == 'signinGoogle')) {
                    this.manageSignIn(message.data);
                }
            });
        },
        github() {
            window.open(`https://${this.$hostname}:3443/api/users/oauth/github/signin`,"windowLoginGithub","location=1,status=1,scrollbars=1,width=800,height=800");
            let listener = window.addEventListener('message', (message) => {
                if ((message.data.method == 'signinGitHub') && (message.data.message)) {
                    this.error = this.manageError(message.data.message);
                } else if ((message.data.token) && (message.data.method == 'signinGitHub')) {
                    this.manageSignIn(message.data);
                }
            });
        },
        orcid() {
            window.open(`https://${this.$hostname}:3443/api/users/oauth/orcid/signin`,"windowLoginORCID","location=1,status=1,scrollbars=1,width=800,height=800");
            let listener = window.addEventListener('message', (message) => {
                if ((message.data.method == 'signinORCID') && (message.data.message)) {
                    this.error = this.manageError(message.data.message);
                } else if ((message.data.token) && (message.data.method == 'signinORCID')) {
                    this.manageSignIn(message.data);
                }
            });
        },
        manageSignIn(data) {
            const { token, id, userId, roles, orcid } = data;
            const sended = {
                token, 
                id, 
                userId, 
                isAdmin: roles.includes('admin'),
                orcid: orcid?.orcid ? orcid.orcid : undefined
            }
            this.$store.dispatch('login',sended);
            this.$store.dispatch('setStorage');
            this.$router.push({path: '/'}).catch(()=>{});
        },
        manageError(error) {
            let errorToReturn;
            switch (error) {
                case 'Email not found':
                    errorToReturn = this.$t('login.emailError');
                    break;
                case 'Invalid password':
                    errorToReturn = this.$t('login.passwordError');
                    break;
                case 'Your account is blocked':
                    errorToReturn = this.$t('login.blockedError');
                    break;
                case 'Account not registered.':
                    errorToReturn = this.$t('login.registeredError');
                    break;
                default:
                    errorToReturn = this.$t('login.generalError');
            }
            return errorToReturn;
        }
    }
}
</script>

<style scoped src="@/assets/css/login.css">
</style>

