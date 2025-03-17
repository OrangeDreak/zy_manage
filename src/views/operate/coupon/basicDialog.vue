<template>
  <el-dialog :title="title" :visible.sync="visible" :before-close="addDialogColse" width="800px">
    <el-form
      :label-position="labelPosition"
      label-width="180px"
      :model="formLabelAlign"
      :rules="rules"
      ref="form"
    >
      <el-form-item label="券类型" prop="couponType">
        <el-select v-model="formLabelAlign.couponType" placeholder="请选择">
          <el-option
            v-for="item in couponTypeData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="券语言" prop="language">
        <!-- <el-input v-model="formLabelAlign.language"></el-input> -->
        <el-select v-model="formLabelAlign.language" placeholder="请选择">
          <el-option
            v-for="item in languageTypeData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <h4>券通用字段配置</h4>
      <div class="bigBox">
        <div class="box1">
          <el-form-item label="满" prop="over">
            <el-input v-model="formLabelAlign.over" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="减" prop="reduce">
            <el-input v-model="formLabelAlign.reduce" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="无门槛" prop="noThreshold">
            <el-input v-model="formLabelAlign.noThreshold" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="有效期" prop="expiryDate">
            <el-input v-model="formLabelAlign.expiryDate" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="适用范围:抵扣包裹运费" prop="scope">
            <el-input v-model="formLabelAlign.scope" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="限定国家/地区" prop="limitCountry">
            <el-input v-model="formLabelAlign.limitCountry" placeholder="请输入"></el-input>
          </el-form-item>
        </div>
        <div class="box2">
          <div class="demo">
            <div class="text">券样式</div>
            <div class="img1"></div>
            <div class="img2"></div>
          </div>
        </div>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose()">取消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')" v-if="title != '详情'"
        >保存</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import {
  couponLanguageAddApi,
  couponLanguageDetailApi,
  couponLanguageUpdateApi,
} from "../../../api/operate/coupon";
export default {
  data() {
    return {
      title: "",
      visible: false,
      id: null,
      disableButton: false,
      formLabelAlign: {
        couponType: null,
        language: null,
        over: null,
        reduce: null,
        noThreshold: null,
        expiryDate: null,
        scope: null,
        limitCountry: null,
      },
      couponTypeData: [
        {
          name: "运费抵扣券",
          id: 0,
        },
        {
          name: "客服补贴券",
          id: 1,
        },
      ],
      languageTypeData: [
        {
          name: "英文",
          id: 1,
        },
        {
          name: "中文",
          id: 0,
        },
      ],
      rules: {
        couponType: [{ required: true, message: "请填写", trigger: "change" }],
        language: [{ required: true, message: "请填写", trigger: "change" }],
        over: [{ required: true, message: "请填写", trigger: "blur" }],
        reduce: [{ required: true, message: "请填写", trigger: "blur" }],
        noThreshold: [{ required: true, message: "请填写", trigger: "blur" }],
        expiryDate: [{ required: true, message: "请填写", trigger: "blur" }],
        scope: [{ required: true, message: "请填写", trigger: "blur" }],
        // limitCountry: [{ required: true, message: "请填写", trigger: "blur" }],
      },
    };
  },
  methods: {
    open(data) {
      this.visible = true;
      this.title = data.title;
      // if (data.title == "详情") {
      //   console.log(this.disableButton, "butt");
      // }
      console.log(data, "data");
      if (data.id) {
        this.id = data.id;
        this.getDetail(data.id);
      }
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        console.log(valid, "valid");
        if (valid) {
          console.log(this.formLabelAlign, "form");
          console.log("新增");
          if (this.title == "新增券语言配列") {
            console.log("配列");
            const obj = { ...this.formLabelAlign };
            obj.limitCountry = obj.limitCountry || 0;
            couponLanguageAddApi(obj).then((res) => {
              console.log(res, "200");
              if (res.data.code == 200) {
                this.dialogClose();
              }
              console.log(res.data.data, "res");
            });
          }
          // }
          if (this.title == "编辑") {
            let data = { ...this.formLabelAlign };
            delete data.gmtCreate;
            delete data.gmtModified;
            delete data.isDelete;
            data.id = this.id;
            data.limitCountry = data.limitCountry || 0;
            couponLanguageUpdateApi(data).then((res) => {
              if (res.data.code == 200) {
                this.dialogClose();
              }
              console.log(res.data.data, "res");
            });
            // console.log(this.formLabelAlign);
          }
        } else {
          this.$message({
            type: "error",
            message: "请完成数据填写!",
          });
          console.log("error submit!!");
          return false;
        }
      });
    },
    getDetail(id) {
      couponLanguageDetailApi({ id }).then((res) => {
        console.log(res, "sf");
        this.formLabelAlign = res.data.data;
        console.log(res.data.data, "hhh");
        // 字段不一样,展示
      });
    },
    dialogClose() {
      (this.formLabelAlign = {
        couponType: null,
        language: null,
        over: null,
        reduce: null,
        noThreshold: null,
        expiryDate: null,
        scope: null,
        limitCountry: null,
      }),
        this.$refs.form.resetFields();
      this.$emit("updateList");
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.bigBox {
  display: flex;
  justify-content: space-between;
  .box1 {
    flex: 1;
  }
  .box2 {
    // flex: 1;
    .demo {
      .text {
        margin: 20px 0 0 20px;
      }
      .img1 {
        margin: 30px 0 0 20px;
        width: 250px;
        height: 100px;
        background-image: url("/img/coupon/zh_coupon.png");
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
      }
      .img2 {
        margin: 50px 0 0 20px;
        width: 250px;
        height: 100px;
        background-image: url("/img/coupon/en_coupon.png");
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }
}
</style>
