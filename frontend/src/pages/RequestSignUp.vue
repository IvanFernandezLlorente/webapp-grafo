<template>
  <div class="wrapper">
        <b-link :to="{path: '/'}" class="nav-link">
            <div class="content-img">
                <img src="../assets/logo_grafo.png" alt="logo-grafo">
            </div>
        </b-link>
        <div class="form">
            <form @submit.prevent="request">
                <div class="header">
                    <h1>Request Sign Up to Grafo Research</h1>
                </div>
                <div class="form-body">
                    <b-row>
                        <b-col cols="6">
                            <label for="email" name="login">Email address</label>
                            <input :disabled="submitedApplication" :class="{'disable-input': submitedApplication}" id="email" v-model="email" type="text" placeholder="Email address">

                        </b-col>
                        <b-col cols="6">
                            <label for="name" name="name">Name</label>
                            <input :disabled="submitedApplication" :class="{'disable-input': submitedApplication}" id="name" v-model="name" placeholder="Name" type="text">
                        </b-col>
                    </b-row>
                    

                    <label for="description" class="control-label">Description</label>
                    <textarea :disabled="submitedApplication" id="description" v-model="description" class="form-control" rows="10" style="height: 20px; min-height: 140px;" placeholder="Here can be your description..."></textarea>    
                    
                    <input type="submit" name="commit" :disabled="submitedApplication" :class="{'disable-input': submitedApplication}" value="Request Sign Up">
                </div>
            </form>
        </div>

        <p v-if="submitedApplication">The request has been sended</p>
        <p v-if="error">{{errorMessage}}</p>

  </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'RequestSignUp',
    
    data: () => {
        return {
            email: '',
            name: '',
            description: '',
            submitedApplication: false,
            error: false,
            errorMessage: ''
        }
    },
    methods: {
        async request () {
            try {
                const info = {
                    email: this.email,
                    name: this.name,
                    description: this.description
                }
                const res = await axios.post("http://localhost:4000/api/applications", info);
                if (res.status == 200) {
                    this.error = false
                    this.submitedApplication = true
                }
                console.log(res);

            } catch (error) {
                this.error = true
                this.errorMessage = error.response.data.message ? error.response.data.message : 'An error has ocurried'
            }            
        },
    }
}
</script>

<style scoped>
.wrapper {
    position: relative;
    top: 0;
    height: 100vh;
    overflow: auto;
    max-height: 100%;
    background: hsla(240,7%,81%,.15);
    width: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.content-img {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
}

img {
    width: 75px;
    height: 27px;
}

.form {
    width: 800px;
    border: 1px solid rgb(222, 223, 224);
    border-radius: 4px;
    box-sizing: border-box;
    position: relative;
}

.header {
    margin-bottom: 15px;
    text-align: center;
    text-shadow: none;
    background-color: initial;
    border: 0;
    border-radius: 6px 6px 0 0;
    margin: 0;
}

.header>h1 {
    font-size: 24px;
    font-weight: 300;
    letter-spacing: -.5px
}

.form-body {
    border-top: 1px solid whitesmoke;
    border-radius: 5px;
    padding: 20px;
    font-size: 14px;
    background-color: whitesmoke;
    border: 1px solid whitesmoke;
}

.form-body label {
    display: block;
    margin-bottom: 7px;
    text-align: left;
    font-weight: 600;
}

.form-body input {
    margin-top: 5px;
    margin-bottom: 15px;
    display: block;
    width: 100%;
    padding: 5px 12px;
    font-size: 14px;
    line-height: 20px;
    color: black;
    background-color: white;
    background-repeat: no-repeat;
    background-position: right 8px center;
    border: 1px solid gainsboro;
    border-radius: 6px;
    outline: none;
    box-shadow: whitesmoke;
}

input.disable-input {
  background-color: #e9ecef;
}
</style>

