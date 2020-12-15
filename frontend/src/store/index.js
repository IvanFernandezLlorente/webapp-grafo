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
            Vue.set(state,'isAdmin',isAdmin);
            Vue.set(state, 'token', token);
            Vue.set(state, 'userId', userId);
            Vue.set(state,'id',id);
        },
        logoutUser(state) {
            Vue.set(state,'isAdmin','');
            Vue.set(state, 'token', '');
            Vue.set(state, 'userId', '');
            Vue.set(state,'id','');
        },
        setUserId(state, userId) {
            Vue.set(state, 'userId', userId);
        }
    },

    actions: {
        login({ commit }, userData) {
            commit('authUser', userData);
        },

        logout({ commit }) {
            commit('logoutUser');
        },

        updateUserId({ commit }, data) {
            commit('setUserId', data);
        }
    },

    modules: {
    }
})
