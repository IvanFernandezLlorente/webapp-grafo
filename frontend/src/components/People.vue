<template>
    <b-row v-if="people" style="justify-content: center;">
        <b-col cols="12" class="padding-box">
            <div class="content-box title">
                <h1>{{ $t('people.title') }}</h1>
                <div class="black-line"></div>
                <div class="red-line"></div>
            </div>
        </b-col>

        <div class="body">
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
                            <img src="../assets/linkedin.svg" style="width: 20px;height: 20px;margin-right: 10px;">
                        </a>

                        <a v-if="person.scholarUrl" :href="person.scholarUrl" target="_blank">
                            <img src="../assets/scholar.svg">
                        </a>
                    </div>                    

                    <div v-if="person.organization" style="text-align: center;">{{ person.organization }}</div>
                </div>
            </div>
        </div>

        <input v-if="!stop" type="button" @click="fetchData()" :value="$t('people.showMore')">
    </b-row>
</template>

<script>

export default {
    name: 'People',

    data: () => {
        return {
            people: [],
            page: 0,
            stop: false
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            if (!(this.stop)) {
                const res = await this.axios.get(`users/pages/${this.page}`);
                this.page += 1;
                this.people.push(...res.data);
                if (res.data.length == 0) {
                    this.stop = true
                }
            }
        },
    },
}
</script>

<style scoped src="@/assets/css/people.css">
</style>