<template>
    <b-row style="justify-content: center;">
        <b-col cols="12" class="padding-box">
            <div class="content-box title">
                <h1>{{ $t('adminRegister.title') }}</h1>
                <div class="black-line"></div>
                <div class="red-line"></div>
            </div>
        </b-col>

        <b-col cols="12" xl="7">
            <div class="content-box body">
                <div class="error-alert" v-if="error">{{errorMessage}}</div>
                <form @submit.prevent="checkForm">
                    <div class="form-body">
                        <b-row>
                            <b-col cols="12" md="6">
                                <label for="email" class="required" name="login">{{ $t('adminRegister.email') }}</label>
                                <input id="email" v-model="email" type="text" :placeholder="$t('adminRegister.emailPHolder')">
                                <p class="error-msg" v-if="errorEmail">{{ $t('adminRegister.emailRequired') }}</p>
                            </b-col>
                            <b-col cols="12" md="6">
                                <label for="name" class="required" name="name">{{ $t('adminRegister.name') }}</label>
                                <input id="name" v-model="name" type="text" :placeholder="$t('adminRegister.namePHolder')">
                                <p class="error-msg" v-if="errorName">{{ $t('adminRegister.nameRequired') }}</p>
                            </b-col>
                            <b-col cols="12" md="6">
                                <label for="password" class="required" >{{ $t('adminRegister.pass') }}</label>
                                <input id="password" v-model="password" type="password" :placeholder="$t('adminRegister.passPHolder')">
                                <p class="error-msg" v-if="errorPass">{{ $t('adminRegister.passRequired') }}</p>
                            </b-col>
                        </b-row>
                        
                        <input type="submit" name="commit" :value="$t('adminRegister.button')">
                    </div>
                </form>
            </div>
        </b-col>
    </b-row>
</template>

<script>

export default {
    name: 'AdminRegister',

    data: () => {
        return {
            email: '',
            name: '',
            password: '',
            errorName: false,
            errorEmail: false,
            errorPass: false,
            error: false,
            errorMessage: '',
        }
    },
    methods: {
        async request () {
            try {
                const info = {
                    email: this.email,
                    name: this.name,
                    password: this.password
                }
                const res = await this.axios.post(`users/admin/signup`, info, {
                    headers: { token: this.$store.state.token}
                });
                if (res.status == 200) {
                    this.error = false;
                }
                this.$router.push({path: `/profile/${res.data.userId}`});
            } catch (error) {
                this.error = true
                this.errorMessage = error.response.data.message ? error.response.data.message : 'Error';
            }            
        },
        checkForm(){
            this.errorName = this.name ? false : true;
            this.errorEmail = this.email ? false : true;
            this.errorPass = this.password ? false : true;

            if (!((this.errorName) || (this.errorEmail) || (this.errorPass))) {
                this.request();
            }
        }
    }
}
</script>

<style scoped src="@/assets/css/adminRegister.css">
</style>