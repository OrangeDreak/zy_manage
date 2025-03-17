<template>
  <el-dialog
    width="500px"
    title="金额确认"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
  >
    <div v-loading="loading" class="amount-confirm">
      <el-form ref="refAmountForm" :model="amountInfo" label-width="170px">
        <el-form-item label="退款类型："> {{ orderInfo.refundTypeName }} </el-form-item>
        <el-form-item label="主订单总金额："> ￥{{ amountInfo.totalAmount }} </el-form-item>
        <el-form-item label="补款金额："> ￥{{ amountInfo.totalAdditionalPayment }} </el-form-item>
        <el-form-item label="精细化拍照总金额：">
          ￥{{ amountInfo.totalPhotoExtraCharge }}
        </el-form-item>
        <el-form-item label="物流运费："> ￥{{ amountInfo.totalDeliveryFee }} </el-form-item>
        <!-- <el-form-item label="售后子单总金额："> ￥{{ amountInfo.subtotal }} </el-form-item> -->
        <el-form-item
          style="border-top: 1px solid #eee; padding-top: 16px"
          label="订单退款金额："
          prop="refundAmount"
        >
          <el-input
            v-model="editInfo.refundAmount"
            style="width: 50%"
            class="refund-align-left"
            size="small"
            placeholder="请输入订单退款金额"
            @input="formatAmount"
          ></el-input>
          元
        </el-form-item>
        <el-form-item
          v-if="[1, 2].includes(orderInfo.refundType)"
          label="退件运费："
          prop="refundFee"
        >
          <el-input
            v-model="editInfo.refundFee"
            style="width: 50%"
            class="refund-align-left"
            size="small"
            placeholder="请输入退件运费"
            @input="formatFee"
          ></el-input>
          元
        </el-form-item>
        <!-- <el-form-item  label="订单退款金额：">
          <span>￥{{ editInfo.refundAmount }}</span>
        </el-form-item>
        <el-form-item label="退件运费：">
          <span>￥{{ editInfo.refundFee }}</span>
        </el-form-item> -->
        <el-form-item label="实际退款金额：">
          <span class="amount"
            >￥{{ (+editInfo.refundAmount - +editInfo.refundFee).toFixed(2) }}</span
          >
        </el-form-item>
        <el-form-item v-if="showChange" label="财务修改金额原因：" prop="updateRemark">
          <el-input
            v-model="editInfo.updateRemark"
            style="width: 100%"
            :rows="5"
            resize="none"
            type="textarea"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="客服修改金额原因：" prop="kefuReason">
          {{ orderInfo.kefuReason }}
        </el-form-item>
        <el-form-item label="退款凭证：" prop="fileList">
          <template v-if="orderInfo.imgs">
            <el-image
              v-for="(item, i) in orderInfo.imgs"
              :key="i"
              style="height: 80px; margin: 0 10px 10px 0"
              :src="item"
              :preview-src-list="orderInfo.imgs"
            >
            </el-image>
          </template>
        </el-form-item>
        <el-form-item label="退款原因：" prop="reason">
          {{ orderInfo.reason }}
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="warning" :loading="subLoading" @click="onReject">打回</el-button>
      <el-button type="primary" :loading="subLoading" @click="onSubPass">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { workOrderDetail, financeConfirm, financeReturn } from "@/api/customer/refund";
import { convertFenToYuan, convertYuanToFen } from "@/util/commonUtil.js";

export default {
  data() {
    return {
      visible: false,
      loading: false,
      subLoading: false,
      orderInfo: {
        refundAmount: 0,
        refundFee: 0,
      },
      editInfo: {
        refundAmount: 0,
        refundFee: 0,
        updateRemark: "",
      },
      amountInfo: {
        subtotal: 0,
        totalDeliveryFee: 0,
        totalPhotoExtraCharge: 0,
        totalAdditionalPayment: 0,
        totalAmount: 0,
      },
      formState: { id: "", status: 1 },
    };
  },
  computed: {
    showChange() {
      if (
        +convertYuanToFen(this.editInfo.refundAmount) - +this.orderInfo.refundAmount != 0 ||
        +convertYuanToFen(this.editInfo.refundFee) - +this.orderInfo.refundFee != 0
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    show(data) {
      this.visible = true;
      this.loading = true;

      workOrderDetail({ id: data.id })
        .then((res) => {
          const data2 = res.data.data || {};
          this.orderInfo.attributes = JSON.parse(data2.attributes);
          this.amountInfo.totalAdditionalPayment = convertFenToYuan(data2.totalAdditionalPayment);
          this.amountInfo.totalDeliveryFee = convertFenToYuan(data2.totalDeliveryFee);
          this.amountInfo.totalAmount = convertFenToYuan(data2.totalAmount);
          this.subOrderData = data2.afterSaleSubOrderList || [];
          // this.subOrderData.forEach((item) => {
          //   this.amountInfo.subtotal += item.subtotal;
          //   this.amountInfo.totalPhotoExtraCharge += item.photoExtraCharge || 0;
          // });
          this.amountInfo.subtotal = convertFenToYuan(data2.subtotal);
          this.amountInfo.totalPhotoExtraCharge = convertFenToYuan(data2.totalPhotoExtraCharge);
          this.orderInfo = data2;
          this.orderInfo.orderId = data.id;
          this.editInfo.refundAmount = convertFenToYuan(this.orderInfo.refundAmount);
          this.editInfo.refundFee = convertFenToYuan(this.orderInfo.refundFee);
          this.orderInfo.kefuReason = JSON.parse(data2.attributes).flows
            ? JSON.parse(data2.attributes).flows[0].remark
            : "";
          this.orderInfo.imgs = data2.refundRemark?.pics || [];
          if (this.orderInfo.refundType === 0) {
            this.orderInfo.reason = data2.refundRemark?.msg || "";
          } else if (this.orderInfo.refundType === 2) {
            this.orderInfo.reason = this.orderInfo.afterSaleSubOrderList
              ? this.orderInfo.afterSaleSubOrderList[0].refundReason
              : "";
          }

          // console.log(convertYuanToFen(this.editInfo.refundAmount), this.orderInfo.refundAmount);
          // console.log(convertYuanToFen(this.editInfo.refundFee), this.orderInfo.refundFee);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    formatFee(val) {
      let value = val.replace(/[^0-9.]/g, "");
      // 1. 必须为数字，只保留数字和小数点
      // value = value.replace(/[^0-9.]/g, '');
      // 2. 只能有一个小数点
      value = value.replace(/(\..*?)\./g, "$1");
      // 3. 小数点后保留两位小数
      value = value.replace(/(\.\d{2})./g, "$1");
      // 4. 第一位输入小数点的时候自动补全，补为 0.
      if (value.startsWith(".")) {
        value = `0${value}`;
      }
      // 5. 除非是小数，否则数字不能以0开头
      value = value.replace(/^(0+)(\d)/, "$2");
      if (Number(value) > this.editInfo.refundAmount) value = this.editInfo.refundAmount;
      this.editInfo.refundFee = value;
    },
    formatAmount(val) {
      let value = val.replace(/[^0-9.]/g, "");
      // 1. 必须为数字，只保留数字和小数点
      // value = value.replace(/[^0-9.]/g, '');
      // 2. 只能有一个小数点
      value = value.replace(/(\..*?)\./g, "$1");
      // 3. 小数点后保留两位小数
      value = value.replace(/(\.\d{2})./g, "$1");
      // 4. 第一位输入小数点的时候自动补全，补为 0.
      if (value.startsWith(".")) {
        value = `0${value}`;
      }
      // 5. 除非是小数，否则数字不能以0开头
      value = value.replace(/^(0+)(\d)/, "$2");
      if (Number(value) > convertFenToYuan(this.orderInfo.refundAmount))
        value = convertFenToYuan(this.orderInfo.refundAmount);
      this.editInfo.refundAmount = value;
    },
    onReject() {
      this.$confirm("确认打回吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        financeReturn({
          id: this.orderInfo.id,
        }).then(() => {
          this.$emit("finish");
          this.visible = false;
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
      });
    },
    onSubPass() {
      if (this.showChange && !this.editInfo.updateRemark) {
        this.$message.warning("请输入财务修改金额原因");
        return;
      }
      financeConfirm({
        id: this.orderInfo.id,
        refundFee: convertYuanToFen(this.editInfo.refundFee),
        refundAmount: convertYuanToFen(this.editInfo.refundAmount),
        updateRemark: this.editInfo.updateRemark || undefined,
      })
        .then(() => {
          this.$message.success("确认退款成功");
          this.subLoading = false;
          this.$emit("finish");
          this.visible = false;
        })
        .catch(() => {
          this.subLoading = false;
        });
    },
    close() {
      this.$nextTick(() => {
        this.$refs.FormState.resetFields();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.amount-confirm {
  .amount {
    color: #ee2624;
    font-weight: 500;
  }
}
</style>
