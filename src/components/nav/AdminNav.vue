<template>
  <div>
    <div class="header">
      <span class="name">后台管理中心</span>

      <div class="rightContainer">
        <span class="welcome">{{getPeriod}}好呀，</span>
        <span class="adminname">{{userInfoGetter.account === 'admin' ? '超级管理员' : '商家'}}</span>
        <span class="logout" @click="logout">退出登陆</span>
      </div>
    </div>

    <div class="content">
      <div class="nav">
        <el-menu
          @select="toRouter"
          :default-active="selectItem"
          background-color="#24343b"
          text-color="#ffffff"
          active-text-color="#ffd43b"
          class="el-menu-vertical-demo navList"
        >
          <el-menu-item index="1">
            <i class="el-icon-menu"></i>
            <span slot="title">&nbsp;商品分类管理</span>
          </el-menu-item>

          <el-menu-item index="2">
            <i class="el-icon-goods"></i>
            <span slot="title">&nbsp;商品管理</span>
          </el-menu-item>

          <el-menu-item index="3">
            <i class="el-icon-picture-outline"></i>
            <span slot="title">&nbsp;公告图管理</span>
          </el-menu-item>

          <el-menu-item index="4" v-if="isAdmin">
            <i class="el-icon-sold-out"></i>
            <span slot="title">&nbsp;订单管理</span>
          </el-menu-item>

          <el-menu-item index="5" v-if="isAdmin">
            <i class="el-icon-star-off"></i>
            <span slot="title">&nbsp;商品评价管理</span>
          </el-menu-item>

          <el-menu-item index="6" v-if="isAdmin">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">&nbsp;用户管理</span>
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
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      selectItem: '1',
      isAdmin: true,
    };
  },

  computed: {
    ...mapGetters(['userInfoGetter']),
    getPeriod() {
      const currentHour = new Date().getHours()

      const timePeriod = [
        { hour: 5, value: '凌晨' },
        { hour: 8, value: '早晨' },
        { hour: 11, value: '上午' },
        { hour: 13, value: '中午' },
        { hour: 16, value: '下午' },
        { hour: 19, value: '傍晚' },
        { hour: 24, value: '晚上' }
      ]
      return timePeriod.find(item => currentHour <= item.hour).value
    }
  },

  methods: {
    ...mapMutations(['isLoginMutation']),

    // 点击导航栏某一项到某个页面
    toRouter(index) {
      const routerArr = ['/category', '/goods', '/banner', '/order', '/assess', '/userManage'];
      this.$router.push({ path: `/admin${routerArr[index - 1]}` });
    },

    // 退出登陆按钮事件
    logout() {
      this.$confirm('确定退出账号吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          window.localStorage.removeItem('token');
          window.localStorage.removeItem('uid');
          this.isLoginMutation({ isLogin: false }); //将vuex中isLogin改为false
          this.$message({
            type: 'success',
            message: '退出成功，欢迎下次再来找我玩呀~',
          });

          this.$router.push({ path: '/login' });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出',
          });
        });
    },

    initialMenu() {
      //配置进入页面时侧边栏选择的页面
      const menuConfig = [
        {
          path: '/admin',
          selectItem: '1',
        },
        {
          path: '/admin/',
          selectItem: '1',
        },
        {
          path: '/admin/category',
          selectItem: '1',
        },
        {
          path: '/admin/goods',
          selectItem: '2',
        },
        {
          path: '/admin/banner',
          selectItem: '3',
        },
        {
          path: '/admin/order',
          selectItem: '4',
        },
        {
          path: '/admin/assess',
          selectItem: '5',
        },
        {
          path: '/admin/userManage',
          selectItem: '6',
        },
      ];

      const currentMenu = menuConfig.find(item => item.path === this.$route.path);
      this.selectItem = currentMenu.selectItem;
    },
  },

  mounted() {
    this.isAdmin = this.userInfoGetter.type === '2';
    this.initialMenu();
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
  position: relative;
  .name {
    //顶部文字样式
    font-size: 20px;
    font-weight: bold;
    margin-left: 120px;
  }
  .rightContainer {
    height: 80px;
    display: flex;
    align-items: center;
    position: absolute;
    right: 100px;
    .welcome {
      font-weight: bold;
    }
    .adminname {
      font-size: 16px;
      font-weight: bold;
      color: #6297b9;
      margin-left: 20px;
    }
    .logout {
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      margin-left: 100px;
      &:hover {
        color: #6f60aa;
      }
    }
  }
}

.content {
  width: 100%;
  display: flex;
  .nav {
    width: 240px;
    height: 88.5vh;
    flex-shrink: 0;
    .navList {
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
