<template>
  <div class="box">
    <div class="view">
      <header>
        <span class="back" @click="$router.back()">
          <i class="el-icon-back"></i>&nbsp;返回
        </span>
        <div class="articleStatus">文章预览</div>
        <span></span>
        <!-- <el-switch
          v-model="terminal"
          class="switch hidden-xs-only"
          style="display: block"
          active-color="#13ce66"
          inactive-color="#30B08F"
          active-value="PC"
          inactive-value="H5"
          active-text="PC"
          inactive-text="H5"
        /> -->
      </header>
      <div class="con">
        <div class="mobile">
          <div class="screen">
            <div class="title">{{ info.title }}</div>
            <div class="html" v-html="htmlCon"></div>
          </div>
        </div>
        <div class="info">
          <el-form
            ref="form"
            size="medium"
            label-position="left"
            :model="info"
            label-width="80px"
          >
            <el-form-item label="标题:">
              {{ info.title }}
            </el-form-item>
            <!-- <el-form-item label="所属栏目:">
              {{ info.column }}
            </el-form-item> -->
            <!-- <el-form-item label="位置:">
              {{ info.position }}
            </el-form-item> -->
            <el-form-item label="语言:">
              {{ info.lang }}
            </el-form-item>
            <!-- <el-form-item label="排序:">
              {{ info.sort }}
            </el-form-item> -->
            <el-form-item label="创建时间:">
              {{ info.time || "--" }}
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { articleDetail } from "@/api/article";
export default {
  name: "ArticleDetail",
  components: {},
  data() {
    return {
      htmlCon: "",
      icons: [],
      terminal: "H5",
      info: {
        title: "",
        lang: "",
        time: "",
      },
    };
  },
  created() {
    articleDetail({ id: this.$route.query.id }).then((res) => {
      this.htmlCon = decodeURIComponent(res.data.content);
      this.info.title = res.data.name;
      this.info.time = res.data.gmtCreate;
      this.info.lang = res.data.language == 0 ? "zh" : "en";
    });
  },
  methods: {
    change(type) {
      this.terminal = type;
    },
  },
};
</script>
<style lang="scss" scoped>
.box {
  padding: 0 7px;
}
header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: relative;
  margin-bottom: 30px;
  font-size: 20px;
  background: #aaa;
  color: #fff;
  border-radius: 2px;
  // &::before {
  //   content: "";
  //   width: 6px;
  //   height: 24px;
  //   background: orange;
  //   margin-right: 10px;
  // }
  .back {
    font-size: 18px;
    font-weight: 500;
    color: #fff;
    // position: absolute;
    // left: 20px;
    // top: 50%;
    // transform: translateY(-50%);
    cursor: pointer;
    i {
      font-weight: 500;
    }
    &:hover {
      color: #bcddfe;
    }
  }
}
.view {
  background: #fff;
  padding-bottom: 60px;
  .con {
    display: flex;
    justify-content: center;
  }
  .mobile {
    width: 414px;
    height: 847px;
    background: url("/img/bg/model2.png");
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    // padding: 70px 40px 0;
    .screen {
      width: 375px;
      height: 807px;
      margin: 17px auto 0;
      padding: 70px 12px 0;
      overflow-y: auto;
      border-radius: 37px;
    }
    .title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 10px;
    }
    .html {
      font-size: 14px;
      box-sizing: content-box;
      padding-bottom: 20px;
    }
  }
  .info {
    padding-top: 50px;
    width: 400px;
    margin-left: 200px;
  }
}
</style>
