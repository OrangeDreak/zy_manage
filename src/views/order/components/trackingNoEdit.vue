<template>
  <el-dialog
    width="600px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    title="修改国际物流单号"
    @close="close"
  >
    <el-form ref="refFormState" :model="formState" label-width="110px" @submit.native.prevent>
      <el-form-item label="" prop="orderId" style="display: none"></el-form-item>
      <el-form-item label="原物流单号：">{{ formState.oldTrackingNo }}</el-form-item>
      <el-form-item
        label="新物流单号"
        :rules="[{ required: true, message: '新物流单号不能为空' }]"
        prop="newTrackingNo"
      >
        <el-input
          v-model="formState.newTrackingNo"
          placeholder="请输入"
          @keyup.enter.native="onSubmit"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { changeInternationalLogisticsTrackingNumber } from "@/api/order";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      formState: { orderId: "", oldTrackingNo: "", newTrackingNo: "" },
    };
  },
  methods: {
    show(data) {
      this.visible = true;
      this.formState.orderId = data.subOrderId;
      this.formState.oldTrackingNo = data.transhipmentTrackingNo;
    },
    close() {
      this.$nextTick(() => {
        this.$refs.refFormState.resetFields();
      });
    },
    onSubmit() {
      this.$refs.refFormState.validate((valid) => {
        if (valid) {
          this.loading = true;
          changeInternationalLogisticsTrackingNumber({
            packageOrderId: this.$route.params.id,
            trackingNumber: this.formState.newTrackingNo,
          })
            .then(() => {
              this.$message.success("操作成功");
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
