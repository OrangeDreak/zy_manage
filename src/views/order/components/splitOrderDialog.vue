<template>
  <el-dialog
    width="400px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    title="拆单"
    @close="close"
  >
    <el-form ref="stateForm" :model="stateForm">
      <!-- <el-form-item label="" prop="id" style="display: none"></el-form-item> -->
      <el-form-item label="" prop="subOrderId" style="display: none"></el-form-item>
      <el-form-item label="原本数量：">{{ goodsItem.skuCount }}</el-form-item>
      <el-form-item
        label="拆出数量："
        :rules="[{ required: true, message: '拆分数量不能为空' }]"
        prop="splitNum"
      >
        <!-- <el-input-number v-model="stateForm.splitNum" placeholder="请输入"></el-input-number> -->
        <el-input-number
          v-model="stateForm.splitNum"
          :min="1"
          :max="goodsItem.skuCount - 1"
          style="width: 100%"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        v-if="goodsItem.photoRequire"
        label="新拆子单是否携带精细化拍照"
        prop="needPhotoResult"
      >
        <el-checkbox v-model="stateForm.needPhotoResult" size="large"></el-checkbox>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { splitSubOrder } from "@/api/order";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      goodsItem: {},
      stateForm: { subOrderId: "", splitNum: 1, needPhotoResult: false },
    };
  },
  methods: {
    show(data) {
      this.visible = true;
      this.stateForm.subOrderId = data.subOrderId;
      this.goodsItem = data;
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
          splitSubOrder({
            ...this.stateForm,
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
