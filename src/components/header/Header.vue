<template>
  <div class="header">
    <!-- <img src="./shop.png" alt="商店" class="icon"> -->
    <span class="name">Secondhand book mall</span>
    <span class="about" @click="toAboutUs">关于我们&gt;&gt;</span>

    <!-- 导航栏右边容器 -->
    <div class="rightContainer">
      <!-- 已登陆时显示 -->
      <div v-if="isLogin">
        <span class="welcome">{{getPeriod}}好呀，</span>

        <el-dropdown>
          <span class="el-dropdown-link username">
            {{nickname}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>

          <el-dropdown-menu slot="dropdown" size="small">
            <el-dropdown-item @click.native="toRouter(0)">
              用户设置&nbsp;&nbsp;&nbsp;
              <i class="el-icon-setting"></i>
            </el-dropdown-item>

            <el-dropdown-item @click.native="toRouter(1)">
              修改密码&nbsp;&nbsp;&nbsp;
              <i class="el-icon-edit-outline"></i>
            </el-dropdown-item>

            <el-dropdown-item @click.native="toRouter(2)">
              收货地址&nbsp;&nbsp;&nbsp;
              <i class="el-icon-location-outline"></i>
            </el-dropdown-item>

            <el-dropdown-item @click.native="toRouter(3)">
              我的订单&nbsp;&nbsp;&nbsp;
              <i class="el-icon-tickets"></i>
            </el-dropdown-item>

            <el-dropdown-item @click.native="toRouter(4)">
              我的购物车
              <i class="el-icon-goods"></i>
            </el-dropdown-item>

            <el-dropdown-item divided @click.native="logout">
              退出登陆&nbsp;&nbsp;&nbsp;
              <i class="el-icon-d-arrow-right"></i>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <!-- 头像 -->
        <div class="avatar">
          <img :src="avatarUrl" alt="头像" class="image">
        </div>
      </div>

      <!-- 未登陆时显示 -->
      <div v-else>
        <a href="javascript:;" class="login" @click="goLogin">你好，请登陆</a>
        <a href="javascript:;" class="register" @click="goRegister">注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfoAPI } from "../../services/index.js";
import { mapMutations, mapGetters } from "vuex";

export default {
  name: "Header",
  data() {
    return {
      // isLogin: false,
      nickname: "",
      avatarUrl: ""
    };
  },

  computed: {
    ...mapGetters(["userInfoGetter"]),
    isLogin() {
      return this.$store.state.isLogin;
    },
    getPeriod() {
      const currentHour = new Date().getHours();

      const timePeriod = [
        { hour: 5, value: "凌晨" },
        { hour: 8, value: "早晨" },
        { hour: 11, value: "上午" },
        { hour: 13, value: "中午" },
        { hour: 16, value: "下午" },
        { hour: 19, value: "傍晚" },
        { hour: 24, value: "晚上" }
      ];
      return timePeriod.find(item => currentHour <= item.hour).value;
    }
  },

  methods: {
    ...mapMutations([
      "activeNameMutation",
      "isLoginMutation",
      "selectItemMutation"
    ]),

    goLogin() {
      this.activeNameMutation({ activeName: "login" });
      this.$router.push({ path: "/login" });
    },

    goRegister() {
      this.activeNameMutation({ activeName: "register" });
      this.$router.push({ path: "/login" });
    },

    // 退出登陆按钮事件
    logout() {
      this.$confirm("确定退出账号吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("uid");
          this.isLoginMutation({ isLogin: false }); //将vuex中isLogin改为false

          this.$message({
            type: "success",
            message: "退出成功，欢迎下次再来找我玩呀~"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出"
          });
        });
    },

    //用户设置按钮事件
    toRouter(index) {
      let selectItem = "";
      if (index === 0) {
        selectItem = "1-1";
      } else {
        selectItem = index + 1 + "";
      }
      this.selectItemMutation({ selectItem });
      const routerArr = [
        "/message",
        "/password",
        "/address",
        "/order",
        "/cart"
      ];
      this.$router.push({ path: `/user${routerArr[index]}` });
    },

    //关于我们点击事件
    toAboutUs() {
      this.$router.push("/about");
    }
  },

  mounted() {
    // 获取用户信息
    this.nickname = this.userInfoGetter ? this.userInfoGetter.nickname : "";
    this.avatarUrl = this.userInfoGetter
      ? this.userInfoGetter.avatar || require("./people.png")
      : require("./people.png");
  }
};
</script>

<style lang="scss" scoped>
.header {
  //最外层容器样式
  height: 80px;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 2px solid #ccc;
  background: url("./shop.png") no-repeat 115px 25px #fff;
  background-size: 30px 30px;
  margin-bottom: 50px;
  // .icon {
  //   //商城图标样式
  //   height: 30px;
  //   width: 30px;
  //   margin-left: 220px;
  // }
  .about {
    text-decoration: none;
    margin-left: 40px;
    color: #444;
    cursor: pointer;
    user-select: none;
    font-size: 18px;
    &:active {
      color: rgb(223, 175, 88);
    }
  }

  .name {
    //商城名字文字样式
    font-size: 22px;
    font-weight: bold;
    margin-left: 150px;
  }
  .rightContainer {
    //导航栏右边容器样式
    height: 80px;
    width: 330px;
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;
    // background-color: #bfa;

    .login {
      //登陆入口样式
      text-decoration: none;
      color: #6297b9;
      font-weight: bold;
      &:hover {
        color: #6f60aa;
      }
    }

    .register {
      //注册入口样式
      text-decoration: none;
      color: #000;
      font-weight: bold;
      margin-left: 20px;
      &:hover {
        color: red;
      }
    }

    .welcome {
      //欢迎文字提示的样式
      text-decoration: none;
      color: #000;
      // color: #6297b9;
      font-weight: bold;
      margin-right: 15px;
    }
    .username {
      //用户名样式
      font-size: 16px;
      font-weight: bold;
      color: #6297b9;
      cursor: pointer;
      &:hover {
        color: #145b7d;
      }
    }

    .avatar {
      //头像图片容器样式
      height: 35px;
      width: 35px;
      border: 3px solid #eee;
      border-radius: 50%;
      overflow: hidden;
      margin-left: 50px;
      position: absolute;
      right: 100px;
      top: 20px;

      // border-radius: 100%;
      .image {
        //头像图片容器样式
        height: 35px;
        width: 35px;
      }
    }

    .el-dropdown-menu {
      width: 500px;
    }
  }
}
</style>
