<template>
  <avue-crud
    :option="option"
    :table-loading="loading"
    :data="data"
    :page="page"
    @current-change="currentChange"
    @size-change="sizeChange"
    @refresh-change="refreshChange"
    @on-load="onLoad"
  >
  <template slot-scope="{ row }" slot="payInfo">
    <template v-if="row.payInfoTO">
      <div v-if="row.payInfoTO?.payNo">支付单号：{{row.payInfoTO.payNo}}</div>
      <div v-if="row.payInfoTO?.outPayNo">第三方支付单号：{{row.payInfoTO.outPayNo}}</div>
      <div v-if="row.payInfoTO?.outPayBizNo">第三方支付业务单号：{{row.payInfoTO.outPayBizNo}}</div>
    </template>
  </template>
  </avue-crud>
</template>

<script>
import { convertFenToYuan } from "@/util/commonUtil.js";
import { listUserOrder } from "@/api/member/user";
import { getLabel } from "@/util/util";
import store from "@/store";
const payModelList = store.state.order.payModelList;
const platformList = store.state.order.platformList;
export default {
  props: {
    userId: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      loading: true,
      data: [],
      option: {
        addBtn: false,
        menu: false,
        column: [
          { label: "交易单号", prop: "orderNo" },
          // { label: "交易时间", prop: "gmtPaySuccess" },
          {
            label: "下单平台",
            prop: "platform",
            formatter: (val) => getLabel(val.platform, platformList),
          },
          {
            label: "实付款",
            prop: "price",
            html: true,
            formatter: (val) => {
              let text = "";
              // if (!val.currency) {
              //   text = convertFenToYuan(val.actualPayAmount, { sign: "￥" });
              // } else {
              //   text =
              //     val.currency +
              //     convertFenToYuan(val.outActualPayAmount) +
              //     "<br/>" +
              //     convertFenToYuan(val.actualPayAmount, { sign: "￥" });
              // }
              text = convertFenToYuan(val.actualPayAmount, { sign: "￥" });
              return text;
              // return convertFenToYuan(val.price, { sign: "￥" });
            },
          },
          {
            label: "支付方式",
            prop: "payModelName",
            formatter: (val) => getLabel(val.payModel, payModelList),
          },
          {
            label: "支付信息",
            prop: "payInfo",
            width: 300
          },
          { label: "订单状态", prop: "orderStatusDesc" },
          { label: "创建时间", prop: "gmtCreateTime" },
          { label: "交易完成时间", prop: "gmtCreate" },
        ],
      },
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
    };
  },
  computed: {},
  created() {},
  methods: {
    refreshChange() {
      this.onLoad(this.page);
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    // TODO:待联调
    onLoad(page) {
      this.loading = true;
      const param = {
        current: page.currentPage,
        size: page.pageSize,
        userId: this.userId,
      };
      listUserOrder(param).then((res) => {
        if (res && res.data && res.data.data) {
          const data = res.data.data;
          this.page.total = Number(data.total);
          this.data = data.records;
          this.loading = false;
        }
      });
    },
  },
};
</script>
