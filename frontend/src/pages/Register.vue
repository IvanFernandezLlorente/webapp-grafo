<template>
  <div class="wrapper">
    <b-row style="margin: 2rem auto;width: 100%;">
        <b-col cols="12">
            <div class="content-img">
                <b-link :to="{path: '/'}"> 
                    <img src="../assets/logo_grafo.png" alt="logo-grafo">
                </b-link>
            </div>
            <b-row style="justify-content: center;">
                <b-col cols="12" md="6" style="max-width: 713px;">
                    <div class="content-box title">
                        <h1>{{ $t('signUp.title') }}</h1>
                        <div class="black-line"></div>
                        <div class="red-line"></div>
                    </div>
                </b-col>
            </b-row>
                    
            <b-row style="justify-content: center;">
                <b-col cols="12" md="6" style="max-width: 713px;">
                    <div class="content-box body">
                        <div class="error-alert" v-if="error">{{error}}</div>
                        <form @submit.prevent="signup">
                            <div class="form-body">
                                <label for="name">{{ $t('signUp.name') }}</label>
                                <input disabled style="background-color: #9ca1a6;" id="name" v-model="application.name" type="text">

                                <label for="email" name="login">{{ $t('signUp.email') }}</label>
                                <input disabled style="background-color: #9ca1a6;" id="email" v-model="application.email" type="text">

                                <label for="password">{{ $t('signUp.pass') }}</label>
                                <input id="password" v-model="password" name="password" :placeholder="$t('signUp.passPHolder')" type="password">
                                <p class="error-msg" v-if="noPass">{{ $t('signUp.passRequired') }}</p>

                                <vue-recaptcha ref="recaptcha"
                                    @verify="onVerify" :sitekey="sitekey">
                                </vue-recaptcha>

                                <input type="submit" name="commit" :value="$t('signUp.button')" :class="[robot ? '' : disabledClass]">
                            </div>
                        </form>
                    </div>
                </b-col>
            </b-row>
        </b-col>
    </b-row>
  </div>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha';

export default {
    name: 'Register',
    
    components: {
        "vue-recaptcha": VueRecaptcha
    },

    data: () => {
        return {
            application: {},
            password: '',
            error: '',
            noPass: false,
            robot: false,
            sitekey: process.env.VUE_APP_SITE_KEY,
            disabledClass: 'disabled'
        }
    },
    created () {
        this.fetchData();
    },
    methods: {
        onVerify(response) {
            if (response) {
                this.robot = true;
            }
        },
        async fetchData() {
            try {
                const res = await this.axios.get(`applications/${this.$route.params.id}`);
                this.application = res.data;
            } catch (error) {
                console.log(error)                
            }
        },
        async signup () {
            try {
                if (this.robot) {
                    this.noPass = this.password ? false : true;
                    if (this.password) {
                        const info = {
                            email: this.application.email,
                            password: this.password,
                            name: this.application.name,
                            token: this.application.token
                        }
                        const res = await this.axios.post("users/signup", info);
                        this.manageSignUp(res.data);
                    }  
                }              
            } catch (error) {
                console.log(error)
                this.error = this.manageError(error.response.data.message);
            }            
        },
        manageSignUp(data) {
            if (data.token) {
                const { token, id, userId, roles } = data;
                const sended = {
                    token, 
                    id, 
                    userId, 
                    isAdmin: roles.includes('admin')
                }
                this.$store.dispatch('signup',sended);
                this.$router.push({path: '/'}).catch(()=>{});
            } else if (data.message) {
                this.error = this.manageError(data.message);
            } else {
                this.error = this.$t('signUp.generalError');
            }
        },
        manageError(error) {
            let errorToReturn;
            switch (error) {
                case 'The email already exists':
                    errorToReturn = this.$t('signUp.emailError');
                    break;
                case 'The email is not accepted':
                    errorToReturn = this.$t('signUp.wrongEmail');
                    break;
                default:
                    errorToReturn = this.$t('signUp.generalError');
            }
            return errorToReturn;
        }
    }
}
</script>

<style scoped src="@/assets/css/register.css">
</style>

