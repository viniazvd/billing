import Vue from 'vue'
import Router from 'vue-router'

const load = component => () => import(`./components/${component}.vue`)

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: load('Login'),
      meta: { requiresAuth: false }
    },
    {
      path: '/form',
      name: 'form',
      component: load('Form'),
      meta: { requiresAuth: true }
    }
  ]
})
