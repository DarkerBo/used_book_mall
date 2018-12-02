export default {
  activeName: 'login', //记录进入登录界面还是注册界面,'login'是登陆界面,'register'是注册界面
  hasGetUserInfo: false, //是否已经请求了用户信息
  isLogin: false, //记录是否已经登陆,true就表示登陆,false表示没有登陆
  type: '', //type表示登陆状态,'0'是客户,'1'是商家,'2'是管理员
  selectItem: '', //导航条高亮的标签
  userInfo: null, //用户信息
  categoryList: [], //商品分类列表
  searchValue: '', //搜索条件
};
