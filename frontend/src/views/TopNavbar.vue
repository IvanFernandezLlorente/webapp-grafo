<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <b-link class="nav-link" :to="{path: '/'}">
        Home
      </b-link>
      <button type="button">
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end">
        <ul class="nav navbar-nav mr-auto">
          <li class="nav-item">
            <a class="nav-link" href="#" data-toggle="dropdown">
              <i class="nc-icon nc-palette"></i>
            </a>
          </li>

          <li class="nav-item">
            <a href="#" class="nav-link">
              <i class="nc-icon nc-zoom-split"></i>
              <span class="d-lg-block">&nbsp;Search</span>
            </a>
          </li>
        </ul>
        <ul class="navbar-nav ml-auto">
          <li v-if="token && !isAdmin" class="nav-item">
            <b-link class="nav-link" :to="{name: 'NewPublication'}">
              New Publication
            </b-link>
          </li>
          <li v-if="token" class="nav-item">
            <b-link class="nav-link" :to="{name: 'EditProfile'}">
              Account
            </b-link>
          </li>
          
          <li v-if="isAdmin" class="nav-item">
            <div>
                <b-button v-b-modal.modal-admin>New User</b-button>

                <b-modal centered 
                id="modal-admin"
                ref="modal"
                title="Submit The New User"
                @show="resetModal"
                @hidden="resetModal"
                @ok="handleOk"
                >
                <form ref="form" @submit.stop.prevent="handleSubmit">
                    <b-form-group
                    :state="emailState"
                    label="Email"
                    label-for="email-input"
                    invalid-feedback="Email is required"
                    >
                    <b-form-input
                        id="email-input"
                        v-model="email"
                        :state="emailState"
                        required
                    ></b-form-input>
                    </b-form-group>
                </form>
                </b-modal>
            </div>
          </li>

          <li class="nav-item">
            <b-link v-if="!token" :to="{path: '/login'}" class="nav-link">
              Sign In 
            </b-link>
            <b-link @click="logOut" v-else class="nav-link">
              Log Out
            </b-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
import { mapState } from 'vuex';

export default {
    name: 'TopNavbar',

    data: () => {
        return {
            email: '',
            emailState: null
        }
    },
    methods: {
        logOut () {
            this.$store.dispatch('logout');
            this.$router.push({path: '/login'})
        },
        checkFormValidity() {
            const valid = this.$refs.form.checkValidity()
            this.emailState = valid
            return valid
        },
        resetModal() {
            this.email= ''
            this.emailState = null
        },
        handleOk(bvModalEvt) {
            bvModalEvt.preventDefault()
            this.handleSubmit()
        },
        handleSubmit() {
            if (!this.checkFormValidity()) {
            return
            }
            
            this.$nextTick(() => {
            this.$bvModal.hide('modal-admin')
            })
        }
    },
    computed: mapState(['token','isAdmin'])
}

</script>
<style scoped>
.navbar {
    border: 0;
    border-bottom-color: currentcolor;
    border-bottom-style: none;
    border-bottom-width: 0px;
    font-size: 16px;
    border-radius: 0;
    min-height: 50px;
    background-color: hsla(0,0%,100%,.96);
    border-bottom: 1px solid rgba(0,0,0,.1);
    padding: 5px 15px;
}
</style>
