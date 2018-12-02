<template>
  <div class="container_cart">
    <el-table :data="cartListData" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="70"></el-table-column>
      <el-table-column prop="name" label="商品名称">
        <template slot-scope="scope">
          <div class="goods_name">
            <img :src="scope.row.icon" width="35" height="35" style="margin-right: 10px;">
            <span class="goodsName">{{scope.row.name}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.price}}&nbsp;&yen;</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="数量" align="center">
        <template slot-scope="scope">
          <el-input-number
            :value="scope.row.amount"
            @change="value => cartAmountChange(value, scope.row.id)"
            :precision="0"
            :min="1"
            :max="100"
            :disabled="!isEdit"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="小计" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.price * scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="deleteCart(scope.row)" :disabled="!isEdit">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="price">
      <div style="margin-right: 30px;">已选价格: {{selectPrice}} &yen;</div>
      <div>总价格: {{totalPrice}} &yen;</div>
    </div>
    <div class="operate">
      <el-button
        :type="isEdit ? 'primary' : 'warning'"
        style="margin-right: 16px;"
        @click="changeEditStatus"
        size="medium"
      >{{isEdit ? '保存' : '编辑'}}</el-button>
      <el-button
        type="success"
        size="medium"
        @click="batchCreateOrder"
        :disabled="isEdit || !selectTableRow.length"
      >结算</el-button>
    </div>
  </div>
</template>

<script>
import {
  getUserCartAPI,
  batchEditCartAPI,
  batchCreateOrderAPI
} from "../../../services/index.js";

export default {
  data() {
    return {
      cartListData: [],
      deleteList: [],
      isEdit: false,
      selectTableRow: [],
      selectPrice: 0
    };
  },
  computed: {
    totalPrice() {
      let total = 0;
      this.cartListData.forEach(c => {
        total += c.price * c.amount;
      });

      return total;
    }
  },
  methods: {
    getUserCart() {
      getUserCartAPI().then(res => {
        !res.code && (this.cartListData = res.data);
      });
    },
    cartAmountChange(value, id) {
      const index = this.cartListData.findIndex(item => item.id === id);
      const newCartData = {
        ...this.cartListData[index],
        amount: value
      };

      this.cartListData.splice(index, 1, newCartData);
    },
    deleteCart({ id }) {
      const index = this.cartListData.findIndex(item => item.id === id);
      this.cartListData.splice(index, 1);
      this.deleteList.push(id);
    },
    changeEditStatus() {
      if (this.isEdit) {
        const editList = this.cartListData.map(c => ({
          id: c.id,
          amount: c.amount
        }));
        const params = { editList, deleteList: this.deleteList };

        batchEditCartAPI(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: "success",
              message: "编辑成功"
            });
            this.getUserCart();
            this.isEdit === false;
          } else {
            this.$message({
              type: "error",
              message: res.message
            });
          }
        });
      }
      this.isEdit = !this.isEdit;
    },
    handleSelectionChange(data) {
      this.selectTableRow = data.map(row => row.id);
      let price = 0;
      data.forEach(row => {
        price += row.price * row.amount;
      });
      this.selectPrice = price;
    },
    batchCreateOrder() {
      this.$confirm("是否结算所选商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          batchCreateOrderAPI({ cartList: this.selectTableRow }).then(res => {
            if (res.code === 0) {
              this.$message({
                type: "success",
                message: "结算成功"
              });
              this.getUserCart();
            } else {
              this.$message({
                type: "error",
                message: res.message
              });
            }
          });
        })
        .catch(() => {});
    }
  },

  mounted() {
    this.getUserCart();
  }
};
</script>

<style lang="scss" scoped>
.container_cart {
  //最外层容器样式
  padding: 40px;
  .goods_name {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .price {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 50px;
    font-size: 18px;
    color: #666;
    font-weight: bold;
  }
  .operate {
    text-align: right;
    margin-top: 24px;
  }
}
</style>
