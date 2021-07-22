<template>
    <b-row style="justify-content: center;">
        <b-col cols="12" class="padding-box">
            <div class="content-box title">
                <h1>{{ $t('applications.title') }}</h1>
                <div class="black-line"></div>
                <div class="red-line"></div>
            </div>
        </b-col>
        <b-row class="body padding-box">
            <b-col cols="12">
                <b-row v-if="spinAll">
                    <div id="preloader" class="content-box" style="height: 640px;"></div>
                </b-row>
                <b-row v-if="applications.length != 0">
                    <b-col cols="12" xl="4" class="application-box">
                        <div class="application-list">
                            <div class="application-object content-box" @click="select(index)" :class="indexSelected == index ? 'application-selected' : 'application-not-selected'" v-for="(application,index) in applications" :key="index">
                                <div>
                                    <p><b>{{ $t('applications.name') }}: </b>{{application.name}}</p> 
                                    <p style="word-break: break-word;"><b>{{ $t('applications.email') }}: </b>{{application.email}}</p>
                                </div>
                            </div>
                        </div>
                    </b-col>
                    
                    <b-col cols="12" xl="8" class="info-box">
                         <div class="buttons">
                            <button @click="acceptAll()" class="accept">{{ $t('applications.acceptAll') }}</button>
                            <button @click="rejectAll()" class="reject">{{ $t('applications.rejectAll') }}</button>
                        </div>
                        <div class="content-box application-data-box">
                            <div v-if="indexSelected!=-1" class="application-data">
                                <div v-if="spin" id="preloader"></div>
                                <div>
                                    <p><b>{{ $t('applications.name') }}: </b>{{applicationSelected.name}}</p> 
                                    <p><b>{{ $t('applications.email') }}: </b>{{applicationSelected.email}}</p>
                                    <p class="description"><b>{{ $t('applications.description') }}: </b>{{applicationSelected.description}}</p>
                                </div>
                                <div class="application-buttons">
                                    <button @click="accept()" class="accept" style="margin-right: 2rem;">{{ $t('applications.acceptRequest') }}</button>
                                    <button @click="reject()" class="reject">{{ $t('applications.rejectRequest') }}</button>
                                </div>
                            </div>
                        </div>
                    </b-col>
                </b-row>
                <div v-else-if="(applications.length == 0) && !(spinAll)" class="content-box no-applications">
                    <h2>{{ $t('applications.noRequests') }}</h2>
                </div>
            </b-col>
        </b-row>
        
        
    </b-row>
</template>

<script>

export default {
    name: 'Applications',

    data: () => {
        return {
            applications: [],
            indexSelected: -1,
            applicationSelected: {},
            spin: false,
            spinAll: false,
        }
    },
    created () {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            try {
                this.spinAll = true;
                const res = await this.axios.get("applications",{
                    headers: { token: this.$store.state.token}
                });
                this.applications = (res.data.filter( application => !application.accepted)).reverse();
                this.spinAll = false;
            } catch (error) {
                this.spinAll = false;
                console.log(error);
            }
            
        },
        select(index) {
            if (this.applications) {
                this.indexSelected = index;
                this.applicationSelected = this.applications[index];
            } else {
                this.indexSelected = -1;
            }
            
        },
        async accept() {
            try {
                this.spin = true;
                const res = await this.axios.put(`applications/accept/${this.applicationSelected._id}`,{ accepted: true },{
                    headers: { token: this.$store.state.token}
                });
                this.deleteApplication();
                this.spin = false;
            } catch (error) {
                this.spin = false;
                console.log(error);
            }
        },
        async acceptAll() {
            try {
                this.spinAll = true;
                const promises = []
                this.applications.forEach(application => {
                    promises.push(this.axios.put(`applications/accept/${application._id}`,{ accepted: true },{
                        headers: { token: this.$store.state.token}
                    }));
                });
                await Promise.all(promises);
                this.applications = [];
                this.spinAll = false;
            } catch (error) {
                this.spinAll = false;
                console.log(error);
            }
        },
        async reject() {
            try {
                this.spin = true;
                const res = await this.axios.delete(`applications/reject/${this.applicationSelected._id}`,{
                    headers: { token: this.$store.state.token}
                });
                this.deleteApplication();
                this.spin = false;
            } catch (error) {
                this.spin = false;
                console.log(error);
            }
        },
        async rejectAll() {
            try {
                this.spinAll = true;
                const promises = []
                this.applications.forEach(application => {
                    promises.push(this.axios.delete(`applications/reject/${application._id}`,{
                        headers: { token: this.$store.state.token}
                    }));
                });
                await Promise.all(promises);
                this.applications = [];
                this.spinAll = false;
            } catch (error) {
                this.spinAll = false;
                console.log(error);
            }
        },
        deleteApplication() {
            this.applications.splice(this.indexSelected,1);
            this.select(this.indexSelected == this.applications.length ? this.indexSelected-1 : this.indexSelected);
        }
    },
}
</script>

<style scoped src="@/assets/css/applications.css">
</style>