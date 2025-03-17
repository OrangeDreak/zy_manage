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
        <el-button type="text" @click="toDetail(row.id)">查看</el-button>
        <!-- <el-popconfirm
          v-if="row.orderStatus === 7"
          title="确定继续该操作吗？"
          @confirm="pushOrder(row)"
        >
          <el-button slot="reference" style="margin: 0 7px" type="text">创建包裹</el-button>
        </el-popconfirm> -->

        <el-button
          v-if="[1].includes(row.dangerStatus) && [0, 1, 7].includes(row.orderStatus)"
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
      <template slot-scope="{ row }" slot="actualPayAmount">
        {{ getLabel(row.actualPayAmount, []) }}
      </template>
      <template slot-scope="{ row }" slot="dangerStatus">
        <el-tag v-if="row.dangerStatus === 1">待处理</el-tag>
        <el-tag v-else-if="row.dangerStatus === 2" type="info">未充值</el-tag>
        <el-tag v-else-if="row.dangerStatus === 3" type="warning">已充值</el-tag>
        <el-tag v-else-if="row.dangerStatus === 5" type="warning">换单中</el-tag>
        <el-tag v-else-if="row.dangerStatus === 4" type="success">处理完成</el-tag>
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
        isDangerous: 1,
        time: [],
      },
      data: [],
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
        isDangerous: 1,
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
        searchMenuSpan: 24,
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

          // {
          //   label: "收货地址",
          //   width: 120,
          //   prop: "address",
          // },

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
        isDangerous: 1,
      };
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
    onShipping(row) {
      this.$refs.refShippingDialog.show({ id: row.id });
    },
    pushOrder(row) {},
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
  background-color: rgba(255, 69, 0, 0.1);
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
