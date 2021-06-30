<template>
    <b-row style="justify-content: center;">
        <b-col cols="12" class="padding-box">
            <div class="content-box title">
                <h1>{{ $t('people.title') }}</h1>
                <div class="black-line"></div>
                <div class="red-line"></div>
            </div>
        </b-col>

        <div class="padding-box" v-if="spin" style="width: 100%;margin-top: 1rem;">
            <div id="preloader" class="content-box" style="height: 550px; position: relative;"></div>
        </div>


        <div class="body" v-else-if="people.length != 0">
            <div class="person-box" v-for="(person,index) in people" :key="index">
                <div class="content-box">
                    <b-link class="nav-link" :to="{path: `/profile/${person.userId}`}">
                        <img v-if="person.imagenProfile" :src="person.imagenProfile" class="image-person">
                        <img v-else src="../assets/blank-person.jpg" class="image-person">
                    </b-link>

                    <b-link :to="{path: `/profile/${person.userId}`}">
                        <div class="name">{{ person.name }}</div>
                    </b-link>
                    

                    <div class="networks">
                        <a v-if="person.linkedinUrl" :href="person.linkedinUrl" target="_blank">
                            <img src="../assets/linkedin.svg" class="image-network">
                        </a>

                        <a v-if="person.scholarUrl" :href="person.scholarUrl" target="_blank">
                            <img src="../assets/scholar.svg" class="image-network">
                        </a>
                        <a v-if="person.scopusUrl" :href="person.scopusUrl" target="_blank">
                            <img src="../assets/scopus.svg" class="image-network">
                        </a>
                        <a v-if="person.publonsUrl" :href="person.publonsUrl" target="_blank">
                            <img src="../assets/publons.svg" class="image-network">
                        </a>
                    </div>                    

                    <div v-if="person.organization" class="organization">{{ person.organization }}</div>
                </div>
            </div>
            <div style="flex-basis: 100%;display: flex;margin-top: 2rem; justify-content: center;">
                <input v-if="!(stop) && !(spin)" type="button" @click="fetchData()" :value="$t('people.showMore')">
            </div>
        </div>
        <div v-else class="content-box no-people">
            <h2>{{ $t('people.noRequests') }}</h2>
        </div>
    </b-row>
</template>

<script>

export default {
    name: 'People',

    data: () => {
        return {
            people: [],
            page: 0,
            stop: false,
            spin: false
        }
    },
    async created() {
        this.spin = true;
        await this.fetchData();
        this.spin = false;        
    },
    methods: {
        async fetchData() {
            if (!(this.stop)) {
                const res = await this.axios.get(`users/pages/${this.page}`);
                this.page += 1;
                this.people.push(...res.data);
                if (res.data.length < 10) {
                    this.stop = true
                }
            }
        },
    },
}
</script>

<style scoped src="@/assets/css/people.css">
</style>