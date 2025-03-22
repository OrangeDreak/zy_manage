<template>
  <el-dialog
    width="500px"
    :visible.sync="cancelVisible"
    :close-on-click-modal="false"
    title="取消订单"
    @close="close"
  >
    <el-form ref="reasonForm" :model="reasonForm" label-width="80px">
      <el-form-item label="" prop="orderId" style="display: none"></el-form-item>
      <el-form-item
        label="取消原因"
        :rules="[{ required: true, message: '取消原因不能为空' }]"
        prop="remark"
      >
        <el-input
          v-if="type === 'package'"
          v-model="reasonForm.remark"
          type="textarea"
          resize="none"
          :rows="5"
          placeholder="请输入取消原因"
        ></el-input>
        <el-select
          v-else
          v-model="reasonForm.remark"
          style="width: 100%"
          size="small"
          placeholder="请选择取消原因"
        >
          <el-option
            v-for="item in reasonList"
            :key="item.dictKey"
            :label="item.dictValue"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="reasonForm.remark === '其他原因'"
        label="原因"
        :rules="[{ required: true, message: '原因不能为空' }]"
        prop="otherReason"
      >
        <el-input
          v-model="reasonForm.otherReason"
          type="textarea"
          resize="none"
          :rows="5"
          placeholder="请输入原因"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelVisible = false">取 消</el-button>
      <el-button type="primary" :loading="cancelLoading" @click="cancelSureOrder">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { cancelPackageOrder } from "@/api/order";
export default {
  props: {
    type: {
      type: String,
      default: "",
    },
    reasonList: {
      type: Array,
      require: true,
      default: () => [],
    },
  },
  data() {
    return {
      cancelVisible: false,
      cancelLoading: false,
      reasonForm: { orderId: "", remark: "", otherReason: "" },
    };
  },
  methods: {
    show(data) {
      this.cancelVisible = true;
      this.reasonForm.orderId = data.orderId;
    },
    close() {
      this.$nextTick(() => {
        this.$refs.reasonForm.resetFields();
      });
    },
    cancelSureOrder() {
      this.$refs.reasonForm.validate((valid) => {
        if (valid) {
          this.cancelLoading = true;
          const api = cancelPackageOrder;
          const params = {};
          if (this.type === "package") {
            params.packageOrderId = this.reasonForm.orderId;
            params.remark = this.reasonForm.remark;
          } else {

          }
          api(params)
            .then(() => {
              this.$message.success("订单取消成功");
              this.cancelVisible = false;
              this.$emit("finish");
            })
            .finally(() => {
              this.cancelLoading = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
