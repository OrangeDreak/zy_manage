<template>
  <el-dialog
    width="600px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :title="title"
    @close="close"
  >
    <el-form ref="replyForm" :model="replyForm" label-width="80px">
      <el-form-item label="" prop="orderId" style="display: none"></el-form-item>
      <el-form-item
        label="留言"
        :rules="[{ required: true, message: '留言不能为空' }]"
        prop="remark"
      >
        <el-input
          v-model="replyForm.remark"
          type="textarea"
          resize="none"
          :rows="5"
          :maxlength="500"
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
import { orderMessage } from "@/api/order";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      replyForm: { orderId: "", remark: "" },
    };
  },
  methods: {
    show(data) {
      this.visible = true;
      this.title = data.title;
      this.replyForm.orderId = data.goods.subOrderId;
    },
    close() {
      this.$nextTick(() => {
        this.$refs.replyForm.resetFields();
      });
    },
    onSubmit() {
      this.$refs.replyForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          orderMessage({
            subOrderId: this.replyForm.orderId,
            content: this.replyForm.remark,
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
