<template>
  <el-dialog
    width="600px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    title="绑定微店订单"
    @close="close"
  >
    <el-form ref="refOrderForm" :model="orderForm" label-width="240px">
      <el-form-item label="" prop="orderId" style="display: none"></el-form-item>
      <el-form-item
        label="微店订单编号："
        prop="outOrderNo"
        :rules="[{ required: true, message: '请输入微店订单编号', trigger: 'blur' }]"
      >
        <el-input
          v-model="orderForm.outOrderNo"
          style="width: 100%"
          size="small"
          placeholder="请输入微店订单编号"
          type="number"
        >
        </el-input>
      </el-form-item>
      <el-form-item
        label="商品价格："
        prop="price"
        :rules="[{ required: true, message: '请输入商品价格', trigger: 'blur' }]"
      >
        <el-input
          v-model="orderForm.price"
          style="width: 100%"
          size="small"
          type="number"
          placeholder="请输入商品价格"
        >
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="采购数量："
        prop="num"
        :rules="[{ required: true, message: '请输入采购数量', trigger: 'blur' }]"
      >
        <el-input
          v-model="orderForm.num"
          style="width: 100%"
          size="small"
          type="number"
          placeholder="请输入采购数量"
        >
        </el-input>
      </el-form-item>
      <el-form-item
        label="实际订单金额（不含物流运费）："
        prop="orderAmount"
        :rules="[{ required: true, message: '请输入实际订单金额', trigger: 'blur' }]"
      >
        <el-input
          v-model="orderForm.orderAmount"
          style="width: 100%"
          size="small"
          type="number"
          placeholder="请输入实际订单金额"
          @blur="countTotal"
        >
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="物流费用："
        prop="freight"
        :rules="[{ required: true, message: '请输入物流费用', trigger: 'blur' }]"
      >
        <el-input
          v-model="orderForm.freight"
          style="width: 100%"
          size="small"
          type="number"
          placeholder="请输入物流费用"
          @blur="countTotal"
        >
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="实际订单总金额（包含物流运费）："
        prop="totalAmount"
        :rules="[{ required: true, message: '请输入实际订单总金额', trigger: 'blur' }]"
      >
        <el-input
          v-model="orderForm.totalAmount"
          style="width: 100%"
          size="small"
          disabled
          placeholder="请输入实际订单总金额"
        >
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="采购支付时间："
        prop="payTime"
        :rules="[{ required: true, message: '请输入采购支付时间', trigger: 'change' }]"
      >
        <el-date-picker
          v-model="orderForm.payTime"
          type="datetime"
          size="small"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 100%"
          placeholder="选择日期时间"
          default-time="12:00:00"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="handleOk">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { bindWdPayOrder } from "@/api/order";
import { convertYuanToFen } from "@/util/commonUtil.js";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      orderForm: {
        orderId: "",
        outOrderNo: "",
        price: undefined,
        num: undefined,
        freight: undefined,
        orderAmount: undefined,
        totalAmount: undefined,
        payTime: "",
      },
      orderList: [],
    };
  },
  methods: {
    show(data) {
      this.visible = true;
      this.orderForm.orderId = data.id;
      // this.orderForm.orderAmount = data.realSubtotal
      //   ? (data.realSubtotal / 100).toFixed(2)
      //   : undefined;
      // this.orderForm.outOrderNo = data.outOrderNo || undefined;
      // this.orderForm.price = data.purchaseSubOrderList[0].realPrice;
      // this.orderForm.num = data.purchaseSubOrderList[0].count;
      // this.orderForm.freight = data.realTotalDeliveryFee
      //   ? (data.realTotalDeliveryFee / 100).toFixed(2)
      //   : undefined;
      // this.orderForm.totalAmount = (
      //   ((data.realTotalDeliveryFee || 0) + (data.realSubtotal || 0)) /
      //   100
      // ).toFixed(2);
      // this.orderForm.payTime = data.gmtCreateTime;
    },
    close() {
      this.$nextTick(() => {
        this.$refs.refOrderForm.resetFields();
      });
    },
    countTotal() {
      this.orderForm.totalAmount =
        Number(this.orderForm.freight || 0) + Number(this.orderForm.orderAmount || 0);
    },
    handleOk() {
      // console.log(this.orderForm);
      // return;
      this.$refs.refOrderForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          bindWdPayOrder({
            outOrderNo: this.orderForm.outOrderNo,
            price: convertYuanToFen(this.orderForm.price),
            count: this.orderForm.num,
            realPrice: convertYuanToFen(this.orderForm.orderAmount),
            totalDeliveryFee: convertYuanToFen(this.orderForm.freight),
            realPriceTotal: convertYuanToFen(this.orderForm.totalAmount),
            id: this.orderForm.orderId,
            gmtPaySuccess: this.orderForm.payTime,
          })
            .then(() => {
              this.$message.success("绑定成功");
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
