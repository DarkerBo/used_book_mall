<template>
  <div class="container">
    <div class="warpper">
        <template v-if="hasAddress">
          <el-button type="success" plain @click="handleEditClick">编辑收获地址</el-button>
          <span class="remarks">点击按钮编辑收货地址</span>
        </template>

        <template v-else>
          <el-button type="success" plain @click="handleEditClick">新增收获地址</el-button>
          <span class="remarks" >点击按钮新增收货地址，最多只有1个收货地址</span>
        </template>


        <!-- <el-tag  class="remarks">点击左边按钮新增收货地址，最多只有一个收货地址</el-tag> -->
        <div class="addressView">

          <!-- 有地址信息的时候显示这个 -->
          <div class="hasAddress" v-if="hasAddress">
            <p class="message">
              <span class="name">收货人：</span>
              <span class="value">{{addressMessage.name}}</span>
            </p>

            <p class="message">
              <span  class="name">所在地区：</span>
              <span  class="value">{{addressMessage.area}}</span>
            </p>

            <p class="message">
              <span  class="name">详细地址：</span>
              <span class="value">{{addressMessage.address}}</span>
            </p>

            <p class="message">
              <span  class="name">手机号码：</span>
              <span class="value">{{addressMessage.phone}}</span>
            </p>

            <!-- <el-button type="primary" icon="el-icon-edit" class="editButton">编辑地址</el-button> -->
          </div>

           <!-- 没有有地址信息的时候显示这个 -->
          <div class="noAddress" v-else>
            <p class="noAddressText">你还没添加收货地址，赶紧点击左上角的按钮添加吧~</p>
          </div>

        </div>

        <el-dialog title="收货地址" :visible.sync="dialogShow">
          <!-- 填写地址表单 -->
          <el-form :model="addressForm">
            <el-form-item label="收货人姓名：" :label-width="formLabelWidth">
              <el-input v-model="addressForm.name" autocomplete="off"
                      placeholder="请输入收货人姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号码：" :label-width="formLabelWidth">
              <el-input v-model="addressForm.phone" autocomplete="off"
                      placeholder="请输入手机号码"></el-input>
            </el-form-item>

            <el-form-item label="选择城市：" :label-width="formLabelWidth">
               <v-distpicker @selected="selectArea" class="selectArea"></v-distpicker>
            </el-form-item>

            <el-form-item label="详细地址：" :label-width="formLabelWidth">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="addressForm.address">
              </el-input>
            </el-form-item>


          </el-form>

          <!-- 城市地址选择器 -->

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogShow = false">取 消</el-button>
            <el-button type="primary" @click="submitAddress">确 定</el-button>
          </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { getAddressInfoAPI, createOrEditAPI } from '../../../services/index.js';
import VDistpicker from 'v-distpicker';

export default {
  data() {
    return {
      hasAddress: false,
      dialogShow: false,
      formLabelWidth: '120px',
      addressMessage: {
        name: '',
        phone: '',
        address: '',
        area: '',
      },
      addressForm: {
        name: '',
        phone: '',
        address: '',
        area: '',
      },
    };
  },

  methods: {
    // 新增/编辑按钮点击事件
    handleEditClick() {
      this.dialogShow = true;
    },

    // 选择城市名
    selectArea(data) {
      for (const key in data) {
        this.addressForm.area += data[key].value;
      }
    },

    submitAddress() {
      for (const value of Object.values(this.addressForm)) {
        if (value === '') {
          this.$message({
            message: '填写栏不能为空',
            type: 'error',
          });
          return;
        }
      }

      createOrEditAPI(this.addressForm).then(res => {
        if (res.data.code === 0) {
          this.dialogShow = false;
          this.getAddressInfo();
          this.$message({
            type: 'success',
            message: this.addressForm.id ? '编辑收货地址成功' : '新增收货地址成功',
          });
        } else {
          this.$message({
            type: 'error',
            message: res.data.message,
          });
        }
      });
    },

    getAddressInfo() {
      getAddressInfoAPI().then(res => {
        if (res.data.code === 0) {
          if (res.data.data) {
            this.hasAddress = true;
            this.addressMessage = res.data.data;
            this.addressForm = res.data.data;
          } else {
            this.hasAddress = false;
          }
        } else {
          this.$message({
            message: res.data.message,
            type: 'error',
          });
        }
      });
    },
  },

  mounted() {
    // 获取地址信息
    this.getAddressInfo();
  },

  components: { VDistpicker },
};
</script>

<style lang="scss" scoped>
.container {
  //最外层容器样式
  overflow: hidden;
  .warpper {
    // 地址容器的样式
    margin-left: 60px;
    margin-top: 40px;
    .remarks {
      // 按钮提示文本样式
      margin-left: 20px;
      font-size: 14px;
      color: #ccc;
    }
    .addressView {
      //地址展示的容器的样式
      width: 900px;
      height: 300px;
      margin-top: 30px;
      border: 2px solid #e9e9e9;
      display: flex;
      justify-content: center;
      align-items: center;
      // &:hover {
      //   border: 2px solid #ee7a23;
      // }
      .hasAddress {
        // 有地址信息时展示的容器的样式
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        position: relative;
        .message {
          //每一条地址信息的样式
          margin-left: 40px;
          .name {
            //地址信息的属性名文字样式
            font-weight: bold;
          }

          .value {
            //地址信息的属性值文字样式
            color: #999;
          }
        }
      }

      .noAddressText {
        // 没有地址信息时的文字提示
        color: #999;
      }
    }

    .selectArea {
      //选择城市界面样式
      cursor: pointer;
    }
  }
}
</style>
