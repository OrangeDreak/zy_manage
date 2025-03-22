<template>
  <div class="basic-container">
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      rowKey="warehouseOrderNo"
      :row-class-name="rowClassName"
      :search.sync="search"
      :page="page"
      @search-change="searchChange"
      @search-reset="searchReset"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template #menu="scope, index">
        <el-button type="text" @click="toDetail(scope.row.id)">包裹详情</el-button>
        <!-- 转运单已出单，且属于商家转运订单,bizType:1商家转运订单，0普通订单包裹普通的转运订单 -->
        <el-button
          v-if="scope.row.orderStatus === 1"
          style="margin: 0 7px"
          type="text"
          @click="onShipping(scope.row)"
          >转运发货</el-button
        >
        <el-button
          v-if="[0, 1, 7].includes(scope.row.orderStatus)"
          style="margin: 0 7px"
          type="text"
          @click="cancelOrder(scope.row)"
          >取消订单</el-button
        >
      </template>
      <template #userId-form>
        <router-link :to="`/userDetail/index?id=${form.userId}`" style="color: #409eff">{{
          row.userId
        }}</router-link>
      </template>
      <template #actualPayAmount-form>
        {{ getLabel(form.actualPayAmount, []) }}
      </template>
      <template #debtAmount-form>
        <template v-if="form.debtStatus">
          {{ convertFenToYuan(form.debtAmount, { sign: "￥" }) }}
        </template>
      </template>
      <template #tradeNo-form>
        <div v-if="form.tradeNo">交易单号:{{ form.tradeNo }}</div>
        <div v-if="form.refundTradeNo">退款交易号:{{ form.refundTradeNo }}</div>
        <div v-if="form.twicePayTradeNo">补缴交易号:{{ form.twicePayTradeNo }}</div>
      </template>
    </avue-crud>
    <CancelReason ref="refCancelReason" type="package" @finish="finish" />
    <ShippingDialog ref="refShippingDialog" @finish="finish"></ShippingDialog>
  </div>
</template>

<script>
import { getPackageList, getOrderStatus } from "@/api/order";
import store from "@/store";
import { getLabel } from "@/utils/util";
import { convertFenToYuan } from "@/utils/commonUtil.js";
import { pickerOptions } from "@/utils/date";
import CancelReason from "./components/cancelReason.vue";
import ShippingDialog from "./components/shippingDialog.vue";
import "@/styles/flex.scss";
import "@/styles/commonStyle.scss";
import '@smallwei/avue/lib/index.css';

export default {
  name: "PackageOrderList",
  components: { CancelReason, ShippingDialog },
  data() {
    return {
      search: {
        orderStatus: "",
        time: [],
      },
      data: [],
      loading: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      query: {},
      option: {
        searchLabelWidth: 120,
        searchMenuSpan: 12,
        searchMenuPosition: "right",
        menuWidth: 150,
        menuAlign: "center",
        addBtn: false,
        editBtn: false,
        delBtn: false,
        column: [
          {
            label: "ID",
            prop: "id",
          },
          {
            label: "包裹单号",
            prop: "packageOrderNo",
            search: true,
            searchOrder: 9,
          },
          {
            label: "国际物流单",
            prop: "trackingNo",
            search: true,
            searchOrder: 2,
            width: 120,
            html: true,
            formatter: (val) => {
              return `<div>ID:${val.trackingNo === "0" ? "--" : val.trackingNo}</div><div>编号:${
                val.outSystemOrderNumber || "--"
              }</div>`;
              // return  val.trackingNo === "0" ? "" : val.trackingNo;
            },
          },
          {
            label: "补款状态",
            prop: "waitDebt",
            search: true,
            hide: true,
            type: "select",
            dicData: [
              {
                label: "待补款",
                value: 1,
              },
            ],
          },
          {
            label: "仓库订单号",
            prop: "warehouseOrderNo",
            search: true,
            hide: true,
            searchOrder: 8,
          },
          { label: "主订单ID", prop: "orderId", hide: true, search: true, searchOrder: 7 },

          { label: "用户ID", prop: "userId", search: true, searchOrder: 6, width: 100 },
          {
            label: "真实运费",
            prop: "finalPaymentPrice",
            // width: 100,
            formatter: (val) => {
              return val.finalPaymentPrice
                ? convertFenToYuan(val.finalPaymentPrice, { sign: "￥" })
                : "--";
            },
          },
          {
            label: "用户预支付运费",
            prop: "totalAmount",
            // width: 100,
            formatter: (val) => {
              return convertFenToYuan(val.totalAmount, { sign: "￥" });
            },
          },
          {
            label: "待补款运费",
            prop: "debtAmount",
            // width: 100,
            // formatter: (val) => {
            //   return convertFenToYuan(val.totalAmount, { sign: "￥" });
            // },
          },
          {
            label: "申报金额",
            prop: "gradeDiscount",
            width: 120,
            formatter: (val) => {
              return convertFenToYuan(val.gradeDiscount, { sign: "￥" });
            },
          },
          {
            label: "预估税费",
            prop: "taxReportingFee",
            width: 120,
            formatter: (val) => {
              return convertFenToYuan(val.taxReportingFee, { sign: "￥" });
            },
          },
          {
            label: "包裹状态",
            prop: "orderStatus",
            search: true,
            searchOrder: 3,
            type: "select",
            dicData: [],
            formatter: (val) => val.orderStatusDesc,
          },
          {
            label: "收件人",
            prop: "receiver",
            search: true,
            searchOrder: 5,
          },
          {
            label: "创建时间",
            prop: "gmtCreateTime",
            type: "daterange",
            search: true,
            searchRange: true,
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            defaultTime: ["00:00:00", "23:59:59"],
            pickerOptions: pickerOptions,
            formatter: (val) => {
              return val.gmtCreateTime;
            },
          },
          {
            label: "支付时间",
            prop: "gmtPayTime",
            type: "daterange",
            searchRange: true,
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            defaultTime: ["00:00:00", "23:59:59"],
            pickerOptions: pickerOptions,
            formatter: (val) => {
              return val.gmtPayTime;
            },
          },
          {
            label: "仓库签收时间",
            width: 120,
            prop: "gmtPackageLogisticsDeliverTime",
          },
        ],
      },
    };
  },
  created() {
    // 获取搜索项的订单状态
    getOrderStatus({
      name: "com.x.bp.common.enums.PackageOrderStatusEnum",
    }).then((res) => {
      const arr = res.data.map((item) => {
        return {
          label: item.desc,
          value: String(item.code),
        };
      });
      this.option.column.some((item) => {
        if (item.prop === "orderStatus") {
          item.dicData = [...arr];
          return true;
        }
      });
    });
  },
  methods: {
    convertFenToYuan,
    getLabel,
    rowClassName({ row }) {
      if (row.debtStatus) {
        return "has-debt-amount";
      }
      return "";
    },

    searchChange(params, done) {
      if (params.gmtCreateTime && params.gmtCreateTime.length) {
        params.startGmtCreateTime = params.gmtCreateTime[0];
        params.endGmtCreateTime = params.gmtCreateTime[1];
      } else {
        delete params.startGmtCreateTime;
        delete params.endGmtCreateTime;
      }
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad(page, params = {}) {
      this.loading = true;
      const param = {
        pageNo: page.currentPage,
        pageSize: page.pageSize,
        ...Object.assign(params, this.query),
      };
      getPackageList(param)
        .then((res) => {
          this.page.total = Number(res.total || 0);
          const arr = res.data || [];
          this.data = arr;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 点击【详情】
    toDetail(id) {
      this.$router.push(`/order/package-detail/${id}`);
    },
    onShipping(row) {
      this.$refs.refShippingDialog.show({ id: row.id });
    },
    cancelOrder(row) {
      this.$refs.refCancelReason.show({ orderId: row.id });
    },
    finish() {
      this.refreshChange();
    },
  },
};
</script>
<style lang="scss" scoped>
:deep(.has-debt-amount) {
  background-color: #fcdede;
}
.user-list {
  &-input-with-select {
    // width: 400px;
    // margin-right: 24px;
  }

  &-search {
    font-size: 14px;
    width: 120px;
  }

  &_info {
    line-height: 1.5;
  }

  &_avatar {
    width: 50px;
    height: 50px;
    border-radius: 3px;
    object-fit: cover;
    margin-right: 8px;
  }
}
</style>
<style>
.user-list-input-with-select .el-select .el-input {
  width: 100px;
}

.user-list-input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.user-list-select .el-input {
  width: 300px;
}
</style>
