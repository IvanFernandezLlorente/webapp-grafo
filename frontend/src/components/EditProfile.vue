<template>
  <b-row style="justify-content: center;">
      <b-col class="card" cols="8">
        <div class="card-header">
            <h4 class="card-title">Edit Profile</h4>
        </div>
        <div class="card-body">
            <form @submit.prevent="updateProfile">
                <b-row>
                    <b-col cols="3">
                        <div class="form-group">
                            <label for="name" class="control-label">Name</label>
                            <input id="name" v-model="user.name" @change="updateCopy"  class="form-control" type="text" placeholder="Name">
                        </div>
                    </b-col>
                    <b-col cols="5">
                        <div class="form-group">
                            <label for="lastname" class="control-label">Last Name</label>
                            <input id="lastname" class="form-control" type="text" placeholder="Last Name">
                        </div>
                    </b-col>
                    <b-col cols="4">
                        <div class="form-group">
                            <label for="email" class="control-label">Email</label>
                            <input id="email" v-model="user.email"  @change="updateCopy" class="form-control" type="text" placeholder="Email">
                        </div>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="3">
                        <div class="form-group">
                            <label class="control-label">Change Password</label>
                            <input class="form-control" type="text" placeholder="New Password">
                        </div>
                    </b-col>
                    <b-col cols="3">
                        <div class="form-group">
                            <label class="control-label">Confirm Password</label>
                            <input class="form-control" type="text" placeholder="Confirm Password">
                        </div>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="8">
                        <div class="form-group">
                            <label for="organization" class="control-label">Organization</label>
                            <input id="organization" v-model="user.organization" @change="updateCopy" class="form-control" type="text" placeholder="Your Organization">
                        </div>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="8">
                        <div class="form-group">
                            <label for="department" class="control-label">Department</label>
                            <input id="department" v-model="user.department" @change="updateCopy" class="form-control" type="text" placeholder="Your Department">
                        </div>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="8">
                        <div class="form-group">
                            <label for="area" class="control-label">Area</label>
                            <input id="area" v-model="user.area" @change="updateCopy" class="form-control" type="text" placeholder="Your Area">
                        </div>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="8">
                        <div class="form-group">
                            <label for="researchgroup" class="control-label">Research Group</label>
                            <input id="researchgroup" v-model="user.researchgroup" @change="updateCopy" class="form-control" type="text" placeholder="Your Research Group">
                        </div>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="12">
                        <div class="form-group">
                            <label for="description" class="control-label">Description</label>
                            <textarea id="description" v-model="user.description" @change="updateCopy" class="form-control" rows="10" style="height: 20px; min-height: 50px;" placeholder="Here can be your description..."></textarea>    
                        </div>
                    </b-col>
                </b-row>
                <div class="text-center">
                    <button type="submit" class="btn btn-info float-right">
                    Update Profile
                    </button>
                </div>
            </form>
        </div>
      </b-col>
  </b-row>
</template>

<script>
import axios from 'axios';

export default {
    name:'EditProfile',

    data () {
      return {
        user: {
          name: '',
          email: '',
          area: '',
          department: '',
          organization: '',
          researchgroup: '',
          description: '',
          linkedinUrl: '',
          scholarUrl: '',
          urjcUrl: ''
        },
        userCopy: {}
      }
    },
    created () {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            try {
                const res = await axios.get(`http://localhost:4000/api/users/5f95be632491c35b78d42545`); //coger el id del store
                this.user = res.data;
            } catch (error) {
                console.log(error)                
            }
        },
        async updateProfile () {
            try {
                const res = await axios.put(`http://localhost:4000/api/users/5f95be632491c35b78d42545`,this.userCopy,{
                    headers: { token: this.$store.state.tokenId}
                });
                alert('Your data: ' + JSON.stringify(res.data))
            } catch (error) {
                console.log(error)                
            }
        },
        updateCopy (valor) {
            this.userCopy[valor.target.id] = valor.target.value
        }
    },
}
</script>

<style scoped>
.card {
    border-radius: 4px;
    background-color: #fff;
    margin-bottom: 30px;
}

.card-header{
    padding: 15px 15px 0;
    background-color: #fff;
    border-bottom: none !important;
}

.card-header>h4 {
    margin: 0;
    color: #333;
    font-weight: 300;
}

.control-label {
    font-size: 12px;
    margin-bottom: 5px;
    text-transform: uppercase;
    font-weight: 400;
    color: #9a9a9a;
}

.form-group {
    margin-bottom: 1rem;
}

.form-control {
    border: 1px solid #e3e3e3;
    border-radius: 4px;
    color: #565656;
    padding: 8px 12px;
    height: 40px;
    display: block;
    width: 100%;
    font-size: 1rem;
    line-height: 1.5;
    background-image: none;
    background-clip: padding-box;
}

.form-control::-moz-placeholder {
  color: #cfcfca;
  opacity: 1;
  filter: alpha(opacity=100);
}
</style>