<template>
  <div class="container">
    <el-card>
      <div slot="header">
        <span class="title">我的订单</span>
      </div>
      <div v-for="order of orderList" :key="order.id" class="item">
        <ul class="order_list">
          <li>订单号：{{order.id}}</li>
          <li>
            订单金额：
            <span style="color: red;">&yen;&nbsp;{{order.money}}</span>
          </li>
          <li>商品名称：{{order.name}}</li>
          <li>购买数量：{{order.amount}}</li>
          <li>下单时间：{{moment(order.create_time).format('YYYY-MM-DD HH:mm:ss')}}</li>
          <li class="operate">
            <el-button type="primary" size="small" @click="clickAssess(order.goods_id)">评价</el-button>
            <el-button type="danger" size="small" @click="deleteOrder(order.id)">删除</el-button>
          </li>
        </ul>
      </div>

      <p class="tips" v-if="!orderList.length">暂无订单，快去购买商品吧~</p>
    </el-card>

    <!-- 弹窗表单 -->
    <el-dialog title="用户评价" :visible.sync="dialogFormVisible">
      <el-form :model="assessForm">
        <el-form-item label="评价等级：" label-width="100">
          <el-radio v-model="assessForm.rank" label="0">好评</el-radio>
          <el-radio v-model="assessForm.rank" label="1">中评</el-radio>
          <el-radio v-model="assessForm.rank" label="2">差评</el-radio>
        </el-form-item>

        <el-form-item label="评价分数：" label-width="100" class="score">
          <div>
            <el-rate
              v-model="assessForm.score"
              :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
              text-color="rgb(255, 153, 0)"
              show-score
              score-template="{value}"
              allow-half
            ></el-rate>
          </div>
        </el-form-item>

        <el-form-item label="评价内容：" label-width="100" class="message">
          <el-input
            type="textarea"
            resize="none"
            :autosize="{ minRows: 4}"
            placeholder="请输入评价内容"
            v-model="assessForm.content"
            maxlength="100"
          ></el-input>
          <span class="count">{{assessForm.content.length}}/100</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAssess">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserOrderAPI,
  createAssessAPI,
  deleteOrderAPI
} from "../../../services";
import moment from "moment";

export default {
  data() {
    return {
      orderList: [],
      moment,
      dialogFormVisible: false,
      assessForm: {
        content: "",
        rank: "0",
        score: 5
      },
      goodsId: ""
    };
  },
  methods: {
    getUserOrder() {
      getUserOrderAPI().then(res => {
        !res.code && (this.orderList = res.data);
      });
    },

    // 点击评价事件
    clickAssess(goodsId) {
      this.dialogFormVisible = true;
      this.goodsId = goodsId;
    },
    // 提交评价
    submitAssess() {
      const params = { ...this.assessForm, goods_id: this.goodsId };
      createAssessAPI(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: "success",
            message: "评价成功"
          });
          this.getUserOrder();
          this.assessForm = {
            content: "",
            rank: "0",
            score: 5
          };
          this.dialogFormVisible = false;
        } else {
          this.$message({
            type: "error",
            message: res.message
          });
        }
      });
    },

    //删除订单
    deleteOrder(id) {
      this.$confirm("此操作将删除该订单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = { id };
          deleteOrderAPI(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getUserOrder();
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
  created() {
    this.getUserOrder();
  }
};
</script>

<style lang="scss" scoped>
.container {
  //最外层容器样式
  padding: 40px 60px;
  box-sizing: border-box;
  .title {
    font-size: 20px;
  }
  .item {
    width: 100%;
    padding: 20px 40px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    margin: 24px 0;
    border-radius: 4px;
  }
  .tips {
    width: 100%;
    text-align: center;
    font-size: 22px;
    font-weight: bold;
    color: #666;
    line-height: 2;
    margin: 40px 0;
  }
  .order_list {
    > li {
      font-size: 14px;
      color: #666;
      line-height: 2;
    }
    .operate {
      text-align: right;
    }
  }
  .message {
    //评价样式
    position: relative;
    .count {
      //字数样式
      position: absolute;
      right: 10px;
      bottom: 0px;
    }
  }
  .score {
    //评分样式
    display: flex;
    align-items: center;
  }
}
</style>
