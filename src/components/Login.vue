<template>
  <div class="login-container">
    <h3 class="title">LOGIN</h3>

    <c-form class="form-container">
      <c-input
        label="Email"
        name="Email"
        required
        v-validate="{ required: true, email: true }"
        data-vv-delay="10"
        :feedback-show="errors.has('Email')"
        :feedback-message="errors.first('Email')"
        v-model="email"
      />

      <c-input
        label="Password"
        name="Password"
        type="password"
        required
        v-validate="{ required: true }"
        data-vv-delay="10"
        :feedback-show="errors.has('Password')"
        :feedback-message="errors.first('Password')"
        v-model="password"
      />

      <c-card v-if="hasError" class="error">E-mail ou login inválidos</c-card>

      <c-button
        slot="actions"
        alternative
        type="submit"
        size="xl"
        icon="plus"
        :disabled="isLoading"
        @click.prevent="login"
      >
        Logar
      </c-button>
    </c-form>
  </div>
</template>

<script>
export default {
  name: 'login',

  data () {
    return {
      email: '',
      password: '',
      isLoading: false,
      hasError: false
    }
  },

  methods: {
    async login () {
      const result = await this.$validator.validate()

      this.isLoading = true

      if (result) {
        try {
          const { data: { data: { employee, api_token: token } } } = await this.$http.post('user/login', { email: this.email, password: this.password })

          const permissionCode = 2756
          const hasPermission = employee && employee.company_id === permissionCode

          if (hasPermission) {
            localStorage.setItem('token', token)
            this.$router.push({ name: 'form' })
          }
        } catch (error) {
          this.hasError = true
          this.isLoading = false
        }
      }

      this.isLoading = false
    }
  }
}
</script>

<style lang="scss">
.login-container {
  max-width: 300px;
  margin: 0 auto;

  & > .title {
    display: flex;
    justify-content: center;
  }

  & > .form-container > .error {
    display: flex;
    justify-content: center;
    border: unset;
    background: red;
    color: white;
  }
}
</style>
