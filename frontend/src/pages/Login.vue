<template>
  <div class="wrapper">
        <b-link :to="{path: '/'}" class="nav-link">
            <div class="content-img">
                <img src="../assets/logo_grafo.png" alt="logo-grafo">
            </div>
        </b-link>
        <div class="form">
            <form @submit.prevent="login">
                <div class="header">
                    <h1>Sign in to Grafo Research</h1>
                </div>
                <div class="form-body">
                    <label for="email" name="login">Email address</label>
                    <input id="email" v-model="email" type="text" placeholder="Email address">

                    <label for="password">Password</label>
                    <input id="password" v-model="password" name="password" placeholder="Password" type="password">

                    <input type="submit" name="commit" value="Sign in">
                </div>
            </form>
        </div>
         
        <button @click="google">Sign In Google</button>
        <button @click="github">Sign In Github</button>
        <button @click="orcid">Sign In ORCID</button>

        <p v-if="error">{{error}}</p>
  </div>
</template>

<script>
export default {
    name: 'Login',
    
    data: () => {
        return {
            email: '',
            password: '',
            error: ''
        }
    },
    methods: {
        async login () {
            try {
                const info = {
                    email: this.email,
                    password: this.password
                }
                const res = await this.axios.post("users/signin", info);
                this.manageSignIn(res.data);
            } catch (error) {
                console.log(error.response.data)
                this.error = error.response.data.message;
            }            
        },
        google(){
            window.open('https://localhost:3443/api/users/oauth/google/signin',"windowLoginGoogle","location=1,status=1,scrollbars=1,width=800,height=800");
            let listener = window.addEventListener('message', (message) => {
                if ((message.data.method == 'signinGoogle') && (message.data.message)) {
                    this.error = message.data.message;
                } else if ((message.data.token) && (message.data.method == 'signinGoogle')) {
                    this.manageSignIn(message.data);
                }
            });
        },
        github() {
            window.open('https://localhost:3443/api/users/oauth/github/signin',"windowLoginGithub","location=1,status=1,scrollbars=1,width=800,height=800");
            let listener = window.addEventListener('message', (message) => {
                if ((message.data.method == 'signinGitHub') && (message.data.message)) {
                    this.error = message.data.message;
                } else if ((message.data.token) && (message.data.method == 'signinGitHub')) {
                    this.manageSignIn(message.data);
                }
            });
        },
        orcid() {
            window.open('https://localhost:3443/api/users/oauth/orcid/signin',"windowLoginORCID","location=1,status=1,scrollbars=1,width=800,height=800");
            let listener = window.addEventListener('message', (message) => {
                if ((message.data.method == 'signinORCID') && (message.data.message)) {
                    this.error = message.data.message;
                } else if ((message.data.token) && (message.data.method == 'signinORCID')) {
                    this.manageSignIn(message.data);
                }
            });
        },
        manageSignIn(data) {
            const { token, id, userId, roles } = data;
            const sended = {
                token, 
                id, 
                userId, 
                isAdmin: roles.includes('admin')
            }
            this.$store.dispatch('login',sended);
            this.$router.push({path: '/'}).catch(()=>{});
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

