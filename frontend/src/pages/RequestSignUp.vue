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
                <b-col cols="12" sm="12" md="6" xl="5">
                    <div class="content-box title">
                        <h1>{{ $t('requestSignUp.title') }}</h1>
                        <div class="black-line"></div>
                        <div class="red-line"></div>
                    </div>
                </b-col>
            </b-row>
            
            <b-row style="justify-content: center;">
                <b-col cols="12" xl="7">
                    <div class="content-box body">
                        <div class="error-alert" v-if="error">{{errorMessage}}</div>
                        <form @submit.prevent="checkForm">
                            <div class="form-body">
                                <b-row>
                                    <b-col cols="12" md="6">
                                        <label for="email" class="required" name="login">{{ $t('requestSignUp.email') }}</label>
                                        <input :disabled="submitedApplication" :class="{'disable-input': submitedApplication}" id="email" v-model="email" type="text" :placeholder="$t('requestSignUp.emailPHolder')">
                                        <p class="error-msg" v-if="errorEmail">{{ $t('requestSignUp.emailRequired') }}</p>
                                        <p class="error-msg" v-if="wrongEmail">{{ $t('requestSignUp.wrongEmail') }}</p>
                                    </b-col>
                                    <b-col cols="12" md="6">
                                        <label for="name" class="required" name="name">{{ $t('requestSignUp.name') }}</label>
                                        <input :disabled="submitedApplication" :class="{'disable-input': submitedApplication}" id="name" v-model="name" :placeholder="$t('requestSignUp.namePHolder')" type="text">
                                        <p class="error-msg" v-if="errorName">{{ $t('requestSignUp.nameRequired') }}</p>
                                    </b-col>
                                </b-row>
                                

                                <label for="description" class="control-label">{{ $t('requestSignUp.description') }}</label>
                                <textarea :disabled="submitedApplication" id="description" v-model="description" :class="{'disable-input': submitedApplication}" class="form-control" rows="10" style="height: 20px; min-height: 140px;" :placeholder="$t('requestSignUp.descriptionPHolder')"></textarea>    
                                
                                <div class="success-msg" v-if="submitedApplication">{{ $t('requestSignUp.successmsg') }}</div>

                                <vue-recaptcha ref="recaptcha"
                                    @verify="onVerify" :sitekey="sitekey">
                                </vue-recaptcha>

                                <input type="submit" name="commit" :disabled="submitedApplication" :class="{'disable-input': submitedApplication, 'disabledClass': !robot}" :value="$t('requestSignUp.button')">
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
    name: 'RequestSignUp',
    
    components: {
        "vue-recaptcha": VueRecaptcha
    },

    data: () => {
        return {
            email: '',
            name: '',
            description: '',
            submitedApplication: false,
            error: false,
            errorMessage: '',
            errorName: false,
            errorEmail: false,
            wrongEmail: false,
            robot: false,
            sitekey: process.env.VUE_APP_SITE_KEY,
        }
    },
    methods: {
        onVerify(response) {
            if (response) {
                this.robot = true;
            }
        },
        async request () {
            try {
                const info = {
                    email: this.email,
                    name: this.name,
                    description: this.description
                }
                const res = await this.axios.post("applications", info);
                if (res.status == 200) {
                    this.error = false
                    this.submitedApplication = true
                }
            } catch (error) {
                this.error = true
                this.errorMessage = error.response.data.message ? this.manageError(error.response.data.message) : this.$t('requestSignUp.generalError');
            }            
        },
        checkForm(){
            if (this.robot) {
                this.errorName = this.name ? false : true;
                this.errorEmail = this.email ? false : true;
                this.wrongEmail = (this.email) ? (this.validEmail(this.email)) ? false : true : false;

                if (!((this.errorName) || (this.errorEmail) || (this.wrongEmail))) {
                    this.request();
                }
            }
        },
        validEmail(email) {
            const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regex.test(email);
        },
        manageError(error) {
            let errorToReturn;
            switch (error) {
                case 'The email already exists':
                    errorToReturn = this.$t('requestSignUp.emailError');
                    break;
                case 'The email already sent a request':
                    errorToReturn = this.$t('requestSignUp.emailRequested');
                    break;
                default:
                    errorToReturn = this.$t('requestSignUp.generalError');
            }
            return errorToReturn;
        }
    }
}
</script>

<style scoped src="@/assets/css/requestSignUp.css">
</style>

