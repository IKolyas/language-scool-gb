import {getUser} from '../../../services/auth.service';
import {getAllUserWords} from "../../../services/statistics.service";
import router from "../../../router";

export default {
    login({commit}, token, user) {
        commit('setAuthenticated', true);
        commit('setToken', token);
        router.push({name: 'home'});
    },
    logout({commit}) {
        commit('setUser', {});
        commit('setCurrentUser', {});
        commit('setAuthenticated', false);
        router.push({name: 'home'});
    },

    async isAuth({commit, state}) {
        await window.axios.post('/api/user/auth').then((response) => {
            if (!response.data.success) return commit('setAuthenticated', false);
            commit('setAuthenticated', true);
        }).then(() => state.authenticated)
    },

    register(e) {
        e.preventDefault()
        if (this.password.length > 0) {
            this.$axios.get('/sanctum/csrf-cookie').then(() => {
                this.$axios.post('api/register', {
                    name: this.name,
                    lastname: this.lastname,
                    email: this.email,
                    password: this.password
                })
                    .then(response => {
                        if (response.data.success) {
                            window.location.href = "/login"
                        } else {
                            this.error = response.data.message
                        }
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            })
        }
    },

    fetchUser({commit}, payload) {
        axios.get(`/api/user/${payload.id}`).then((response) => {
            console.log(response.data.data)
            commit('setCurrentUser', response.data.data)
        })
    },

    async fetchUsersWords({commit}, payload) {
        try {
            const data = await getAllUserWords(payload.user_id);
            commit("setUserWords", data);
        } catch (e) {
            console.error('fetchUsersWords', e);
        }
    },
}
