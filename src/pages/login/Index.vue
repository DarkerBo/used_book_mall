<template>
  <div class="container">
    <div style="position: relative;">
      <router-link to="/" class="back">&lt;&lt; 返回首页</router-link>
      <el-tabs type="card" stretch v-model="activeName">
        <el-tab-pane label="登陆" name="login">
          <login/>
        </el-tab-pane>

        <el-tab-pane label="用户注册" name="register">
          <register/>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Login from "../../components/login/Login";
import Register from "../../components/login/Register";

export default {
  data() {
    return {
      activeName: ""
    };
  },

  // 跳到该页面时判断是登陆还是注册界面
  created() {
    this.activeName = this.$store.state.activeName;
  },

  components: {
    Login,
    Register
  }
};
</script>


<style lang="scss" scoped>
.container {
  //最外层容器样式
  width: 100vw;
  height: 100vh;
  background-image: url("./background.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  .back {
    //返回首页样式
    position: absolute;
    right: 0px;
    top: -35px;
    text-decoration: none;
    color: #fff;
    &:hover {
      color: #6297b9;
    }
  }
}
</style>

<!-- 修改element-ui的字体样式不能scoped -->
<style lang="scss">
.el-tabs__item.is-active {
  color: #fff;
}
</style>
