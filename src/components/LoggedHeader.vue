<template>
  <div class="header">
    <c-button alternative size="xl" icon="exit" @click="logout">LOGOUT</c-button>
  </div>
</template>

<script>
export default {
  name: 'logged-header',

  methods: {
    logout () {
      localStorage.removeItem('token')

      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style lang="scss">
.header {
  display: flex;
  justify-content: flex-end;
}
</style>
