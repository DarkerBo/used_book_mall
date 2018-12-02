<template>
  <div class="container_search">
    <span class="name">Secondhand book mall</span>
    <el-autocomplete
      class="selectInput"
      v-model="searchValue"
      :fetch-suggestions="debounce(searchGoods,300)"
      placeholder="请输入你要搜索的商品"
      :trigger-on-focus="false"
      @select="handleSelect"
      prefix-icon="el-icon-search"
    ></el-autocomplete>
  </div>
</template>

<script>
import { searchGoodsAPI } from "../../../services/index.js";
import debounce from "../../../utils/debounce.js";

export default {
  data() {
    return {
      searchValue: "",
      debounce
    };
  },
  methods: {
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
            message: res.data.message,
            type: "error"
          });
          cb([]);
        }
      });
    },

    handleSelect(data) {
      this.$router.push(`/goods/${data.id}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.container_search {
  // 容器样式
  height: 50px;
  width: 100%;
  padding: 10px 0;
  border-bottom: 2px solid #ccc;
  background: url("./shop.png") no-repeat 115px 10px;
  background-size: 30px 30px;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  .name {
    //商店名字样式
    font-size: 22px;
    font-weight: bold;
    margin-left: 150px;
  }
  .selectInput {
    width: 600px;
    margin-left: 50px;
  }
}
</style>
