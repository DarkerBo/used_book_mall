import axios from './config';

// 登陆接口
export const loginAPI = params => axios.post('/api/user/login', params);

// 注册接口
export const registerAPI = params => axios.post('/api/user/register', params);

// 获取某个用户信息接口
export const getUserInfoAPI = () => axios.get('/api/user/getUserInfo');

// 用户修改自己的信息接口
export const modifyUserInfoAPI = params => axios.post('/api/user/modifyUserInfo', params);

// 用户修改密码接口
export const modifyPasswordAPI = params => axios.post('/api/user/modifyPassword', params);

// 获取用户收货地址接口
export const getAddressInfoAPI = () => axios.get('/api/address/getAddressInfo');

// 编辑用户收货地址接口
export const createOrEditAPI = params => axios.post('/api/address/createOrEdit', params);

// 上传头像接口
export const uploadAvatarAPI = params =>
  axios.post('/api/user/uploadAvatar', params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

//获取商品分类接口
export const getCategoryListAPI = () => axios.get('/api/category/getCategoryList');

//新增商品接口
export const addOrEditGoodsAPI = params =>
  axios.post('/api/goods/addOrEdit', params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

// 获取商品列表接口
export const getGoodsListAPI = params => axios.get('/api/goods/getGoodsList', { params });

// 编辑商品上下架接口
export const changeGoodsStatusAPI = params => axios.post('/api/goods/changeStatus', params);

//获取商品详情接口
export const getGoodsDetailAPI = params => axios.get('/api/goods/getGoodsDetail', { params });

//编辑分类接口
export const createOrEditCategoryAPI = params => axios.post('/api/category/createOrEdit', params);

//获取分类详情接口
export const getCategoryDetailAPI = params =>
  axios.get('/api/category/getCategoryDetail', { params });

//删除分类接口
export const deleteCategoryAPI = params => axios.post('/api/category/delete', params);

//获取公告图列表接口
export const getBannerListAPI = params => axios.get('/api/banner/getBannerList', params);

//编辑公告图接口
export const createOrEditBannerAPI = params =>
  axios.post('/api/banner/createOrEdit', params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

//获取公告图详情接口
export const getBannerDetailAPI = params => axios.get('/api/banner/getBannerDetail', { params });

//删除公告图详情接口
export const deleteBannerAPI = params => axios.post('/api/banner/delete', params);

//获取用户列表接口
export const getUserListAPI = params => axios.get('/api/user/getUserList', { params });

//新增商家接口
export const addSellerAPI = params => axios.post('/api/user/addSeller', params);

//冻结/解冻用户
export const freezeOrThawUserAPI = params => axios.post('/api/user/freezeOrThawUser', params);

//搜索商品
export const searchGoodsAPI = params => axios.get('/api/goods/searchGoods', { params });

//加入或者编辑购物车
export const createOrEditCartAPI = async params => {
  const res = await axios.post('/api/cart/createOrEdit', params);
  return res.data;
};

//获取购物车列表
export const getUserCartAPI = async params => {
  const res = await axios.get('/api/cart/getUserCart', { params });
  return res.data;
};

//删除购物车
export const deleteCartAPI = async params => {
  const res = await axios.post('/api/cart/delete', params);
  return res.data;
};

//批量编辑购物车
export const batchEditCartAPI = async params => {
  const res = await axios.post('/api/cart/batchEditAndDelete', params);
  return res.data;
};

//批量结算
export const batchCreateOrderAPI = async params => {
  const res = await axios.post('/api/order/batchCreate', params);
  return res.data;
};

// 获取我的订单
export const getUserOrderAPI = async params => {
  const res = await axios.get('/api/order/getUserOrder', { params });
  return res.data;
};

// 提交评价
export const createAssessAPI = async params => {
  const res = await axios.post('/api/assess/create', params);
  return res.data;
};

// 删除订单
export const deleteOrderAPI = async params => {
  const res = await axios.post('/api/order/delete', params);
  return res.data;
};

// 单个结算
export const creteOrderAPI = async params => {
  const res = await axios.post('/api/order/create', params);
  return res.data;
};

//获取商品下的评价
export const getGoodsAssessAPI = async params => {
  const res = await axios.get('/api/assess/getGoodsAssess', { params });
  return res.data;
};

//获取订单信息列表
export const getOrderListAPI = async params => {
  const res = await axios.get('/api/order/getOrderList', { params });
  return res.data;
};

//获取评价信息列表
export const getAssessListAPI = async params => {
  const res = await axios.get('/api/assess/getAssessList', { params });
  return res.data;
};

// 删除评价
export const deleteAssessAPI = async params => {
  const res = await axios.post('/api/assess/delete', params);
  return res.data;
};

//置顶/取消置顶
export const changePriorityAPI = async params => {
  const res = await axios.post('/api/assess/changePriority', params);
  return res.data;
};
