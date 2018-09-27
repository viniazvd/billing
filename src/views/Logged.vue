<template>
  <div>
    <logged-header />
    <router-view/>
  </div>
</template>

<script>
import LoggedHeader from '../components/LoggedHeader'

export default {
  name: 'logged',

  components: { LoggedHeader }
}
</script>
