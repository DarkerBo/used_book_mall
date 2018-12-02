<template>
  <div class="container">
    <div class="buttonItem">
      <el-button type="success" @click="addBanner">新增</el-button>
    </div>

    <div class="title">公告图管理列表</div>

    <el-table :data="bannerData" stripe style="width: 100%" v-loading="tableLoading">
      <el-table-column prop="id" label="公告图ID" align="center"></el-table-column>
      <el-table-column prop="title" label="公告图标题" align="center"></el-table-column>
      <el-table-column prop="goods_id" label="商品ID" align="center"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="update_time" label="更新时间" align="center"></el-table-column>

      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

     <el-dialog title="添加公告图" :visible.sync="dialogFormVisible" width="700px">

      <el-form :model="operateForm" class="operateForm">
        <el-form-item label="标题：" label-width="120px">
          <el-input v-model="operateForm.title" autocomplete="off" placeholder="请输入公告图标题"></el-input>
        </el-form-item>

        <el-form-item label="商品ID：" label-width="120px">
          <el-input v-model="operateForm.goods_id" autocomplete="off" placeholder="请输入商品ID"></el-input>
        </el-form-item>

        <el-form-item label="公告图：" label-width="120px">
        <el-upload :show-file-list="false" :auto-upload="false" action="" :on-change="handleIconSuccess"                     list-type="picture-card" class="iconContainer">
          <img v-if="iconSrc" :src="iconSrc" class="icon">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
       </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveBanner" v-loading="saveLoading">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  getBannerListAPI,
  createOrEditBannerAPI,
  getBannerDetailAPI,
  deleteBannerAPI,
} from '../../../services/index.js';
import moment from 'moment';

export default {
  data() {
    return {
      bannerData: [],
      dialogFormVisible: false,
      operateForm: {
        id: '',
        title: '',
        goods_id: '',
        icon: null,
      },
      type: 'add',
      tableLoading: false,
      saveLoading: false,
    };
  },

  computed: {
    iconSrc() {
      const icon = this.operateForm.icon;
      return icon ? window.URL.createObjectURL(icon) : '';
    },
  },

  methods: {
    //编辑事件
    async handleEdit(index, row) {
      const bannerData = await getBannerDetailAPI({ id: row.id });
      if (bannerData.data.code === 0) {
        const data = bannerData.data.data;

        this.dialogFormVisible = true;
        this.type = 'edit';
        this.operateForm = {
          id: data.id,
          title: data.title,
          goods_id: data.goods_id,
          icon: null,
        };
      } else {
        this.$message({
          type: 'error',
          message: bannerData.data.message,
        });
      }
    },

    //删除事件
    handleDelete(index, row) {
      this.$confirm('此操作将删除该公告图, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const params = { id: row.id };
          const res = await deleteBannerAPI(params);
          if (res.data.code === 0) {
            this.queryBannerList();
            this.$message({
              type: 'success',
              message: '删除成功',
            });
          } else {
            this.$message({
              type: 'error',
              message: res.data.message,
            });
          }
        })
        .catch(() => {});
    },

    // 上传公告图icon事件
    handleIconSuccess(file) {
      this.operateForm.icon = file.raw;
    },

    //新增公告图
    addBanner() {
      // 连续点新增不清空表单数据
      if (this.type !== 'add') {
        this.type = 'add';
        this.resetOperateForm();
      }
      this.dialogFormVisible = true;
    },

    //保存公告图
    saveBanner() {
      const { id, title, goods_id, icon } = this.operateForm;
      const formData = new FormData();

      formData.append('id', id);
      formData.append('title', title);
      formData.append('goods_id', goods_id);
      formData.append('picture', icon);
      this.saveLoading = true;

      createOrEditBannerAPI(formData).then(res => {
        this.saveLoading = false;
        if (res.data.code === 0) {
          this.queryBannerList();
          this.resetOperateForm();
          this.$message({
            message: this.type === 'add' ? '添加成功' : '修改成功',
            type: 'success',
          });
          this.dialogFormVisible = false;
        } else {
          this.$message({
            message: res.data.message,
            type: 'error',
          });
        }
      });
    },

    //重置弹窗表单
    resetOperateForm() {
      this.operateForm = { id: '', goods_id: '', title: '', icon: null };
    },

    //获取公告图列表
    queryBannerList() {
      this.tableLoading = true;
      getBannerListAPI().then(res => {
        this.tableLoading = false;
        if (res.data.code === 0) {
          this.bannerData = res.data.data.map(item => ({
            id: item.id,
            title: item.title,
            goods_id: item.goods_id,
            create_time: moment(item.create_time).format('YYYY-MM-DD HH:mm:ss'),
            update_time: moment(item.update_time).format('YYYY-MM-DD HH:mm:ss'),
          }));
        } else {
          this.$message({
            message: res.data.message,
            type: 'error',
          });
        }
      });
    },
  },

  mounted() {
    this.queryBannerList();
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 40px;
  box-sizing: border-box;

  .title {
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
    background-color: #ddd;
    line-height: 46px;
    padding-left: 16px;
    border-radius: 6px;
  }
  .operateForm {
    padding: 6px 20px;
    box-sizing: border-box;
    .iconContainer {
      width: 148px;
      height: 148px;
      .icon {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
