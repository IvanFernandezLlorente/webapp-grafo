import Vue from 'vue'
import Vuex from 'vuex'
import crypto from 'crypto-js';
import secret from '../../cert/lsSecret.txt';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: "",
        userId: "",
        id: "",
        isAdmin: false,
        orcid: "",
        bibtex: "" 
    },

    mutations: {
        authUser(state, userData) {
            const { token, id, userId, isAdmin, orcid } = userData
            Vue.set(state, 'isAdmin', isAdmin);
            Vue.set(state, 'token', token);
            Vue.set(state, 'userId', userId);
            Vue.set(state, 'id', id);
            Vue.set(state, 'orcid', orcid);
        },
        logoutUser(state) {
            Vue.set(state, 'isAdmin', '');
            Vue.set(state, 'token', '');
            Vue.set(state, 'userId', '');
            Vue.set(state, 'id', '');
            Vue.set(state, 'orcid', '');
        },
        orcidUser(state, data) {
            Vue.set(state, 'orcid', data);
        },
        updateBibtex(state, data) {
            Vue.set(state, 'bibtex', data);
        }
    },

    actions: {
        login({ commit }, userData) {
            commit('authUser', userData);
        },

        logout({ commit }) {
            commit('logoutUser');
        },

        updateUser({ commit }, data) {
            commit('authUser', data);
        },

        signup({ commit }, userData) {
            commit('authUser', userData);
        },

        updateOrcid({ commit }, data) {
            commit('orcidUser', data);
        },

        bibtexFromOrcid({ commit }, data) {
            commit('updateBibtex', data);
        },
        initialiseStorage({ commit }) {
            const itemStr = localStorage.getItem('userData');
            if (itemStr) {
                const bytes = crypto.AES.decrypt(itemStr, secret);
                const originalText = bytes.toString(crypto.enc.Utf8);
                const item = JSON.parse(originalText);
                const now = new Date();
                if (now.getTime() > item.expiry) {
                    localStorage.removeItem('userData');
                } else {
                    commit('authUser', item.value);
                }
            }
        },
        setStorage({ commit }) {
            const itemStr = localStorage.getItem('userData');
            if (itemStr) {
                localStorage.removeItem('userData');
            }
            const now = new Date();
            const ttl = 86400000;
            const item = {
                value: this.state,
                expiry: now.getTime() + ttl,
            }
            const itemString = JSON.stringify(item);
            const textcrypto = crypto.AES.encrypt(itemString, secret);
            localStorage.setItem('userData', textcrypto);
        },
        deleteStorage({ commit }) {
            localStorage.removeItem('userData');
        }
    },

    modules: {
    }
})
