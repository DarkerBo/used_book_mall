<template>
  <div>
    <admin-nav>
      <router-view></router-view>
    </admin-nav>
  </div>
</template>

<script>
import AdminNav from '../../components/nav/AdminNav';

export default {
  components: {
    AdminNav,
  },
};
</script>

<style lang="scss" scoped>
</style>
