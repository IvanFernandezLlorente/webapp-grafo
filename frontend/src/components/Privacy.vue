<template>
    <b-row style="justify-content: center;">
        <b-col cols="12" class="padding-box">
            <div class="content-box title">
                <h1>{{ $t('privacy.title') }}</h1>
                <div class="black-line"></div>
                <div class="red-line"></div>
            </div>
        </b-col>
        <b-row class="padding-box spin" v-if="spin">
            <b-col cols="12" style="display: flex;justify-content: center;">
                <div id="preloader" class="content-box" style="height: 550px;background-color: #EAEAEA;box-shadow: 0 0;"></div>
            </b-col>
        </b-row>
        <b-row v-else style="width: 100%;margin-top: 2rem;">
            <b-col v-if="(getLanguage() == 'en') && (privacy.en)" cols="12" class="padding-box">
                <div class="content-box privacy" v-html="privacy.en"></div>
            </b-col>
            <b-col v-else-if="(getLanguage() == 'es') && (privacy.es)" cols="12" class="padding-box">
                <div class="content-box privacy" v-html="privacy.es"></div>
            </b-col>
            <b-col v-else cols="12" class="padding-box">
                <div class="content-box noPrivacy">
                    <h2>{{ $t('privacy.noPrivacy') }}</h2>
                </div>
            </b-col>
        </b-row>
    </b-row>
</template>

<script>
import i18n from '../i18n';

export default {
    name: 'Privacy',

    data: () => {
        return {
            privacy: {
                en: '',
                es: ''
            },
            spin: false
        }
    },
    created () {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            try {
                this.spin = true;
                const res = await this.axios.get(`texts/privacy`);
                if((res.data) && (Object.keys(res.data).length !== 0)){
                    this.privacy = res.data;
                }
                
                this.spin = false;
            } catch (error) {
                console.log(error);
                this.spin = false;
            }
        },
        getLanguage() {
            return i18n.locale;
        },
    }
}
</script>

<style scoped src="@/assets/css/privacy.css">
</style>