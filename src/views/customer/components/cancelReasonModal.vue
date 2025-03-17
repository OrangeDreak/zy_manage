<template>
  <el-dialog
    width="500px"
    :visible.sync="cancelVisible"
    :close-on-click-modal="false"
    title="发起商家售后"
    @close="close"
  >
    <div class="tips"><i class="el-icon-warning-outline icon"></i> 商家售后发起后将无法取消!</div>
    <el-form ref="reasonForm" :model="reasonForm" label-width="80px">
      <el-form-item label="" prop="id" style="display: none"></el-form-item>
      <el-form-item
        label="售后原因"
        :rules="[{ required: true, message: '请选择售后原因' }]"
        prop="remark"
      >
        <el-select
          v-model="reasonForm.remark"
          style="width: 100%"
          size="small"
          placeholder="请选择售后原因"
        >
          <el-option
            v-for="item in reasonList"
            :key="item.reasonId"
            :label="item.reasonName"
            :value="item.reasonId"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelVisible = false">取 消</el-button>
      <el-button type="primary" :loading="cancelLoading" @click="cancelSureOrder">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addMerchantAfterSale, getMerchantAfterSaleRefundReason } from "@/api/customer/refund";

export default {
  data() {
    return {
      cancelVisible: false,
      cancelLoading: false,
      reasonList: [],
      reasonForm: { id: "", remark: "" },
    };
  },
  methods: {
    show(data) {
      this.cancelVisible = true;
      this.reasonForm.id = data.id;
      getMerchantAfterSaleRefundReason({ id: this.reasonForm.id }).then((res) => {
        this.reasonList = res.data.data || [];
      });
    },
    close() {
      this.reasonList = [];
      this.$nextTick(() => {
        this.$refs.reasonForm.resetFields();
      });
    },
    cancelSureOrder() {
      this.$refs.reasonForm.validate((valid) => {
        if (valid) {
          this.cancelLoading = true;
          const params = {
            id: this.reasonForm.id,
          };
          this.reasonList.some((item) => {
            if (item.reasonId === this.reasonForm.remark) {
              params.reasonId = item.reasonId;
              params.reasonName = item.reasonName;
            }
          });
          addMerchantAfterSale(params).then(() => {
            this.$message.success("提交成功");
            this.cancelVisible = false;
            this.cancelLoading = false;
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
