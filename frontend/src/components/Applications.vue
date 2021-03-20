<template>
  <b-row style="justify-content: center;">
      <b-col class="card" cols="10">
        <div class="card-header">
            <h4 class="card-title">Applications</h4>
            <div>
                <button @click="acceptAll">Accept All</button>
                <button @click="rejectAll">Reject All</button>
            </div>
        </div>
        <div v-if="applications" class="card-body">
            <b-row>
                <b-col cols="3" class="application-list">
                    <div class="application-object" @click="select(index)" :class="indexSelected == index ? 'application-selected' : 'application-not-selected'" v-for="(application,index) in applications" :key="index">
                        <div>
                            <p><b>Name: </b>{{application.name}}</p> 
                            <p><b>Email: </b>{{application.email}}</p>
                        </div>
                    </div>
                </b-col>
                <b-col cols="9">
                    <div v-if="indexSelected!=-1" style="height: 100%;">
                        <div>
                            <p><b>Name: </b>{{applicationSelected.name}}</p> 
                            <p><b>Email: </b>{{applicationSelected.email}}</p>
                            <p><b>Description: </b>{{applicationSelected.description}}</p>
                        </div>
                        <div class="application-buttons">
                            <button @click="accept" class="btn btn-success">
                                Accept application
                            </button>
                            <button @click="reject" type="submit" class="btn btn-danger">
                                Reject application
                            </button>
                        </div>
                    </div>
                </b-col>
            </b-row>
        </div>
      </b-col>
  </b-row>
</template>

<script>

export default {
    name: 'Applications',

    data: () => {
        return {
            applications: [],
            indexSelected: -1,
            applicationSelected: {}
        }
    },
    created () {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            const res = await this.axios.get("applications",{
                headers: { token: this.$store.state.token}
            });
            this.applications = res.data.filter( application => !application.accepted);
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
                const res = await this.axios.put(`applications/accept/${this.applicationSelected._id}`,{ accepted: true },{
                    headers: { token: this.$store.state.token}
                });
                this.deleteApplication();
            } catch (error) {
                console.log(error);
            }
        },
        async acceptAll() {
            try {
                const promises = []
                this.applications.forEach(application => {
                    promises.push(this.axios.put(`applications/accept/${application._id}`,{ accepted: true },{
                        headers: { token: this.$store.state.token}
                    }));
                });
                await Promise.all(promises);
                this.applications = [];
            } catch (error) {
                console.log(error);
            }
        },
        async reject() {
            try {
                const res = await this.axios.delete(`applications/reject/${this.applicationSelected._id}`,{
                    headers: { token: this.$store.state.token}
                });
                this.deleteApplication();
            } catch (error) {
                console.log(error);
            }
        },
        async rejectAll() {
            try {
                const promises = []
                this.applications.forEach(application => {
                    promises.push(this.axios.delete(`applications/reject/${application._id}`,{
                        headers: { token: this.$store.state.token}
                    }));
                });
                await Promise.all(promises);
                this.applications = [];
            } catch (error) {
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

.application-list{
    overflow-y: auto;
    height: 600px;
    border-bottom: 1px solid;
}

.application-object{
    border-top: 1px solid;
    padding-bottom: 10px;
}

.application-object p{
    margin-top: 5px;
    margin-bottom: 9px;
}

.application-object-focus {
    background-color:#d0d0d0;
}
.application-buttons {
    position: absolute;
    bottom: 0;
    right: 0;
}

.application-buttons button{
    margin-right: 30px;
}

.application-selected {
    background-color:#d0d0d0;;
}
.application-not-selected {
    background-color:#fff;;
}
</style>