<template>
  <div>
    <div class="title">关于我们
      <router-link to="/" class="button">&lt;&lt;返回主页</router-link>
    </div>
    <div class="container">
      <div class="description"></div>
      <div
        class="content"
      >书山有路勤为径，本二手书商城是专业的旧书，二手书交易平台。在提供优质低价的正版书籍的同时，还是为用户提供书籍二手买卖信息服务的网站。为用户提供高质量二手书服务信息的同时，更会深入服务环节，依托赶集积累的丰厚服务资源，运用创新思维优化服务链条，从而推动二手书行业的发展。</div>
      <div class="information">
        <div>团队成员：蔡梓涛、梁永文、黎安道</div>
        <div>&copy;&nbsp; 该网站版权归以上团队成员所有</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.title {
  position: relative;
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 26px;
  font-weight: bold;
  margin-top: 100px;
  color: #444;
  .button {
    position: absolute;
    right: 10px;
    font-size: 20px;
    color: #888;
    font-weight: normal;
    cursor: pointer;
    user-select: none;
    text-decoration: none;
    &:active {
      color: #d38e34;
    }
  }
}
.container {
  position: relative;
  width: 80%;
  height: 400px;
  margin: 40px auto;
  .description {
    width: 100%;
    height: 100%;
    background: url("./background.jpg") no-repeat center center;
    filter: blur(6px);
  }
  .content {
    position: absolute;
    top: 0;
    width: 100%;
    padding: 40px;
    box-sizing: border-box;
    color: #eeeeee;
    line-height: 2;
    font-size: 16px;
    text-indent: 2em;
  }
  .information {
    position: absolute;
    bottom: 24px;
    width: 100%;
    > div {
      color: #eeeeee;
      line-height: 2;
      font-size: 16px;
      text-align: center;
    }
  }
}
</style>
