<template>
    <b-row style="justify-content: center;">
        <b-col cols="12" class="padding-box">
            <div class="content-box title">
                <h1>{{ $t('importORCID.title') }}</h1>
                <div class="black-line"></div>
                <div class="red-line"></div>
            </div>
        </b-col>

        <b-row class="body padding-box">
            <b-col cols="12">
                <b-row v-if="spin" style="min-height: 500px;">
                    <div id="preloader" class="content-box"></div>
                </b-row>
                <b-row v-if="publications.length != 0">
                    <b-col cols="12" xl="4" class="publication-box">
                        <div class="publication-list">
                            <div class="publication-object content-box" @click="select(index)" :class="indexSelected == index ? 'publication-selected' : 'publication-not-selected'" v-for="(publication,index) in publications" :key="index">
                                <div class="cut-text">
                                    <p><b>{{ $t('importORCID.titlePubli') }}: </b>{{publication.title.title.value}}</p> 
                                    <p v-if="journalExist(publication)"><b>{{ $t('importORCID.journal') }}: </b>{{publication["journal-title"]["value"]}}</p>
                                </div>
                            </div>
                        </div>
                    </b-col>

                    <b-col cols="12" xl="8" class="info-box">
                        <div class="content-box publication-data-box">
                            <div v-if="indexSelected!=-1" class="publication-data">
                                <div>                                
                                    <p><b>{{ $t('importORCID.titlePubli') }}: </b>{{publicationSelected.title.title.value}}</p> 
                                    <p v-if="journalExist(publicationSelected)"><b>{{ $t('importORCID.journal') }}: </b>{{publicationSelected["journal-title"]["value"]}}</p>
                                    <p><b>Date: </b>{{publicationSelected["publication-date"].year.value}}</p>
                                    <p v-if="doiExist(publicationSelected)"><b>DOI: </b>https://doi.org/{{manageDOI(publicationSelected)}}</p>
                                    <p v-if="publicationSelected.citation" class="cite"><b>{{ $t('importORCID.citation') }}: </b>{{publicationSelected.citation["citation-value"]}}</p>                   
                                </div>
                                <div class="publication-buttons">
                                    <button v-if="publicationSelected.citation" @click="importPublication" class="accept">
                                        {{ $t('importORCID.import') }}
                                    </button>
                                    <p v-else class="error-text">{{ $t('importORCID.msg') }}</p>
                                </div>
                            </div>
                        </div>
                    </b-col>
                </b-row>
                <div v-else class="content-box no-publications">
                    <h2>{{ $t('importORCID.noPublications') }}</h2>
                </div>
            </b-col>
        </b-row>
    </b-row>
</template>

<script>
export default {
    name: 'Import-Orcid',

    data: () => {
        return {
            publications: [],
            indexSelected: -1,
            publicationSelected: {},
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
                const promises = [];
                const response = await this.axios.get("publications");
                const doiPublications = new Set(response.data.filter(publication => publication.doi).map(publication => publication.doi));

                const res = await this.axios.get(`https://pub.orcid.org/v2.0/${this.$store.state.orcid}/works`,{
                    headers: { Accept: 'application/orcid+json'}
                });
                res.data.group.map( publication => 
                    promises.push(this.axios.get(`https://pub.orcid.org/v2.0/${this.$store.state.orcid}/work/${publication["work-summary"][0]["put-code"]}`,{
                        headers: { Accept: 'application/orcid+json'}
                    }))
                );

                const result = await Promise.all(promises);
                this.publications = result.map(result => result.data).filter(publication => !doiPublications.has(this.manageDOI(publication)));
                this.spin = false;
            } catch (error) {
                this.spin = false;
                console.log(error);
            }
        },
        select(index) {
            if (this.publications) {
                this.indexSelected = index;
                this.publicationSelected = this.publications[index];
            } else {
                this.indexSelected = -1;
            }
            
        },
        async importPublication() {
            this.$store.dispatch('bibtexFromOrcid',this.publicationSelected.citation["citation-value"]);
            this.$router.push({path: '/newpublication'})
        },
        journalExist(publication) {
            return (publication["journal-title"]) ? publication["journal-title"]["value"] : false;
        },
        doiExist(publication) {
            return publication["external-ids"] ? publication["external-ids"]["external-id"].filter(objectId  => objectId["external-id-type"]=="doi").length : false;
        },
        manageDOI(publication) {
            return publication["external-ids"] ? publication["external-ids"]["external-id"].filter(objectId  => objectId["external-id-type"]=="doi").map(id=> id["external-id-value"])[0] : undefined;
        }
    }
}
</script>

<style scoped src="@/assets/css/importOrcid.css">
</style>