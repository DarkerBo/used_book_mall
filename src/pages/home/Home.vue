<template>
  <div class="container">
    <transition name="search">
      <search v-if="showSearch" style="background-color: #fff"/>
    </transition>

    <home-header/>
    <swiper/>

    <div class="search">
      <el-autocomplete
        class="searchInput"
        v-model="selectValue"
        :fetch-suggestions="debounce(searchGoods, 300)"
        placeholder="请输入内容"
        :trigger-on-focus="false"
        @select="handleSelect"
        prefix-icon="el-icon-search"
      ></el-autocomplete>
    </div>

    <goods-list/>

    <!-- 版权 -->
  </div>
</template>

<script>
import HomeHeader from "../../components/header/Header";
import Swiper from "./swiper/Swiper";
import Search from "./search/Search";
import GoodsList from "./goodslist/GoodsList";
import throttle from "../../utils/throttle.js";
import { searchGoodsAPI, getGoodsListAPI } from "../../services/index.js";
import debounce from "../../utils/debounce.js";

export default {
  data() {
    return {
      selectValue: "",
      showSearch: false,
      debounce
    };
  },

  methods: {
    //滚动到一定距离出现搜索框
    showSearchContainer() {
      this.showSearch = window.pageYOffset > 560;
    },

    // 搜索关键字触发的方法
    searchGoods(queryString, cb) {
      const params = { value: queryString };

      searchGoodsAPI(params).then(res => {
        const data = res.data;
        if (data.code === 0) {
          const searchData = data.data
            ? data.data
                .map(item => ({ value: item.name, id: item.id }))
                .slice(0, 8)
            : [];
          cb(searchData);
        } else {
          this.$message({
            message: data.message,
            type: "error"
          });
          cb([]);
        }
      });
    },

    handleSelect(data) {
      this.$router.push(`/goods/${data.id}`);
    }
  },

  components: {
    HomeHeader,
    Swiper,
    Search,
    GoodsList
  },

  mounted() {
    window.addEventListener("scroll", throttle(this.showSearchContainer, 250));
  }
};
</script>

<style lang="scss" scoped>
.container {
  // 最外层容器样式
  background-color: #f5f7fc;

  .search {
    //输入框的容器
    padding: 30px 0;
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    .searchInput {
      width: 700px;
      height: 56px;
    }
  }
}
</style>

<style lang="scss" scoped>
.el-carousel {
  max-width: 100%;
  box-sizing: border-box;
}

.search-enter-active,
.search-leave-active {
  transition: all 0.3s ease;
}

.search-enter,
.search-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}
</style>
