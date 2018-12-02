import Vue from 'vue';
import ElementUI from 'element-ui';
import App from './App.vue';
import { router } from './router';
import store from './store';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/icon/iconfont.css';

Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
