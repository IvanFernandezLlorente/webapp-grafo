<template>
    <nav class="navbar">
        <div class="wrapper">
            <div class="circle" @click="toggleSidebar">
                <img v-if="$sidebar.showSidebar" src="../assets/menu.svg">
                <img v-else src="../assets/collapse.svg">
            </div>
            <div class="circle dropdown-lang" @click="languageList = !languageList">
                <img v-if="getLanguage() == 'en'" src="../assets/en.svg" class="lang-icon" style="opacity: 1 !important;">                        
                <img v-else src="../assets/es.svg" class="lang-icon" style="opacity: 1 !important;">
                <transition name="fade">
                    <div class="dropdown-content-lang" v-show="languageList">
                        <div class="lang-icons">
                            <img v-if="getLanguage() == 'es'" src="../assets/en.svg" class="lang-icon" @click="changeLanguage('en')">                        
                            <img v-else src="../assets/es.svg" class="lang-icon" @click="changeLanguage('es')">
                        </div>
                    </div>
                </transition>
            </div>
            <div class="spacer"></div>

            <div v-if="token" class="dropdown nav-item" @mouseover="createList = true" @mouseleave="createList = false">
                <div class="nav-link hide-element">{{ $t('topNavBar.create') }}<img src="../assets/create-icon.svg" style="margin-left: 6px;"></div>
                <transition name="fade">
                    <div class="dropdown-content" v-show="createList" @click="createList = false">
                        <router-link to="/newpublication">{{ $t('topNavBar.publication') }}</router-link>
                        <router-link to="/newproblem">{{ $t('topNavBar.problem') }}</router-link>
                        <router-link v-if="orcid" to="/import-orcid">{{ $t('topNavBar.importORCID') }}</router-link>
                    </div>
                </transition>
            </div>

            <div v-if="isAdmin" class="nav-item">
                <router-link class="nav-link hide-element" to="/applications">
                    {{ $t('topNavBar.requests') }}
                    <img src="../assets/requests.svg">
                </router-link>
            </div>

            <div v-if="token" class="nav-item">
                <router-link class="nav-link hide-element" to="/settings">
                    {{ $t('topNavBar.settigns') }}
                    <img src="../assets/settings.svg">
                </router-link>
            </div>

            <div v-if="!token" class="buttons-login">
                <router-link to="/login" class="link-signIn">    
                    <button class="btn login">
                        {{ $t('topNavBar.signIn') }}
                    </button>
                </router-link>
                
                <router-link to="/request-signUp" class="link-signUp">    
                    <button class="btn signUp">
                        {{ $t('topNavBar.signUp') }}
                    </button>
                </router-link>
            </div>

            <div v-else class="nav-item logOut">
                <div @click="logOut" class="nav-link hide-element">
                    {{ $t('topNavBar.logout') }}
                    <img src="../assets/logout.svg">
                </div>
            </div>
        </div>
    </nav>
</template>
<script>
import { mapState } from 'vuex';
import i18n from '../i18n';

export default {
    name: 'TopNavbar',

    data: () => {
        return {
            createList: false,
            languageList: false
        }
    },
    methods: {
        logOut () {
            this.$store.dispatch('deleteStorage');
            this.$store.dispatch('logout');
            this.$router.push({path: '/login'})
        },
        changeLanguage(lang) {
            i18n.locale = lang;
        },
        getLanguage() {
            return i18n.locale;
        },
        toggleSidebar() {
            this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
        }
    },
    computed: mapState(['token', 'isAdmin','orcid'])
}

</script>
<style scoped src="@/assets/css/topNavbar.css">
</style>
