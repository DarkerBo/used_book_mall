<template>
    <div class="warpper">

    <!-- title文字 -->
    <div style="text-align: center;">
      <p class="title">很高兴见到你哦~</p>
      <p class="desc">注册账号，就可以和我们一起VAN♂游戏</p>
    </div>

    <!-- 表单 -->
    <el-form :model="registerForm" :rules="rules" ref="registerForm" label-width="100px" class="demo-registerForm">

      <!-- 账号输入框 -->
      <el-form-item label="账号：" prop="username">
        <el-input v-model="registerForm.username"
                  size="small"
                  placeholder="请输入你的账号"
                  suffix-icon="el-icon-edit"
                  class="input"></el-input>
      </el-form-item>

      <!-- 密码输入框 -->
      <el-form-item label="密码：" prop="password">
        <el-input v-model="registerForm.password"
                  v-if="isShowPassword"
                  key="showPassword"
                  type="text"
                  size="small"
                  placeholder="请输入你的密码"
                  class="input"></el-input>

        <el-input v-model="registerForm.password"
                  v-else
                  key="hidePassword"
                  type="password"
                  size="small"
                  placeholder="请输入你的密码"
                  class="input"></el-input>

          <!-- 眼睛图标 -->
        <i class="icon iconfont eyeOpen"  v-if="isShowPassword"
            @click="handleEyeClick">&#xe621;</i>

        <i class="icon iconfont eyeClose" v-else
            @click="handleEyeClick">&#xe61d;</i>

      </el-form-item>



      <!-- 确认密码密码输入框 -->
      <el-form-item label="确认密码：" prop="rePassword">
        <el-input v-model="registerForm.rePassword"
                  v-if="isShowRePassword"
                  key="showRePassword"
                  type="text"
                  size="small"
                  placeholder="请输入你的确认密码"
                  class="input"></el-input>

        <el-input v-model="registerForm.rePassword"
                  v-else
                  key="hideRePassword"
                  type="password"
                  size="small"
                  placeholder="请输入你的确认密码"
                  class="input"></el-input>


          <!-- 眼睛图标 -->
        <i class="icon iconfont eyeOpen"  v-if="isShowRePassword"
            @click="handleReEyeClick">&#xe621;</i>

        <i class="icon iconfont eyeClose" v-else
            @click="handleReEyeClick">&#xe61d;</i>

      </el-form-item>



      <!-- 确认/重置按钮 -->
      <el-form-item class="buttonGroup">
        <el-button type="primary" @click="submitRegister('registerForm')" class="leftButton">立即注册</el-button>
        <el-button @click="resetForm('registerForm')" class="rightButton">重置信息</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { registerAPI } from '../../services/index.js';
import { mapMutations, mapActions } from 'vuex';

export default {
  name: 'register',
  data() {
    return {
      isShowPassword: false, //是否显示密码为明文
      isShowRePassword: false, //是否显示确认密码为明文
      registerForm: {
        username: '',
        password: '',
        rePassword: '',
        type: '0', //type表示登陆状态，'0'是客户,注册只能注册客户账号
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '长度至少6个字符,只能输入数字字母和下划线', trigger: 'blur' },
        ],
        rePassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 6, message: '长度至少6个字符,只能输入数字字母和下划线', trigger: 'blur' },
        ],
        type: [{ required: true, message: '请选择登陆状态', trigger: 'change' }],
      },
    };
  },
  methods: {
    // 变更vuex中isLogin和type的状态
    ...mapMutations(['isLoginMutation', 'typeMutation', 'userNameMutation']),
    ...mapActions(['getUserInfoAction']),

    // 立即注册按钮点击事件
    submitRegister() {
      const { username, password, rePassword, type } = this.registerForm;
      const params = { account: username, password, rePassword, type };

      const reg = /^\w{6,}$/;
      if (username === '' || !reg.test(password)) {
        this.$message({
          message: '用户名或者密码格式不正确',
          type: 'error',
        });
        return;
      }

      registerAPI(params)
        .then(async res => {
          if (res.data.code === 1) {
            this.$message({
              message: res.data.message,
              type: 'error',
            });
            return;
          }

          const data = res.data.data;
          window.localStorage.setItem('token', data.token);
          window.localStorage.setItem('uid', data.id);

          this.isLoginMutation({ isLogin: true }); //将vuex中isLogin改为true
          this.typeMutation({ type }); //改变vuex中的type(登陆状态)
          await this.getUserInfoAction();

          this.$message({
            message: '注册成功，欢迎你呀~',
            type: 'success',
          });

          if (data.type === '0') {
            this.$router.push({ path: '/' });
          } else {
            this.$router.push({ path: '/backstage' });
          }
        })
        .catch(error => console.log(error));
    },

    // 重置信息按钮点击事件
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    // 点击密码框睁眼闭眼按钮事件
    handleEyeClick() {
      this.isShowPassword = !this.isShowPassword;
    },

    //点击确认密码框睁眼闭眼事件
    handleReEyeClick() {
      this.isShowRePassword = !this.isShowRePassword;
    },
  },
};
</script>

<style lang="scss" scoped>
.warpper {
  //登陆表单容器的样式
  width: 500px;
  height: 400px;
  border: solid #ccc 1px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  // text-align: center;

  .title {
    //主标题文字样式
    font-size: 20px;
    font-weight: bold;
    color: black;
    margin: 20px 0;
  }

  .desc {
    //描述文字的样式
    margin-bottom: 20px;
  }

  .input {
    //input输入框的样式
    width: 300px;
  }

  .iconGroup {
    //图标组的样式
    margin-left: 60px;
    margin-top: 5px;
    padding-bottom: 30px;
  }

  .buttonGroup {
    //按钮组的样式
    display: flex;
  }

  // .radioButton {
  //   width: 120px;
  // }

  .leftButton {
    //左按钮样式
    margin-left: 20px;
  }

  .rightButton {
    //右按钮的样式
    margin-left: 60px;
  }

  .eyeOpen {
    //睁眼图标样式
    position: relative;
    right: 28px;
    top: 3px;
    cursor: pointer;
  }

  .eyeClose {
    //闭眼图标样式
    position: relative;
    right: 28px;
    top: 3px;
    cursor: pointer;
  }
}
</style>
