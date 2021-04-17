<template>
  <b-row style="justify-content: center;">
      <b-col class="card" cols="10">
        <div class="card-header">
            <h4 class="card-title">ORCID Publications</h4>
        </div>
        <div v-if="publications" class="card-body">
            <b-row>
                <b-col cols="4" class="publication-list">
                    <div class="publication-object" @click="select(index)" :class="indexSelected == index ? 'publication-selected' : 'publication-not-selected'" v-for="(publication,index) in publications" :key="index">
                        <div class="cut-text">
                            <p><b>Title: </b>{{publication.title.title.value}}</p> 
                            <p v-if="journalExist(publication)"><b>Journal: </b>{{publication["journal-title"]["value"]}}</p>
                        </div>
                    </div>
                </b-col>
                <b-col cols="8">
                    <div v-if="indexSelected!=-1" style="height: 100%;">
                        <div>
                            <p><b>Title: </b>{{publicationSelected.title.title.value}}</p> 
                            <p v-if="journalExist(publicationSelected)"><b>Journal: </b>{{publicationSelected["journal-title"]["value"]}}</p>
                            <p><b>Date: </b>{{publicationSelected["publication-date"].year.value}}</p>
                            <p v-if="doiExist(publicationSelected)"><b>DOI: </b>https://doi.org/{{manageDOI(publicationSelected)}}</p>
                            <p v-if="publicationSelected.citation"><b>Citation: </b>{{publicationSelected.citation["citation-value"]}}</p>
                        </div>
                        <div class="publication-buttons">
                            <button v-if="publicationSelected.citation" @click="importPublication" class="btn btn-success">
                                Import publication
                            </button>
                            <p v-else>You cannot import a publication without citation</p>
                        </div>
                    </div>
                </b-col>
            </b-row>
        </div>
      </b-col>
  </b-row>
</template>

<script>
import { eventBus } from '../main';
export default {
    name: 'Import-Orcid',

    data: () => {
        return {
            publications: [],
            indexSelected: -1,
            publicationSelected: {}
        }
    },
    created () {
        this.fetchData();
    },
    methods: {
        async fetchData() {
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

<style scoped>
.card {
    border-radius: 4px;
    background-color: #fff;
    margin-bottom: 30px;
    min-height: 720px;
    max-height: 720px;
}

.card-header{
    padding: 15px 15px 0;
    background-color: #fff;
    border-bottom: none !important;
    display: flex;
    justify-content: space-between;
}

.card-header>h4 {
    margin: 0;
    color: #333;
    font-weight: 300;
}

.publication-list{
    overflow-y: auto;
    height: 600px;
    border-bottom: 1px solid;
}

.publication-object{
    border-top: 1px solid;
    padding-bottom: 10px;
}

.publication-object p{
    margin-top: 5px;
    margin-bottom: 9px;
}

.publication-object-focus {
    background-color:#d0d0d0;
}
.publication-buttons {
    position: absolute;
    bottom: 0;
    right: 0;
}

.publication-buttons button{
    margin-right: 30px;
}

.publication-selected {
    background-color:#d0d0d0;;
}
.publication-not-selected {
    background-color:#fff;;
}
.cut-text p{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
</style>