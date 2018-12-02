<template>
  <div class="container">
    <home-header/>
    <template v-if="goodsData">
      <div class="main">
        <div class="image">
          <img :src="goodsData.icon" alt="商品图片" width="300" height="300">
        </div>

        <div class="basic">
          <p class="title">{{goodsData.title}}</p>
          <p class="goodsName">{{goodsData.name}}</p>

          <div class="price">
            <span class="priceName">价格</span>
            <span class="priceValue">&yen;{{goodsData.price}}</span>
          </div>

          <div class="sales">
            <span class="salesName">总销量 {{goodsData.sale_amount || 0}} 件</span>
            <el-tag type="success" class="typeTag" v-if="goodsData.type === '1'">新品</el-tag>
            <el-tag type="danger" class="typeTag" v-else-if="goodsData.type === '2'">特价商品</el-tag>
            <span class="status" style="color: red" v-if="goodsData.status === '2'">下架商品</span>
          </div>

          <div class="computed">
            <el-input-number v-model="number" size="small" :min="1" :max="100" :precision="0"></el-input-number>
            <span class="stock">库存&nbsp;&nbsp;{{goodsData.stock}}&nbsp;&nbsp;件</span>
          </div>

          <div class="buttonGroup">
            <el-button type="success" class="purchase" @click="purchase">立即购买</el-button>
            <el-button type="danger" plain @click="addCart">加入购物车</el-button>
          </div>
        </div>

        <el-button type="primary" plain class="goBack" @click="goBack">回到主页 &gt;&gt;</el-button>
      </div>

      <div class="tabContainer">
        <el-tabs type="border-card" class="tabs">
          <!-- 商品详情 -->
          <el-tab-pane label="商品详情" class="tabItem">
            <div class="description">
              <p class="descTitle">商品描述</p>
              <div class="descText">{{goodsData.description}}</div>
            </div>
            <template v-if="goodsData.picture">
              <el-card
                class="imgCard"
                v-for="(item,index) of goodsData.picture.split(',')"
                :key="index"
              >
                <img :src="item" width="100%">
              </el-card>
            </template>

            <div v-else class="imgTips">不好意思，这个商品没有详情图~</div>
          </el-tab-pane>

          <!-- 用户评价 -->
          <el-tab-pane :label="`用户评价 ${assesslength}`" class="tabItem">
            <div class="totalAssess">
              <span class="totalScore">{{average}}</span>
              <el-rate v-model="score" disabled text-color="#ff9900" score-template="{value}"></el-rate>
              <span class="summary">
                <span
                  style="color: #EF4136; margin: 20px;"
                >好评率：{{rankPercent.good | assessToPercent}}</span>
                <span
                  style="color: #009ad6; margin: 20px; "
                >中评率：{{rankPercent.middle | assessToPercent}}</span>
                <span
                  style="color: #77787b; margin: 20px;"
                >差评率：{{rankPercent.bad | assessToPercent}}</span>
              </span>
            </div>

            <div
              class="assessList"
              v-for="assess of priorityAssessList.concat(assessList)"
              :key="assess.id"
            >
              <div class="userMsg">
                <div class="avatar">
                  <img :src="getAvatar(assess.avatar)" alt="头像" width="35px" height="35px">
                </div>
                <span class="nickname">{{assess.account}}</span>
              </div>

              <div class="assess">
                <div class="assess_header">
                  <el-rate
                    v-model="assess.score"
                    disabled
                    :allow-half="true"
                    text-color="#ff9900"
                    score-template="{value}"
                  ></el-rate>
                  <el-tag type="success" class="priority" v-if="assess.priority === '1'">置顶</el-tag>
                </div>
                <div class="content">{{assess.content}}</div>
                <span
                  class="create_time"
                >{{moment(assess.create_time).format('YYYY-MM-DD HH:mm:ss')}}</span>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>

    <div v-else class="tips">该商品不存在~</div>
  </div>
</template>

<script>
import HomeHeader from "../../components/header/Header";
import {
  getGoodsDetailAPI,
  createOrEditCartAPI,
  creteOrderAPI,
  getGoodsAssessAPI
} from "../../services/index.js";
import moment from "moment";

export default {
  data() {
    return {
      number: "",
      goodsData: null,
      score: 0,
      itemScore: 4.0,
      assessList: [],
      priorityAssessList: [],
      assesslength: 0,
      average: 0, //平均分
      rankPercent: {
        good: 0,
        middle: 0,
        bad: 0
      },
      moment
    };
  },

  methods: {
    goBack() {
      this.$router.push({ path: "/" });
    },
    addCart() {
      const params = {
        amount: this.number,
        goods_id: this.goodsData.id
      };
      createOrEditCartAPI(params).then(res => {
        if (!res.code) {
          this.$message({
            message: "成功加入购物车",
            type: "success"
          });
        } else {
          this.$message({
            message: res.message,
            type: "error"
          });
        }
      });
    },

    getAvatar(avatarUrl) {
      return avatarUrl || require("./people.png");
    },

    //立即购买
    purchase() {
      this.$confirm("是否结算所选商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          creteOrderAPI({
            goods_id: this.goodsData.id,
            amount: this.number
          }).then(res => {
            if (res.code === 0) {
              this.$message({
                type: "success",
                message: "购买成功"
              });
              this.getGoodsData();
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

    //获取商品详情
    getGoodsData() {
      const id = this.$route.params.id;
      const params = { id };
      getGoodsDetailAPI(params).then(res => {
        if (res.data.code === 0) this.goodsData = res.data.data;
      });
    },

    //获取商品评价列表
    getGoodsAssess() {
      const goods_id = this.$route.params.id;
      getGoodsAssessAPI({ goods_id }).then(res => {
        if (res.code === 0) {
          this.average = res.data.average ? res.data.average.toFixed(1) : 0;
          this.assesslength = res.data.length;
          this.score = res.data.average;

          res.data.rankPercent.forEach(item => {
            const { rank, percent } = item;

            rank === "0" && (this.rankPercent.good = percent);
            rank === "1" && (this.rankPercent.middle = percent);
            rank === "2" && (this.rankPercent.bad = percent);
          });

          res.data.assessList.forEach(item => {
            item.priority === "1"
              ? this.priorityAssessList.push(item)
              : this.assessList.push(item);
          });
        }
      });
    }
  },

  filters: {
    assessToPercent(val) {
      return Number(val) * 100 + "%";
    }
  },

  mounted() {
    this.getGoodsData();
    this.getGoodsAssess();
  },

  components: {
    HomeHeader
  }
};
</script>

<style lang="scss" scoped>
.main {
  //商品主要描述样式
  width: 100%;
  margin-top: 30px;
  display: flex;
  position: relative;
  .image {
    padding: 20px 10px;
    margin-left: 130px;
    border: 2px #ccc solid;
  }
  .basic {
    // 商品基本描述样式
    margin-left: 100px;
    .title {
      font-size: 18px;
      font-weight: bold;
      color: #666;
    }
    .goodsName {
      font-size: 17px;
      font-weight: 700;
      margin-top: 40px;
    }
    .price {
      margin-top: 40px;
      .priceName {
        font-size: 14px;
        color: #999;
      }
      .priceValue {
        font-size: 25px;
        color: #ff0036;
        font-weight: bold;
        margin-left: 30px;
      }
    }
    .sales {
      //销量
      margin-top: 40px;
      .salesName {
        color: #666;
        margin-right: 60px;
      }
      .status {
        margin-left: 40px;
      }
    }
    .computed {
      //数字计算器 + 库存
      margin-top: 40px;
      .stock {
        margin-left: 70px;
        color: #878787;
        font-size: 14px;
      }
    }
    .buttonGroup {
      //按钮组
      margin-top: 40px;
      .purchase {
        //立即购买按钮
        margin-right: 70px;
      }
    }
  }
  .goBack {
    //回到主页按钮
    position: absolute;
    top: -20px;
    right: 100px;
  }
}

.tabContainer {
  //tabs的外层容器
  width: 100%;
  margin-top: 50px;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f7fc;
  border-top: 2px #ccc solid;
  display: flex;
  justify-content: center;
  .tabs {
    width: 1200px;
  }
  .tabItem {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    .imgCard {
      //图片卡片样式
      width: 100%;
      height: auto;
      padding: 40px;
      box-sizing: border-box;
      margin-bottom: 20px;
    }
    .description {
      //商品描述
      width: 100%;
      margin: 20px 0;
      border-radius: 5px;
      box-shadow: 0 0 8px #ccc;

      .descTitle {
        font-size: 20px;
        font-weight: bold;
        color: #585eaa;
        margin-top: 20px;
        margin-left: 20px;
      }
      .descText {
        // margin: 20px 0 20px 20px;
        padding: 20px;
        word-break: break-all;
        line-height: 1.5;
        color: #444;
        text-align: justify;
        text-indent: 2em;
      }
    }
    .imgTips {
      width: 100%;
      text-align: center;
      font-size: 22px;
      font-weight: bold;
      color: #666;
      line-height: 2;
      margin: 40px;
    }
  }
  .totalAssess {
    //总评价
    width: 100%;
    margin: 20px 0;
    padding: 30px 0;
    border-radius: 5px;
    box-shadow: 0 0 4px #ccc;
    display: flex;
    align-items: center;
    .totalScore {
      font-size: 32px;
      color: #f60;
      line-height: 32px;
      margin-left: 60px;
      margin-right: 50px;
    }
    .summary {
      font-size: 22px;
      font-weight: bold;
      margin-left: 60px;
    }
  }
  .assessList {
    //评价列表
    width: 100%;
    padding: 20px;
    margin: 10px 0;
    box-sizing: border-box;
    border-radius: 5px;
    box-shadow: 0 0 4px #ccc;
    display: flex;
    .userMsg {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 200px;
      flex-shrink: 0;
      .avatar {
        height: 35px;
        width: 35px;
        border: 3px solid #eee;
        border-radius: 50%;
        overflow: hidden;
        margin-top: 20px;
      }
      .nickname {
        margin: 20px 0;
        font-size: 14px;
        color: #666;
      }
    }
  }
  .assess {
    flex: 1;
    display: flex;
    flex-direction: column;
    .assess_header {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
    }
    .content {
      padding: 24px 0;
      line-height: 1.5;
      text-align: justify;
      color: #666;
      word-break: break-all;
    }
    .create_time {
      font-size: 13px;
      color: #888;
    }
  }
}
.tips {
  width: 100%;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  color: #666;
  line-height: 2;
  margin-top: 80px;
}
</style>
