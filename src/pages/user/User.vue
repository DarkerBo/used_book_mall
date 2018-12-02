<template>
  <div>
    <user-nav>
      <router-view></router-view>
    </user-nav>
  </div>
</template>

<script>
import UserNav from '../../components/nav/UserNav';

export default {
  components: {
    UserNav,
  },
};
</script>

<style lang="scss" scoped>
</style>
