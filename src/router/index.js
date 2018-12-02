import Vue from 'vue';
import Router from 'vue-router';
import store from '../store/index';
import { Message } from 'element-ui';

Vue.use(Router);

export const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../pages/home/Home.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../pages/login/Index.vue'),
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../pages/about/About.vue'),
    },
    {
      path: '/goods/:id',
      component: () => import('../pages/goods/Goods.vue'),
    },
    {
      path: '/user',
      name: 'User',
      component: () => import('../pages/user/User.vue'),
      children: [
        {
          path: 'message',
          name: 'Message',
          component: () => import('../pages/user/setting/Message.vue'),
        },
        {
          path: 'avatar',
          name: 'Avatar',
          component: () => import('../pages/user/setting/Avatar.vue'),
        },
        {
          path: 'password',
          name: 'Password',
          component: () => import('../pages/user/password/Password.vue'),
        },
        {
          path: 'address',
          name: 'Address',
          component: () => import('../pages/user/address/Address.vue'),
        },
        {
          path: 'order',
          component: () => import('../pages/user/order/Order.vue'),
        },
        {
          path: 'cart',
          name: 'Cart',
          component: () => import('../pages/user/cart/Cart.vue'),
        },
      ],
    },
    {
      path: '/admin',
      component: () => import('../pages/admin/Admin.vue'),
      children: [
        {
          path: '',
          component: () => import('../pages/admin/category/Category.vue'),
        },
        {
          path: 'userManage',
          component: () => import('../pages/admin/user/User.vue'),
        },
        {
          path: 'category',
          component: () => import('../pages/admin/category/Category.vue'),
        },
        {
          path: 'goods',
          component: () => import('../pages/admin/goods/Goods.vue'),
        },
        {
          path: 'banner',
          component: () => import('../pages/admin/banner/Banner.vue'),
        },
        {
          path: 'order',
          component: () => import('../pages/admin/order/Order.vue'),
        },
        {
          path: 'assess',
          component: () => import('../pages/admin/assess/Assess.vue'),
        },
      ],
    },
  ],
});

//如果没登陆就实现路由拦截,除了不拦截的路由,其他路由一律跳到登陆页面
router.beforeEach(async (to, from, next) => {
  // 刚打开网页时请求一次用户信息改变isLogin,之后不再请求
  if (!store.state.hasGetUserInfo) {
    store.commit('hasGetUserInfoMutation', { hasGetUserInfo: true });
    await store.dispatch('getUserInfoAction');
    await store.dispatch('getCategoryList');
  }

  // 如果登陆了，就不执行拦截
  if (store.state.isLogin) {
    // 如果是用户登陆
    if (store.state.userInfo.type === '0') {
      // 如果访问的地址是后台管理
      if (to.path.includes('admin')) {
        Message({
          message: '非法操作',
          type: 'error',
        });
        next({ path: from.path });
        return;
      }
    }

    // 如果是商户登陆
    if (store.state.userInfo.type === '1') {
      const forbidArr = ['/admin/userManage', '/admin/order', '/admin/assess'];
      if (forbidArr.includes(to.path)) {
        Message({
          message: '非法操作',
          type: 'error',
        });
        next({ path: from.path });
        return;
      }
    }

    next();
  } else {
    // 可以不登陆就进入的页面
    const ignoreArr = ['/', '/login', '/about'];
    const goodsPathReg = /\/goods\/?\d*/;
    if (ignoreArr.includes(to.path) || goodsPathReg.test(to.path)) {
      next();
    } else {
      Message({
        message: '非法操作',
        type: 'error',
      });
      next({ path: '/login' });
    }
  }
});
