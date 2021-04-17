import Vue from 'vue'
import Vuex from 'vuex'

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
    },

    modules: {
    }
})
