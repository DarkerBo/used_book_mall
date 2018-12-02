export default {
  isLoginMutation(state, payload) {
    state.isLogin = payload.isLogin;
  },

  hasGetUserInfoMutation(state, payload) {
    state.hasGetUserInfo = payload.hasGetUserInfo;
  },

  typeMutation(state, payload) {
    state.type = payload.type;
  },

  activeNameMutation(state, payload) {
    state.activeName = payload.activeName;
  },

  selectItemMutation(state, payload) {
    state.selectItem = payload.selectItem;
  },

  userInfoMutation(state, payload) {
    state.userInfo = payload;
  },

  categoryListMutation(state, payload) {
    state.categoryList = payload;
  },

  searchValueMutation(state, payload) {
    state.searchValue = payload.searchValue;
  },
};
