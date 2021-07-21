<template>
    <div class="wrapper mobile" :class="{ toggled: $sidebar.showSidebar }">
        <div class="sidebar-backdrop mobile" @click="closeSidebarPanel" v-if="$sidebar.showSidebar"></div>
        <div class="sidebar mobile" :class="{ toggled: $sidebar.showSidebar }">
            <div class="sidebar-wrapper">
                <div class="logo-profile">
                    <div>
                        <img src="../assets/logo_grafo_menu.svg" class="image-menu">
                    </div>
                    <div class="title">
                        <div style="font-size: 1.5rem;font-weight: bold; white-space: nowrap;">Heuristicas</div>
                    </div>
                </div>
                <hr class="divider">
            </div>

            <div v-if="userName" class="sidebar-wrapper">
                <router-link :to="`/profile/${id}`" class="logo-profile" @click.native="hideSidebar()">
                    <div>
                        <img v-if="image" :src="image" class="image-menu">
                        <img v-else src="../assets/blank-person.jpg" class="image-menu">
                    </div>
                    <div class="title">
                        <div style="white-space: nowrap;">{{ userName }}</div>
                    </div>
                </router-link>
                <hr class="divider">
            </div>
            
            <div class="sidebar-wrapper">
                <router-link to="/" class="link" @click.native="hideSidebar(); active = 'home'" :class="{active: active === 'home'}">
                    <div class="icon">
                        <b-icon-house-fill></b-icon-house-fill>
                    </div>
                    <div class="title">
                        <div>{{ $t('drawer.home') }}</div>
                    </div>
                </router-link>
                <router-link to="/people" class="link" @click.native="hideSidebar(); active = 'people'" :class="{active: active === 'people'}">
                    <div class="icon">
                        <b-icon-file-person></b-icon-file-person>
                    </div>
                    <div class="title">
                        <div>{{ $t('drawer.people') }}</div>
                    </div>
                </router-link>
                <router-link to="/publications" class="link" @click.native="hideSidebar(); active = 'publications'"  :class="{active: active === 'publications'}">
                    <div class="icon">
                        <b-icon-chat-dots-fill></b-icon-chat-dots-fill>
                    </div>
                    <div class="title">
                        {{ $t('drawer.publications') }}
                    </div>
                </router-link>
                <router-link to="/problems" class="link" @click.native="hideSidebar(); active = 'problems'" :class="{active: active === 'problems'}">
                    <div class="icon">
                        <b-icon-clipboard></b-icon-clipboard>
                    </div>
                    <div class="title">
                        {{ $t('drawer.problems') }}
                    </div>
                </router-link>
                <router-link v-if="isAdmin" to="/admin-people" class="link" @click.native="hideSidebar(); active = 'admin-people'" :class="{active: active === 'admin-people'}">
                    <div class="icon">
                        <b-icon-file-person></b-icon-file-person>
                    </div>
                    <div class="title">
                        Admin People
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'Drawer',

    data: () => {
        return {
            id: '',
            userName: '',
            image: '',
            active: null
        }
    },
    created() {
        this.watchState();
        this.getActive();
    },
    methods: {
        async watchState(){
            try {
                this.id = this.userId;
                if (this.id) {
                    const res = await this.axios.get(`users/${this.id}`);
                    const { name, imagenProfile } = res.data;
                    this.userName = name;
                    this.image = imagenProfile;
                }               
            } catch (error) {
                console.log(error)                
            }
        },
        closeSidebarPanel() {
            this.$sidebar.displaySidebar(false);
        },
        hideSidebar() {
            if (window.innerWidth < 992) {
                this.$sidebar.displaySidebar(false);
            }
        },
        activeLink(value) {
            this.active = value;
        },
        getActive() {
            switch (this.$route.name) {
                case 'Home':
                    this.active = 'home';
                    break;
                case 'People':
                    this.active = 'people';
                    break;
                case 'Problems':
                    this.active = 'problems';
                    break;
                case 'Publications':
                    this.active = 'publications';
                    break;
                case 'admin-people':
                    this.active = 'admin-people';
                case 'admin-register':
                    this.active = 'admin-register';
                default:
                    this.active = null;
            }
        }
    },
    computed: mapState(['userId','isAdmin']),
    watch: {
        userId() {
            this.id = this.userId;
        }
    }
}
</script>

<style scoped src="@/assets/css/drawer.css">
</style>