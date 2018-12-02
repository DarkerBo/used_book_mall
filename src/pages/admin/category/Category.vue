<template>
  <div class="container">
    <div class="buttonItem">
      <el-button type="success" @click="addCategory">新增</el-button>
    </div>

    <div class="title">商品分类管理列表</div>

    <el-table :data="categoryData" stripe style="width: 100%" v-loading="tableLoading">
      <el-table-column prop="id" label="分类ID" align="center"></el-table-column>
      <el-table-column prop="name" label="分类名称" align="center"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="update_time" label="更新时间" align="center"></el-table-column>

      <el-table-column fixed="right" label="操作" align="center" width="210px;">
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

     <el-dialog title="添加商品分类" :visible.sync="dialogFormVisible" width="700px">

      <el-form :model="operateForm" class="operateForm">
        <el-form-item label="分类名称：" label-width="100px">
          <el-input v-model="operateForm.name" autocomplete="off" placeholder="请输入分类名称"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCategory" v-loading="saveLoading">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  getCategoryListAPI,
  createOrEditCategoryAPI,
  getCategoryDetailAPI,
  deleteCategoryAPI,
} from '../../../services/index.js';
import { mapActions } from 'vuex';
import moment from 'moment';

export default {
  data() {
    return {
      categoryData: [],
      dialogFormVisible: false,
      operateForm: {
        id: '',
        name: '',
      },
      tableLoading: false,
      saveLoading: false,
      type: 'add',
    };
  },

  methods: {
    ...mapActions(['getCategoryList']),
    // 编辑事件
    async handleEdit(index, row) {
      const categoryData = await getCategoryDetailAPI({ id: row.id });
      if (categoryData.data.code === 0) {
        const data = categoryData.data.data;
        this.dialogFormVisible = true;
        this.type = 'edit';
        this.operateForm = { id: data.id, name: data.name };
        this.getCategoryList();
      } else {
        this.$message({
          type: 'error',
          message: categoryData.data.message,
        });
      }
    },

    //删除事件
    handleDelete(index, row) {
      this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const params = { id: row.id };
          const res = await deleteCategoryAPI(params);
          if (res.data.code === 0) {
            this.queryCategoryList();
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

    //保存分类数据
    saveCategory() {
      const { id, name } = this.operateForm;
      const params = { id, name };
      this.saveLoading = true;

      createOrEditCategoryAPI(params).then(res => {
        this.saveLoading = false;
        if (res.data.code === 0) {
          this.queryCategoryList();
          this.resetOperateForm();
          this.$message({
            message: this.type === 'add' ? '添加成功' : '修改成功',
            type: 'success',
          });
          this.getCategoryList();
          this.dialogFormVisible = false;
        } else {
          this.$message({
            type: 'error',
            message: res.data.message,
          });
        }
      });
    },

    //新增分类
    addCategory() {
      // 连续点新增不清空表单数据
      if (this.type !== 'add') {
        this.type = 'add';
        this.resetOperateForm();
      }
      this.dialogFormVisible = true;
    },

    // 重置弹窗表单
    resetOperateForm() {
      this.operateForm = { id: '', name: '' };
    },

    //获取分类列表
    queryCategoryList() {
      this.tableLoading = true;
      getCategoryListAPI().then(res => {
        this.tableLoading = false;
        if (res.data.code === 0) {
          this.categoryData = res.data.data.map(item => ({
            id: item.id,
            name: item.name,
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
    this.queryCategoryList();
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
