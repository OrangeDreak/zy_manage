<template>
  <el-dialog v-model="visible" title="订单发货" width="900px" @close="handleCancel">
    <div v-loading="loading" class="send-modal">
      <el-form ref="formRef" :model="formState" label-width="140px" label-align="right">
        <el-form-item style="display: none" prop="id" label="ID"> </el-form-item>
        <!-- <el-form-item label="用户付款：" prop="realAmount">
          <div class="amount">{{ formState.realAmount || "--" }}元</div>
        </el-form-item> -->
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="包裹预估重量：" prop="realWeight">
              <div class="weight">{{ formState.realWeight || "--" }}g</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户支付运费：" prop="realAmount">
              <div class="amount">{{ formState.realAmount || "--" }}元</div></el-form-item
            ></el-col
          >
          <el-col :span="12">
            <el-form-item label="仓库回传计费重：" prop="warehouseWeight">
              <div class="weight">{{ formState.warehouseWeight || "--" }}g</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓库回传运费：" prop="warehouseAmount">
              <div class="amount">{{ formState.warehouseAmount || "--" }}元</div></el-form-item
            ></el-col
          >
          <el-col :span="12">
            <el-form-item
              label="计费重："
              prop="changeWeight"
              :rules="[
                { required: true, message: '请输入计费重：', trigger: 'blur' },
                { validator: validateChangeWeight, trigger: ['change', 'blur'] },
              ]"
            >
              <el-input
                v-model="formState.changeWeight"
                placeholder="请输入"
                style="width: 100%"
                clearable
                @input="onWeightIpt"
              >
                <template slot="append">g</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="成本价："
              prop="changeAmount"
              :rules="[
                { required: true, message: '请输入成本价', trigger: 'blur' },
                { validator: validateChangeAmount, trigger: ['change', 'blur'] },
              ]"
            >
              <el-input
                v-model="formState.changeAmount"
                clearable
                placeholder="请输入成本价"
                @input="changeAmountIpt"
                ><template slot="append">元</template></el-input
              ></el-form-item
            ></el-col
          >

          <el-col v-loading="countLoading" :span="12">
            <el-form-item
              label="实际应收运费："
              prop="finallyAmount"
              :rules="[
                { required: true, message: '请输入实际应收运费', trigger: 'blur' },
                { validator: validateFinallyAmount, trigger: ['change', 'blur'] },
              ]"
            >
              <el-input v-model="formState.finallyAmount" @input="finallyAmountIpt"
                ><template slot="append">元</template></el-input
              >
            </el-form-item>
          </el-col>
          <el-col v-if="chaAmount && Number(chaAmount) != 0" :span="12">
            <el-form-item>
              <template slot="label"
                ><span :class="chaAmount > 0 ? 'success' : 'err'">{{
                  chaAmount > 0 ? "用户退款：" : "用户需补款："
                }}</span></template
              >
              <div :class="chaAmount > 0 ? 'success' : 'err'">
                {{ Math.abs(chaAmount) }}元
                <template v-if="adjustAmount && Number(adjustAmount) != 0"
                  >（调整金额：{{ adjustAmount > 0 ? "+" : "" }}{{ adjustAmount }}元）</template
                >
              </div>
            </el-form-item>
          </el-col>
          <el-col v-if="adjustAmount && Number(adjustAmount) != 0" :span="12">
            <el-form-item
              label="金额修改原因："
              prop="reason"
              :rules="[
                { required: true, message: '请输入金额修改原因', trigger: ['change', 'blur'] },
              ]"
            >
              <el-input
                v-model="formState.reason"
                type="textarea"
                :autosize="{ minRows: 4 }"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer class="dialog-footer">
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel"> 取消 </el-button>
      <el-button type="primary" :loading="subLoading" @click="handleOk">确定</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<script>
import { getPackageDetail, getTransportOrderEstimatedAmount, submitDelivery } from "@/api/order";
import debounce from "lodash-es/debounce";
import { convertFenToYuan } from "@/utils/commonUtil.js";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      subLoading: false,
      formState: {
        id: "",
        realAmount: "",
        realWeight: "",
        warehouseWeight: "",
        warehouseAmount: "",
        changeWeight: "",
        changeAmount: "",
        finallyAmount: "",
        reason: "",
      },
      currFinallyAmount: "",
      countLoading: false,
      debouncedFetchResult: debounce(this.getNewFreight, 500),
    };
  },
  computed: {
    chaAmount() {
      if (this.formState.finallyAmount && this.formState.realAmount) {
        return (Number(this.formState.realAmount) - Number(this.formState.finallyAmount)).toFixed(
          2,
        );
      } else {
        return "";
      }
    },
    adjustAmount() {
      if (
        this.formState.finallyAmount &&
        this.currFinallyAmount &&
        Number(this.formState.finallyAmount) - Number(this.currFinallyAmount) != 0
      ) {
        return (Number(this.formState.finallyAmount) - Number(this.currFinallyAmount)).toFixed(2);
      } else {
        this.formState.reason = "";
        return "";
      }
    },
  },
  methods: {
    validateChangeWeight(rule, value, callback) {
      if (value && Number(value) <= 0) {
        callback(new Error("必须大于0"));
      } else {
        callback();
      }
    },
    validateChangeAmount(rule, value, callback) {
      if (value && Number(value) <= 0) {
        callback(new Error("必须大于0"));
      } else {
        callback();
      }
    },
    validateFinallyAmount(rule, value, callback) {
      if (value && Number(value) <= 0) {
        callback(new Error("必须大于0"));
      } else if (
        this.formState.changeAmount &&
        Number(value) < Number(this.formState.changeAmount) / 2
      ) {
        callback(new Error("必须大于成本价的一半"));
      }
      {
        callback();
      }
    },
    handleCancel() {
      this.$refs.formRef.resetFields();
      this.visible = false;
    },
    handleOk() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.subLoading = true;
          submitDelivery({
            packageOrderId: this.formState.id,
            weight: this.formState.changeWeight,
            costPrice: this.$convertYuanToFen(this.formState.changeAmount),
            finalPaymentPrice: this.$convertYuanToFen(this.formState.finallyAmount),
            adjustmentNote: this.formState.reason,
          })
            .then(() => {
              this.visible = false;
              this.$message.success("操作成功");
              this.$emit("finish");
            })
            .finally(() => [(this.subLoading = false)]);
        }
      });
    },
    async show(data) {
      this.visible = true;
      this.loading = true;
      this.formState.id = data.id;
      const res = await getPackageDetail({ id: data.id });
      this.loading = false;
      this.formState.realAmount = convertFenToYuan(res.data.estimateFreightDeposit);
      this.formState.realWeight = res.data.estimatePackageWeight;
      this.formState.warehouseAmount = convertFenToYuan(res.data.realFreightDeposit);
      this.formState.warehouseWeight = res.data.realPackageWeight;
    },
    onWeightIpt(value) {
      // 移除所有非数字字符
      let filtered = value.replace(/[^0-9]/g, "");
      // 如果输入以 '0' 开头并且长度大于 1，则移除 '0'
      if (filtered.startsWith("0") && filtered.length > 1) {
        filtered = filtered.slice(1);
      }
      // 更新 v-model 绑定的值
      this.formState.changeWeight = filtered;

      // 触发防抖后的 fetchResult 方法
      this.debouncedFetchResult();
    },
    changeAmountIpt(val) {
      let value = val.replace(/[^0-9.]/g, "");
      // 1. 必须为数字，只保留数字和小数点
      // value = value.replace(/[^0-9.]/g, '');
      // 2. 只能有一个小数点
      value = value.replace(/(\..*?)\./g, "$1");
      // 3. 小数点后保留两位小数
      value = value.replace(/(\.\d{2})./g, "$1");
      // 4. 第一位输入小数点的时候自动补全，补为 0.
      if (value.startsWith(".")) {
        value = `0${value}`;
      }
      // 5. 除非是小数，否则数字不能以0开头
      value = value.replace(/^(0+)(\d)/, "$2");
      // if (Number(value) <= 0) value = 0.01;
      this.formState.changeAmount = value;

      // 触发防抖后的 fetchResult 方法
      this.debouncedFetchResult();
    },
    finallyAmountIpt(val) {
      let value = val.replace(/[^0-9.]/g, "");
      // 1. 必须为数字，只保留数字和小数点
      // value = value.replace(/[^0-9.]/g, '');
      // 2. 只能有一个小数点
      value = value.replace(/(\..*?)\./g, "$1");
      // 3. 小数点后保留两位小数
      value = value.replace(/(\.\d{2})./g, "$1");
      // 4. 第一位输入小数点的时候自动补全，补为 0.
      if (value.startsWith(".")) {
        value = `0${value}`;
      }
      // 5. 除非是小数，否则数字不能以0开头
      value = value.replace(/^(0+)(\d)/, "$2");
      // if (Number(value) <= 0) value = 0.01;
      this.formState.finallyAmount = value;
    },
    async getNewFreight() {
      if (!this.formState.changeWeight || !this.formState.changeAmount) {
        this.formState.finallyAmount = "";
        this.currFinallyAmount = "";
        return;
      }
      this.countLoading = true;

      try {
        const response = await getTransportOrderEstimatedAmount({
          packageOrderId: this.formState.id,
          weight: this.formState.changeWeight,
          costPrice: this.$convertYuanToFen(this.formState.changeAmount),
        });
        this.formState.finallyAmount = convertFenToYuan(response.data.data);
        this.currFinallyAmount = convertFenToYuan(response.data.data);
      } catch {
        this.formState.finallyAmount = "";
        this.currFinallyAmount = "";
      } finally {
        this.countLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.send-modal {
  .amount {
    color: #ff1e05;
    font-weight: 600;
  }
  .success {
    color: #67c23a;
    // font-weight: 500;
  }
  .err {
    color: #f56c6c;
  }
}
</style>
