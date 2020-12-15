<template>
  <div>
    <h3>{{user.name}}</h3>
    <b-row style="justify-content: center;">
        <b-col cols="9">
            <b-tabs content-class="mt-3" justified>
                <b-tab title="About" active>
                    <b-list-group>
                        <b-list-group-item>{{user.name}}</b-list-group-item>
                        <b-list-group-item>{{user.email}}</b-list-group-item>
                        <b-list-group-item>{{user.area}}</b-list-group-item>
                        <b-list-group-item>{{user.department}}</b-list-group-item>
                        <b-list-group-item>{{user.organization}}</b-list-group-item>
                        <b-list-group-item>{{user.researchgroup}}</b-list-group-item>
                        <b-list-group-item>{{user.description}}</b-list-group-item>
                        <b-list-group-item>{{user.linkedinUrl}}</b-list-group-item>
                        <b-list-group-item>{{user.scholarUrl}}</b-list-group-item>
                        <b-list-group-item>{{user.urjcUrl}}</b-list-group-item>
                    </b-list-group>
                </b-tab>

                <b-tab title="Publications">
                    <b-list-group>
                        <b-list-group-item  class="publi" v-for="(publication,index) in user.publications"
                            :key="index"
                        >
                            <p>{{publication.title}}</p> 
                            <p>{{publication.userName}}</p>
                        </b-list-group-item>
                    </b-list-group>
                </b-tab>
            </b-tabs>
        </b-col>  
    </b-row>
  </div>
  
</template>

<script>
import axios from 'axios';

export default {
     name: 'Profile',
    
    data: () => {
        return {
          user: {
            name: '',
            email: '',
            userId: '',
            area: '',
            department: '',
            organization: '',
            researchgroup: '',
            description: '',
            linkedinUrl: '',
            scholarUrl: '',
            urjcUrl: '',
            publications: []
          },
        }
    },
    created () {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            try {
                const res = await axios.get(`http://localhost:4000/api/users/${this.$route.params.userId}`);
                this.user = res.data;
            } catch (error) {
                console.log(error)                
            }
        },
    }
}
</script>

<style scoped>
.publi {

    justify-content: space-between;
    display: flex;
}
</style>