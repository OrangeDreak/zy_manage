<template>
  <el-dialog
    :title="rowId ? '编辑规则' : '新建规则'"
    :visible.sync="showPop"
    width="50%"
    :before-close="closePop"
  >
    <div class="points-content">
      <div class="fw6 mb20">积分类型</div>
      <div class="flex-sb">
        <div
          v-for="(item, index) in pointsTypeMap"
          :key="index"
          :class="['integral-type', item.value === integralTypeAct ? 'integral-type_act' : '']"
          @click="changeIntegralType(item.value)"
        >
          <div class="fs16 fw6">{{ item.label }}</div>
          <div class="fs12">{{ item.instructions }}</div>
        </div>
      </div>
      <div class="fw6 mt32 mb20">积分设置</div>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-form-item label="规则名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="奖励比例" prop="rate">
          <!-- <el-input v-model="form.rate" placeholder="请输入">
            <template slot="append">%</template>
          </el-input> -->
          <el-input-number
            v-model="form.rate"
            :min="0"
            :precision="2"
            class="my-el-input-number"
            style="width: 100%"
            :controls="false"
            data-unit="%"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="规则有效期" prop="isPermanent">
          <el-radio-group v-model="form.isPermanent" @change="changeTimeRadio">
            <el-radio :label="1">限时有效</el-radio>
            <el-date-picker
              v-model="times"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
            />
            <br />
            <el-radio :label="0" class="mt20">永久有效</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="规则说明" prop="description">
          <el-input
            v-model="form.description"
            placeholder="请输入"
            type="textarea"
            rows="5"
            maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
        <div class="fw6 mb20">规则设置</div>
        <el-form-item label="规则状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">开启</el-radio>
            <el-radio :label="1">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button size="small" @click="closePop">取消</el-button>
      <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import cloneDeep from "lodash-es/cloneDeep";
import { detail, add, update } from "@/api/member/points";
import { isTwoDecimalPlaces, isPositivePointNum } from "@/util/commonUtil.js";
import { pointsTypeMap } from "@/config/commonConfig.js";

const formInit = {
  isPermanent: 0,
  status: 0,
};

export default {
  components: {},
  props: {
    showPop: {
      type: Boolean,
      default: false,
    },
    rowId: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      form: {},
      integralTypeAct: 0,
      pointsTypeMap,
      times: [],
      rules: {
        name: [
          {
            required: true,
            message: "请输入规则名称",
            trigger: ["blur", "change"],
          },
        ],
        rate: [
          {
            required: true,
            message: "请输入奖励比例",
            trigger: ["blur", "change"],
          },
        ],
        isPermanent: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              const { times } = this;
              if (value === 1 && !times.length) {
                callback(new Error("请选择规则有效期"));
              }
              callback();
            },
          },
        ],
        status: [
          {
            required: true,
            message: "请输入奖励比例",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  watch: {
    rowId: {
      handler(val) {
        if (val) {
          this.initData();
        } else {
          this.integralTypeAct = 0;
          this.form = cloneDeep(formInit);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    initData() {
      detail({ id: this.rowId }).then((res) => {
        if (res && res.data && res.data.data) {
          res.data.data.rate = res.data.data.rate / 100;
          this.form = res.data.data || {};
          const { type, startTime, endTime } = res.data.data;
          this.integralTypeAct = type;
          if (startTime && endTime) this.times = [startTime, endTime];
        }
      });
    },
    // 修改【积分类型】
    changeIntegralType(val) {
      if (this.integralTypeAct === val) return;
      this.integralTypeAct = val;
      this.times = [];
      this.form = cloneDeep(formInit);
      this.$refs.form.resetFields();
    },
    // 修改【规则有效期】
    changeTimeRadio(val) {
      val === 0 && (this.times = []);
    },
    // 关闭弹窗
    closePop() {
      this.$emit("update:showPop", false);
    },
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { times, integralTypeAct, rowId } = this;
          this.form.type = integralTypeAct;
          const params = { ...this.form };

          if (times && times.length) {
            params.startTime = times[0];
            params.endTime = times[1];
          } else {
            params.startTime = null;
            params.endTime = null;
          }
          params.rate = params.rate;
          rowId && (this.form.id = rowId);
          const api = rowId ? update : add;
          const { data = {} } = await api(params);
          if (data.success) {
            this.$message.success("操作成功!");
            this.closePop();
            this.$emit("onSubmit");
          } else {
            this.$message.error(data.msg || "操作失败");
          }
        }
      });
    },
  },
  filters: {},
};
</script>

<style lang="scss" scoped>
@import "@/styles/flex.scss";
@import "@/styles/commonStyle.scss";

.integral-type {
  width: 150px;
  height: 100px;
  padding: 20px 10px;
  box-sizing: border-box;
  border: 1px solid #b8b7b7;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  border-radius: 10px;

  &_act {
    background-color: rgba(231, 244, 255, 1);
    color: #1890ff;
    border-color: rgba(158, 208, 255, 1);
  }
}
</style>
