<template>
  <div class="container">
    <el-form ref="form" :model="goodsForm" label-width="100px" class="goodsForm">
      <el-form-item label="商品ID：" class="goodsFormItem">
        <el-input
          placeholder="请输入商品ID"
          v-model="goodsForm.id"
          class="input-with-select search-input"
        ></el-input>
      </el-form-item>

      <el-form-item label="商品名称：" class="goodsFormItem">
        <el-input
          placeholder="请输入商品名称"
          v-model="goodsForm.name"
          class="input-with-select search-input"
        ></el-input>
      </el-form-item>

      <el-form-item label="商品分类：" class="goodsFormItem">
        <el-select v-model="goodsForm.category" placeholder="请选择分类" style="width: 160px;">
          <el-option label="所有分类" value key="-1"></el-option>
          <el-option
            v-for="(item, index) of categoryList"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商品类型：" class="goodsFormItem">
        <el-select v-model="goodsForm.type" placeholder="请选择类型" style="width: 160px;">
          <el-option label="所有类型" value></el-option>
          <el-option label="新品" :value="1"></el-option>
          <el-option label="特价商品" :value="2"></el-option>
          <el-option label="普通商品" :value="3"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商品状态：" class="goodsFormItem">
        <el-select v-model="goodsForm.status" placeholder="请选择状态" style="width: 160px;">
          <el-option label="所有状态" value></el-option>
          <el-option label="上架" :value="1"></el-option>
          <el-option label="下架" :value="2"></el-option>
        </el-select>
      </el-form-item>

      <div class="buttonItem">
        <el-button type="primary" class="button leftButton" @click="handleQueryGoodsList">查询</el-button>
        <el-button class="button leftButton" @click="resetQueryForm">重置</el-button>
        <el-button type="success" class="button" @click="addGoods">新增</el-button>
      </div>
    </el-form>

    <div class="title">商品管理列表</div>

    <el-table :data="goodsData" stripe style="width: 100%" v-loading="tableLoading">
      <el-table-column prop="id" label="商品ID" align="center"></el-table-column>
      <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
      <el-table-column prop="category" label="商品分类" align="center"></el-table-column>
      <el-table-column prop="type" label="商品类型" align="center"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>
      <el-table-column label="商品状态" align="center">
        <template slot-scope="scope">
          <span
            :style="{color: scope.row.status === '1' ? 'green' : 'red'}"
          >{{scope.row.status === '1' ? '上架' : '下架'}}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" align="center" width="210px;">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :type="scope.row.status === '1' ? 'warning' : 'success'"
            @click="handleToggle(scope.$index, scope.row)"
          >{{scope.row.status === '1' ? '下架' : '上架'}}</el-button>
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="type === 'add' ? '添加商品' : '编辑商品'"
      :visible.sync="dialogFormVisible"
      width="700px"
    >
      <el-form :model="operateForm" class="operateForm">
        <el-form-item label="商品名称：" label-width="100px">
          <el-input v-model="operateForm.name" autocomplete="off" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品价格：" label-width="100px">
          <el-input v-model="operateForm.price" autocomplete="off" placeholder="请输入商品价格"></el-input>
        </el-form-item>
        <el-form-item label="库存数量：" label-width="100px">
          <el-input v-model="operateForm.stock" autocomplete="off" placeholder="请输入库存数量"></el-input>
        </el-form-item>
        <el-form-item label="商品标题：" label-width="100px">
          <el-input v-model="operateForm.title" autocomplete="off" placeholder="请输入商品标题"></el-input>
        </el-form-item>
        <el-form-item label="商品描述：" label-width="100px">
          <el-input
            type="textarea"
            resize="none"
            v-model="operateForm.description"
            autocomplete="off"
            placeholder="请输入商品描述"
          ></el-input>
        </el-form-item>

        <el-form-item label="商品分类：" label-width="100px">
          <el-select v-model="operateForm.category_id" placeholder="请选择商品类别" style="width: 100%;">
            <el-option
              v-for="item of categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品类型：" label-width="100px">
          <el-select v-model="operateForm.type" placeholder="请选择商品类型" style="width: 100%;">
            <el-option
              v-for="type of goodsType"
              :label="type.name"
              :value="type.value"
              :key="type.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品缩略图：" label-width="100px">
          <el-upload
            :show-file-list="false"
            :auto-upload="false"
            action
            :on-change="handleIconSuccess"
            list-type="picture-card"
            class="iconContainer"
          >
            <img v-if="iconSrc" :src="iconSrc" class="icon">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="商品详情图：" label-width="100px">
          <el-upload
            action
            :auto-upload="false"
            list-type="picture-card"
            :on-change="handlePictureSuccess"
            :on-remove="handlePictureRemove"
            :multiple="true"
            :limit="8"
            ref="upload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveGoods" v-loading="saveLoading">保存</el-button>
      </div>
    </el-dialog>

    <div class="pagination">
      <el-pagination
        @current-change="onPageChange"
        :current-page="pageNo"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  addOrEditGoodsAPI,
  getGoodsListAPI,
  changeGoodsStatusAPI,
  getGoodsDetailAPI
} from "../../../services/index.js";
import moment from "moment";

export default {
  data() {
    return {
      goodsForm: {
        id: "",
        name: "",
        category: "",
        type: "",
        status: ""
      },
      goodsData: [],
      dialogFormVisible: false,
      operateForm: {
        id: "",
        name: "",
        title: "",
        stock: "",
        price: "",
        description: "",
        category_id: "",
        type: "",
        icon: null,
        picture: []
      },
      type: "add",
      saveLoading: false,
      pageNo: 1, //当前页
      pageSize: 10, //当前页数据的数量
      totalCount: 0,
      tableLoading: false,
      condition: {} //查询条件
    };
  },

  computed: {
    categoryList() {
      return this.$store.state.categoryList;
    },
    iconSrc() {
      const icon = this.operateForm.icon;
      return icon ? window.URL.createObjectURL(icon) : "";
    },
    goodsType() {
      return [
        { name: "新品", value: "1" },
        { name: "特价商品", value: "2" },
        { name: "普通商品", value: "3" }
      ];
    }
  },

  methods: {
    // 编辑事件
    async handleEdit(index, row) {
      const goodsData = await getGoodsDetailAPI({ id: row.id });

      if (goodsData.data.code === 0) {
        const data = goodsData.data.data;

        this.dialogFormVisible = true;
        this.type = "edit";
        this.operateForm = {
          id: data.id,
          name: data.name,
          title: data.title,
          stock: data.stock,
          price: data.price,
          description: data.description,
          category_id: data.category_id,
          type: data.type,
          icon: null,
          picture: []
        };
        this.$refs.upload && this.$refs.upload.clearFiles();
      } else {
        this.$message({
          type: "error",
          message: goodsData.data.message
        });
      }
    },

    // 上传缩略图icon事件
    handleIconSuccess(file) {
      this.operateForm.icon = file.raw;
    },

    // 上传详情图picture事件
    handlePictureSuccess(file, fileList) {
      if (fileList.length === 8) {
        this.$message({
          message: "最多上传8张商品详情图",
          type: "warning"
        });
      }
      this.operateForm.picture = fileList.map(item => item.raw);
    },

    // 移除详情图picture事件
    handlePictureRemove(file, fileList) {
      this.operateForm.picture = fileList.map(item => item.raw);
    },

    // 商品上下架
    handleToggle(index, row) {
      const status = row.status === "1" ? "下架" : "上架";

      this.$confirm(`此操作将${status}该商品, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = {
            id: row.id,
            status: row.status === "1" ? "2" : "1"
          };
          changeGoodsStatusAPI(params).then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: "success",
                message: `${status}成功`
              });
              this.queryGoodsList();
            } else {
              this.$message({
                type: "error",
                message: res.data.message
              });
            }
          });
          this.$message({
            type: "success",
            message: `设置${status}操作成功`
          });
        })
        .catch(() => {});
    },

    // 添加商品
    addGoods() {
      // 连续点新增不清空表单数据
      if (this.type !== "add") {
        this.type = "add";
        this.resetOperateForm();
      }

      this.dialogFormVisible = true;
    },

    // 保存商品数据
    saveGoods() {
      const {
        id,
        name,
        title,
        stock,
        price,
        description,
        category_id,
        type,
        icon,
        picture
      } = this.operateForm;

      const formData = new FormData();
      formData.append("id", id);
      formData.append("name", name);
      formData.append("title", title);
      formData.append("stock", stock);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("category_id", category_id);
      formData.append("type", type);
      formData.append("icon", icon);
      picture.forEach(file => formData.append("picture", file));

      this.$confirm("是否保存商品信息？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.saveLoading = true;

          addOrEditGoodsAPI(formData).then(res => {
            this.saveLoading = false;

            if (res.data.code === 0) {
              this.queryGoodsList();
              this.resetOperateForm();
              this.$message({
                message: this.type === "add" ? "添加成功" : "修改成功",
                type: "success"
              });
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: res.data.message,
                type: "error"
              });
            }
          });
        })
        .catch(() => {});
    },

    // 重置查询表单
    resetQueryForm() {
      this.goodsForm = {
        id: "",
        name: "",
        category: "",
        type: "",
        status: ""
      };
      this.pageNo = 1;

      this.handleQueryGoodsList();
    },

    // 分页页面改变事件
    onPageChange(page) {
      this.pageNo = page;
      this.queryGoodsList();
    },

    // 点击查询商品列表
    handleQueryGoodsList() {
      const { id } = this.goodsForm;
      //如果输入的不是数字的话, 报错;
      const reg = /^\d*$/;
      if (!reg.test(id)) {
        this.$message({
          message: "请输入正确的数字格式",
          type: "error"
        });
        return;
      }

      this.saveQueryCondition();
      this.queryGoodsList();
    },

    //获取商品资料列表
    queryGoodsList() {
      const params = {
        ...this.condition,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };

      this.tableLoading = true;

      getGoodsListAPI(params).then(res => {
        this.tableLoading = false;

        if (res.data.code === 0) {
          const { result, totalCount } = res.data.data;

          this.totalCount = totalCount;
          this.goodsData = result.map(item => ({
            id: item.id,
            name: item.name,
            category: this.categoryList.find(c => c.id === item.category_id)
              .name,
            type: this.goodsType.find(t => t.value === item.type).name,
            status: item.status,
            create_time: moment(item.create_time).format("YYYY-MM-DD HH:mm:ss")
          }));
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          });
        }
      });
    },

    // 保存查询条件
    saveQueryCondition() {
      const { id, name, category, type, status } = this.goodsForm;
      const condition = {
        id,
        name,
        category_id: category,
        type,
        status
      };

      this.condition = condition;
    },

    //重置弹窗表单
    resetOperateForm() {
      this.operateForm = {
        id: "",
        name: "",
        title: "",
        stock: "",
        price: "",
        description: "",
        category_id: "",
        type: "",
        icon: null,
        picture: []
      };
      this.$refs.upload && this.$refs.upload.clearFiles();
    }
  },

  mounted() {
    this.queryGoodsList();
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 40px;
  box-sizing: border-box;
  .goodsForm {
    display: flex;
    flex-wrap: wrap;
    .goodsFormItem {
      margin-left: 20px;
      .search-input {
        width: 160px;
      }
    }
    .buttonItem {
      margin-left: 30px;
      .leftButton {
        margin-right: 15px;
      }
    }
  }
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
  .pagination {
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>
