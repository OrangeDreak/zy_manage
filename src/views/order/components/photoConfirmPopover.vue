<template>
  <span>
    <el-popover
      v-model="visible"
      placement="top"
      width="200"
      title="拍照数量确认"
      trigger="click"
      @show="confirmOpen"
    >
      <el-form ref="refConfirmForm" :model="photoForm" @submit.native.prevent>
        <el-form-item prop="confirmNum" :rules="[{ required: true, message: '确认数量不能为空' }]">
          <el-input
            v-model="photoForm.confirmNum"
            placeholder="请输入确认QC数量"
            style="width: 100%"
            @input="formatNum"
            @keyup.enter.native="confirmSubmit"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button @click="visible = false" size="mini">取 消</el-button>
        <el-button type="primary" :loading="loading" size="mini" @click="confirmSubmit"
          >确 定</el-button
        >
      </div>
      <el-button type="text" icon="el-icon-edit" slot="reference">{{
        subOrderData.takeFinePictures ? "编辑" : "确认"
      }}</el-button>
    </el-popover>
  </span>
</template>

<script>
import { updateTakeFinePictures } from "@/api/order";
export default {
  props: {
    subOrderData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      subOrderData: {},
      visible: false,
      loading: false,
      photoForm: {
        confirmNum: 0,
      },
    };
  },
  methods: {
    formatNum(val) {
      const value = val.replace(/[^0-9]/g, "");
      this.photoForm.confirmNum = value;
    },
    confirmSubmit() {
      this.$refs.refConfirmForm.validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true;
            await updateTakeFinePictures({
              subOrderId: this.subOrderData.subOrderId,
              takeFinePictures: this.photoForm.confirmNum,
            });
            this.subOrderData.takeFinePictures = Number(this.photoForm.confirmNum);
            this.loading = false;
            this.visible = false;
            this.$message.success("操作成功");
          } catch (e) {
            this.loading = false;
            console.log(e);
          }
        }
      });
    },
    confirmOpen() {
      this.photoForm.confirmNum = this.subOrderData.takeFinePictures
        ? this.subOrderData.takeFinePictures
        : this.subOrderData.photoRequire.requires.length;
    },
  },
};
</script>

<style lang="scss" scoped></style>
