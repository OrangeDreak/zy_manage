<template>
  <basic-container>
    <div class="header-search">
      <el-form ref="refStateForm" :model="stateForm" label-width="100px">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="订单单号:" prop="number">
              <el-input
                placeholder="请输入售后单号/主订单ID/子订单ID"
                v-model="stateForm.number"
                size="small"
              >
                <el-select
                  v-model="stateForm.numberType"
                  style="width: 120px"
                  slot="prepend"
                  :clearable="false"
                  placeholder="请选择"
                >
                  <el-option label="售后单号" value="0"></el-option>
                  <el-option label="主订单号" value="1"></el-option>
                  <el-option label="子订单号" value="2"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="售后单号:" prop="orderNo">
              <el-input
                v-model="stateForm.orderNo"
                placeholder="请输入 售后单号"
                size="small"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="主订单ID:" prop="orderId">
              <el-input
                v-model="stateForm.orderId"
                placeholder="请输入 主订单ID"
                size="small"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="子订单号:" prop="usbOrderNo">
              <el-input
                v-model="stateForm.usbOrderNo"
                placeholder="请输入 子订单号"
                size="small"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="处理人:" prop="operateName">
              <el-input
                v-model="stateForm.operateName"
                placeholder="请输入 处理人"
                size="small"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="售后类型:" prop="refundType">
              <el-select
                v-model="stateForm.refundType"
                placeholder="请选择 售后类型"
                size="small"
                style="width: 100%"
              >
                <el-option
                  v-for="item in refundTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="售后状态:" prop="workOrderStatus">
              <el-select
                v-model="stateForm.workOrderStatus"
                placeholder="请选择 售后状态"
                size="small"
                style="width: 100%"
              >
                <el-option
                  v-for="item in refundStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="售后申请时间:" prop="timeRange">
              <el-date-picker
                v-model="stateForm.timeRange"
                style="width: 100%"
                type="datetimerange"
                range-separator=":"
                size="small"
                class="filter-item"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="起始时间"
                end-placeholder="结束时间"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="pickerOptions"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div style="padding-top: 3px; display: flex; justify-content: flex-end">
              <el-button icon="el-icon-search" type="primary" size="small" @click="searchChange"
                >查询</el-button
              >
              <el-button icon="el-icon-delete" size="small" @click="searchReset">清空</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="status-tabs">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="createWork"
        >新建工单</el-button
      >
    </div>
    <div ref="dataTable" v-loading="loading" class="data-table">
      <template v-if="orderData.length">
        <div class="content">
          <div v-for="(item, i) in orderData" :key="item.id" class="list">
            <div class="store">
              <div class="channel">
                <svg-icon v-if="item.platform === 2" name="taobao"></svg-icon>
                <img v-else-if="item.platform === 1" width="40" src="/img/1688.png" alt="" />
                <img v-else-if="item.platform === 4" width="24" src="/img/wd.png" alt="" />
              </div>
              <div class="flex-1">
                <div>
                  <span class="label">售后单号:</span>
                  {{ item.afterSaleOrderNo }}&nbsp;<i
                    v-if="item.afterSaleOrderNo"
                    class="el-icon-copy-document"
                    @click="copyTxt($event, item.afterSaleOrderNo)"
                    style="font-size: 14px; color: #1890ff"
                  />
                </div>
                <!-- <div>
                  <span class="label">创建时间:</span>
                  {{ item.timeRange }}
                </div> -->
              </div>
              <div class="flex-1">
                <div class="order-number">
                  <span class="label" @click="goOrderDetail(item.warehouseOrderId)"
                    >主订单号: {{ item.orderNo }}</span
                  >&nbsp;<i
                    v-if="item.orderNo"
                    class="el-icon-copy-document"
                    style="font-size: 14px; color: #1890ff"
                    @click="copyTxt($event, item.orderNo)"
                  />
                </div>
                <div>
                  <span class="label">采购单号:</span>
                  {{ item.purchaseOrderNo }}&nbsp;<i
                    v-if="item.purchaseOrderNo"
                    class="el-icon-copy-document"
                    style="font-size: 14px; color: #1890ff"
                    @click="copyTxt($event, item.purchaseOrderNo)"
                  />
                </div>
              </div>
              <div class="flex-1">
                <div>
                  <span class="label">用户ID:</span>
                  {{ item.buyerId }}&nbsp;<i
                    v-if="item.buyerId"
                    class="el-icon-copy-document"
                    style="font-size: 14px; color: #1890ff"
                    @click="copyTxt($event, item.buyerId)"
                  />&nbsp;<el-tag
                    v-if="item.buyerStatus === 4"
                    effect="dark"
                    type="warning"
                    size="mini"
                    >已锁定</el-tag
                  >
                  <el-tag v-else-if="item.buyerStatus === 1" effect="dark" type="danger" size="mini"
                    >已冻结</el-tag
                  >
                </div>
              </div>
              <div class="flex-1">
                <div>
                  <span class="label">申请时间:</span>
                  {{ item.gmtCreate }}
                </div>
              </div>
            </div>
            <div class="head">
              <div class="left-info">
                <div
                  v-for="child in leftColumns"
                  :key="child.prop"
                  :class="['column', child.title === '操作' ? 'center' : '']"
                  :style="{
                    width: child.width,
                  }"
                >
                  {{ child.title }}
                </div>
              </div>
              <div class="right-info">
                <div
                  v-for="child in rightColumns"
                  :key="child.prop"
                  class="column center"
                  :style="{
                    width: child.width ? child.width : '',
                    'flex-shrink': child.width ? 0 : '',
                    'flex-grow': !child.width ? 1 : '',
                  }"
                >
                  {{ child.title }}
                </div>
              </div>
            </div>

            <div class="goods-list">
              <div class="left-info">
                <div class="goods-infos">
                  <div
                    v-for="(goods, index) in item.afterSaleSubOrderList"
                    :key="index"
                    class="item-list"
                  >
                    <div
                      class="detail cell"
                      :style="{
                        width: leftColumns[0].width ? leftColumns[0].width : '',
                      }"
                    >
                      <div class="poster">
                        <el-image
                          style="width: 100%; height: 100%"
                          :src="goods.skuImg"
                          fit="cover"
                        ></el-image>
                      </div>
                      <div class="info">
                        <div class="title text" :title="goods.productName">
                          {{ goods.productName }}
                        </div>
                        <div class="size text">
                          <template v-if="goods.attrList">
                            <span v-for="sku in goods.attrList" :key="sku.attrValue">
                              <span>{{ sku.attrName }}:{{ sku.attrValue }}&nbsp;</span>
                            </span>
                          </template>
                        </div>
                        <div class="text">{{ goods.subOrderNo }}</div>
                      </div>
                      <div class="num">×{{ goods.refundNum }}</div>
                    </div>

                    <div
                      class="cell"
                      :style="{
                        width: leftColumns[1].width ? leftColumns[1].width : '',
                      }"
                    >
                      <div>{{ goods.refundTypeStatusName }}</div>
                    </div>
                    <div
                      class="cell"
                      :style="{
                        width: leftColumns[2].width ? leftColumns[2].width : '',
                      }"
                    >
                      <el-tag
                        size="mini"
                        v-if="[0, 1, 2, 4, 5, 7, 9, 90].includes(goods.workOrderStatus)"
                        >{{ goods.workOrderStatusName }}</el-tag
                      >
                      <el-tag
                        size="mini"
                        v-if="[3, 6].includes(goods.workOrderStatus)"
                        type="danger"
                        >{{ goods.workOrderStatusName }}</el-tag
                      >
                      <el-tag
                        size="mini"
                        v-if="[8, 10].includes(goods.workOrderStatus)"
                        type="success"
                        >{{ goods.workOrderStatusName }}</el-tag
                      >
                      <el-tag size="mini" v-if="[-1].includes(goods.workOrderStatus)" type="info">{{
                        goods.workOrderStatusName
                      }}</el-tag>
                    </div>
                    <div
                      class="cell"
                      :style="{
                        width: leftColumns[3].width ? leftColumns[3].width : '',
                      }"
                    >
                      <div>{{ goods.refundReason }}</div>
                    </div>
                    <div
                      class="cell"
                      :style="{
                        width: leftColumns[4].width ? leftColumns[4].width : '',
                      }"
                    >
                      <div>
                        {{ goods.businessReason }}
                      </div>
                    </div>
                    <div
                      class="cell"
                      :style="{
                        width: leftColumns[5].width ? leftColumns[5].width : '',
                      }"
                    >
                      <div>{{ goods.logisticsName }}</div>
                      <div>
                        {{ goods.logisticsNumber
                        }}<i
                          v-if="goods.logisticsNumber"
                          class="el-icon-copy-document"
                          style="font-size: 14px; color: #1890ff"
                          @click="copyTxt($event, goods.logisticsNumber)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                :class="['right-info', item.afterSaleSubOrderList.length > 1 ? 'border-left' : '']"
              >
                <div
                  class="status cell"
                  :style="{
                    width: rightColumns[0].width ? rightColumns[0].width : '',
                  }"
                >
                  {{ $formatNum2(+item.refundAmount - +item.refundFee, "￥") }}
                  <!-- ￥{{ (+item.refundAmount - +item.refundFee).toFixed(2) }} -->
                </div>
                <div
                  class="status cell"
                  :style="{
                    width: rightColumns[1].width ? rightColumns[1].width : '',
                  }"
                >
                  {{ item.afterSaleSubOrderList[0].operateName }}
                </div>
                <div
                  class="cell center"
                  :style="{
                    width: rightColumns[2].width ? rightColumns[2].width : '',
                  }"
                >
                  <div>
                    <el-button type="text" @click="goDetail(item)">查看</el-button>
                  </div>
                  <div v-if="checkRefundShow(item)">
                    <el-button type="text" @click="onRefund(item)">发起商家售后</el-button>
                  </div>
                  <div v-if="checkRefundShow(item)">
                    <el-button type="text" @click="onReject(item)">直接驳回</el-button>
                  </div>
                  <div v-if="checkMerchantAuditShow(item)">
                    <el-button type="text" @click="onWdAudit(item)">微店商家审核</el-button>
                  </div>
                  <div v-if="checkWarehouseAuditShow(item)">
                    <el-button type="text" @click="onWarehouseAudit(item)">申请仓库退件</el-button>
                  </div>
                  <div v-if="checkFlowShow(item)">
                    <el-button type="text" @click="onLogistics(item)"
                      >{{
                        item.afterSaleSubOrderList[0].logisticsNumber ? "更改" : "添加"
                      }}物流</el-button
                    >
                  </div>
                  <el-popconfirm
                    v-if="checkReceiveGoodsShow(item)"
                    title="是否确认收货？"
                    :disabled="subLoading === item.id"
                    @confirm="wdConfirmReceive(item)"
                  >
                    <el-button type="text" :loading="subLoading === item.id" slot="reference"
                      >微店确认收货</el-button
                    >
                  </el-popconfirm>
                  <el-button v-if="changeStatusShow(item)" type="text" @click="tochangeStatus(item)"
                    >变更售后状态</el-button
                  >
                  <el-button v-if="checkAuditShow(item)" type="text" @click="toExamine(item)"
                    >客服审核</el-button
                  >
                  <!-- <el-popconfirm
                    v-if="permission.refund_finance_sure && checkFinanceConfirmShow(item)"
                    title="是否确认退款？"
                    :disabled="subLoading === item.id"
                    @confirm="financeSure(item)"
                  > -->
                  <el-button
                    v-if="permission.refund_finance_sure && checkFinanceConfirmShow(item)"
                    type="text"
                    @click="financeSure(item)"
                    slot="reference"
                    >财务确认</el-button
                  >
                  <!-- </el-popconfirm> -->

                  <el-popconfirm
                    v-if="permission.refund_customer_sure && checkCustomerConfirmShow(item)"
                    title="是否确认发放优惠券？"
                    :disabled="subLoading === item.id"
                    @confirm="customerSure(item)"
                  >
                    <el-button type="text" slot="reference" :loading="subLoading === item.id"
                      >客服确认</el-button
                    >
                  </el-popconfirm>
                </div>
              </div>
            </div>
            <!-- <div class="total-amount">
              <div>
                货品金额总计：
                <span class="num">
                  {{ (item.subtotal / 100).toFixed(2) }}</span
                >
              </div>
              <div>
                国内履约运费总计：<span class="num">
                  {{ (item.totalDeliveryFee / 100).toFixed(2) }}</span
                >
              </div>
              <div>
                金额总计：<span class="num">
                  {{ (item.totalAmount / 100).toFixed(2) }}</span
                >
              </div>
            </div> -->
          </div>
        </div>
        <div class="page-info">
          <el-pagination
            :current-page.sync="pagination.pageNum"
            :page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="total"
            layout="total, prev, pager, next, sizes"
            @size-change="sizeChange"
            @current-change="pageChange"
          >
          </el-pagination>
        </div>
      </template>
      <template v-else>
        <el-card shadow="never">
          <div class="no-data">暂无数据</div>
        </el-card>
      </template>
    </div>
    <div class="pb50"></div>
    <FlowDialog ref="refFlowDialog" @finish="finish" />
    <CancelReasonModal ref="refCancelReasonModal" @finish="finish" />
    <RefuseModal ref="refRefuseModal" @finish="finish"></RefuseModal>
    <WarehouseAuditModal ref="refWarehouseAuditModal" @finish="finish" />
    <WdOrderAudit ref="refWdOrderAudit" @finish="finish" />
    <LogisticsModal ref="refLogisticsModal" :list="logisticsList" @finish="finish" />
    <RefundDetailModal ref="refRefundDetailModal" @finish="finish"></RefundDetailModal>
    <RefundDetailModal ref="refRefundDetailModal" @finish="finish"></RefundDetailModal>
    <RefundModal ref="refRefundModal" @finish="finish"></RefundModal>
    <FinanceConfirmModal ref="refFinanceConfirmModal" @finish="finish"></FinanceConfirmModal>
    <StatusModal ref="refStatusModal" @finish="finish"></StatusModal>
    <!-- <SupplementaryPayment ref="refSupplementaryPayment" @finish="finish" /> -->
  </basic-container>
</template>

<script>
import { refundList, staffConfirm, wdOrderConfirmReceipt } from "@/api/customer/refund";
import { pickerOptions } from "@/util/date";
import clipboard from "@/util/clipboard";
import store from "@/store";
import { mapGetters } from "vuex";
import CancelReasonModal from "./components/cancelReasonModal.vue";
import WarehouseAuditModal from "./components/warehouseAuditModal.vue";
import WdOrderAudit from "./components/wdOrderAudit.vue";
import LogisticsModal from "./components/logisticsModal.vue";
import RefundDetailModal from "./components/refundDetailModal.vue";
import RefundModal from "./components/refundModal.vue";
import FinanceConfirmModal from "./components/financeConfirmModal.vue";
import RefuseModal from "./components/refuseModal.vue";
import StatusModal from "./components/statusModal.vue";
// import SupplementaryPayment from "../order/components/supplementaryPayment.vue";
import RemarkPopover from "../order/components/remarkPopover.vue";
import FlowDialog from "../order/components/flowDialog.vue";
export default {
  name: "RefundList",
  data() {
    return {
      loading: false,
      subLoading: undefined,
      pickerOptions,
      platformList: store.state.order.platformList,
      stateForm: {
        numberType: "0",
        number: undefined,
        // orderId: undefined,
        // subOrderNo: undefined,
        // orderNo: undefined,
        operateName: undefined,
        // operatorId: undefined,
        // platform: undefined,
        refundType: undefined,
        workOrderStatus: undefined,
        timeRange: [],
        gmtPaySuccess: [],
      },
      tabsList: [],
      leftColumns: [
        {
          title: "商品详情",
          prop: "detail",
          width: "35%",
        },
        {
          title: "售后类型",
          prop: "im",
          width: "10%",
        },
        {
          title: "售后状态",
          prop: "price",
          width: "15%",
        },

        {
          title: "售后原因",
          prop: "freight",
          width: "10%",
        },
        {
          title: "商家售后原因",
          prop: "amount",
          width: "15%",
        },
        {
          title: "退货物流单号",
          prop: "amount",
          width: "15%",
        },
        // {
        //   title: "处理人",
        //   prop: "status",
        //   width: "10%",
        // },
        // {
        //   title: "操作",
        //   prop: "action",
        //   width: "10%",
        // },
      ],
      rightColumns: [
        {
          title: "退款金额",
          prop: "status",
          width: "34%",
        },
        {
          title: "处理人",
          prop: "status",
          width: "33%",
        },
        {
          title: "操作",
          prop: "action",
          width: "33%",
        },
      ],
      orderData: [],
      operatorList: [],
      reasonList: [],
      logisticsList: [],
      refundTypeList: [
        {
          label: "仅退款",
          value: "0",
        },
        {
          label: "下发优惠券",
          value: "1",
        },
        {
          label: "退货退款",
          value: "2",
        },
      ],
      refundStatusList: [
        {
          label: "售后客服-待处理",
          value: "0",
        },
        {
          label: "待商家审核",
          value: "1",
        },
        {
          label: "商家审核通过",
          value: "2",
        },
        {
          label: "商家审核拒绝",
          value: "3",
        },
        {
          label: "待商家收货退款",
          value: "4",
        },
        {
          label: "客服待审核",
          value: "5",
        },
        {
          label: "客服-审核驳回",
          value: "6",
        },
        {
          label: "财务待退款",
          value: "7",
        },
        {
          label: "退款成功",
          value: "8",
        },
        {
          label: "退货邮费待付款",
          value: "90",
        },
        {
          label: "待发放优惠券",
          value: "9",
        },
        {
          label: "已发放优惠券",
          value: "10",
        },
        {
          label: "已取消",
          value: "-1",
        },
      ],
      pagination: {
        pageSize: 10,
        pageNum: 1,
      },
      total: 0,
    };
  },
  components: {
    RemarkPopover,
    WarehouseAuditModal,
    RefuseModal,
    WdOrderAudit,
    FlowDialog,
    CancelReasonModal,
    LogisticsModal,
    RefundDetailModal,
    RefundModal,
    FinanceConfirmModal,
    StatusModal,
  },
  computed: {
    ...mapGetters(["permission"]),
    // CANCEL( code:-1， desc:"已取消")
    // STAFF_PENDING( code: 0,desc:"售后客服-待处理")
    // BUSINESS_PENDING( code: 1,desc:"待商家审核")
    // BUSINESS_APPROVE( code: 2,desc:"商家审核通过")
    // BUSINESS_REJECT( code: 3,desc:"商家审核拒绝")
    // BUSINESS_REFUND_PENDING( code: 4,desc:"待商家收货退款")
    // FINANCE_PENDING( code: 5,desc:"财务-待处理")
    // FINANCE_REJECT( code:6,desc:"退款失败")
    // REFUND_PENDING( code: 7,desc:"待退款")
    // REFUND_SUCCESS( code: 8,desc:"退款成功")
    // COUPON_SEND_PENDING( code: 9,desc:"待发放优惠券")
    // COUPON_SEND_SUCCESS( code: 10,desc:"已发放优惠券")
    // POSTAGE_NO_PAY( code: 90,desc:"退货邮费待付款")
    checkRefundShow() {
      return (value) => {
        let show = false;
        value.afterSaleSubOrderList.some((item) => {
          if (item.workOrderStatus == "0") {
            show = true;
            return true;
          }
        });
        return show;
      };
    },
    checkMerchantAuditShow() {
      return (value) => {
        let show = false;
        if ([4].includes(value.platform)) {
          value.afterSaleSubOrderList.some((item) => {
            if (item.workOrderStatus == "1") {
              show = true;
              return true;
            }
          });
        }
        return show;
      };
    },
    checkWarehouseAuditShow() {
      return (value) => {
        let show = false;
        value.afterSaleSubOrderList.some((item) => {
          if (item.workOrderStatus === 2 && item.refundType === 2) {
            show = true;
            return true;
          }
        });
        return show;
      };
    },
    checkFlowShow() {
      return (value) => {
        let show = false;
        value.afterSaleSubOrderList.some((item) => {
          if (item.workOrderStatus === 2 || item.workOrderStatus === 4) {
            show = true;
            return true;
          }
        });
        return show;
      };
    },
    checkReceiveGoodsShow() {
      return (value) => {
        let show = false;
        if ([4].includes(value.platform)) {
          value.afterSaleSubOrderList.some((item) => {
            if (item.workOrderStatus == "4") {
              show = true;
              return true;
            }
          });
        }
        return show;
      };
    },
    changeStatusShow() {
      return (value) => {
        let show = false;
        value.afterSaleSubOrderList.some((item) => {
          if ([0, 1, 2, 3, 4].includes(item.workOrderStatus)) {
            show = true;
            return true;
          }
        });
        return show;
      };
    },
    checkAuditShow() {
      return (value) => {
        let show = false;
        value.afterSaleSubOrderList.some((item) => {
          if (item.workOrderStatus == "5") {
            show = true;
            return true;
          }
        });
        return show;
      };
    },
    checkFinanceConfirmShow() {
      return (value) => {
        let show = false;
        value.afterSaleSubOrderList.some((item) => {
          if (item.workOrderStatus == "7") {
            show = true;
            return true;
          }
        });
        return show;
      };
    },
    checkCustomerConfirmShow() {
      return (value) => {
        let show = false;
        value.afterSaleSubOrderList.some((item) => {
          if (item.workOrderStatus == "9") {
            show = true;
            return true;
          }
        });
        return show;
      };
    },
    refundStatusConfig() {
      return (val) => {
        let obj = {};
        this.refundStatusList.some((item) => {
          if (item.value === val) {
            obj = item;
            return true;
          }
        });
        return obj;
      };
    },
    statusConfig() {
      return (val) => {
        let label = "";
        this.statusList.some((item) => {
          if (item.value === val) {
            label = item.label;
            return true;
          }
        });
        return label;
      };
    },
  },
  created() {
    this.searchChange();
    // 获取搜索项的订单状态
    // getOrderStatus({
    //   name: "com.sifubuy.buy.manage.modules.order.enums.EnumPurchaseOrderStatus",
    // }).then((res) => {
    //   this.tabsList = res.data.data.map((item) => {
    //     return {
    //       label: item.desc,
    //       value: String(item.code),
    //     };
    //   });
    //   this.stateForm.orderStatus = this.tabsList[0].value;
    //   this.getData();
    // });
    //采购员列表
    // getOperatorList({ roleId: "1123598816738675202" }).then((res) => {
    //   this.operatorList = res.data.data || [];
    // });
  },
  methods: {
    goOrderDetail(id) {
      if (!id) {
        this.$message.warning("QC照片不存在");
        return;
      }
      // this.$router.push(`/order/detail/${id}`);
      const route = this.$router.resolve({ path: `/order/stash-detail/${id}` });
      window.open(route.href, "_blank");
    },
    createWork() {
      this.$refs.refRefundModal.show();
    },
    goDetail(item) {
      this.$refs.refRefundDetailModal.show({
        id: item.id,
      });
    },
    onRefund(item) {
      this.$refs.refCancelReasonModal.show({ id: item.id, platform: item.platform });
    },
    onReject(item) {
      this.$refs.refRefuseModal.show({ id: item.id });
    },
    onWdAudit(item) {
      this.$refs.refWdOrderAudit.show({ id: item.id, platform: item.platform });
    },
    onWarehouseAudit(item) {
      this.$refs.refWarehouseAuditModal.show({ id: item.id });
    },
    onLogistics(item) {
      this.$refs.refLogisticsModal.show({
        id: item.id,
        type: item.afterSaleSubOrderList[0].logisticsType,
        number: item.afterSaleSubOrderList[0].logisticsNumber,
      });
    },
    addMFlowNo(item) {
      this.$refs.refFlowDialog.show({
        title: "订单发货",
        rowData: item,
      });
    },
    wdConfirmReceive(item) {
      wdOrderConfirmReceipt({ id: item.id })
        .then(() => {
          this.$message.success("操作成功");
          this.searchChange();
          this.subLoading = undefined;
        })
        .catch(() => {
          this.subLoading = undefined;
        });
    },
    tochangeStatus(item) {
      this.$refs.refStatusModal.show({
        id: item.id,
        status: item.afterSaleSubOrderList[0].workOrderStatus,
      });
    },
    toExamine(item) {
      this.$refs.refRefundDetailModal.show({
        id: item.id,
        action: "toExamine",
      });
    },
    financeSure(item) {
      // this.$refs.refFinanceConfirmModal.show({
      //   id: item.id,
      // });
      this.$refs.refRefundDetailModal.show({
        id: item.id,
        action: "financeSure",
      });
    },
    customerSure(item) {
      this.subLoading = item.id;
      staffConfirm({ id: item.id })
        .then(() => {
          this.$message.success("确认发放优惠券成功");
          this.searchChange();
          this.subLoading = undefined;
        })
        .catch(() => {
          this.subLoading = undefined;
        });
    },

    finish() {
      this.getData();
    },
    cancelOrder(item) {
      this.$refs.refCancelReasonModal.show({ orderId: item.orderId });
    },
    initiateSupplementary(item) {
      this.$refs.refSupplementaryPayment.show(item);
    },
    changeRemark(text, i) {
      this.orderData[i].remark = text;
    },
    countAmount(list) {
      let num = 0;
      list.forEach((item) => {
        num += Number(item.product_amount);
      });
      return (num / 100).toFixed(2);
    },
    countFreight(list) {
      let num = 0;
      list.forEach((item) => {
        num += item.domestic_post_fee;
      });
      return (num / 100).toFixed(2);
    },
    countTotalAmount(list) {
      let num = 0;
      list.forEach((item) => {
        num += Number(item.product_amount) + item.domestic_post_fee;
      });
      return (num / 100).toFixed(2);
    },
    copyTxt(even, txt) {
      clipboard(txt, even);
    },
    // 分页
    sizeChange(size) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = size;
      this.getData();
    },
    pageChange(e) {
      this.pagination.pageNum = e;
      this.getData();
    },
    getData() {
      this.loading = true;
      if (this.stateForm.timeRange && this.stateForm.timeRange.length) {
        this.stateForm.startTime = this.stateForm.timeRange[0];
        this.stateForm.endTime = this.stateForm.timeRange[1];
      } else {
        delete this.stateForm.startTime;
        delete this.stateForm.endTime;
      }
      // if (this.stateForm.gmtPaySuccess && this.stateForm.gmtPaySuccess.length) {
      //   this.stateForm.startPaySuccessTime = this.stateForm.gmtPaySuccess[0];
      //   this.stateForm.endPaySuccessTime = this.stateForm.gmtPaySuccess[1];
      // } else {
      //   delete this.stateForm.startPaySuccessTime;
      //   delete this.stateForm.endPaySuccessTime;
      // }
      const param = {
        current: this.pagination.pageNum,
        size: this.pagination.pageSize,
        ...this.stateForm,
      };
      console.log(param);
      // if (param.orderStatus == 0) {
      //   delete param.orderStatus;
      // }
      refundList(param)
        .then((res) => {
          this.orderData = res.data.data.records || [];
          this.total = Number(res.data.data.total || 0);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    searchChange() {
      this.pagination.pageNum = 1;
      this.getData();
    },
    searchReset() {
      this.$refs.refStateForm.resetFields();
      this.pagination.pageNum = 1;
      // Object.keys(this.stateForm).forEach((key) => {
      //   this.stateForm[key] = this.defaultStateForm[key];
      // });
      this.getData();
    },
  },
};
</script>

<style lang="scss" scoped>
.header-search {
  padding: 10px;
}
.status-tabs {
  padding: 20px 0px;
}
.data-table {
  // max-width: 1680px;
  .header {
    width: 100%;
    overflow: hidden;
  }
  .content {
    width: 100%;
    color: rgba(0, 0, 0, 0.85);
    border-bottom: 1px solid #f0f0f0;
    .head {
      display: flex;
      color: rgba(0, 0, 0, 0.85);
      padding: 0 15px;
      border-bottom: 1px solid #f0f0f0;
      .right-info {
        text-align: center;
      }
    }
    .left-info {
      display: flex;
      width: 70%;
    }
    .right-info {
      display: flex;
      width: 30%;
    }
    .column {
      // flex-grow: 1;
      padding: 16px 0;
      position: relative;
      min-width: 80px;
      font-size: 14px;
      flex-shrink: 0;
      // font-weight: 500;
      // &:not(:last-child)::before {
      //   position: absolute;
      //   top: 50%;
      //   right: 0;
      //   width: 1px;
      //   height: 1.6em;
      //   background-color: rgba(0, 0, 0, 0.06);
      //   transform: translateY(-50%);
      //   transition: background-color 0.3s;
      //   content: '';
      // }
    }
    .center {
      text-align: center;
    }
    .list {
      margin-bottom: 20px;
      :deep(.el-tag--mini) {
        height: auto;
        text-align: center;
        padding: 2px 8px;
        white-space: normal;
      }
    }
    .store {
      display: flex;
      align-items: center;
      padding: 10px 15px;
      border-radius: 6px;
      // border-top: 1px solid #f0f0f0;
      // border-bottom: 1px solid #f0f0f0;
      background: #fafafa;
      color: #333;
      font-size: 14px;
      .checkbox {
        width: 30px;
      }
      .channel {
        display: flex;
        align-items: center;
        padding-right: 10px;
        font-size: 24px;
      }

      .flex-1 {
        flex: 1;
        overflow: hidden;
        // :deep(.anticon-copy) {
        //   cursor: pointer;
        //   margin-left: 2px;
        // }
        .label {
          // font-weight: 500;
        }
        .address {
          display: inline-block;
          padding: 1px 10px;
          font-size: 12px;
          border-radius: 20px;
          // background: #fff;
          border: 1px solid #ddd;
        }
        .center {
          display: flex;
          align-items: center;
        }
      }
      .order-number span {
        color: #1677ff;
        cursor: pointer;
        // text-decoration: underline;
      }
      .btns {
        display: flex;
        justify-content: flex-end;
        flex-wrap: wrap;
      }
    }
    .goods-infos {
      width: 100%;
      flex-shrink: 0;
    }
    .goods-list {
      font-size: 12px;
      display: flex;
      padding: 0 15px;
      .item-list {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 15px 0px;
        border-bottom: 1px solid #f0f0f0;
        &:last-child {
          border: none;
        }
        .cell {
          flex-shrink: 0;
          // padding: 15px;
          .wuliu {
            padding-top: 10px;
            line-height: normal;
          }
        }
        // .center {
        //   text-align: center;
        // }
        .detail {
          display: flex;
          align-items: center;
          padding-right: 10px;
          .checkbox {
            width: 30px;
          }
          .poster {
            flex-shrink: 0;
            width: 80px;
            height: 80px;
          }
          .info {
            min-width: 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            font-size: 14px;
            color: #666;
            padding: 0 10px;
            .title {
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              color: #000;
              font-weight: 500;
              margin-bottom: 10px;
            }
            .text {
              word-break: break-all;
            }
          }
          .num {
            color: #333;
            font-size: 14px;
            font-weight: bold;
            margin-left: 10px;
          }
        }

        .last-time {
          font-size: 12px;
          color: #666;
        }
      }
      .right-info {
        padding-top: 35px;
        text-align: center;
      }
    }
    .cancel-reason {
      color: #ee2624;
      font-size: 12px;
    }
    .border-left {
      border-left: 1px solid #f0f0f0;
    }
    .more {
      padding: 10px;
      text-align: center;
      border-top: 1px solid #f0f0f0;
    }
    .total-amount {
      padding: 20px 45px;
      display: flex;
      justify-content: flex-end;
      background: #f2f2f2;
      font-size: 14px;
      border-radius: 4px;
      div {
        padding: 0 20px;
        display: flex;
        align-items: center;
        span {
          font-size: 20px;
          font-weight: bold;
          // margin-left: 10px;
        }
      }
    }
  }
  .el-icon-copy-document {
    cursor: pointer;
  }
  .page-info {
    margin: 16px 0;
    display: flex;
    padding-right: 20px;
    justify-content: flex-end;
  }
  .approval {
    position: relative;
    padding-left: 16px;
    &::before {
      content: " ";
      position: absolute;
      width: 6px;
      height: 6px;
      left: 0;
      border-radius: 50%;
      top: 0;
      bottom: 0;
      margin: auto;
    }
  }

  .approval_1 {
    &:before {
      background: #1677ff;
    }
  }
  .approval_4 {
    &:before {
      background: #1677ff;
    }
  }
  .approval_2 {
    &:before {
      background: #52c41a;
    }
  }
  .approval_5 {
    &:before {
      background: #52c41a;
    }
  }

  .approval_WAIT_SELLER_SEND_GOODS {
    &:before {
      background: #f6434c;
    }
  }
  .approval_3 {
    &:before {
      background: #909399;
    }
  }
}
.pb50 {
  padding-bottom: 50px;
}
.no-data {
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #999;
}
</style>
