<template>
  <div class="container">
    <el-form :model="passwordForm" :rules="rules" ref="passwordForm" label-width="100px" class="passwordForm">

      <!-- 旧密码输入框 -->
      <el-form-item label="旧密码：" prop="password" class="input formItem">
        <el-input type="text"
                  v-model="passwordForm.password"
                  v-if="isShowPassword"
                  placeholder="请输入你的旧密码"></el-input>
        <el-input type="password"
                  v-model="passwordForm.password"
                  v-else
                  placeholder="请输入你的旧密码"></el-input>

         <!-- 眼睛图标 -->
        <i class="icon iconfont eyeOpen"  v-if="isShowPassword"
            @click="handleEyeClick">&#xe621;</i>

        <i class="icon iconfont eyeClose" v-else
            @click="handleEyeClick">&#xe61d;</i>

      </el-form-item>

      <!-- 新密码输入框 -->
      <el-form-item label="新密码：" prop="newPassword" class="input formItem">
        <el-input type="text"
                  v-model="passwordForm.newPassword"
                  v-if="isShowNewPassword"
                  placeholder="请输入你的新密码"></el-input>
        <el-input type="password"
                  v-model="passwordForm.newPassword"
                  v-else
                  placeholder="请输入你的新密码"></el-input>

          <!-- 眼睛图标 -->
        <i class="icon iconfont eyeOpen"  v-if="isShowNewPassword"
            @click="handleNewEyeClick">&#xe621;</i>

        <i class="icon iconfont eyeClose" v-else
            @click="handleNewEyeClick">&#xe61d;</i>

      </el-form-item>

      <!-- 按钮组 -->
      <el-form-item class="buttonGroup">
        <el-button type="primary" class="leftButton" @click="changeMessage('passwordForm')" >
          修改密码
        </el-button>
        <el-button @click="resetForm('passwordForm')" class="rightButton">重置更改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { modifyPasswordAPI } from '../../../services/index.js';

export default {
  data() {
    return {
      isShowPassword: false, //是否显示旧密码
      isShowNewPassword: false, //是否显示新密码
      passwordForm: {
        password: '',
        newPassword: '',
      },
      rules: {
        password: [
          { required: true, message: '请输入你的旧密码', trigger: 'blur' },
          { min: 3, message: '长度在 3 个字符以上', trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: '请输入你的新密码', trigger: 'blur' },
          { min: 3, message: '长度在 3 个字符以上', trigger: 'blur' },
        ],
      },
    };
  },

  methods: {
    // 点击旧密码框睁眼闭眼按钮事件
    handleEyeClick() {
      this.isShowPassword = !this.isShowPassword;
    },

    //点击新密码框睁眼闭眼事件
    handleNewEyeClick() {
      this.isShowNewPassword = !this.isShowNewPassword;
    },

    changeMessage() {
      const { password, newPassword } = this.passwordForm;
      if (password === '' || newPassword === '') {
        //旧密码和新密码不能为空
        this.$message({
          message: '密码填写栏不能为空哦~',
          type: 'error',
        });
        return;
      } else if (password === newPassword) {
        //旧密码和新密码不能相同
        this.$message({
          message: '旧密码和新密码不能相同哦~',
          type: 'error',
        });
        return;
      }

      const params = { password, newPassword };
      modifyPasswordAPI(params)
        .then(res => {
          if (res.data.code === 1) {
            this.$message({
              message: res.data.message,
              type: 'error',
            });
            return;
          }

          this.$message({
            showClose: true,
            message: '修改密码成功~',
            type: 'success',
          });
        })
        .catch(error => Promise.reject(error));
    },

    resetForm(formName) {
      this.$confirm('此操作将重置你的修改信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$refs[formName].resetFields();
          this.$message({
            type: 'success',
            message: '重置成功!',
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置',
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  //最外层容器样式
  overflow: hidden;
  .passwordForm {
    //表单容器样式
    height: 80%;
    width: 40%;
    margin-left: 100px;
    margin-top: 80px;
    .formItem {
      //每一个表单项的样式
      position: relative;
      margin: 60px 0;
    }

    .input {
      //输入框的样式
      width: 400px;
    }

    .buttonGroup {
      //按钮组的样式
      display: flex;

      .leftButton {
        //左按钮样式
        margin-left: -20px;
      }

      .rightButton {
        //右按钮样式
        margin-left: 80px;
      }
    }

    .eyeOpen {
      //睁眼图标样式
      position: absolute;
      right: 20px;
      top: 3px;
      cursor: pointer;
    }

    .eyeClose {
      //闭眼图标样式
      position: absolute;
      right: 20px;
      top: 3px;
      cursor: pointer;
    }
  }
}
</style>
