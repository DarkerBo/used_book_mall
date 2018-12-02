<template>
  <div class="container">
    <el-form ref="form" :model="assessForm" label-width="100px" class="assessForm">
      <el-form-item label="商品ID：" class="assessFormItem">
        <el-input
          placeholder="请输入商品ID"
          v-model="assessForm.goods_id"
          class="input-with-select search-input"
        ></el-input>
      </el-form-item>

      <el-form-item label="用户名：" class="assessFormItem">
        <el-input
          placeholder="请输入用户名"
          v-model="assessForm.account"
          class="input-with-select search-input"
        ></el-input>
      </el-form-item>

      <div class="buttonItem">
        <el-button type="primary" class="button leftButton" @click="handleQueryAssessList">查询</el-button>
        <el-button plain class="button leftButton" @click="resetQueryForm">重置</el-button>
      </div>
    </el-form>

    <div class="title">商品评价管理列表</div>

    <el-table :data="assessData" stripe style="width: 100%" v-loading="tableLoading">
      <el-table-column prop="id" label="评价ID" align="center"></el-table-column>
      <el-table-column prop="goods_id" label="商品ID" align="center"></el-table-column>
      <el-table-column prop="user_id" label="用户ID" align="center"></el-table-column>
      <el-table-column prop="account" label="用户名" align="center"></el-table-column>
      <el-table-column prop="priority" label="评价状态" align="center">
        <template slot-scope="scope">
          <span
            :style="{color: scope.row.priority === '0' ? '#999' : 'green'}"
          >{{scope.row.priority === '0' ? '普通' : '置顶'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>

      <el-table-column fixed="right" label="操作" align="center" width="210px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :type="scope.row.priority === '0' ? 'success' : 'warning'"
            @click="handleToggle(scope.$index, scope.row)"
          >{{scope.row.priority === '0' ? '置顶' : '撤销'}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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
  getAssessListAPI,
  deleteAssessAPI,
  changePriorityAPI
} from "../../../services/index.js";
import moment from "moment";

export default {
  data() {
    return {
      assessForm: {
        goods_id: "",
        account: ""
      },
      assessData: [],
      tableLoading: false,
      condition: {}, //查询条件
      pageNo: 1, //当前页,
      pageSize: 10, //当前页数据的数量
      totalCount: 0
    };
  },

  methods: {
    //删除事件
    handleDelete(index, row) {
      this.$confirm("此操作将删除该评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = { id: row.id };
          deleteAssessAPI(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.queryAssessList();
            } else {
              this.$message({
                type: "error",
                message: res.message
              });
            }
          });
        })
        .catch(() => {});
    },

    //置顶/取消置顶事件
    handleToggle(index, row) {
      const priority = row.priority === "0" ? "置顶" : "撤销";

      this.$confirm(`此操作将${priority}该商品, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = {
            id: row.id,
            priority: row.priority === "0" ? "1" : "0"
          };
          changePriorityAPI(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: "success",
                message: `${priority}成功`
              });
              this.handleQueryAssessList();
            } else {
              this.$message({
                type: "error",
                message: res.message
              });
            }
          });
          this.$message({
            type: "success",
            message: `设置${priority}操作成功`
          });
        })
        .catch(() => {});
    },

    //查询事件
    handleQueryAssessList() {
      const { goods_id } = this.assessForm;
      const reg = /^\d*$/;
      if (!reg.test(goods_id)) {
        this.$message({
          message: "请输入正确的数字格式",
          type: "error"
        });
        return;
      }

      this.saveQueryCondition();
      this.queryAssessList();
    },

    // 保存查询条件
    saveQueryCondition() {
      const { goods_id, account } = this.assessForm;
      const condition = { goods_id, account };
      this.condition = condition;
    },

    //重置查询表单
    resetQueryForm() {
      this.assessForm = { account: "", goods_id: "" };
      this.pageNo = 1;
      this.handleQueryAssessList();
    },

    //分页点击事件
    onPageChange(page) {
      this.pageNo = page;
      this.queryAssessList();
    },

    //获取评价信息列表
    queryAssessList() {
      const params = {
        ...this.condition,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      this.tableLoading = true;
      getAssessListAPI(params).then(res => {
        this.tableLoading = false;
        if (res.code === 0) {
          this.totalCount = res.data.totalCount;
          this.assessData = res.data.result.map(item => ({
            id: item.id,
            goods_id: item.goods_id,
            user_id: item.user_id,
            account: item.account,
            goods_id: item.goods_id,
            priority: item.priority,
            create_time: moment(item.create_time).format("YYYY-MM-DD HH:mm:ss")
          }));
        } else {
          this.$message({
            message: res.message,
            type: "error"
          });
        }
      });
    }
  },

  mounted() {
    this.queryAssessList();
  }
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
  .assessForm {
    display: flex;
    flex-wrap: wrap;
    .assessFormItem {
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
