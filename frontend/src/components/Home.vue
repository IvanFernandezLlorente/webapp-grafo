<template>
    <b-row>
        <b-col v-if="(getLanguage() == 'en') && (description.en)" cols="12" class="padding-box">
            <div class="content-box description">
                {{ description.en }}
            </div>
        </b-col>
        <b-col v-if="(getLanguage() == 'es') && (description.es)" cols="12" class="padding-box">
            <div class="content-box description">
                {{ description.es }}
            </div>
        </b-col>
        <b-col cols="12" xl="6" v-if="publications.length != 0">
            <div class="subtitle">{{ $t('home.recentPublication') }}</div>
            <b-row style="justify-content: center;">
                <b-col cols="9" class="content-box publication" v-for="(publication,index) in publications" :key="index">
                    <div class="info">
                        <b-link :to="{path: `/publications/${publication.publicationId}`}">
                            <div style="margin-bottom: 10px;">{{ publication.title }}</div> 
                        </b-link>

                        <div>
                            {{ getAuthors(publication.authors) }}      
                        </div>

                        <div class="journal-info">
                            <div v-if="publication.journal" style="font-style: italic; margin-right: 8px;">{{ publication.journal }},</div>
                            <div v-if="publication.volume" style="margin-right: 8px;">{{ publication.volume }},</div>
                            <div v-if="publication.pages" style="margin-right: 8px;">{{ publication.pages }}.</div>
                            <div v-if="publication.year" >({{ publication.year }})</div>
                        </div>
                        
                        <a v-if="publication.doi" :href="publication.doi" target="_blank" style="color: #E50914; word-wrap: break-word;">
                            {{ getDoi(publication.doi) }}        
                        </a>
                    </div> 
                </b-col>
            </b-row>
        </b-col>

        <b-col cols="12" xl="6" v-if="problems.length != 0">
            <div class="subtitle">{{ $t('home.recentProblems') }}</div>
            <b-row style="justify-content: center;">
                <b-col cols="9" class="content-box problem" v-for="(problem,index) in problems" :key="index">
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
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
import i18n from '../i18n';

export default {
    name: 'Home',

    data: () => {
        return {
            publications: [],
            problems: [],
            description: {
                en: '',
                es: ''
            },
        }
    },
    created () {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            try {
                const res = await this.axios.get(`description`);
                if((res.data) && (Object.keys(res.data).length !== 0)){
                    this.description = res.data;
                }
                
                const promises = []
                promises.push(this.axios.get(`publications/pages/0`));
                promises.push(this.axios.get(`problems/pages/0`));
                const [publications, problems] = await Promise.all(promises);
                this.publications = publications.data;
                this.problems = problems.data;
            } catch (error) {
                console.log(error);
            }
        },
        getDoi(doi) {
            return doi.split("https://doi.org/")[1];
        },
        getAuthors(authors) {
            const authorsArray = JSON.parse(authors);
            return authorsArray.map(user=> user[0]).reduce((text, user) => text + `, ${user}`);
        },
        getLanguage() {
            return i18n.locale;
        },
    }
}
</script>

<style scoped src="@/assets/css/home.css">
</style>