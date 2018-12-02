<template>
  <div class="container">
    <el-form :model="messageForm" :rules="rules" ref="messageForm" label-width="100px" class="messageForm">

      <!-- 用户名 -->
      <el-form-item label="用户名：" prop="username" class="formItem">
        <span>{{messageForm.username}}</span>
      </el-form-item>

      <!-- 昵称输入框 -->
      <el-form-item label="昵称：" prop="nickname" class="input formItem">
        <el-input v-model="messageForm.nickname" placeholder="请输入你的昵称"></el-input>
      </el-form-item>

      <!-- 性别单选框 -->
      <el-form-item label="性别：" prop="sex" class="formItem">
        <el-radio-group v-model="messageForm.sex">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
          <el-radio label="保密"></el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 按钮组 -->
      <el-form-item class="buttonGroup">
        <el-button type="primary" class="leftButton" @click="changeMessage('messageForm')" >
          修改信息
        </el-button>
        <el-button @click="resetForm('messageForm')" class="rightButton">重置更改</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { modifyUserInfoAPI } from '../../../services/index.js';
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      messageForm: {
        username: '',
        nickname: '',
        sex: '保密',
      },

      initialUserName: '',

      rules: {
        nickname: [
          { required: true, message: '昵称不能为空哦~', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' },
        ],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
      },
    };
  },

  computed: {
    ...mapGetters(['userInfoGetter']),
  },

  methods: {
    ...mapActions(['getUserInfoAction']),

    changeMessage() {
      const typeMap = new Map([['保密', '0'], ['男', '1'], ['女', '2']]);
      const { username, nickname, sex } = this.messageForm;
      const params = { nickname, sex: typeMap.get(sex) };

      if (!nickname) {
        //昵称不能为空，如果你硬要为空，我就打你
        this.$message({
          message: '昵称不能为空，如果你硬要为空，我就打你',
          type: 'error',
        });
        return;
      }

      modifyUserInfoAPI(params)
        .then(async res => {
          if (res.data.code === 0) {
            await this.getUserInfoAction();
            this.$message({
              showClose: true,
              message: '修改信息成功~',
              type: 'success',
            });
          }
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
          const { initialUserName } = this;
          this.$refs[formName].resetFields();
          this.messageForm.username = initialUserName;
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

  mounted() {
    // 获取用户信息
    const { nickname, account, sex } = this.userInfoGetter;
    const sexMap = new Map([['0', '保密'], ['1', '男'], ['2', '女']]);
    this.messageForm.username = this.initialUserName = account;
    this.messageForm.nickname = nickname ? nickname : account;
    this.messageForm.sex = sexMap.get(sex);
  },
};
</script>

<style lang="scss" scoped>
.container {
  //最外层容器样式
  overflow: hidden;
  .messageForm {
    //表单容器样式
    height: 80%;
    width: 50%;
    margin-left: 100px;
    margin-top: 80px;
    .formItem {
      //每一个表单项的样式
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
  }
}
</style>
