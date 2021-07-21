<template>
    <b-row style="justify-content: center;">
        <b-col cols="12" class="padding-box">
            <div class="content-box title">
                <h1>{{ $t('admin.title') }}</h1>
                <div class="black-line"></div>
                <div class="red-line"></div>
            </div>
        </b-col>

        <div class="padding-box" v-if="spin" style="width: 100%;margin-top: 1rem;">
            <div id="preloader" class="content-box" style="height: 550px; position: relative;"></div>
        </div>


        <b-row v-else class="body padding-box">
            <b-col cols="12" xl="3" class="content-box choices-box">
                <div class="choices">
                    <div @click="setChoice(1)" :class="[choice == 1 ? activeClass : '']">{{ $t('admin.people') }}</div>
                    <div  @click="setChoice(2)" :class="[choice == 2 ? activeClass : '']">{{ $t('admin.register') }}</div>    
                </div>
            </b-col>
            <b-col cols="12" xl="9" class="info-box">
                <div v-if="choice == 1">
                    <div class="person-box" v-for="(person,index) in people" :key="index">
                        <div class="content-box">
                            <b-link class="nav-link" :to="{path: `/profile/${person.userId}`}">
                                <img v-if="person.imagenProfile" :src="person.imagenProfile" class="image-person">
                                <img v-else src="../assets/blank-person.jpg" class="image-person">
                            </b-link>

                            <b-link :to="{path: `/profile/${person.userId}`}">
                                <div class="name">{{ person.name }}</div>
                            </b-link>
                        </div>
                    </div>
                </div>

                <div class="info content-box" v-if="choice == 2">
                    <div class="error-alert" v-if="error">{{errorMessage}}</div>
                    <form @submit.prevent="checkForm">
                        <div class="form-body">
                            <b-row style="width: 100%;padding: 50px;">
                                <b-col cols="12" md="6">
                                    <label for="email" class="required" name="login">{{ $t('admin.email') }}</label>
                                    <input id="email" v-model="email" type="text" :placeholder="$t('admin.emailPHolder')">
                                    <p class="error-msg" v-if="errorEmail">{{ $t('admin.emailRequired') }}</p>
                                </b-col>
                                <b-col cols="12" md="6">
                                    <label for="name" class="required" name="name">{{ $t('admin.name') }}</label>
                                    <input id="name" v-model="name" type="text" :placeholder="$t('admin.namePHolder')">
                                    <p class="error-msg" v-if="errorName">{{ $t('admin.nameRequired') }}</p>
                                </b-col>
                                <b-col cols="12" md="6">
                                    <label for="password" class="required" >{{ $t('admin.pass') }}</label>
                                    <input id="password" v-model="password" type="password" :placeholder="$t('admin.passPHolder')">
                                    <p class="error-msg" v-if="errorPass">{{ $t('admin.passRequired') }}</p>
                                </b-col>
                            </b-row>
                            
                            <input type="submit" name="commit" :value="$t('admin.button')">
                        </div>
                    </form>
                </div>
            </b-col>
            
        </b-row>
        
    </b-row>
</template>

<script>

export default {
    name: 'AdminPeople',

    data: () => {
        return {
            people: [],
            spin: false,
            choice: 1,
            activeClass: 'active',
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
    async created() {
        this.spin = true;
        await this.fetchData();
        this.spin = false;        
    },
    methods: {
        async fetchData() {
            const res = await this.axios.get(`users`);
            this.people = res.data;
        },
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
        },
        setChoice(value) {
            this.choice = value;
        },
    },
}
</script>

<style scoped src="@/assets/css/admin.css">
</style>