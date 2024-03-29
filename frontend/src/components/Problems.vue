<template>
    <b-row>
        <b-col cols="12" class="padding-box">
            <div class="content-box title">
                <h1>{{ $t('problems.title') }}</h1>
                <div class="black-line"></div>
                <div class="red-line"></div>
            </div>
        </b-col>

        <b-col cols="9" class="tags-component" style="margin: 2rem auto auto; padding: 0;">
            <b-row>
                <b-col cols="12" md="6">
                    <tags-input v-model="selectedTags" :existing-tags="suggestions" :typeahead="true" :typeahead-max-results=10 @tags-updated="fetchData(false)" :placeholder="$t('problems.tagsPHolder')"></tags-input>
                </b-col>
                <b-col cols="12" md="6">
                    <input v-model="filterText" class="filterText" :placeholder="$t('problems.searchName')" />
                </b-col>
            </b-row>
        </b-col>

        <div class="padding-box" v-if="spinAll && page == 0" style="width: 100%;margin-top: 1rem;">
            <div id="preloader" class="content-box" style="height: 550px; position: relative;"></div>
        </div>
        
        <div class="body" v-else-if="filteredProblems.length != 0">
            <b-col cols="9" class="content-box problem" v-for="(problem,index) in filteredProblems" :key="index">
                <div class="info">
                    <b-link :to="{path: `/problems/${problem.problemId}`}">
                        <div>{{ problem.name }}</div> 
                    </b-link>

                    <div v-if="problem.alias" style="margin-bottom: 10px;">{{ problem.alias }}</div> 
                    <div v-if="problem.tags.length != 0" class="tag-box">
                        <div v-for="(tag,index) in problem.tags" :key="index" class="tag">
                            {{ tag.value }}
                        </div>
                    </div>
                </div> 
            </b-col>
            <div style="flex-basis: 100%;display: flex;margin-top: 2rem;">
                <input v-if="!stop" type="button" @click="fetchData(true)" :value="$t('problems.showMore')">
            </div>
        </div>
        <div v-else class="content-box no-problems">
            <h2>{{ $t('problems.noRequests') }}</h2>
        </div>
    </b-row>
</template>

<script>
import VoerroTagsInput from '@voerro/vue-tagsinput';

export default {
    name: 'Problems',
    components: {
        "tags-input": VoerroTagsInput
    },
    data: () => {
        return {
            problems: [],
            page: 0,
            stop: false,
            selectedTags: [],
            suggestions: [],
            spinAll: false,
            filterText: ''
        }
    },
    async created () {
        await this.inicializateData();
    },
    methods: {
        async inicializateData() {
            this.spinAll = true;
            const res = await this.axios.get(`tags`);
            this.suggestions = res.data;
            await this.fetchData(true);
        },
        async fetchData(showMore) {
            this.spinAll = true;
            if (!showMore) {
                this.page = 0;
                this.stop = false;
                this.problems = [];
            }

            let query = `problems/pages/${this.page}`;

            if (this.selectedTags.length != 0) {
                query += this.buildQuery();
            }

            await this.fetch(query);
            this.spinAll = false;
        },
        buildQuery() {
            return this.selectedTags.reduce((text, tag, index) => index == 0 ? text + `tag=${tag.value}` : text + `&tag=${tag.value}` , '?');               
        },
        async fetch(query) {
            if (!(this.stop)) {
                const res = await this.axios.get(query);
                this.page += 1;
                if (res.data.length < 10) {
                    this.stop = true;
                }
                
                this.problems.push(...res.data);                
            }       
        },
    },
    computed: {
        filteredProblems() {
            let filter = new RegExp(this.filterText, 'i');
            return this.problems.filter(problem => problem.name.match(filter));
        }
    }
}
</script>

<style scoped src="@/assets/css/problems.css">
</style>