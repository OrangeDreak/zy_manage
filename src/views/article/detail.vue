<template>
  <!-- <basic-container> -->
  <div class="box">
    <div class="article">
      <header>
        <span class="back" @click="$router.back()">
          <i class="el-icon-back"></i>&nbsp;返回
        </span>
        <span>{{ $route.query.id ? "编辑" : "新建" }}文章</span>
      </header>

      <el-form
        ref="refArticleForm"
        :model="articleForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="文章状态:" prop="status" style="display: none">
          <el-input
            v-model="articleForm.status"
            size="small"
            style="width: 300px"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="文章标题:" prop="title">
          <el-input
            v-model="articleForm.title"
            size="small"
            style="width: 300px"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="所属栏目:" prop="column">
          <el-select
            v-model="articleForm.column"
            style="width: 300px"
            size="small"
            placeholder="请选择栏目"
            @change="columnChange"
          >
            <el-option
              v-for="item in columnList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="columnType === 1" label="位置:" prop="position">
          <el-select
            v-model="articleForm.position"
            style="width: 300px"
            size="small"
            placeholder=""
          >
            <el-option
              v-for="item in positionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="语言:" prop="lang">
          <el-select
            v-model="articleForm.lang"
            style="width: 300px"
            size="small"
            placeholder="请选择语言"
          >
            <el-option
              v-for="item in langList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序:" prop="sort">
          <el-input-number
            v-model="articleForm.sort"
            style="width: 300px"
            size="small"
            placeholder=""
            :min="0"
            :precision="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="发布时间:" prop="time">
          <el-date-picker
            v-model="articleForm.time"
            style="width: 300px"
            type="datetime"
            size="small"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="内容:" prop="html">
          <WangEditor v-model="articleForm.html" />
        </el-form-item>
      </el-form>
      <div class="btns">
        <div v-loading="loading">
          <el-button @click="$router.back()">取消</el-button>
          <el-button
            v-if="articleForm.status == 0"
            type="primary"
            @click="onRelease"
            >发布</el-button
          >
          <el-button type="primary" @click="saveArticle">保存</el-button>
        </div>
      </div>
    </div>
  </div>
  <!-- </basic-container> -->
</template>

<script>
import {
  articleDetail,
  articleAdd,
  articleEdit,
  articleCategoryAllList,
} from "@/api/article";
import WangEditor from "@/components/editor";
export default {
  components: { WangEditor },
  data() {
    const htmlValidator = (rule, value, callback) => {
      if (value === "<p><br></p>") {
        callback(new Error("请输入文章内容"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      articleForm: {
        title: "",
        column: "",
        lang: "",
        sort: undefined,
        position: "",
        time: "",
        html: "",
        status: 0,
      },
      pickerOptions: {
        disabledDate: (time) => {
          if (time.getTime() < new Date().getTime() - 24 * 60 * 60 * 1000) {
            return true;
          }
        },
      },
      rules: {
        title: [{ required: true, message: "请输入文章标题" }],
        column: [{ required: true, message: "请选择栏目" }],
        position: [{ required: true, message: "请选择协议位置" }],
        lang: [{ required: true, message: "请选择语言" }],
        sort: [{ required: true, message: "请输入排序" }],
        time: [{ required: true, message: "请选择发布时间" }],
        html: [
          { required: true, message: "请输入文章内容" },
          {
            validator: htmlValidator,
          },
        ],
      },
      columnList: [],
      columnType: 0, // 栏目类型
      langList: [
        { label: "zh", value: 0 },
        { label: "en", value: 1 },
      ],
      positionList: [
        {
          label: "注册页面",
          value: 0,
        },
        {
          label: "提交订单页",
          value: 1,
        },
        {
          label: "我的",
          value: 2,
        },
        {
          label: "各国起征税点",
          value: 3,
        },
        {
          label: "开屏页",
          value: 4,
        },
        {
          label: "新手指南",
          value: 5,
        },
      ],
    };
  },
  methods: {
    columnChange() {
      this.columnList.some((item) => {
        if (item.id === this.articleForm.column) {
          this.columnType = item.type;
          return true;
        }
      });
    },
    saveArticle() {
      console.log(this.articleForm);
      this.$refs.refArticleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let api = "";
          if (this.$route.query.id) {
            api = articleEdit;
          } else {
            api = articleAdd;
          }
          api({
            id: this.$route.query.id,
            name: this.articleForm.title,
            cateId: this.articleForm.column,
            position: this.articleForm.position,
            sort: this.articleForm.sort,
            gmtPublish: this.articleForm.time,
            content: encodeURIComponent(this.articleForm.html),
            language: this.articleForm.lang,
            status: this.articleForm.status,
          })
            .then(() => {
              let con = "";
              con = this.$route.query.id ? "编辑" : "创建";
              this.$message.success("文章" + con + "成功");
              this.$router.replace("/article/index");
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    onRelease() {
      this.$refs.refArticleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let api = "";
          if (this.$route.query.id) {
            api = articleEdit;
          } else {
            api = articleAdd;
          }
          const { column } = this.articleForm;
          api({
            id: this.$route.query.id,
            name: this.articleForm.title,
            cateId: column,
            position: this.articleForm.position,
            sort: this.articleForm.sort,
            gmtPublish: this.articleForm.time,
            content: encodeURIComponent(this.articleForm.html),
            language:
              this.columnList.find((item) => item.id === column)?.language ||
              this.articleForm.lang,
            status: 1,
          })
            .then(() => {
              this.$message.success("文章发布成功");
              this.$router.replace("/article/index");
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
  },
  mounted() {
    if (this.$route.query.id) {
      articleDetail({ id: this.$route.query.id }).then((res) => {
        const data = res.data || {};
        this.articleForm = {
          title: data.name,
          column: String(data.cateId),
          position: data.position,
          lang: data.language,
          sort: data.sort,
          time: data.gmtPublish,
          html: decodeURIComponent(data.content),
          status: data.status || 0,
        };
        articleCategoryAllList().then((res) => {
          this.columnList = res.data || [];
          this.columnChange();
        });
      });
    } else {
      articleCategoryAllList().then((res) => {
        this.columnList = res.data || [];
      });
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   if (this.articleForm.html) {
  //     // next(false)
  //     setTimeout(() => {
  //       this.$confirm('是否退出编辑?', '提示', {
  //         confirmButtonText: '退出',
  //         cancelButtonText: '取消',
  //         type: 'warning'
  //       }).then(() => {
  //         next(true)
  //       }).catch(() => {
  //         next(false)
  //       })
  //     }, 200)
  //   } else {
  //     next()
  //   }
  // }
};
</script>
<style lang="scss" scoped>
.box {
  padding: 0 6px;
}
.article {
  background: #fff;
  overflow: hidden;
}
header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
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
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    i {
      font-weight: 500;
    }
    &:hover {
      color: #bcddfe;
    }
  }
}
.btns {
  padding: 0 50px;
  margin-bottom: 100px;
  display: flex;
  justify-content: flex-end;
}
</style>
