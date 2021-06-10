<template>
    <b-row v-if="problems" style="justify-content: center;">
        <b-col cols="12" class="padding-box">
            <div class="content-box title">
                <h1>{{ $t('problems.title') }}</h1>
                <div class="black-line"></div>
                <div class="red-line"></div>
            </div>
        </b-col>

        <div class="body">
            <b-col cols="9" class="content-box problem" v-for="(problem,index) in problems" :key="index">
                <div class="info">
                    <b-link :to="{path: `/problems/${problem.problemId}`}">
                        <div>{{ problem.name }}</div> 
                    </b-link>

                    <div style="margin-bottom: 10px;">{{ problem.alias }}</div> 
                </div> 
            </b-col>
        </div>
        <input v-if="!stop" type="button" @click="fetchData()" :value="$t('problems.showMore')">
    </b-row>
</template>

<script>

export default {
    name: 'Problems',

    data: () => {
        return {
            problems: [],
            page: 0,
            stop: false
        }
    },
    created () {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            if (!(this.stop)) {
                const res = await this.axios.get(`problems/pages/${this.page}`);
                this.page += 1;
                if (res.data.length == 0) {
                    this.stop = true
                } else {
                    this.problems.push(...res.data);
                }
            }            
        }
    },
}
</script>

<style scoped src="@/assets/css/problems.css">
</style>