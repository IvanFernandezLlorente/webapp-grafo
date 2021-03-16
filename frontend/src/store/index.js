import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: "",
        userId: "",
        id: "",
        isAdmin: false
    },

    mutations: {
        authUser(state, userData) {
            const { token, id, userId, isAdmin } = userData
            Vue.set(state, 'isAdmin', isAdmin);
            Vue.set(state, 'token', token);
            Vue.set(state, 'userId', userId);
            Vue.set(state, 'id',id);
        },
        logoutUser(state) {
            Vue.set(state, 'isAdmin', '');
            Vue.set(state, 'token', '');
            Vue.set(state, 'userId', '');
            Vue.set(state, 'id','');
        },
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
    },

    modules: {
    }
})
