<template>
  <el-dialog width="500px" title="驳回原因" :visible.sync="visible" @close="close" append-to-body>
    <el-form ref="refFormState" :model="formState" label-width="100px">
      <el-form-item
        label="驳回原因："
        prop="reason"
        :rules="[{ required: true, message: '请选择驳回原因' }]"
      >
        <el-select
          v-model="formState.reason"
          style="width: 100%"
          placeholder="请选择"
          @change="change"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="formState.reason === 4"
        label="原因："
        prop="reasonOther"
        :rules="[{ required: true, message: '请输入驳回原因' }]"
      >
        <el-input
          v-model="formState.reasonOther"
          style="width: 100%"
          :rows="5"
          resize="none"
          type="textarea"
          placeholder="请输入驳回原因"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubReject">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { staffReject } from "@/api/customer/refund";

export default {
  data() {
    return {
      visible: false,
      loading: false,
      reasonList: [],
      formState: { id: "", reason: undefined, reasonOther: "" },
      options: [
        {
          label: "已超过7天无理由售后时间",
          labelEn:
            "Dear friends, the order has been more than 7 days without reason after-sales time, the merchant has rejected the after-sales application, thank you for your understanding",
          value: 1,
        },
        {
          label: "用户要求取消",
          labelEn:
            "Dear friends, According to your requirement, the return application of this order has been cancelled. If necessary, you can contact us",
          value: 2,
        },
        {
          label: "无售后商品商家拒绝售后",
          labelEn:
            "This product has no after-sales service. We have confirmed with you before ordering, so we cannot apply for you now. Thank you for your understanding",
          value: 3,
        },
        {
          label: "其他原因",
          value: 4,
        },
      ],
    };
  },
  methods: {
    show(data) {
      this.visible = true;
      this.formState.id = data.id;
    },
    change() {
      this.formState.reasonOther = "";
    },
    close() {
      this.$nextTick(() => {
        this.$refs.refFormState.resetFields();
      });
    },
    onSubReject() {
      this.$refs.refFormState.validate((valid) => {
        if (valid) {
          this.loading = true;
          let reason = "";
          if (this.formState.reason === 4) {
            reason = this.formState.reasonOther;
          } else {
            reason = this.options.find((item) => item.value === this.formState.reason)?.labelEn;
          }
          const params = {
            id: this.formState.id,
            rejectReason: reason,
          };
          staffReject(params).then(() => {
            this.$message.success("驳回成功");
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
