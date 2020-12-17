<template>
  <div class="body-content">
      <h3>{{publication.title}}</h3>
      <p>{{publication.userName}}</p>
      <p>{{publication.organization}}</p>
      <h4>Problem Description</h4>
      <div v-html="publication.description"></div>
      <h4>State of the Art Methods</h4>
      <div v-html="publication.state"></div>
      <h4>Instances</h4>
      <div v-html="publication.instances"></div>
      <h4>Computational Experience</h4>
      <div v-html="publication.computationalExperience"></div>
      <h4>References</h4>
      <div v-html="publication.reference"></div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Publication',

    data: () => {
        return {
            publication: {}
        }
    },
    created () {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            const res = await axios.get(`http://localhost:4000/api/publications/${this.$route.params.publicationId}`);
            this.publication = res.data;
        }
    },
}
</script>

<style scoped>
.body-content >>> blockquote {
  background: #f9f9f9;
  border-left: 10px solid #ccc;
  margin: 1.5em 10px;
  padding: 0.5em 10px;
  quotes: "\201C""\201D""\2018""\2019";
}
.body-content >>> blockquote:before {
  color: #ccc;
  content: open-quote;
  font-size: 4em;
  line-height: 0.1em;
  margin-right: 0.25em;
  vertical-align: -0.4em;
}
.body-content >>> blockquote p {
  display: inline;
  font-style: italic;
}
</style>