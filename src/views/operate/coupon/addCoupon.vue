<template>
  <basic-container>
    <div style="margin-bottom: 50px">基本信息</div>
    <div>
      <el-form
        :label-position="left"
        label-width="100px"
        :model="formLabelAlign"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="类型" prop="couponType">
          <!-- <el-select v-model="formLabelAlign.couponType" placeholder="请选择">
            <el-option label="运费抵扣券" value="0"></el-option>
            <el-option label="客服补贴券" value="1"></el-option>
          </el-select> -->
          <el-select
            v-model="formLabelAlign.couponType"
            placeholder="请选择"
            style="width: 50%"
            :disabled="$route.query.type === 'edit'"
            @change="couponTypeChange"
          >
            <el-option
              v-for="item in couponTypeData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券名称" prop="name">
          <el-input
            v-model="formLabelAlign.name"
            placeholder="请输入"
            maxlength="20"
            style="width: 50%"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="优惠券编码" prop="couponCode">
          <el-input
            v-model="formLabelAlign.couponCode"
            placeholder="请输入"
            :disabled="$route.query.type === 'edit'"
            maxlength="64"
            show-word-limit
            style="width: 50%"
          ></el-input>
        </el-form-item>
        <el-form-item label="总库存" prop="stockTotal">
          <el-input
            v-model.number="formLabelAlign.stockTotal"
            oninput="if(value>100000000)value=100000000"
            placeholder="最多100000000张"
            type="number"
            onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode)))"
            style="width: 50%"
          ></el-input>
        </el-form-item>
        <el-form-item label="每日发行量" prop="stockToday">
          <el-input
            v-model.number="formLabelAlign.stockToday"
            oninput="if(value>100000000)value=100000000"
            placeholder="最多100000000张"
            type="number"
            onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode)))"
            style="width: 50%"
          ></el-input>
        </el-form-item>
        <el-form-item label="使用门槛" prop="threshold">
          <el-radio-group
            v-model="formLabelAlign.threshold"
            :disabled="$route.query.type === 'edit'"
            class="threshold"
            @change="thresholdChange"
          >
            <el-radio label="1">
              <span> 有门槛，满&nbsp;</span>
              <el-input
                v-model="thresholdStr"
                style="width: 200px"
                type="number"
                :disabled="$route.query.type === 'edit'"
                onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode)))"
              >
                <template slot="append">元</template>
              </el-input>
            </el-radio>
            <el-radio label="0">无门槛</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formLabelAlign.couponType === 2" label="优惠内容" prop="rateDiscount">
          优惠&nbsp;
          <el-input
            v-model="formLabelAlign.rateDiscount"
            style="width: 200px"
            type="number"
            :disabled="$route.query.type === 'edit'"
            oninput="if(value>100)value=100"
            onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode)))"
          >
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item v-else label="优惠内容" prop="reduce">
          减&nbsp;
          <el-input
            v-model="formLabelAlign.reduce"
            style="width: 200px"
            type="number"
            :disabled="$route.query.type === 'edit'"
            onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode)))"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="使用说明" prop="introduction">
          <el-input
            v-model="formLabelAlign.introduction"
            type="textarea"
            :rows="2"
            style="width: 50%"
          >
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="领券期限" prop="drawDownLimitType">
          <el-radio-group v-model="formLabelAlign.drawDownLimitType" @change="drawDownLimitTypeChange">
            <el-radio label="1">
              <span>限制期限&nbsp;</span>
              <el-date-picker
                v-model="drawDownTimeRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="timeSet"
              >
              </el-date-picker>
            </el-radio>
            <el-radio label="0">
              <span>时间不限&nbsp;</span>
            </el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="用券有效期" prop="timeMark">
          <el-radio-group v-model="formLabelAlign.timeMark" @change="timeMarkChange">
            <el-radio label="1">
              <span>生效时间&nbsp;</span>
              <el-date-picker
                v-model="timeValue"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="timeSet"
              >
              </el-date-picker>
            </el-radio>
            <el-radio label="0">
              <span>自领券后，有效期&nbsp;</span>
              <el-input v-model.number="timeStr" style="width: 200px" type="number">
                <template slot="append">天</template>
              </el-input>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <div style="margin-top: 50px; margin-bottom: 50px">适用规则</div>
        <el-form-item label="适用国家" prop="countryId">
          <el-select
            v-model="formLabelAlign.countryId"
            style="width: 50%"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in countryData"
              :key="item.id"
              :label="item.areaName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户范围" prop="userScope">
          <!-- <el-radio-group v-model="formLabelAlign.userScope" prop="threshold">
            <el-radio label="0">所有用户</el-radio>
          </el-radio-group> -->
          <el-radio v-model="formLabelAlign.userScope" label="0">所有用户</el-radio>
        </el-form-item>
        <el-form-item label="退回限制" prop="isBackValid">
          <el-radio-group v-model="formLabelAlign.isBackValid">
            <el-radio :label="1">退回后有效</el-radio>
            <el-radio :label="2">退回后失效</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="领取限制" prop="drawDownLimit">
          <el-radio-group
            v-model="formLabelAlign.receiveLimitType"
            @change="receiveLimitTypeChange"
          >
            <el-radio label="0">不限</el-radio>
            <el-radio label="1">
              累计领取：
              <el-input
                v-model="limitArr[0]"
                style="width: 200px"
                type="number"
                onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode)))"
              >
                <template slot="append">张/人</template>
              </el-input>
              <span>；领取频率：</span>
              <el-input
                v-model="limitArr[1]"
                style="width: 280px"
                type="number"
                onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode)))"
              >
                <template slot="append">张/(每人，每日)</template>
              </el-input>
              <span>；单张可使用的优惠券，最多可同时拥有：</span>
              <el-input
                v-model="limitArr[2]"
                style="width: 200px"
                type="number"
                onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode)))"
              >
                <template slot="append">张/人</template>
              </el-input>
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="disableButton" class="btn">
      <el-button size="large" @click="onCancel">取消</el-button>
      <el-button size="large" @click="add()" type="primary" :loading="loading">保存</el-button>
    </div>
  </basic-container>
</template>

<script>
import { getCountry, editCouponApi, addCouponApi, getDetailApi } from "../../../api/operate/coupon";
export default {
  data() {
    const thresholdRule = (rule, value, callback) => {
      // console.log(this.formLabelAlign.threshold, "v", this.threshold);s
      if (this.formLabelAlign.threshold != 0 && !this.thresholdStr) {
        return callback(new Error("请输入使用门槛"));
      } else if (this.formLabelAlign.threshold != 0 && this.formLabelAlign.reduce) {
        if (Number(this.thresholdStr) < Number(this.formLabelAlign.reduce)) {
          return callback(new Error("使用门槛不可小于立减金额"));
        }
      }
      callback();
    };
    const reduceRule = (rule, value, callback) => {
      if (this.thresholdStr != 0 && this.formLabelAlign.threshold == 1) {
        if (Number(value) > Number(this.thresholdStr)) {
          console.log(value, this.thresholdStr, "sss");
          return callback(new Error("立减金额不可大于实用门槛"));
        }
      }
      callback();
    };

    const timeRule = (rule, value, callback) => {
      if (this.formLabelAlign.timeMark == 0 && !this.timeStr) {
        return callback(new Error("请输入有效期"));
      } else if (this.formLabelAlign.timeMark == 1 && !this.timeValue.length) {
        return callback(new Error("请选择生效时间"));
      }
      callback();
    };
    const drawDownLimitTimeRule = (rule, value, callback) => {
      if (this.formLabelAlign.drawDownLimitType == 1 && !this.drawDownTimeRange.length) {
        return callback(new Error("请选择领取期限时间"));
      }
      callback();
    };

    const limitRule = (rule, value, callback) => {
      // console.log(this.receiveLimit, this.limitArr, this.limitArr.length);
      if (this.formLabelAlign.receiveLimitType == 1) {
        if (!this.limitArr[0] || !this.limitArr[1] || !this.limitArr[2]) {
          console.log(this.limitArr);
          return callback(new Error("请输入完整限制数剧"));
        } else if (Number(this.limitArr[0]) < Number(this.limitArr[1])) {
          return callback(new Error("每日领取数量不可大于累计领取数量"));
        }
      }
      callback();
    };
    const stockTotalRule = (rule, value, callback) => {
      if (value < this.formLabelAlign.stockToday) {
        return callback(new Error("总库存不能小于每日发行量"));
      }
      callback();
    };

    const stockTodayRule = (rule, value, callback) => {
      if (value > this.formLabelAlign.stockTotal) {
        return callback(new Error("每日发行量不可大于总库存"));
      }
      callback();
    };
    return {
      formLabelAlign: {
        name: null,
        couponCode: null,
        couponType: null,
        stockTotal: null,
        stockToday: null,
        // 默认
        threshold: "1",
        isBackValid: 1,
        reduce: null,
        rateDiscount: null,
        introduction: null,
        startTime: null,
        endTime: null,
        expiryDay: null,

        countryId: null,
        userScope: "0",
        receiveLimitType: null,
        // drawDownLimitType: null,
        // drawDownStartTime: null,
        // drawDownEndTime: null,
        // 标志字段
        timeMark: null,
        receiveTotalLimit: null,
        receiveTodayLimit: null,
        userEffectiveCouponLimit: null,
      },
      countryData: [],
      timeSet: ["00:00:00", "23:59:59"],
      loading: false,
      couponTypeData: [
        {
          name: "运费抵扣券",
          id: 0,
        },
        {
          name: "运费折扣券",
          id: 2,
        },
        {
          name: "客服补贴券",
          id: 1,
        },
      ],
      drawDownTimeRange: [],
      // 校验开关字段
      timeValue: [],
      timeStr: null,
      thresholdStr: null,
      receiveLimitStr: null,
      limitArr: [],
      receiveTotalLimit: null,
      disableButton: false,
      rules: {
        name: [
          { required: true, message: "请输入优惠券名称", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
        couponType: [{ required: true, message: "请选择优惠券类型", trigger: "change" }],
        isBackValid: [{ required: true }],
        stockTotal: [
          {
            required: true,
            message: "请输入总库存",
            trigger: "blur",
          },
          { validator: stockTotalRule, trigger: "blur" },
        ],
        stockToday: [{ validator: stockTodayRule, trigger: "blur" }],
        threshold: [
          {
            required: true,
            message: "请选择使用门槛",
            trigger: "blur",
          },
          { validator: thresholdRule, trigger: "blur" },
        ],
        reduce: [
          {
            required: true,
            // validator: validatePass,
            message: "请输入",
            trigger: "blur",
          },
          { validator: reduceRule, trigger: "blur" },
        ],
        rateDiscount: [
          {
            required: true,
            // validator: validatePass,
            message: "请输入",
            trigger: "blur",
          },
        ],
        // countryId: [
        //   { required: true, message: "请选择国家", trigger: "change" },
        // ],
        userScope: [{ required: true, message: "请选择范围", trigger: "change" }],
        receiveLimitType: [
          { required: true, message: "请选择有效期", trigger: "change" },
          { validator: limitRule, trigger: "change" },
        ],
        timeMark: [
          { required: true, message: "请选择有效期", trigger: "change" },
          { validator: timeRule, trigger: "change" },
        ],
        drawDownLimitType: [
          { required: true, message: "请选择领取期限", trigger: "change" },
          { validator: drawDownLimitTimeRule, trigger: "change" },
        ],
      },
    };
  },
  created() {
    if (this.$route.query.type) {
      this.disableButton = true;
    }
    if (this.$route.query.id) {
      this.getDetail(this.$route.query.id);
    }
    this.country();
  },
  methods: {
    couponTypeChange() {
      if (this.formLabelAlign.couponType === 2) {
        this.formLabelAlign.reduce = 0;
      } else {
        this.formLabelAlign.rateDiscount = null;
      }
    },
    thresholdChange() {
      if (this.formLabelAlign.threshold === "0") {
        this.thresholdStr = null;
      }
    },
    drawDownLimitTypeChange() {
      if (this.formLabelAlign.drawDownLimitType === "0") {
        this.drawDownTimeRange = [];
        this.$forceUpdate();
      }
    },
    timeMarkChange() {
      if (this.formLabelAlign.timeMark === "1") {
        this.timeStr = null;
      } else {
        this.timeValue = [];
      }
      this.$forceUpdate();
    },
    receiveLimitTypeChange() {
      if (this.formLabelAlign.receiveLimitType === "0") {
        this.limitArr = [0, 0, 0];
      }
    },
    onCancel() {
      this.$router.back();
    },
    add() {
      // submitForm(formName) {
      this.$refs.ruleForm.validate((valid) => {
        console.log(valid, "valid");
        if (valid) {
          this.loading = true;
          // alert("submit!");
          if (this.formLabelAlign.timeMark == 1) {
            if (this.timeValue) {
              this.formLabelAlign.startTime = this.timeValue[0];
              this.formLabelAlign.endTime = this.timeValue[1];
              this.formLabelAlign.expiryDay = null;
            }
          } else {
            if (this.timeStr) {
              this.formLabelAlign.startTime = null;
              this.formLabelAlign.endTime = null;
              this.formLabelAlign.expiryDay = this.timeStr;
            }
          }
          if (this.formLabelAlign.drawDownLimitType == "1") {
            if (this.drawDownTimeRange) {
              this.formLabelAlign.drawDownStartTime = this.drawDownTimeRange[0];
              this.formLabelAlign.drawDownEndTime = this.drawDownTimeRange[1];
            }
          }
          // if (this.threshold == 0) {
          //   this.formLabelAlign.threshold = 0;
          // } else {
          //   this.formLabelAlign.threshold = this.thresholdStr;
          if (this.formLabelAlign.threshold == 1) {
            this.formLabelAlign.threshold = this.thresholdStr;
          }
          // }
          console.log(this.thresholdStr, this.formLabelAlign.threshold, "比较");
          if (this.receiveLimitStr == 0) {
            this.formLabelAlign.receiveLimitType = 0;
            this.formLabelAlign.receiveTotalLimit = null;
            this.formLabelAlign.receiveTodayLimit = null;
            this.formLabelAlign.userEffectiveCouponLimit = null;
          } else {
            this.formLabelAlign.receiveTotalLimit = this.limitArr[0];
            this.formLabelAlign.receiveTodayLimit = this.limitArr[1];
            this.formLabelAlign.userEffectiveCouponLimit = this.limitArr[2];
          }
          // console.log(this.formLabelAlign, "form", this.limitArr, this.receiveLimitStr);
          const apiData = { ...this.formLabelAlign };
          apiData.countryId = apiData.countryId || 0;
          delete apiData.timeMark;
          if (this.$route.query.type === "edit") apiData.id = this.$route.query.id;
          console.log(apiData, "接口数据");
          const api = this.$route.query.type === "edit" ? editCouponApi : addCouponApi;
          api(apiData)
            .then((res) => {
              console.log(res);
              if (res && res.data.code == 200) {
                console.log("2");
                this.loading = false;
                this.$router.push({ path: "/operate/coupon" });
              }
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          this.$message({
            type: "error",
            message: "请确保校验正确",
          });
          console.log("error submit!!", this.formLabelAlign);
          return false;
        }
      });
    },
    country(params) {
      getCountry(params).then((res) => {
        const countryData = res.data.data;
        this.countryData = countryData;
      });
    },
    getDetail(params) {
      getDetailApi({ id: params }).then((res) => {
        let data = res.data.data;
        if (res.data.data.id) {
          delete data.id;
        }
        data.couponCode = data.code;
        this.formLabelAlign = data;
        this.formLabelAlign.countryId = data.countryId || null;
        // 回显格式转化
        // if (this.formLabelAlign.threshold != 0) {
        if (this.formLabelAlign.threshold != 0) {
          this.thresholdStr = String(this.formLabelAlign.threshold);
          this.formLabelAlign.threshold = "1";
        } else {
          this.formLabelAlign.threshold = String(this.formLabelAlign.threshold);
        }
        this.formLabelAlign.isBackValid = this.formLabelAlign.isBackValid;
        this.formLabelAlign.reduce = String(this.formLabelAlign.reduce);
        this.formLabelAlign.rateDiscount = String(this.formLabelAlign.rateDiscount);
        if (this.formLabelAlign.expiryDay) {
          this.formLabelAlign.timeMark = "0";

          this.timeStr = this.formLabelAlign.expiryDay;
        } else {
          this.formLabelAlign.timeMark = "1";
          this.timeValue = [this.formLabelAlign.startTime, this.formLabelAlign.endTime];
        }
        if (this.formLabelAlign.drawDownLimitType == "1") {
          this.drawDownTimeRange = [
            this.formLabelAlign.drawDownStartTime,
            this.formLabelAlign.drawDownEndTime,
          ];
        }
        this.formLabelAlign.userScope = String(this.formLabelAlign.userScope);

        this.formLabelAlign.receiveLimitType = String(this.formLabelAlign.receiveLimitType);
        this.limitArr = [
          this.formLabelAlign.receiveTotalLimit,
          this.formLabelAlign.receiveTodayLimit,
          this.formLabelAlign.userEffectiveCouponLimit,
        ];
        // }
        console.log(this.formLabelAlign, "表单");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-radio__label) {
  display: inline-flex;
  align-items: center;
}
.btn {
  display: flex;
  justify-content: flex-end;
  margin: 50px 100px 100px 0;
}
</style>
