<template>
  <basic-container>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      :search.sync="search"
      :page="page"
      rowKey="orderId"
      @search-change="searchChange"
      @search-reset="searchReset"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
    >
      <template slot="orderStatus" slot-scope="{ row }">
        {{ row.orderStatusDesc }}
        <div v-if="row.businessPayStatus">
          <el-tag size="mini" type="danger">待补款</el-tag>
        </div>
      </template>
      <template slot-scope="{ row }" slot="menu">
        <el-button type="text" @click="toDetail(row.orderId)">查看</el-button>
        <el-button
          v-if="row.orderStatus == 2 && permission.order_list_action"
          type="text"
          @click="acceptOrder(row)"
          >去接单</el-button
        >
        <!-- <el-popconfirm title="确定取消该订单吗？" @confirm="cancelOrder(row)"> -->
        <el-button
          style="margin: 0 7px"
          type="text"
          size="small"
          v-if="[1].includes(row.orderStatus) && permission.order_list_action"
          @click="cancelOrder(row)"
          >取消订单</el-button
        >
        <!-- </el-popconfirm> -->
        <el-button
          v-if="row.orderStatus == 3 && permission.order_list_action"
          type="text"
          size="small"
          :loading="purchaseId == row.orderId"
          @click="toPurchase(row)"
          >去采购</el-button
        >
        <el-button
          v-if="row.orderStatus == 3 && !row.isConfirm && permission.order_list_action"
          type="text"
          size="small"
          @click="onSureOrder(row)"
          >提交确认</el-button
        >
      </template>
      <!-- <template slot-scope="{ row }" slot="platform">
        {{ getLabel(row.platform, platformList) }}
      </template> -->
      <template slot="menuLeft">
        <el-tabs v-model="search.orderStatus" type="card" @tab-click="handleClick">
          <el-tab-pane
            v-for="item in tabsList"
            :key="item.value"
            :label="item.label"
            :name="item.value"
          />
        </el-tabs>
      </template>
    </avue-crud>
    <SureOrder ref="sureOrder" @finish="finish" />
    <CancelReason ref="refCancelReason" :reasonList="reasonList" @finish="finish" />
  </basic-container>
</template>

<script>
import { getList, getOrderStatus, getCancelReason, takeOrder, purchaseOrder } from "@/api/order";
import store from "@/store";
import { getLabel } from "@/util/util";
import { pickerOptions } from "@/util/date";
import { convertFenToYuan } from "@/util/commonUtil.js";
import SureOrder from "./components/sureOrder.vue";
import CancelReason from "./components/cancelReason.vue";
import { mapGetters } from "vuex";

const platformList = store.state.order.platformList;
const payModelList = store.state.order.payModelList;
export default {
  name: "OrderList",
  components: { SureOrder, CancelReason },
  data() {
    return {
      search: {
        gmtCreateTime: [],
        gmtPaySuccess: [],
      },
      data: [],
      tabsList: [],
      platformList,
      loading: false,
      purchaseId: "",
      query: {},
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      option: {
        // height: "auto",
        // calcHeight: 210,
        searchSpan: 6,
        searchMenuSpan: 12,
        searchMenuPosition: "right",
        menuWidth: 200,
        searchLabelWidth: 100,
        menuAlign: "center",
        addBtn: false,
        editBtn: false,
        delBtn: false,
        column: [
          { label: "主订单ID", prop: "orderId", search: true },
          { label: "主订单编号", prop: "orderNo", search: true },
          { label: "子订单编号", prop: "subOrderNo", hide: true, search: true },
          { label: "用户ID", prop: "userId", search: true },
          { label: "物流单号", prop: "logisticsTrackingNumber", search: true, hide: true },
          { label: "用户昵称", prop: "nickName" },
          {
            label: "订单状态",
            prop: "orderStatus",
            // props: {
            //   label: "desc",
            //   valur: "code",
            // },
            searchClearable: false,
            search: true,
            type: "select",
            dicData: [],
            align: "center",
            formatter: (val) => {
              // if (val.)
              return val.orderStatusDesc;
            },
          },
          {
            label: "订单总金额",
            prop: "actualPayAmount",
            width: 170,
            formatter: (val) => {
              if (val.currency && val.currency != "CNY") {
                return `${convertFenToYuan(val.outActualPayAmount, {
                  sign: val.currency,
                })} / ${convertFenToYuan(val.actualPayAmount, {
                  sign: "CNY",
                })}`;
              } else {
                return convertFenToYuan(val.actualPayAmount, { sign: "CNY" });
              }
            },
          },
          {
            label: "付款方式",
            prop: "payModel",
            search: true,
            type: "select",
            dicData: payModelList,
            formatter: (val) => {
              if ([1, 12, 9].includes(val.orderStatus)) {
                return "";
              } else {
                return getLabel(val.payModel, payModelList);
              }
            },
          },
          {
            label: "订单类型",
            prop: "platform",
            width: 100,
            search: true,
            type: "select",
            dicData: platformList,
            formatter: (val) => getLabel(val.platform, platformList),
          },
          { label: "配送物流", prop: "deliveryCompany" },
          {
            label: "下单时间",
            prop: "gmtCreateTime",
            search: true,
            width: 90,
            type: "daterange",
            searchRange: true,
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            defaultTime: ["00:00:00", "23:59:59"],
            pickerOptions: pickerOptions,
            formatter: (val) => val.gmtCreateTime,
          },
          {
            label: "付款时间",
            prop: "gmtPaySuccess",
            type: "daterange",
            width: 90,
            search: true,
            searchRange: true,
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            defaultTime: ["00:00:00", "23:59:59"],
            pickerOptions: pickerOptions,
            formatter: (val) => {
              if ([1, 12, 8, 9].includes(val.orderStatus)) {
                return "";
              } else {
                return val.gmtPaySuccess;
              }
            },
          },
        ],
      },
      reasonList: [],
    };
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  created() {
    // 获取搜索项的订单状态
    getOrderStatus({
      name: "com.sifubuy.buy.common.enums.EnumBackOrderStatus",
    }).then((res) => {
      this.tabsList = res.data.data.map((item) => {
        return {
          label: item.desc,
          value: String(item.code),
        };
      });
      this.option.column.some((item) => {
        if (item.prop === "orderStatus") {
          item.dicData = [...this.tabsList];
          return true;
        }
      });
      this.search.orderStatus = this.tabsList[0].value;
      this.query.orderStatus = this.search.orderStatus;
      this.onLoad(this.page, this.query);
    });
    // 取消原因
    getCancelReason().then((res) => {
      this.reasonList = res.data.data || [];
    });
  },
  methods: {
    handleClick() {
      this.page.currentPage = 1;
      this.query.orderStatus = this.search.orderStatus;
      this.onLoad(this.page, this.query);
    },
    searchChange(params, done) {
      if (params.gmtCreateTime && params.gmtCreateTime.length) {
        params.startGmtCreateTime = params.gmtCreateTime[0];
        params.endGmtCreateTime = params.gmtCreateTime[1];
      } else {
        delete params.startGmtCreateTime;
        delete params.endGmtCreateTime;
      }
      if (params.gmtPaySuccess && params.gmtPaySuccess.length) {
        params.startPaySuccessTime = params.gmtPaySuccess[0];
        params.endPaySuccessTime = params.gmtPaySuccess[1];
      } else {
        delete params.startPaySuccessTime;
        delete params.endPaySuccessTime;
      }
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    searchReset() {
      this.search.orderStatus = "0";
      this.query = {
        orderStatus: "0",
      };
      this.page.currentPage = 1;
      this.onLoad(this.page, this.query);
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.onLoad(this.page, this.query);
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
      // if (param.orderStatus == 0) {
      //   delete param.orderStatus;
      // }
      getList(param)
        .then((res) => {
          if (res && res.data && res.data.data) {
            const data = res.data.data;
            this.page.total = Number(data.total || 0);
            this.data = data.records;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // 点击【详情】
    toDetail(id) {
      this.$router.push(`/order/detail/${id}`);
    },
    acceptOrder(row) {
      takeOrder({ orderId: row.orderId }).then(() => {
        this.$message.success("接单成功");
        this.refreshChange();
      });
    },
    cancelOrder(row) {
      this.$refs.refCancelReason.show({ orderId: row.orderId });
    },
    finish() {
      this.refreshChange();
    },
    // 确认订单
    onSureOrder(row) {
      this.$refs.sureOrder.show(row.orderId);
    },
    // 采购
    toPurchase(row) {
      this.purchaseId = row.orderId;
      purchaseOrder({ orderId: row.orderId })
        .then(() => {
          this.$message.success("采购完成");
          this.refreshChange();
        })
        .finally(() => {
          this.purchaseId = "";
        });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/flex.scss";
@import "@/styles/commonStyle.scss";

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
