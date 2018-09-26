
<template>
  <c-form class="form-container">
    <c-select
      form-label="Empresas"
      data-vv-delay="10"
      :multiple="true"
      track-by="custom"
      label="custom"
      required
      :options="companiesOptions"
      :value="form.companies"
      @input="v => form.companies = v"
    />

    <c-input
      label="Razão social"
      name="Razão social"
      required
      v-validate="{ required: true }"
      data-vv-delay="10"
      :feedback-show="errors.has('Razão social')"
      :feedback-message="errors.first('Razão social')"
      v-model="form.name"
    />

    <c-input
      label="Email"
      name="Email"
      required
      v-validate="{ required: true, email: true }"
      data-vv-delay="10"
      :feedback-show="errors.has('Email')"
      :feedback-message="errors.first('Email')"
      v-model="form.email"
    />

    <c-input
      label="CNPJ"
      name="CNPJ"
      mask="##.###.###/####-##"
      required
      v-validate="{ required: true, cnpj: true }"
      data-vv-delay="10"
      :feedback-show="errors.has('CNPJ')"
      :feedback-message="errors.first('CNPJ')"
      :value="form.registry_code"
      @input="value => form.registry_code = value.replace(/\D/g, '')"
    />

    <c-input
      label="Telefone"
      name="Telefone"
      required
      v-validate="{ required: true, min: 14 }"
      data-vv-delay="10"
      :mask="['(##) ####-####', '(##) #####-####']"
      :feedback-show="errors.has('Telefone')"
      :feedback-message="errors.first('Telefone')"
      v-model="form.phone"
    />

    <c-input
      label="CEP"
      name="cep"
      mask="#####-###"
      required
      v-validate="{ required: true }"
      data-vv-delay="10"
      :feedback-show="errors.has('cep')"
      :feedback-message="errors.first('cep')"
      :value="form.zipcode"
      @input="cepHandler"
    />

    <c-input
      label="Número"
      name="number"
      mask="#####"
      required
      v-validate="{ required: true }"
      data-vv-delay="10"
      :feedback-show="errors.has('Número')"
      :feedback-message="errors.first('Número')"
      v-model="form.number"
    />

    <c-input
      label="Complemento"
      name="additional_details"
      v-model="form.additional_details"
    />

    <c-input
      label="Bairro"
      name="neighborhood"
      required
      v-validate="{ required: true }"
      data-vv-delay="10"
      feedback-message="Campo obrigatório"
      :feedback-show="errors.has('neighborhood')"
      v-model="form.neighborhood"
    />

    <c-select
      form-label="Estado"
      name="state"
      data-vv-delay="10"
      track-by="sigla"
      label="sigla"
      :options="states"
      :value="form.state"
      @input="state => form.state = state"
    />

    <c-select
      form-label="Cidade"
      name="city"
      required
      :disabled="!(form.state && form.state.sigla)"
      data-vv-delay="10"
      track-by="name"
      label="name"
      :options="cities"
      :value="form.city"
      @input="city => form.city = city"
    />

    <c-input
      label="Observações"
      name="description"
      required
      text-area
      v-validate="{ required: true }"
      data-vv-delay="10"
      feedback-message="Campo obrigatório"
      :feedback-show="errors.has('description')"
      v-model="form.description"
    />

    <c-card v-if="hasError" class="error">Preencha os campos corretamente.</c-card>
    <c-card v-if="allFilled" class="error">Preencha todos os campos orbigatórios</c-card>

    <c-button
      slot="actions"
      alternative
      type="submit"
      size="xl"
      icon="plus"
      :disabled="isLoading"
      @click.prevent="submit"
    >
      Salvar
    </c-button>
  </c-form>
</template>

<script>
import { Validator } from 'vee-validate'
import { isCNPJRule } from '../utils/isCNPJ'

import { states as places } from '../support/json/places.json'

import cepPromise from 'cep-promise'

Validator.extend('cnpj', isCNPJRule)

export default {
  name: 'init-form',

  data () {
    return {
      hasError: false,
      allFilled: false,
      isLoading: false,
      companiesOptions: [],
      form: {
        companies: [],
        name: '',
        email: '',
        registry_code: '',
        phone: '',
        zipcode: '',
        number: '',
        additional_details: '',
        neighborhood: '',
        state: {},
        city: {},
        description: ''
      }
    }
  },

  watch: {
    'form.state': {
      handle (x, y) {
        if ((!this.form.state) || x !== y) this.form.city = ''
        if (this.hasError) this.hasError = false
      },
      deep: true
    }
  },

  async mounted () {
    const { data: { data: companies } } = await this.$http.get('sale/inTrial', { ...this.headers })

    if (companies) {
      this.companiesOptions = companies.map(({ company }) => ({ company, custom: `${company.id} - ${company.name}` }))
    }
  },

  computed: {
    headers () {
      const token = localStorage.getItem('token')

      return { headers: { 'Authorization': `Bearer ${token}` } }
    },

    states () {
      return places.map(({ sigla }) => ({ sigla }))
    },

    cities () {
      if (this.form.state && this.form.state.sigla) {
        const cities = (places.find(({ sigla }) => sigla === this.form.state.sigla) || {}).cidades || []

        return (cities && cities.map(city => ({ name: city }))) || []
      }

      return []
    }
  },

  methods: {
    async cepHandler (cep) {
      if (cep.length === 9) {
        const { cep: zipcode, ...address } = await cepPromise(cep).catch(err => console.warn(err))

        this.form = { ...this.form, ...address, zipcode }
      }
    },

    isFormValid (requireds = [], form = {}) {
      const isValid = prop => form[prop]

      return requireds.every(isValid)
    },

    async submit () {
      const requireds = Object.keys(this.form).filter(required => required !== 'additional_details')

      const allFilled = this.isFormValid(requireds, this.form)

      if (allFilled) {
        const result = await this.$validator.validateAll()

        this.isLoading = true

        if (result) {
          const payload = {
            ...this.form,
            companies: this.form.companies.map(({ company: { id } }) => id.toString()),
            state: this.form.state && this.form.state.sigla,
            city: this.form.state && this.form.state.city
          }

          try {
            const response = await this.$http.post('sale/startOnboarding', { ...payload }, { ...this.headers })
            console.log('response', response)

            // this.form = {}
          } catch (error) {
            this.isLoading = false
            this.hasError = true
          }
        } else {
          this.hasError = true
          this.isLoading = false
        }

        this.isLoading = false
      } else {
        this.allFilled = true
        setTimeout(() => { this.allFilled = false }, 3000)
      }
    }
  }

  // beforeDestroy () {
  //   localStorage.removeItem('token')
  // }
}
</script>

<style lang="scss">
.form-container {
  max-width: 400px;
  margin: 0 auto;

  & > .error {
    display: flex;
    justify-content: center;
    border: unset;
    background: red;
    color: white;
  }
}
</style>
