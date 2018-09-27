import Login from '../components/Login'
import Logged from '../views/Logged'

import Form from '../components/Form'

export default [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'logged',
    component: Logged,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/form',
        name: 'form',
        component: Form,
        meta: { requiresAuth: true }
      }
    ]
  }
]
