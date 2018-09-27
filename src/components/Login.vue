<template>
  <div class="login-container">
    <div class="header">
      <img class="logo" src="../assets/img/convenia-color.png" />
    </div>

    <c-form class="form-container">
      <c-input
        label="Email"
        name="Email"
        required
        v-validate="{ required: true, email: true }"
        data-vv-delay="10"
        :feedback-show="errors.has('Email')"
        :feedback-message="errors.first('Email')"
        v-model="user.email"
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
        v-model="user.password"
      />

      <c-card v-if="hasError" class="error">E-mail ou login inválidos</c-card>
      <c-card v-if="hasPermission" class="error">Usuário sem permissão</c-card>

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
      user: {
        email: '',
        password: ''
      },
      isLoading: false,
      hasError: false,
      hasPermission: false
    }
  },

  methods: {
    async login () {
      const result = await this.$validator.validate()

      this.isLoading = true

      if (result) {
        try {
          const { data: { data: { employee, api_token: token } } } = await this.$http.post('user/login', { ...this.$data.user })

          const permissionCode = 2756
          const hasPermission = employee && employee.company_id === permissionCode

          if (hasPermission) {
            localStorage.setItem('token', token)
            this.$router.push({ name: 'form' })
          } else {
            this.hasPermission = true
            setTimeout(() => { this.hasPermission = false }, 3000)
            this.isLoading = false
          }
        } catch (error) {
          this.hasError = true
          setTimeout(() => { this.hasError = false }, 3000)
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

  & > .header {
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
