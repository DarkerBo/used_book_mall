import { getUserInfoAPI, getCategoryListAPI } from '../services/index';
import { Message } from 'element-ui';

export default {
  getUserInfoAction: async ({ commit }) => {
    try {
      const response = await getUserInfoAPI();
      if (response.data.code === 0) {
        commit('isLoginMutation', { isLogin: true });
        commit('userInfoMutation', response.data.data[0]);
      } else {
        commit('isLoginMutation', { isLogin: false });
        Message({
          message: response.data.message,
          type: 'error',
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  getCategoryList: async ({ commit }) => {
    try {
      const response = await getCategoryListAPI();
      if (response.data.code === 0) {
        commit('categoryListMutation', response.data.data);
      } else {
        commit('categoryListMutation', []);
        Message({
          message: response.data.message,
          type: 'error',
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
