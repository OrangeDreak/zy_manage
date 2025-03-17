<template>
  <!-- <basic-container class="fs14" v-loading="loading"> -->
  <div class="detail fs14" v-loading="loading">
    <el-card shadow="never">
      <div class="head">
        <el-form class="order-detail-form head-form" :model="orderInfo" inline>
          <el-form-item label="包裹订单ID:">{{ orderInfo.packageOrderId }}</el-form-item>
          <el-form-item label="包裹收货地址:">{{ orderInfo.packageOrderFullAddress }}</el-form-item>
          <!-- <el-form-item label="包裹订单号:">{{ orderInfo.packageOrderNo }}</el-form-item>
          <el-form-item label="创建时间:">{{ orderInfo.gmtCreateTime }}</el-form-item> -->
          <!-- <div class="stash-list">
            <el-form-item
              v-for="(item, index) in orderInfo.warehouseOrderNoList"
              :key="index"
              :label="`仓库订单号${index + 1}:`"
              >{{ item }}</el-form-item
            >
          </div> -->
        </el-form>
      </div>
    </el-card>
    <el-card class="list" shadow="never">
      <div slot="header" class="card-header">
        订单记录
        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
      </div>
      <div class="menu">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
          >全选</el-checkbox
        >
        <div>
          <el-button type="primary" @click="mostRechargeOrder">批量创建充值申请</el-button>
          <el-button type="primary" @click="mostReleaseRiskOrder">批量解除风控</el-button>
        </div>
      </div>

      <el-checkbox-group v-model="selectIds" @change="handleCheckedChange">
        <avue-crud
          ref="crud"
          rowKey="id"
          :data="packageData"
          :option="option"
          :span-method="spanMethod"
          @selection-change="selectionChange"
        >
          <template slot-scope="{ row }" slot="productName">
            <div class="product-detail">
              <div class="poster">
                <el-image
                  style="width: 60px; height: 60px"
                  :src="row.headPic"
                  fit="cover"
                ></el-image>
              </div>
              <div class="info">
                <div class="title text" :title="row.productName">
                  {{ row.productName }}
                </div>
                <div class="size text">
                  <template v-if="row.attrList">
                    <span v-for="sku in row.attrList" :key="sku.attrValue">
                      <span>{{ sku.attrName }}:{{ sku.attrValue }}&nbsp;</span>
                    </span>
                  </template>
                </div>
                <!-- <div v-if="row.subOrderId" class="orderNo text">
                    子订单ID：{{ row.subOrderId }}
                  </div> -->
                <div v-if="row.subOrderNo" class="orderNo text">子订单号：{{ row.subOrderNo }}</div>
              </div>
            </div>
          </template>
          <template slot-scope="{ row }" slot="subOrderId">
            <el-checkbox :label="row.id" :disabled="!selectable(row)">{{
              row.subOrderId
            }}</el-checkbox>
          </template>
          <template slot-scope="{ row }" slot="status">
            <el-tag v-if="row.status === -1" type="info">已取消</el-tag>
            <el-tag v-else-if="row.status === 0">待处理</el-tag>
            <el-tag v-else-if="row.status === 1" effect="dark">待支付</el-tag>
            <el-tag v-else-if="row.status === 2" effect="dark" type="success">已完成</el-tag>
            <el-tag v-else-if="row.status === 3" type="danger">失败</el-tag>
            <el-tag v-else-if="row.status === 4" effect="dark" type="success">支付成功</el-tag>
            <el-tag v-else-if="row.status === 5">待换单</el-tag>
            <el-tag v-else-if="row.status === 6" type="warning">换单中</el-tag>
          </template>
          <template slot-scope="{ row }" slot="menu">
            <el-button v-if="row.status === 0" type="text" @click="rechargeOrder(row)"
              >创建充值申请</el-button
            >

            <el-button v-if="row.status === 0" type="text" @click="releaseRiskOrder(row)"
              >解除风控</el-button
            >
          </template>
          <template slot="empty"> 暂无数据 </template>
        </avue-crud>
      </el-checkbox-group>
    </el-card>
    <el-card class="list" shadow="never">
      <div slot="header" class="card-header">可换单记录</div>
      <div class="menu">
        <div></div>
        <el-button type="primary" @click="mostChangeOrder">批量换单</el-button>
      </div>
      <avue-crud
        :option="option1"
        rowKey="id"
        :span-method="spanMethod1"
        :data="switchOrderData"
        @selection-change="selectionChange2"
      >
        <template slot="empty"> 暂无数据 </template>
        <template slot-scope="{ row }" slot="productName">
          <div class="product-detail">
            <div class="poster">
              <el-image style="width: 60px; height: 60px" :src="row.headPic" fit="cover"></el-image>
            </div>
            <div class="info">
              <div class="title text" :title="row.productName">
                {{ row.productName }}
              </div>
              <div class="size text">
                <template v-if="row.attrList">
                  <span v-for="sku in row.attrList" :key="sku.attrValue">
                    <span>{{ sku.attrName }}:{{ sku.attrValue }}&nbsp;</span>
                  </span>
                </template>
              </div>
              <!-- <div v-if="row.subOrderId" class="orderNo text">
                    子订单ID：{{ row.subOrderId }}
                  </div> -->
              <div v-if="row.subOrderNo" class="orderNo text">子订单号：{{ row.subOrderNo }}</div>
            </div>
          </div>
        </template>
        <template slot-scope="{ row }" slot="status">
          <el-tag v-if="row.status === -1" type="info">已取消</el-tag>
          <el-tag v-else-if="row.status === 0">待处理</el-tag>
          <el-tag v-else-if="row.status === 1">待支付</el-tag>
          <el-tag v-else-if="row.status === 2" effect="dark" type="success">已完成</el-tag>
          <el-tag v-else-if="row.status === 3" type="danger">失败</el-tag>
          <el-tag v-else-if="row.status === 4" type="success">支付成功</el-tag>
          <el-tag v-else-if="row.status === 5">待换单</el-tag>
          <el-tag v-else-if="row.status === 6" effect="dark">换单中</el-tag>
        </template>
        <template slot-scope="{ row }" slot="menu">
          <!-- v-if="!row.status" -->
          <el-button v-if="row.status === 4" type="text" @click="changeOrder(row)">换单</el-button>
          <el-button v-if="row.status === 1" type="text" @click="cancelChangeOrder(row)"
            >撤回充值申请</el-button
          >
        </template>
      </avue-crud>
    </el-card>
  </div>

  <!-- </basic-container> -->
</template>

<script>
import countDown from "@/components/count-down";
import { convertFenToYuan } from "@/util/commonUtil.js";
import {
  dangerOrderDetail,
  createChangeOrder,
  cancelChangeOrderRecharge,
  releaseRiskPackageOrder,
  confirmChangeOrder,
} from "@/api/order";
import clipboard from "@/util/clipboard";
import { getLabel } from "@/util/util";
import store from "@/store";
import { mapActions, mapState } from "vuex";
import PhotoConfirmPopover from "./components/photoConfirmPopover.vue";
const payModelList = store.state.order.payModelList;
export default {
  data() {
    return {
      loading: false,
      orderInfo: {},
      countDownTime: 0,
      payModelList,
      packageData: [],
      selectIds: [],
      checkAll: false,
      isIndeterminate: false,
      option: {
        // menu: false,
        header: false,
        // selection: true,
        editBtn: false,
        delBtn: false,
        selectable: (row, index) => {
          if (row.status === 0) {
            return true;
          } else {
            return false;
          }
        },
        column: [
          { label: "支付单号", prop: "payOrderNo" },
          {
            label: "账单地址",
            prop: "paypalBillingAddress",
          },
          {
            label: "支付方式",
            prop: "payChannel",
            formatter: (val) => getLabel(val.payChannel, payModelList),
          },
          { label: "订单ID", prop: "businessId" },
          { label: "子订单ID", prop: "subOrderId" },

          {
            label: "支付金额",
            prop: "changeAmount",
            formatter: (val) => {
              return convertFenToYuan(val.changeAmount, { sign: "￥" });
            },
          },

          { label: "状态", prop: "status" },
        ],
      },
      switchOrderData: [],
      selectChangeIds: [],
      option1: {
        // menu: false,
        header: false,
        selection: true,
        editBtn: false,
        delBtn: false,
        selectable: (row, index) => {
          if (row.status === 4) {
            return true;
          } else {
            return false;
          }
        },
        column: [
          { label: "充值单号", prop: "rechargePayOrderNo" },
          {
            label: "账单地址",
            prop: "paypalBillingAddress",
          },
          {
            label: "充值金额",
            prop: "rechargeAmount",
            formatter: (val) => {
              return convertFenToYuan(val.rechargeAmount, { sign: "￥" });
            },
          },
          // { label: "订单ID", prop: "orderId", width: 300 },
          {
            label: "换单金额",
            prop: "realChangeAmount",
            formatter: (val) => {
              return convertFenToYuan(val.realChangeAmount, { sign: "￥" });
            },
          },
          { label: "状态", prop: "status" },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      productTypeList: (state) => state.logistics.productTypeList,
    }),
  },
  filters: {
    convertFenToYuan,
    getLabel,
  },
  components: { countDown, PhotoConfirmPopover },
  created() {
    this.getProductTypeList();
    this.getData();
  },
  methods: {
    selectable(row) {
      if (row.status === 0) {
        return true;
      } else {
        return false;
      }
    },
    ...mapActions(["getProductTypeList"]),
    getLabel,
    convertFenToYuan,
    handleCheckAllChange(val) {
      this.selectIds = val
        ? this.packageData.filter((item) => item.status === 0).map((item) => item.id)
        : [];
      this.isIndeterminate = false;
      console.log(this.selectIds);
    },
    handleCheckedChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.packageData.filter((item) => item.status === 0);
      this.isIndeterminate =
        checkedCount > 0 &&
        checkedCount < this.packageData.filter((item) => item.status === 0).length;
    },
    selectionChange(list) {
      this.selectIds = list.map((v) => v.id);
      // this.$message.success("选中的数据" + JSON.stringify(list));
    },
    selectionChange2(list) {
      this.selectChangeIds = list.map((v) => v.id);
      // this.$message.success("选中的数据" + JSON.stringify(list));
    },
    spanMethod({ row, columnIndex }) {
      if ([0, 1, 2].includes(columnIndex)) {
        if (row.list) {
          return {
            rowspan: row.list.length,
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
    spanMethod1({ row, columnIndex }) {
      if (![4, 5].includes(columnIndex)) {
        if (row.list) {
          return {
            rowspan: row.list.length,
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
    rechargeOrder(row) {
      this.confirmRechargeOrder({
        packageOrderId: this.orderInfo.packageOrderId,
        recordIdList: [row.id],
      });
    },
    mostRechargeOrder() {
      if (!this.selectIds.length) {
        this.$message.error("请选择订单");
        return;
      }
      this.confirmRechargeOrder({
        packageOrderId: this.orderInfo.packageOrderId,
        recordIdList: this.selectIds,
      });
    },
    confirmRechargeOrder(params) {
      this.$confirm("确认创建充值申请？", {
        confirmButtonText: "确认",
        cancelButtonText: "我再想想",
        type: "warning",
      })
        .then(() => {
          createChangeOrder(params)
            .then(() => {
              this.$message.success("操作成功");
              this.selectIds = [];
              this.getData();
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    releaseRiskOrder(row) {
      this.confirmReleaseRiskOrder({
        packageOrderId: this.orderInfo.packageOrderId,
        recordIdList: [row.id],
      });
    },
    mostReleaseRiskOrder() {
      if (!this.selectIds.length) {
        this.$message.error("请选择订单");
        return;
      }
      this.confirmReleaseRiskOrder({
        packageOrderId: this.orderInfo.packageOrderId,
        recordIdList: this.selectIds,
      });
    },
    confirmReleaseRiskOrder(params) {
      this.$confirm("确认解除订单风控？", {
        confirmButtonText: "确认",
        cancelButtonText: "我再想想",
        type: "warning",
      })
        .then(() => {
          releaseRiskPackageOrder(params)
            .then(() => {
              this.selectIds = [];
              this.$message.success("操作成功");
              this.getData();
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    changeOrder(row) {
      this.confirmChangeOrder({
        packageOrderId: this.orderInfo.packageOrderId,
        recordIdList: row.list.map((item) => item.id),
      });
    },
    mostChangeOrder() {
      if (!this.selectChangeIds.length) {
        this.$message.error("请选择订单");
        return;
      }
      this.confirmChangeOrder({
        packageOrderId: this.orderInfo.packageOrderId,
        recordIdList: this.selectChangeIds,
      });
    },
    confirmChangeOrder(params) {
      this.$confirm("是否确认换单？", {
        confirmButtonText: "确认",
        cancelButtonText: "我再想想",
        type: "warning",
      })
        .then(() => {
          confirmChangeOrder(params)
            .then(() => {
              this.selectChangeIds = [];
              this.$message.success("操作成功");
              this.getData();
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    cancelChangeOrder(row) {
      this.$confirm("确认撤回充值申请？", {
        confirmButtonText: "确认",
        cancelButtonText: "我再想想",
        type: "warning",
      })
        .then(() => {
          cancelChangeOrderRecharge({
            userPayId: row.userPayId,
          })
            .then(() => {
              this.$message.success("操作成功");
              this.getData();
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    getData() {
      this.loading = true;
      dangerOrderDetail({ packageOrderId: this.$route.params.id })
        .then((res) => {
          this.orderInfo = res.data.data || {};
          const arr = [];
          // (this.orderInfo.changeOrderRecordList || []).forEach((item) => {
          //   item.recordList.forEach((child) => {
          //     arr.push({
          //       payOrderNo: item.payOrderNo,
          //       paypalBillingAddress: item.paypalBillingAddress,
          //       ...child,
          //     });
          //   });
          // });
          (this.orderInfo.changeOrderRecordList || []).forEach((item) => {
            item.recordList.forEach((child, index) => {
              if (index === 0) {
                arr.push({
                  payOrderNo: item.payOrderNo,
                  paypalBillingAddress: item.paypalBillingAddress,
                  ...child,
                  list: item.recordList,
                });
              } else {
                arr.push(child);
              }
            });
          });

          this.packageData = arr;
          const arr2 = [];
          (this.orderInfo.changeRechargeDetailList || []).forEach((item) => {
            item.changeRechargeRecordList.forEach((child, index) => {
              if (index === 0) {
                arr2.push({
                  rechargePayOrderNo: item.rechargePayOrderNo,
                  paypalBillingAddress: item.paypalBillingAddress,
                  rechargeAmount: item.rechargeAmount,
                  ...child,
                  list: item.changeRechargeRecordList,
                });
              } else {
                arr2.push(child);
              }
            });
          });
          console.log(arr2);

          this.switchOrderData = arr2;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    copyTxt(even, txt) {
      clipboard(txt, even);
    },
    changeProductType(row) {
      this.$set(this.editData, "_" + row.subOrderId, [...row.productType]);
      this.$set(this.editData, "_" + row.subOrderId + "loading", false);
    },
    cancelChange(subOrderId) {
      this.$set(this.editData, "_" + subOrderId, undefined);
      this.$set(this.editData, "_" + subOrderId + "loading", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.detail {
  // background: #fff;
  // border-radius: 2px;
  padding: 20px 20px 80px;
  .head {
    font-size: 14px;
    // margin-bottom: 10px;
  }
  :deep(.order-detail-form .el-form-item__label) {
    font-weight: 500;
  }

  .main {
    margin-top: 30px;
    margin-bottom: 10px;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #666;
      margin-bottom: 10px;
    }
    :deep(.ant-form-item) {
      margin-bottom: 0px;
    }
  }

  .list {
    margin-top: 20px;
    .menu {
      padding-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .card-header {
    padding: 10px 0;
  }
  .product-detail {
    display: flex;
    align-items: center;
    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-grow: 1;
      width: 0;
      font-size: 12px;
      color: #666;
      margin-left: 10px;
      .title {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #000;
        font-weight: 500;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
