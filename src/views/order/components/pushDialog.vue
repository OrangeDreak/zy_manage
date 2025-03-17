<template>
  <el-dialog
    width="600px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    title="创建包裹"
    @close="close"
  >
    <el-form ref="stateForm" :model="stateForm" label-width="80px">
      <el-form-item label="" prop="orderId" style="display: none"></el-form-item>
      <el-form-item
        label="备注"
        :rules="[{ required: false, message: '备注不能为空' }]"
        prop="remark"
      >
        <el-input
          v-model="stateForm.remark"
          type="textarea"
          resize="none"
          :rows="5"
          :maxlength="150"
          show-word-limit
          placeholder="请输入"
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
import { pushPackageOrder } from "@/api/order";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      stateForm: { orderId: "", remark: "" },
    };
  },
  methods: {
    show(data) {
      this.visible = true;
      this.stateForm.orderId = data.orderId;
    },
    close() {
      this.$nextTick(() => {
        this.$refs.stateForm.resetFields();
      });
    },
    onSubmit() {
      this.$refs.stateForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          pushPackageOrder({
            id: this.stateForm.orderId,
            remark: this.stateForm.remark,
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
