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
                </div>
            </div>
        </div>
        <div v-else class="content-box no-people">
            <h2>{{ $t('people.noRequests') }}</h2>
        </div>
    </b-row>
</template>

<script>

export default {
    name: 'AdminPeople',

    data: () => {
        return {
            people: [],
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
            const res = await this.axios.get(`users`);
            this.people = res.data;
        },
    },
}
</script>

<style scoped src="@/assets/css/people.css">
</style>