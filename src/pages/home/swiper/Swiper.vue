<template>
  <div class="container">
    <el-carousel height="250px" trigger="click" type="card">
      <el-carousel-item
        v-for="item of bannerData"
        :key="item.id"
        @click.native="clickItem(item.goods_id)"
        :title="item.title"
      >
        <img :src="item.picture" width="100%">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import {getBannerListAPI} from '../../../services'

export default {
  data () {
    return {
      bannerLength: 5,
      bannerData: []
    }
  },
  methods: {

    // 点击公告图事件
    clickItem(goods_id) {
      this.$router.push(`/goods/${goods_id}`)
    },
    getBannerList() {
      getBannerListAPI({number: this.bannerLength}).then(res => {
        const data = res.data
        if (data.code === 0 ) {
         this.bannerData = data.data
        }else {
          this.$message({
            type: 'error',
            message: res.data.message,
          });
        }
      })
    }
  },
  created() {
    this.getBannerList()
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 1200px;
  margin: 0 auto;
  margin-bottom: 50px;
}
.el-carousel {
  width: 100%;
}
</style>
