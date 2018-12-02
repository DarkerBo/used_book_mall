<template>
  <div>
    <ul class="goodsList">
      <li class="goodItem" v-for="item of goodsList" :key="item.id" @click="goDetail(item.id)">
        <img :src="item.icon" alt="商品" class="image">
        <p class="name">{{item.name}}</p>
        <p class="price">
          <span class="now">&yen;{{item.price.toFixed(2)}}</span>
          <!-- <span class="before">&yen;68.00</span> -->
        </p>
        <p class="remark">
          <span class="amount">总销量{{item.sale_amount || 0}}件</span>
          <el-tag type="success" v-if="item.type === '1'">新品</el-tag>
          <el-tag type="danger" v-else-if="item.type === '2'">特价商品</el-tag>
        </p>

        <p class="detail">点击进入商品详情&gt;&gt;</p>
      </li>
    </ul>
    <div class="tips" v-if="goodsList.length === 0">不好意思，暂无此类商品，看看其他分类吧~</div>
  </div>
</template>

<script>
export default {
  props: {
    dataList: Array
  },

  computed: {
    goodsList() {
      return this.dataList;
    }
  },

  methods: {
    goDetail(id) {
      this.$router.push({ path: `/goods/${id}` });
    }
  }
};
</script>

<style lang="scss" scoped>
.goodsList {
  //商品列表样式
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;

  .goodItem {
    //单个商品li的样式
    cursor: pointer;
    padding: 20px 10px;
    margin: 30px 30px;
    border: 2px solid #e9e9e9;
    transition: all 0.5s ease-out;
    background-color: #fff;
    &:hover {
      border: 2px solid #ee7a23;
      box-shadow: 0 0 10px #999;
      transform: translateY(-5px);
    }
    .image {
      width: 200px;
      height: 200px;
    }
    .name {
      //商品名字样式
      font-weight: bold;
      margin-left: 20px;
      margin-top: 20px;
    }
    .price {
      margin-top: 20px;
      margin-left: 20px;
      .now {
        //现价文字样式
        font-size: 18px;
        color: #fa2846;
      }
      .before {
        //原价文字样式
        margin-left: 10px;
        text-decoration: line-through;
        color: #666;
        font-size: 12px;
      }
    }
    .remark {
      margin-top: 20px;
      margin-left: 20px;
      .amount {
        //总销量文字样式
        margin-right: 30px;
        font-size: 12px;
        color: #ccc;
      }
    }
    .detail {
      //点击进入的文字样式
      margin-top: 20px;
      color: #6297b9;
      padding-left: 15px;
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
  margin: 30px 0;
}
</style>
