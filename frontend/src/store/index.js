import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        tokenId: "",
        userId: "",
        //user: null,
        isAdmin: false
    },

    mutations: {
        authUser(state, userData) {
            const { isAdmin, tokenId, userId } = userData
            Vue.set(state,'isAdmin',isAdmin);
            Vue.set(state, 'tokenId', tokenId);
            Vue.set(state,'userId',userId);
        },
        logoutUser(state) {
            Vue.set(state,'isAdmin','');
            Vue.set(state, 'tokenId', '');
            Vue.set(state,'userId','');
        }
    },

    actions: {
        login({ commit }, userData) {
            commit('authUser', userData);
        },

        logout({ commit }) {
            commit('logoutUser');
        }
    },

    modules: {
    }
})
