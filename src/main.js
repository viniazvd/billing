import Vue from 'vue'
import Root from './Root.vue'

import router from './router'
import store from './store'

import axios from './support/pluggins/http'

import VeeValidate, { Validator } from 'vee-validate'
import Locale from 'vee-validate/dist/locale/pt_BR'

import 'vue-convenia-components/style.scss'
import CComponents from 'vue-convenia-components'

import 'vue-coe-image/dist/vue-coe-image.css'

Vue.use(axios)
Vue.use(CComponents)

Validator.localize(Locale)
Vue.use(VeeValidate, { locale: 'pt_BR' })

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(Root)
}).$mount('#app')
