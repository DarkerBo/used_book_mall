<template>
  <div class="container">
    <el-form ref="form" :model="userForm" label-width="100px" class="userForm">
      <el-form-item label="用户名：" class="userFormItem">
        <el-input
          placeholder="请输入用户名"
          v-model="userForm.account"
          class="input-with-select search-input"
        ></el-input>
      </el-form-item>

      <div class="buttonItem">
        <el-button type="primary" class="button leftButton" @click="handleQueryUserList">查询</el-button>
        <el-button type="success" class="button" @click="addBusiness">新增商家</el-button>
      </div>
    </el-form>

    <div class="title">用户管理列表</div>

    <el-table :data="userData" stripe style="width: 100%" v-loading="tableLoading">
      <el-table-column prop="id" label="用户ID" align="center"></el-table-column>
      <el-table-column prop="account" label="用户名" align="center"></el-table-column>
      <el-table-column prop="nickname" label="用户昵称" align="center"></el-table-column>
      <el-table-column prop="sex" label="性别" align="center">
        <template slot-scope="scope">
          <i class="icon iconfont" v-if="scope.row.sex === '未知'" style="font-size: 20px;">&#xe633;</i>
          <i
            class="icon iconfont"
            v-else-if="scope.row.sex === '男'"
            style="color: #1296db; font-size: 20px;"
          >&#xe636;</i>
          <i class="icon iconfont" v-else style="color: #d4237a; font-size: 20px;">&#xe635;</i>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="账户类型" align="center"></el-table-column>
      <el-table-column prop="status" label="用户状态" align="center">
        <template slot-scope="scope">
          <span
            :style="{color: scope.row.status === '0' ? 'green' : 'red'}"
          >{{scope.row.status === '0' ? '正常' : '冻结'}}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" align="center" width="210px;">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :type="scope.row.status === '0' ? 'warning' : 'success'"
            @click="handleToggle(scope.$index, scope.row)"
          >{{scope.row.status === '0' ? '冻结' : '解冻'}}</el-button>
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

    <el-dialog title="添加商家账户" :visible.sync="dialogFormVisible" width="700px">
      <el-form :model="operateForm" class="operateForm">
        <el-form-item label="用户名：" label-width="120px">
          <el-input v-model="operateForm.account" autocomplete="off" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item label="密码：" label-width="120px">
          <el-input v-model="operateForm.password" autocomplete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveBusiness" v-loading="saveLoading">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserListAPI,
  addSellerAPI,
  freezeOrThawUserAPI
} from "../../../services/index.js";

export default {
  data() {
    return {
      userForm: {
        account: ""
      },
      userData: [],
      operateForm: {
        account: "",
        password: ""
      },
      toggle: "sss",
      type: "add",
      isShowPassword: true,
      dialogFormVisible: false,
      tableLoading: false,
      saveLoading: false,
      pageNo: 1, //当前页
      pageSize: 10, //当前页数据的数量
      totalCount: 0,
      condition: {} //查询条件
    };
  },

  computed: {
    sexType() {
      return [
        { name: "未知", value: "0" },
        { name: "男", value: "1" },
        { name: "女", value: "2" }
      ];
    },
    userType() {
      return [{ name: "用户", value: "0" }, { name: "商家", value: "1" }];
    }
  },

  methods: {
    sexIcon(sex) {
      if (sex === "1") return "&#xe635;";
      else if (sex === "2") return "&#xe636;";
      else return "&#xe633;";
    },

    // 用户冻结/解冻事件
    handleToggle(index, row) {
      const status = row.status === "0" ? "冻结" : "解冻";

      this.$confirm(`此操作将${status}该商品, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = {
            account: row.account,
            status: row.status === "0" ? "1" : "0"
          };
          freezeOrThawUserAPI(params).then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: "success",
                message: `${status}成功`
              });
              this.handleQueryUserList();
            } else {
              this.$message({
                type: "error",
                message: res.data.message
              });
            }
          });
          this.$message({
            type: "success",
            message: `设置${status}操作成功`
          });
        })
        .catch(() => {});
    },

    // 分页页面改变事件
    onPageChange(page) {
      this.pageNo = page;
      this.queryUserList();
    },

    //新增商家
    addBusiness() {
      // 连续点新增不清空表单数据
      if (this.type !== "add") {
        this.type = "add";
        this.resetOperateForm();
      }

      this.dialogFormVisible = true;
    },

    //清空弹窗表单数据
    resetOperateForm() {
      this.operateForm = { account: "", password: "" };
    },

    //保存商家信息
    saveBusiness() {
      const { account, password } = this.operateForm;
      const params = { account, password };
      this.saveLoading = true;
      addSellerAPI(params).then(res => {
        if (res.data.code === 0) {
          this.queryUserList();
          this.resetOperateForm();
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.dialogFormVisible = false;
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },

    //点击查询用户列表
    handleQueryUserList() {
      this.saveQueryCondition();
      this.queryUserList();
    },

    //获取用户资料列表
    queryUserList() {
      const params = {
        ...this.condition,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };

      this.tableLoading = true;

      getUserListAPI(params).then(res => {
        this.tableLoading = false;
        if (res.data.code === 0) {
          const { result, totalCount } = res.data.data;
          this.totalCount = totalCount;
          this.userData = result.map(item => ({
            id: item.id,
            account: item.account,
            nickname: item.nickname,
            sex: this.sexType.find(s => s.value === item.sex).name,
            type: this.userType.find(u => u.value === item.type).name,
            status: item.status
          }));
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          });
        }
      });
    },

    //重置查询表单
    resetQueryForm() {
      this.userForm = { account: "" };
      this.pageNo = 1;
      this.queryUserList();
    },

    // 保存查询条件
    saveQueryCondition() {
      const { account } = this.userForm;
      const condition = { account };
      this.condition = condition;
    }
  },

  mounted() {
    this.queryUserList();
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
  .userForm {
    display: flex;
    flex-wrap: wrap;
    .userFormItem {
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
