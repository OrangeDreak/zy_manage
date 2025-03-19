<template>
  <el-dialog
    title="编辑重量范围"
    :close-on-click-modal="false"
    model-value="showPop"
    width="50%"
    :before-close="closePop"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
      size="small"
      :disabled="loading"
    >
      <el-form-item label="开始重量" prop="weightMin">
        <el-input
          :disabled="weightMin"
          v-model="form.weightMin"
          placeholder="请输入"
          style="width: 180px"
          ><template slot="append">g</template></el-input
        >
      </el-form-item>
      <el-form-item label="结束重量" prop="weightMax">
        <el-input
          :disabled="weightMax"
          v-model="form.weightMax"
          placeholder="请输入"
          style="width: 180px"
          ><template slot="append">g</template></el-input
        >
      </el-form-item>
      <el-form-item label="首重" prop="firstWeight">
        <el-input v-model="form.firstWeight" placeholder="请输入" style="width: 180px"
          ><template slot="append">g</template></el-input
        >
      </el-form-item>
      <el-form-item label="首重运费" prop="firstWeightPrice">
        <el-input v-model="form.firstWeightPrice" placeholder="请输入" style="width: 180px"
          ><template slot="append">￥</template></el-input
        >
      </el-form-item>
      <el-form-item label="续重单位重量" prop="additionalWeight">
        <el-input v-model="form.additionalWeight" placeholder="请输入" style="width: 180px"
          ><template slot="append">g</template></el-input
        >
      </el-form-item>
      <el-form-item label="续重单价" prop="additionalWeightPrice">
        <el-input v-model="form.additionalWeightPrice" placeholder="请输入" style="width: 180px"
          ><template slot="append">￥</template></el-input
        >
      </el-form-item>
      <el-form-item label="物流商处理费" prop="logisticsProviderProcessingFee">
        <el-input
          v-model="form.logisticsProviderProcessingFee"
          placeholder="请输入"
          style="width: 180px"
          ><template slot="append">￥</template></el-input
        >
      </el-form-item>
      <el-form-item label="燃油费" prop="fuelCost">
        <el-input v-model="form.fuelCost" placeholder="请输入" style="width: 180px"
          ><template slot="append">￥</template></el-input
        >
      </el-form-item>
      <el-form-item label="操作费" prop="operationFee">
        <el-input v-model="form.operationFee" placeholder="请输入" style="width: 180px"
          ><template slot="append">￥</template></el-input
        >
      </el-form-item>
      <el-form-item label="服务费" prop="servicePrice">
        <el-input v-model="form.servicePrice" placeholder="请输入" style="width: 180px"
          ><template slot="append">￥</template></el-input
        >
      </el-form-item>
    </el-form>
    <template #footer class="dialog-footer">
    <div class="dialog-footer">
      <el-button  @click="closePop">取消</el-button>
      <el-button :disabled="loading" type="primary"  @click="onSubmit">确定</el-button>
    </div>
    </template>
  </el-dialog>
</template>

<script>
import cloneDeep from "lodash-es/cloneDeep";
import "@/styles/flex.scss";
import "@/styles/commonStyle.scss";
import 'element-plus/dist/index.css';

export default {
  components: {},
  props: {
    showPop: {
      type: Boolean,
      default: false,
    },
    weightCostInfo: {
      type: Object,
      default: () => ({}),
    },
    weightMin: {
      type: [Number, String],
      default: null,
    },
    weightMax: {
      type: [Number, String],
      default: null,
    },
  },
  data() {
    return {
      form: {},
      rules: {
        weightMin: [
          // { required: true, message: "请输入开始重量", trigger: ["blur", "change"] }
          {
            required: true,
            trigger: ["blur"],
            validator: (rule, value, callback) => {
              const { weightMax } = this.form;
              if (!Number(value) && Number(value) != 0) {
                callback(new Error("请输入开始重量"));
              } else if (Number(value) >= Number(weightMax)) {
                callback(new Error("结束重量必须大于开始重量"));
              } else {
                callback();
              }
            },
          },
        ],
        weightMax: [
          // {
          //   required: true,
          //   trigger: ["blur", "change"],
          //   validator: (rule, value, callback) => {
          //     const { weightMin } = this.form;
          //     if (!value) {
          //       callback(new Error("请输入结束重量"));
          //     } else if (weightMin >= value) {
          //       callback(new Error("结束重量必须大于开始重量"));
          //     }
          //     callback();
          //   },
          // },
          {
            required: true,
            trigger: ["blur"],
            validator: (rule, value, callback) => {
              const { weightMin } = this.form;
              if (!Number(value)) {
                callback(new Error("请输入结束重量"));
              } else if (Number(weightMin) >= Number(value)) {
                callback(new Error("结束重量必须大于开始重量"));
              } else {
                callback();
              }
            },
          },
        ],
        firstWeight: [{ required: true, message: "请输入首重", trigger: ["blur", "change"] }],
        firstWeightPrice: [
          { required: true, message: "请输入首重运费", trigger: ["blur", "change"] },
        ],
        additionalWeight: [
          { required: true, message: "请输入续重单位重量", trigger: ["blur", "change"] },
        ],
        additionalWeightPrice: [
          { required: true, message: "请输入续重单价", trigger: ["blur", "change"] },
        ],
        logisticsProviderProcessingFee: [
          { required: true, message: "物流商处理费", trigger: ["blur", "change"] },
        ],
        fuelCost: [{ required: true, message: "请输入燃油费", trigger: ["blur", "change"] }],
        operationFee: [{ required: true, message: "请输入操作费", trigger: ["blur", "change"] }],
        servicePrice: [{ required: true, message: "请输入服务费", trigger: ["blur", "change"] }],
      },
      loading: false,
    };
  },
  computed: {},
  mounted() {
    this.form = cloneDeep(this.weightCostInfo) || {};
    this.weightMin && (this.form.weightMin = this.weightMin);
    this.weightMax && (this.form.weightMax = this.weightMax);
  },
  methods: {
    onClean() {
      this.$refs.form.resetFields();
      this.freightPrice = null;
    },
    // 关闭弹窗
    closePop() {
      this.$emit("close");
    },
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.$emit("submitWeightCost", this.form);
          this.closePop();
        }
      });
    },
  },
  filters: {},
};
</script>

<style lang="scss" scoped>
</style>
