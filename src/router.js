import Vue from 'vue'
import Router from 'vue-router'

const loadComponent = component => () => import(`./components/${component}.vue`)
const loadView = component => () => import(`./views/${component}.vue`)

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: loadComponent('Login'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'logged',
      component: loadView('Logged'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '/form',
          name: 'form',
          component: loadComponent('Form')
        }
      ]
    }
  ]
})
