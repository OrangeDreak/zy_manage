<template>
  <basic-container>
    <!-- :span-method="spanMethod" -->
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
      <template slot-scope="{ row }" slot="menu">
        <el-button type="text" @click="toDetail(row.id)">包裹详情</el-button>
        <el-button v-if="row.isDangerous === 1" type="text" @click="toDangerDetail(row.id)"
          >风控包裹详情</el-button
        >
        <el-popconfirm
          v-if="row.orderStatus === 7 && row.isDangerous === 0"
          title="确定继续该操作吗？"
          @confirm="pushOrder(row)"
        >
          <el-button slot="reference" style="margin: 0 7px" type="text">创建包裹</el-button>
        </el-popconfirm>
        <!-- 转运单已出单，且属于商家转运订单,bizType:1商家转运订单，0普通订单包裹普通的转运订单 -->
        <el-button
          v-if="row.orderStatus === 2 && row.bizType === 1"
          style="margin: 0 7px"
          type="text"
          @click="onShipping(row)"
          >商家转运发货</el-button
        >
        <el-button
          v-if="[0, 1, 7].includes(row.orderStatus)"
          style="margin: 0 7px"
          type="text"
          @click="cancelOrder(row)"
          >取消订单</el-button
        >
      </template>
      <template slot-scope="{ row }" slot="userId">
        <router-link :to="`/userDetail/index?id=${row.userId}`" style="color: #409eff">{{
          row.userId
        }}</router-link>
      </template>
      <template slot-scope="{ row }" slot="isDangerous">
        <div>
          <el-tag v-if="row.isDangerous === 1" type="danger">风控包裹</el-tag>
          <el-tag v-else type="success">正常包裹</el-tag>
        </div>
      </template>
      <template slot-scope="{ row }" slot="actualPayAmount">
        {{ getLabel(row.actualPayAmount, []) }}
      </template>
      <template slot-scope="{ row }" slot="debtAmount">
        <template v-if="row.debtStatus">
          {{ convertFenToYuan(row.debtAmount, { sign: "￥" }) }}
        </template>
      </template>

      <template slot-scope="{ row }" slot="platform">
        {{ getLabel(row.platform, platformList) }}
      </template>
      <template slot-scope="{ row }" slot="tradeNo">
        <div v-if="row.tradeNo">交易单号:{{ row.tradeNo }}</div>
        <div v-if="row.refundTradeNo">退款交易号:{{ row.refundTradeNo }}</div>
        <div v-if="row.twicePayTradeNo">补缴交易号:{{ row.twicePayTradeNo }}</div>
      </template>
      <template slot="menuLeft">
        <el-tabs v-model="search.bizType" type="card" @tab-click="handleClick">
          <el-tab-pane
            v-for="item in biztypeList"
            :key="item.value"
            :label="item.label"
            :name="item.value"
          />
        </el-tabs>
      </template>
    </avue-crud>
    <CancelReason ref="refCancelReason" type="package" @finish="finish" />
    <SupplementaryPayment ref="refSupplementaryPayment" @finish="finish" />
    <ShippingDialog ref="refShippingDialog" @finish="finish"></ShippingDialog>
  </basic-container>
</template>

<script>
import { getPackageList, getOrderStatus, pushPackageOrder, checkIsDangerUser } from "@/api/order";
import store from "@/store";
import { getLabel } from "@/util/util";
import { convertFenToYuan } from "@/util/commonUtil.js";
import { pickerOptions } from "@/util/date";
import SupplementaryPayment from "./components/supplementaryPayment.vue";
import CancelReason from "./components/cancelReason.vue";
import ShippingDialog from "./components/shippingDialog.vue";
const platformList = store.state.order.platformList;
export default {
  name: "PackageOrderList",
  components: { SupplementaryPayment, CancelReason, ShippingDialog },
  data() {
    return {
      search: {
        orderStatus: "",
        bizType: "-1",
        time: [],
      },
      data: [],
      biztypeList: [
        {
          label: "全部",
          value: "-1",
        },
        {
          label: "普通订单",
          value: "0",
        },
        {
          label: "商家转运订单",
          value: "1",
        },
      ],
      // tabsList: [
      //   {
      //     label: "待支付",
      //     value: "1",
      //     num: 20,
      //   },
      //   {
      //     label: "待发货",
      //     value: "10",
      //     num: 20,
      //   },
      //   {
      //     label: "已发货",
      //     value: "11",
      //     num: 20,
      //   },
      //   {
      //     label: "已取消",
      //     value: "4",
      //     num: 20,
      //   },
      // ],
      platformList,
      loading: false,
      query: {
        bizType: "-1",
      },
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      option: {
        // height: "auto",
        // calcHeight: 210,
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
          // {
          //   label: "实付总金额/订单金额/手续费",
          //   width: 200,
          //   prop: "totalAmount",
          //   formatter: (val) => {
          //     convertFenToYuan(val.totalAmount, { sign: "￥" }) +
          //       "/" +
          //       convertFenToYuan(val.orderAmount, { sign: "￥" }) +
          //       "/" +
          //       convertFenToYuan(val.fee, { sign: "￥" });
          //   },
          // },
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
            label: "优惠券抵扣金额",
            prop: "discount",
            width: 120,
            formatter: (val) => {
              return convertFenToYuan(val.discount, { sign: "￥" });
            },
          },
          {
            label: "会员折扣抵扣金额",
            prop: "gradeDiscount",
            width: 120,
            formatter: (val) => {
              return convertFenToYuan(val.gradeDiscount, { sign: "￥" });
            },
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
            label: "是否风控",
            prop: "isDangerous",
            searchOrder: 4,
            search: true,
            showOverflowTooltip: false,
            type: "select",
            dicData: [
              {
                label: "风控包裹",
                value: 1,
              },
              {
                label: "正常包裹",
                value: 0,
              },
            ],
          },
          {
            label: "收件人",
            prop: "receiver",
            search: true,
            searchOrder: 5,
          },
          {
            label: "订单类型",
            prop: "bizType",
            formatter: (val) => (val.bizType === 0 ? "普通订单" : "商家转运订单"),
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
            // search: true,
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

          // {
          //   label: "创建时间",
          //   prop: "createTime",
          //   searchOrder: 1,
          //   width: 100,
          //   type: "daterange",
          //   search: true,
          //   searchRange: true,
          //   valueFormat: "yyyy-MM-dd HH:mm:ss",
          //   defaultTime: ["00:00:00", "23:59:59"],
          //   pickerOptions: pickerOptions,
          //   formatter: (val) => {
          //     return val.gmtCreateTime;
          //   },
          // },
        ],
      },
    };
  },
  created() {
    // 获取搜索项的订单状态
    getOrderStatus({
      name: "com.sifubuy.buy.common.enums.PackageOrderStatusEnum",
    }).then((res) => {
      const arr = res.data.data.map((item) => {
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
    handleClick() {
      this.page.currentPage = 1;
      this.query.bizType = this.search.bizType;
      this.onLoad(this.page, this.query);
    },
    convertFenToYuan,
    getLabel,
    rowClassName({ row }) {
      if (row.debtStatus) {
        return "has-debt-amount";
      }
      return "";
    },
    spanMethod({ row, columnIndex }) {
      if (columnIndex === 3 || columnIndex === 4 || columnIndex === this.option.column.length) {
      } else {
        if (row.warehouseOrderList) {
          return {
            rowspan: row.warehouseOrderList.length,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
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
      this.query = {
        bizType: "-1",
      };
      this.search.bizType = "-1";
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
      if (param.bizType === "-1") {
        delete param.bizType;
      }
      getPackageList(param)
        .then((res) => {
          if (res.data.data) {
            const data = res.data.data;
            this.page.total = Number(data.total || 0);
            const arr = data.records || [];
            // const arr2 = [];
            // arr.forEach((item) => {
            //   const arr3 = [];
            //   item.warehouseOrderList.forEach((child) => {
            //     arr3.push(child);
            //   });
            //   arr3[0] = { ...arr3[0], ...item };
            //   arr2.push(...arr3);
            // });
            // this.data = arr2;
            this.data = arr;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 点击【详情】
    toDetail(id) {
      this.$router.push(`/order/package-detail/${id}`);
    },
    // 点击【详情】
    toDangerDetail(id) {
      this.$router.push(`/order/danger-package-detail/${id}`);
    },
    // 补款
    toSendBk(row) {
      this.$refs.refSupplementaryPayment.show({
        orderId: row.packageOrderId,
        additionalPayment: row.totalAmount,
      });
      // this.subLoading = row.packageOrderId;
      // sendPayNotify({ id: row.packageOrderId })
      //   .then(() => {
      //     const message =
      //       row.orderStatus === 7
      //         ? this.$t("bkWarnTip")
      //         : this.$t("payWarnTip");
      //     this.$message.success(message);
      //   })
      //   .finally(() => {
      //     this.subLoading = "";
      //   });
    },
    async pushOrder(row) {
      try {
        let status = false;
        if (row.bizType === 0) {
          const { data } = await checkIsDangerUser({ id: row.id });

          console.log(data);
          status = data.data;
        }
        if (!status) {
          await pushPackageOrder({ id: row.id });
          this.$message.success("操作成功");
          this.finish();
        } else {
          this.$confirm("此包裹为风控包裹，是否继续该操作？", {
            confirmButtonText: "确认",
            cancelButtonText: "我再想想",
            type: "warning",
          })
            .then(async () => {
              await pushPackageOrder({ id: row.id });
              this.$message.success("操作成功");
              this.finish();
            })
            .catch(() => {});
        }
      } catch (e) {
        console.log(e);
      }
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
@import "@/styles/flex.scss";
@import "@/styles/commonStyle.scss";
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
