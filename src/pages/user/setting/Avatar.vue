<template>
  <div class="container">
    <div class="avatarContainer">
      <el-tag type="warning" class="title">当前你的头像</el-tag>
      <label class="view">
        <div class="upload">
          <i class="el-icon-upload uploadIcon"></i>
          <p class="uploadText">点击上传图片</p>
        </div>

        <img :src="avatarUrl" alt="头像" class="avatar-img" width="250" height="250">

        <input type="file" name="file" id="file" style="display: none;" @change="uploadImage($event)">

      </label>
      <el-button  type="success" icon="el-icon-edit"
                  size="small" class="edit-button"
                  :disabled="avatarDisabled"
                  @click="submitAvatar">点击保存头像信息</el-button>
    </div>
  </div>
</template>

<script>
import { uploadAvatarAPI } from '../../../services/index.js';
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      file: null,
    };
  },

  computed: {
    avatarUrl() {
      return this.file ? window.URL.createObjectURL(this.file) : this.userInfoGetter.avatar || require('./people.png');
    },

    ...mapGetters(['userInfoGetter']),

    avatarDisabled() {
      return this.avatarUrl === require('./people.png');
    },
  },

  methods: {
    ...mapActions(['getUserInfoAction']),

    uploadImage(event) {
      if (event.target.value) {
        this.file = event.target.files[0];
      }
    },

    submitAvatar() {
      const formData = new FormData();
      formData.append('avatar', this.file);
      uploadAvatarAPI(formData).then(async res => {
        this.$message({
          type: 'success',
          message: '修改头像成功~',
        });
        await this.getUserInfoAction();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  //最外层容器样式
  overflow: hidden;
  .avatarContainer {
    //头像容器样式
    margin-left: 100px;
    margin-top: 50px;
    .title {
      // 标签文字样式
      display: block;
      width: 100px;
      margin-bottom: 40px;
    }
    .view {
      //头像展示容器样式
      position: relative;
      height: 300px;
      width: 300px;
      margin-left: 50px;
      border: #ccc 1px solid;
      border-radius: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      // hover时将图片透明度设为从1到0.1
      & .avatar-img {
        opacity: 1;
        transition: 0.3s ease-in-out;
      }

      &:hover .avatar-img {
        opacity: 0.1;
      }

      .upload {
        position: absolute;
        opacity: 0;
        z-index: 10;
        .uploadIcon {
          font-size: 100px;
        }
        .uploadText {
          font-weight: bold;
        }
      }

      // hover时将icon透明度设为从0到0.8
      &:hover .upload {
        opacity: 0.8;
        transition: 0.8s ease-in-out;
      }
    }

    .edit-button {
      // 编辑按钮样式
      width: 300px;
      margin: 20px 50px;
    }
  }
}
</style>
