<template>
  <div class="wrapper">
        <b-link :to="{path: '/'}" class="nav-link">
            <div class="content-img">
                <img src="../assets/logo_grafo.png" alt="logo-grafo">
            </div>
        </b-link>
        <div class="form">
            <form @submit.prevent="signup">
                <div class="header">
                    <h1>Sign Up to Grafo Research</h1>
                </div>
                <div class="form-body">
                    <label for="name">Name</label>
                    <input disabled style="background-color: #e9ecef;" id="name" v-model="application.name" type="text" placeholder="Your name">

                    <label for="email" name="login">Email address</label>
                    <input disabled style="background-color: #e9ecef;" id="email" v-model="application.email" type="text" placeholder="Email address">

                    <label for="password">Password</label>
                    <input id="password" v-model="password" name="password" placeholder="Password" type="password">

                    <input type="submit" name="commit" value="Sign Up">
                </div>
            </form>
        </div>
         

        <p v-if="error">{{error}}</p>
  </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'Register',
    
    data: () => {
        return {
            application: {},
            password: '',
            error: ''
        }
    },
    created () {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            try {
                const res = await axios.get(`http://localhost:4000/api/applications/${this.$route.params.id}`);
                this.application = res.data;
            } catch (error) {
                console.log(error)                
            }
        },
        async signup () {
            try {
                const info = {
                    email: this.application.email,
                    password: this.password,
                    name: this.application.name,
                    token: this.application.token
                }
                const res = await axios.post("http://localhost:4000/api/users/signup", info);
                this.manageSignUp(res.data);
            } catch (error) {
                console.log(error)
            }            
        },
        manageSignUp(data) {
            console.log(data);
            if (data.token) {
                const { token, id, userId, roles } = data;
                const sended = {
                    token, 
                    id, 
                    userId, 
                    isAdmin: roles.includes('admin'),
                    isCollaborator: roles.includes('collaborator')
                }
                this.$store.dispatch('signup',sended);
                this.$router.push({path: '/'}).catch(()=>{});
            } else if (data.message) {
                this.error = data.message
            } else {
                this.error = 'An error has ocurried'
            }
        }
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
    width: 320px;
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

.form-body>label {
    display: block;
    margin-bottom: 7px;
    text-align: left;
    font-weight: 600;
}

.form-body>input {
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
</style>

