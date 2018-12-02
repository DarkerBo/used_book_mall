<template>
  <div class="container_tab">
    <el-tabs type="border-card" class="tabs" @tab-click="switchTab">
      <div class="model">
        <el-radio-group v-model="model" size="small" class="buttonGroup" v-if="goodsList.length">
          <el-radio-button label="menu" @click="changeMenu" title="菜单模式">
            <i class="el-icon-menu"></i>
          </el-radio-button>
          <el-radio-button label="list" @click="changeList" title="列表模式">
            <i class="el-icon-tickets"></i>
          </el-radio-button>
        </el-radio-group>
      </div>

      <el-tab-pane v-for="(item, index) of labelList" :label="item.name" :key="index">
        <menu v-if="model === 'menu'" :dataList="goodsList"></menu>
        <list v-else :dataList="goodsList"></list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Menu from "../../../components/model/Menu";
import List from "../../../components/model/List";
import { getGoodsListAPI } from "../../../services";

export default {
  data() {
    return {
      model: "menu",
      goodsList: []
    };
  },

  computed: {
    categoryList() {
      return this.$store.state.categoryList.map(c => ({
        name: c.name,
        category_id: c.id
      }));
    },
    labelList() {
      return [
        { name: "全部商品", value: "" },
        { name: "新品", type: "1" },
        { name: "特价商品", type: "2" },
        ...this.categoryList
      ];
    }
  },

  methods: {
    //切换成菜单模式
    changeMenu() {
      this.model = "menu";
    },

    //切换成列表模式
    changeList() {
      this.model = "list";
    },
    switchTab(item) {
      const currentTabData = this.labelList[Number(item.index)];
      this.getGoodsList(currentTabData);
    },

    // 获取商品列表
    getGoodsList(obj) {
      let params = { pageNo: 1, pageSize: 100 };
      if (obj.type) {
        params = { ...params, type: obj.type };
      } else if (obj.category_id) {
        params = { ...params, category_id: obj.category_id };
      }

      getGoodsListAPI(params).then(res => {
        const data = res.data;
        if (data.code === 0) this.goodsList = data.data.result;
      });
    }
  },

  created() {
    this.getGoodsList({});
  },

  components: { Menu, List }
};
</script>

<style lang="scss" scoped>
.container_tab {
  //最外层容器样式
  display: flex;
  justify-content: center;
  .tabs {
    width: 80%;
    margin: 40px 0;
    .model {
      //模式选择的容器
      text-align: end;
      .buttonGroup {
        //按钮组样式
        margin-right: 50px;
      }
    }
  }
}
</style>
