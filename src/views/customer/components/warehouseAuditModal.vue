<template>
  <el-dialog
    width="500px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    title="申请仓库退件"
    @close="close"
  >
    <div v-loading="loading">
      <el-form ref="refAuditForm" :model="auditForm" label-width="130px">
        <el-form-item label="" prop="id" style="display: none"></el-form-item>
        <div v-if="!hasNo" class="tips">
          <i class="el-icon-warning"></i>请联系仓库，获取退件包裹单号
        </div>
        <el-form-item
          label="退件包裹单号："
          prop="packageId"
          :rules="[{ required: true, message: '请输入退件包裹单号' }]"
        >
          <el-input
            v-model="auditForm.packageId"
            style="width: 100%"
            size="small"
            placeholder="请输入"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" :loading="subLoading" @click="handleOk">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getPackageNo, warehouseAudit } from "@/api/customer/refund.js";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      hasNo: true,
      subLoading: false,
      auditForm: { orderId: "", packageId: "" },
    };
  },
  methods: {
    show(data) {
      this.visible = true;
      this.auditForm.id = data.id;
      this.loading = true;
      getPackageNo({ id: data.id })
        .then((res) => {
          this.auditForm.packageId = res.data.data;
          if (!res.data.data) {
            this.hasNo = false;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    close() {
      this.hasNo = true;
      this.$nextTick(() => {
        this.$refs.refAuditForm.resetFields();
      });
    },
    handleOk() {
      this.$refs.refAuditForm.validate((valid) => {
        if (valid) {
          this.subLoading = true;
          warehouseAudit({
            id: this.auditForm.id,
            packageId: this.auditForm.packageId,
          })
            .then(() => {
              this.$message.success("操作成功");
              this.visible = false;
              this.$emit("finish");
            })
            .finally(() => {
              this.subLoading = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tips {
  font-size: 12px;
  color: #333;
  display: flex;
  align-items: center;
  background: #ffcb7c;
  padding: 5px 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  i {
    font-size: 14px;
    color: #f88f56;
    margin-right: 3px;
  }
}
</style>
