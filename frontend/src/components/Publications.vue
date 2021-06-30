<template>
    <b-row v-if="publications" style="justify-content: center;">
        <b-col cols="12" class="padding-box">
            <div class="content-box title">
                <h1>{{ $t('publications.title') }}</h1>
                <div class="black-line"></div>
                <div class="red-line"></div>
            </div>
        </b-col>

        <b-col cols="9" style="margin: 2rem auto auto; padding: 0;">
            <b-row>
                <b-col cols="12" md="6">
                    <input v-model="filterText" class="filterText" :placeholder="$t('publications.search')" />
                </b-col>
            </b-row>
        </b-col>

        <div class="padding-box" v-if="spinAll && page == 0" style="width: 100%;margin-top: 1rem;">
            <div id="preloader" class="content-box" style="height: 550px; position: relative;"></div>
        </div>

        <div class="body" v-else-if="filteredPublications.length != 0">
            <b-col cols="9" class="content-box publication" v-for="(publication,index) in filteredPublications" :key="index">
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
            <div class="button-box">
                <input v-if="!stop" type="button" @click="fetchData()" :value="$t('publications.showMore')">
            </div>
        </div>
        <div v-else class="content-box no-publications">
            <h2>{{ $t('publications.noRequests') }}</h2>
        </div>
    </b-row>
</template>

<script>

export default {
    name: 'Publications',

    data: () => {
        return {
            publications: [],
            page: 0,
            stop: false,
            filterText: '',
            spinAll: false,
        }
    },
    async created () {
        this.spinAll = true;
        await this.fetchData();
        this.spinAll = false;
    },
    methods: {
        async fetchData() {
            if (!(this.stop)) {
                const res = await this.axios.get(`publications/pages/${this.page}`);
                this.page += 1;
                if (res.data.length < 10) {
                    this.stop = true
                }

                this.publications.push(...res.data);
            }            
        },
        getDoi(doi) {
            return doi.split("https://doi.org/")[1];
        },
        getAuthors(authors) {
            const authorsArray = JSON.parse(authors);
            return authorsArray.map(user=> user[0]).reduce((text, user) => text + `, ${user}`);
        }
    },
    computed: {
        filteredPublications() {
            let filter = new RegExp(this.filterText, 'i');
            return this.publications.filter(publication => publication.title.match(filter) || publication.authors.match(filter) ||
                publication.journal.match(filter) || publication.volume.match(filter) || publication.pages.match(filter) || 
                publication.year.match(filter) || publication.doi.match(filter) 
            );
        }
    }
}
</script>

<style scoped src="@/assets/css/publications.css">
</style>