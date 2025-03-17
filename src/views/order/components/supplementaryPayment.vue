<template>
  <el-dialog
    width="500px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    title="补款配置"
    @close="close"
  >
    <el-form ref="refAmountForm" :model="amountForm" label-width="120px">
      <el-form-item label="" prop="orderId" style="display: none"></el-form-item>
      <el-form-item
        label="补款金额(元)："
        prop="amount"
        :rules="[
          { required: true, message: '请输入补款金额' },
          { min: 0.01, message: '补款金额不能为0' },
        ]"
      >
        <el-input-number
          v-model="amountForm.amount"
          style="width: 100%"
          :min="min"
          disabled
          :controls="false"
          size="small"
          :precision="2"
          placeholder="请输入补款金额"
        >
        </el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="handleOk">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { toTwicePay } from "@/api/order";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      min: 0,
      amountForm: { orderId: "", amount: undefined },
    };
  },
  methods: {
    show(data) {
      this.visible = true;
      this.amountForm.orderId = data.orderId;
      this.amountForm.amount = (data.additionalPayment / 100).toFixed(2) || undefined;
      this.min = this.amountForm.amount || 0;
    },
    close() {
      this.$nextTick(() => {
        this.$refs.refAmountForm.resetFields();
      });
    },
    handleOk() {
      this.$refs.refAmountForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          toTwicePay({
            orderId: this.amountForm.orderId,
          })
            .then(() => {
              this.$message.success("补款发起成功");
              this.visible = false;
              this.$emit("finish");
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
