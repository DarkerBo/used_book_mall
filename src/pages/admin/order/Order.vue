<template>
  <div class="container">
    <el-form ref="form" :model="orderForm" label-width="100px" class="orderForm">
      <el-form-item label="订单ID：" class="orderFormItem">
        <el-input
          placeholder="请输入订单ID"
          v-model="orderForm.id"
          class="input-with-select search-input"
        ></el-input>
      </el-form-item>

      <div class="buttonItem">
        <el-button type="primary" class="button leftButton" @click="handleQueryOrderList">查询</el-button>
      </div>
    </el-form>

    <div class="title">订单管理列表</div>

    <el-table :data="orderData" stripe style="width: 100%" v-loading="tableLoading">
      <el-table-column prop="id" label="订单ID" align="center"></el-table-column>
      <el-table-column prop="money" label="订单价格" align="center"></el-table-column>
      <el-table-column prop="goods_id" label="商品ID" align="center"></el-table-column>
      <el-table-column prop="account" label="用户名" align="center"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>

      <el-table-column fixed="right" label="操作" align="center" width="210px">
        <template slot-scope="scope">
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
import { getOrderListAPI, deleteOrderAPI } from "../../../services/index.js";
import moment from "moment";
export default {
  data() {
    return {
      orderForm: {
        id: ""
      },
      orderData: [],
      tableLoading: false,
      pageNo: 1, //当前页,
      pageSize: 10, //当前页数据的数量
      totalCount: 0,
      condition: {} //查询条件
    };
  },

  methods: {
    //点击删除事件
    handleDelete(index, row) {
      this.$confirm("此操作将删除该订单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = { id: row.id };
          deleteOrderAPI(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.queryOrderList();
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

    //分页点击事件
    onPageChange(page) {
      this.pageNo = page;
      this.queryOrderList();
    },

    // 保存查询条件
    saveQueryCondition() {
      const { id } = this.orderForm;
      const condition = { id };
      this.condition = condition;
    },

    //查询订单
    handleQueryOrderList() {
      const { id } = this.orderForm;
      const reg = /^\d*$/;
      if (!reg.test(id)) {
        this.$message({
          message: "请输入正确的数字格式",
          type: "error"
        });
        return;
      }

      this.saveQueryCondition();
      this.queryOrderList();
    },

    //获取订单列表
    queryOrderList() {
      const params = {
        ...this.condition,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };

      this.tableLoading = true;
      getOrderListAPI(params).then(res => {
        this.tableLoading = false;
        if (res.code === 0) {
          this.totalCount = res.data.totalCount;
          this.orderData = res.data.result.map(item => ({
            id: item.id,
            money: item.money,
            account: item.account,
            goods_id: item.goods_id,
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
    this.queryOrderList();
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
  .orderForm {
    display: flex;
    flex-wrap: wrap;
    .orderFormItem {
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
