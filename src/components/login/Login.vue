<template>
  <div class="warpper">
    <!-- title文字 -->
    <div style="text-align: center;">
      <p class="title">很高兴见到你哦~</p>
      <p class="desc">登陆账号，就可以和我们一起VAN♂游戏</p>
    </div>

    <!-- 表单 -->
    <el-form
      :model="loginForm"
      :rules="rules"
      ref="loginForm"
      label-width="100px"
      class="demo-loginForm"
    >
      <!-- 账号输入框 -->
      <el-form-item label="账号：" prop="username">
        <el-input
          v-model="loginForm.username"
          size="small"
          placeholder="请输入你的账号"
          suffix-icon="el-icon-edit"
          class="input"
        ></el-input>
      </el-form-item>

      <!-- 密码输入框 -->
      <el-form-item label="密码：" prop="password">
        <el-input
          v-model="loginForm.password"
          v-if="isShowPassword"
          key="showPassword"
          type="text"
          size="small"
          placeholder="请输入你的密码"
          class="input"
        ></el-input>

        <el-input
          v-model="loginForm.password"
          v-else
          key="hidePassword"
          type="password"
          size="small"
          placeholder="请输入你的密码"
          class="input"
        ></el-input>

        <!-- 眼睛图标 -->
        <i class="icon iconfont eyeOpen" v-if="isShowPassword" @click="handleEyeClick">&#xe621;</i>

        <i class="icon iconfont eyeClose" v-else @click="handleEyeClick">&#xe61d;</i>
      </el-form-item>

      <!--登陆状态单选框  -->
      <el-form-item label="登陆状态：" prop="type">
        <el-radio-group v-model="loginForm.type" size="medium" class="iconGroup">
          <el-tooltip class="item" effect="dark" content="用户登陆" placement="bottom">
            <el-radio-button label="0" class="radioButton">
              <i class="icon iconfont">&#xe66f;</i>
            </el-radio-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="商家登陆" placement="bottom">
            <el-radio-button label="1" class="radioButton">
              <i class="icon iconfont">&#xe634;</i>
            </el-radio-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="管理员登陆" placement="bottom">
            <el-radio-button label="2" class="radioButton">
              <i class="icon iconfont">&#xe62c;</i>
            </el-radio-button>
          </el-tooltip>
        </el-radio-group>
      </el-form-item>

      <!-- 确认/重置按钮 -->
      <el-form-item class="buttonGroup">
        <el-button type="primary" @click="submitLogin('loginForm')" class="leftButton">确认登陆</el-button>
        <el-button @click="resetForm('loginForm')" class="rightButton">重置信息</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { loginAPI } from "../../services/index.js";
import { mapMutations, mapActions } from "vuex";

export default {
  name: "login",
  data() {
    return {
      isShowPassword: false, //是否显示密码为明文
      loginForm: {
        username: "",
        password: "",
        type: "0" //type表示登陆状态，'0'是客户,'1'是商家,'2'是管理员
      },
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            message: "长度至少6个字符,只能输入数字字母和下划线",
            trigger: "blur"
          }
        ],
        type: [{ required: true, message: "请选择登陆状态", trigger: "change" }]
      }
    };
  },
  methods: {
    // 变更vuex中isLogin和type的状态
    ...mapMutations(["isLoginMutation", "typeMutation", "userNameMutation"]),
    ...mapActions(["getUserInfoAction"]),

    // 确认登陆按钮点击事件
    submitLogin() {
      const { username, password, type } = this.loginForm;
      const params = { account: username, password, type };

      const reg = /^\w{6,}$/;
      if (username === "" || !reg.test(password)) {
        this.$message({
          message: "用户名或者密码格式不正确",
          type: "error"
        });
        return;
      }

      loginAPI(params)
        .then(async res => {
          if (res.data.code === 1) {
            this.$message({
              message: res.data.message,
              type: "error"
            });
            return;
          }
          const data = res.data.data;
          window.localStorage.setItem("token", data.token);
          window.localStorage.setItem("uid", data.id);

          this.isLoginMutation({ isLogin: true }); //将vuex中isLogin改为true
          this.typeMutation({ type }); //改变vuex中的type(登陆状态)
          // this.userNameMutation({ username }); //改变vuex中的username
          await this.getUserInfoAction();

          this.$message({
            message: "登陆成功，欢迎你呀~",
            type: "success"
          });

          if (data.type === "0") {
            this.$router.push({ path: "/" });
          } else {
            this.$router.push({ path: "/admin" });
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
    }
  }
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
