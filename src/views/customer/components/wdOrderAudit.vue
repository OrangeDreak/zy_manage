<template>
  <el-dialog
    width="500px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    title="商家审核结果"
    @close="close"
  >
    <el-form ref="FormState" :model="formState" label-width="80px">
      <el-form-item label="" prop="id" style="display: none"></el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-radio-group v-model="formState.status">
          <el-radio :label="1">商家审核通过</el-radio>
          <el-radio :label="2">商家审核拒绝</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submitOrder">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { financeAuditWd } from "@/api/customer/refund";

export default {
  data() {
    return {
      visible: false,
      loading: false,
      reasonList: [],
      formState: { id: "", status: 1 },
    };
  },
  methods: {
    show(data) {
      this.visible = true;
      this.formState.id = data.id;
    },
    close() {
      this.$nextTick(() => {
        this.$refs.FormState.resetFields();
      });
    },
    submitOrder() {
      this.$refs.FormState.validate((valid) => {
        if (valid) {
          this.loading = true;
          const params = {
            id: this.formState.id,
            status: this.formState.status,
          };
          financeAuditWd(params).then(() => {
            this.$message.success("提交成功");
            this.visible = false;
            this.loading = false;
            this.$emit("finish");
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tips {
  background: #fbe8ad;
  color: #333;
  font-size: 12px;
  border-radius: 2px;
  padding: 5px 10px;
  margin-bottom: 20px;
  .icon {
    font-size: 14px;
    color: #f88f56;
  }
}
</style>
