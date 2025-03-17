<template>
  <el-dialog
    width="600px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :title="title"
    @close="close"
  >
    <el-form ref="reasonForm" :model="reasonForm" label-width="120px">
      <el-form-item label="" prop="orderId" style="display: none"></el-form-item>
      <el-form-item
        :label="`${title}原因`"
        :rules="[{ required: true, message: '原因不能为空' }]"
        prop="reasonEn"
      >
        <el-input
          v-model="reasonForm.reasonEn"
          type="textarea"
          resize="none"
          :rows="5"
          :placeholder="`请输入${title}原因`"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="cancelSureOrder">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { changeUserStatus } from "@/api/member/user";
export default {
  data() {
    return {
      title: "",
      visible: false,
      loading: false,
      reasonForm: { userId: "", reasonEn: "", status: null },
    };
  },
  methods: {
    show(data) {
      this.title = data.title;
      this.visible = true;
      this.reasonForm.userId = data.userId;
      this.reasonForm.status = data.status;
    },
    close() {
      this.$nextTick(() => {
        this.$refs.reasonForm.resetFields();
      });
    },
    cancelSureOrder() {
      this.$refs.reasonForm.validate((valid) => {
        if (valid) {
          changeUserStatus({
            userId: this.reasonForm.userId,
            status: this.reasonForm.status,
            reasonEn: this.reasonForm.reasonEn,
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
