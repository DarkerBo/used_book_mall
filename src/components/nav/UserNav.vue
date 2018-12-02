<template>
  <div>
    <div class="header">
      <span class="name"> 用户管理中心 </span>
      <span class="back" @click="goBack">
        回到主页&gt;&gt;
      </span>
    </div>

    <div class="content">
      <div class="nav">
        <el-menu
          @select="toRouter"
          :default-active="selectItem"
          background-color="#24343b"
          text-color="#ffffff"
          active-text-color="#ffd43b"
          class="el-menu-vertical-demo navList">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>&nbsp;基本信息</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">
                &nbsp;<span class="item">个人信息</span>
              </el-menu-item>
              <el-menu-item index="1-2">
                &nbsp;<span class="item">更改头像</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-menu-item index="2">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">&nbsp;修改密码</span>
          </el-menu-item>

          <el-menu-item index="3">
            <i class="el-icon-location-outline"></i>
            <span slot="title">&nbsp;收货地址</span>
          </el-menu-item>

          <el-menu-item index="4">
            <i class="el-icon-tickets"></i>
            <span slot="title">&nbsp;我的订单</span>
          </el-menu-item>

          <el-menu-item index="5">
            <i class="el-icon-goods"></i>
            <span slot="title">&nbsp;我的购物车</span>
          </el-menu-item>

        </el-menu>
      </div>

      <div class="page">
        <slot></slot>
      </div>

    </div>




  </div>
</template>

<script>
export default {
  data() {
    return {
      selectItem: '1',
    };
  },

  mounted() {
    this.selectItem = this.$store.state.selectItem + '';
    this.initialMenu();
  },

  methods: {
    // 点击导航栏某一项到某个页面
    toRouter(index) {
      const routerMap = new Map([
        ['1-1', '/message'],
        ['1-2', '/avatar'],
        ['2', '/password'],
        ['3', '/address'],
        ['4', '/order'],
        ['5', '/cart'],
      ]);
      this.$router.push({ path: `/user${routerMap.get(index)}` });
    },

    //回到主页按钮事件
    goBack() {
      this.$router.push({ path: '/' });
    },

    initialMenu() {
      //配置进入页面时侧边栏选择的页面
      const menuConfig = [
        {
          path: '/user',
          selectItem: '1-1',
        },
        {
          path: '/user/',
          selectItem: '1-1',
        },
        {
          path: '/user/message',
          selectItem: '1-1',
        },
        {
          path: '/user/avatar',
          selectItem: '1-2',
        },
        {
          path: '/user/password',
          selectItem: '2',
        },
        {
          path: '/user/address',
          selectItem: '3',
        },
        {
          path: '/user/order',
          selectItem: '4',
        },
        {
          path: '/user/cart',
          selectItem: '5',
        },
      ];

      const currentMenu = menuConfig.find(item => item.path === this.$route.path);
      this.selectItem = currentMenu.selectItem;
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  //头部容器样式
  height: 80px;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 3px solid #ccc;
  .name {
    //顶部文字样式
    font-size: 20px;
    font-weight: bold;
    margin-left: 120px;
  }

  .back {
    //回到主页文字样式
    font-size: 16px;
    font-weight: bold;
    color: #6297b9;
    margin-right: 100px;
    cursor: pointer;
    &:hover {
      color: #6f60aa;
    }
  }
}

.content {
  width: 100%;
  display: flex;
  .nav {
    width: 240px;
    flex-shrink: 0;
    height: 88.5vh;
    .navList {
      // 导航栏样式
      height: 100%;
    }
  }
  .page {
    flex: 1;
    height: 88.5vh;
    overflow: auto;
  }
}
</style>
