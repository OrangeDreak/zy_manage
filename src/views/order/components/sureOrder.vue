<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    width="80%"
    title="订单确认"
  >
    <div class="tips">注意：订单确认仅可操作一次，请谨慎选择</div>
    <div class="header">
      <div class="item">
        <span class="label">主订单ID:</span>
        {{ orderInfo.orderId }}
      </div>
      <div class="item">
        <span class="label">订单编号:</span>
        {{ orderInfo.orderNo }}
      </div>
      <div class="item">
        <span class="label">下单时间:</span>
        {{ orderInfo.gmtOrderPay }}
      </div>
      <div class="item">
        <span class="label">付款方式:</span>
        {{ getLabel(orderInfo.payModel, payModelList) }}
      </div>
    </div>
    <avue-crud
      ref="crud"
      rowKey="id"
      :data="subOrderData"
      :table-loading="loading"
      :option="option"
      @selection-change="selectionChange"
    >
      <template slot-scope="{ row }" slot="productName">
        <div class="detail">
          <div class="poster">
            <el-image
              style="width: 80px; height: 80px"
              :src="row.headPic"
              fit="cover"
            ></el-image>
          </div>
          <div class="info">
            <div class="title text" :title="row.productName">
              {{ row.productName }}
            </div>
            <div class="size text">
              <template v-if="row.attrs">
                <span v-for="sku in row.attrs" :key="sku.attrValue">
                  <span>{{ sku.attrName }}:{{ sku.attrValue }}&nbsp;</span>
                </span>
                <!-- &nbsp;<span class="num">×{{ row.count }}</span> -->
              </template>
            </div>
            <div v-if="row.shopName" class="store-name text">
              店铺名称：{{ row.shopName }}
            </div>
            <!-- <div v-if="orderId" class="orderNo text">
              主订单号：{{ orderId }}
            </div>
            <div v-if="row.outSubOrderNo" class="orderNo text">
              子订单号：{{ row.outSubOrderNo }}
            </div> -->
          </div>
        </div>
      </template>
    </avue-crud>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="sureOrder"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { getSubDetail, confirmOrder } from "@/api/order";
import { convertFenToYuan } from "@/util/commonUtil.js";
import { getLabel } from "@/util/util";
import store from "@/store";
const payModelList = store.state.order.payModelList;
export default {
  data() {
    return {
      visible: false,
      loading: false,
      submitLoading: false,
      orderId: "",
      subOrderData: [],
      orderInfo: {},
      payModelList,
      option: {
        menu: false,
        header: false,
        selection: true,
        // selectable: (row, index) => {
        //   return row.orderStatus === 4;
        // },
        column: [
          { label: "商品详情", prop: "productName", width: 500 },
          {
            label: "单价",
            prop: "price",
            formatter: (val) => {
              return convertFenToYuan(val.price, { sign: "￥" });
            },
          },
          {
            label: "数量",
            prop: "skuNum",
            formatter: (val) => {
              return "×" + val.skuNum;
            },
          },
          // { label: "订单状态", prop: "statusDesc" },
          {
            label: "订单金额",
            prop: "subtotal",
            formatter: (val) => {
              return convertFenToYuan(val.subtotal, { sign: "￥" });
            },
          },
        ],
      },
      selections: [],
    };
  },
  methods: {
    getLabel,
    selectionChange(list) {
      this.selections = list;
      // this.$message.success('选中的数据'+ JSON.stringify(list));
    },
    sureOrder() {
      if (!this.selections.length) {
        this.$message.warning("请勾选订单");
      } else {
        this.submitLoading = true;
        confirmOrder({ subOrderIds: this.selections.map((v) => v.id) })
          .then(() => {
            this.$emit("finish");
            this.visible = false;
          })
          .finally(() => {
            this.submitLoading = false;
          });
      }
    },
    show(orderId) {
      // console.log(data);
      // this.subOrderData = data;
      this.visible = true;
      this.getDetail(orderId);
    },
    getDetail(id) {
      this.loading = true;
      this.selections = [];
      getSubDetail({ id })
        .then((res) => {
          this.orderInfo = res.data.data;
          this.subOrderData = res.data.data.subDetailList;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.tips {
  color: #f56c6c;
  font-size: 14px;
  font-weight: 500;
  line-height: 50px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f3f7fd;
  border-radius: 2px;
}
.detail {
  display: flex;
  align-items: center;
  .info {
    width: 0;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 12px;
    color: #666;
    margin-left: 10px;
    .title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #000;
      font-weight: 500;
      margin-bottom: 10px;
    }
    .num {
      color: #333;
      font-size: 14px;
      font-weight: bold;
      margin-left: 10px;
    }
  }
}
</style>
