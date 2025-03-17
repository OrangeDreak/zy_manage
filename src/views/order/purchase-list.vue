<template>
  <basic-container>
    <div class="header-search">
      <el-form ref="refStateForm" :model="stateForm" label-width="80px">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="订单ID:" prop="orderId">
              <el-input
                v-model="stateForm.orderId"
                placeholder="请输入 订单ID"
                size="small"
                clearable
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单编号:" prop="orderNo">
              <el-input
                v-model="stateForm.orderNo"
                placeholder="请输入 订单编号"
                size="small"
                clearable
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="采购单ID:" prop="outOrderNo">
              <el-input
                v-model="stateForm.outOrderNo"
                placeholder="请输入 采购单ID"
                size="small"
                clearable
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户ID:" prop="userId">
              <el-input
                v-model="stateForm.userId"
                placeholder="请输入 用户ID"
                size="small"
                clearable
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="采购员:" prop="operatorId">
              <el-select
                v-model="stateForm.operatorId"
                placeholder="请选择 采购员"
                filterable
                size="small"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in operatorList"
                  :key="item.userId"
                  :label="item.name"
                  :value="item.userId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单类型:" prop="platform">
              <el-select
                v-model="stateForm.platform"
                placeholder="请选择 订单类型"
                size="small"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in platformList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单状态:" prop="orderStatus">
              <el-select
                v-model="stateForm.orderStatus"
                placeholder="请选择 订单状态"
                size="small"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in tabsList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="店铺名称:" prop="shopName">
              <el-input
                v-model="stateForm.shopName"
                placeholder="请输入 店铺名称"
                size="small"
                clearable
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建时间:" prop="gmtCreateTime">
              <el-date-picker
                v-model="stateForm.gmtCreateTime"
                style="width: 100%"
                type="daterange"
                range-separator=":"
                size="small"
                class="filter-item"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="起始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="pickerOptions"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="采购时间:" prop="gmtPaySuccess">
              <el-date-picker
                v-model="stateForm.gmtPaySuccess"
                style="width: 100%"
                type="daterange"
                range-separator=":"
                size="small"
                class="filter-item"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="起始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="pickerOptions"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
      <el-tabs v-model="stateForm.orderStatus" type="card" @tab-click="searchChange">
        <el-tab-pane
          v-for="item in tabsList"
          :key="item.value"
          :label="item.label"
          :name="item.value"
        >
          <template slot="label"
            >{{ item.label
            }}<span
              v-if="item.value === stateForm.orderStatus && !purchaseLoading"
              style="color: red"
              >({{ total || 0 }})</span
            ></template
          >
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-loading="purchaseLoading" class="data-table">
      <template>
        <div v-show="orderData.length" class="content">
          <div v-for="(item, i) in orderData" :key="item.id" class="list">
            <div class="store">
              <div class="checked">
                <el-checkbox
                  :indeterminate="isIndeterminate(item)"
                  :value="item._checkedResult.length == item.purchaseSubOrderList.length"
                  @change="shopCheckAllChange($event, item)"
                  >&nbsp;</el-checkbox
                >
              </div>
              <div class="channel">
                <svg-icon v-if="item.platform === 2" name="taobao"></svg-icon>
                <img v-else-if="item.platform === 1" width="40" src="/img/1688.png" alt="" />
                <img v-else-if="item.platform === 4" width="24" src="/img/wd.png" alt="" />
              </div>
              <div class="flex-1">
                <div class="order-number" @click="goOrderDetail(item.orderId)">
                  <span class="label">订单编号: {{ item.orderNo }}</span
                  >&nbsp;<i
                    class="el-icon-copy-document"
                    @click.stop="copyTxt($event, item.orderNo)"
                    style="font-size: 14px; color: #1890ff"
                  />
                </div>
                <div>
                  <span class="label">创建时间:</span>
                  {{ item.gmtCreateTime }}
                </div>
              </div>

              <div class="flex-1">
                <div>
                  <span class="label">采购单ID:</span>
                  {{ item.outOrderNo }}&nbsp;<i
                    class="el-icon-copy-document"
                    style="font-size: 14px; color: #1890ff"
                    @click="copyTxt($event, item.outOrderNo || '')"
                  />
                </div>
                <div>
                  <span class="label">采购员:</span>
                  {{ item.operator || "--" }}&nbsp;<i
                    class="el-icon-copy-document"
                    style="font-size: 14px; color: #1890ff"
                    @click="copyTxt($event, item.operator || '')"
                  />
                </div>
              </div>
              <div class="flex-1">
                <div>
                  <span class="label">仓库名称:</span>
                  {{ item.warehouseName }}
                </div>
                <div>
                  <span class="label">用户ID:</span>
                  {{ item.userId }}
                  <el-tag v-if="item.userStatus === 4" effect="dark" type="warning" size="mini"
                    >已锁定</el-tag
                  >
                  <el-tag v-else-if="item.userStatus === 1" effect="dark" type="danger" size="mini"
                    >已冻结</el-tag
                  >
                </div>
              </div>
              <!-- <div v-if="item.logisticsInfo" class="flex-1">
                <div>
                  <span class="label">物流公司:</span>
                  {{ item.logisticsInfo.deliveryCompany }}
                </div>
                <div>
                  <span class="label">物流单号:</span>
                  {{ item.logisticsInfo.trackingNumber }}
                </div>
              </div> -->
              <!-- <div class="flex-1">
                <div>
                  <span class="label">采购单ID:</span>
                  {{ item.purchaseSubOrderList[0].taobaoPurchaseId }}&nbsp;<i
                    class="el-icon-copy-document"
                    style="font-size: 14px; color: #1890ff"
                    @click="
                      copyTxt($event, item.purchaseSubOrderList[0].taobaoPurchaseId)
                    "
                  />
                </div>
                <div>
                  <span class="label">采购员:</span>
                  {{
                    item.operator
                      ? item.operator.replace(/浙江花熊科技有限公司:/g, "")
                      : "--"
                  }}&nbsp;<i
                    class="el-icon-copy-document"
                    style="font-size: 14px; color: #1890ff"
                    @click="
                      copyTxt(
                        $event,
                        item.operator
                          ? item.operator.replace(/浙江花熊科技有限公司:/g, '')
                          : ''
                      )
                    "
                  />
                </div>
              </div>
              <div class="flex-1">
                <div>
                  <span class="label">仓库名称:</span>{{ item.warehouseName }}
                </div>
                <div>
                  <span class="label">收货人:</span>
                  {{ item.warehouseAddressInfoVO.name }}
                  <el-popover placement="top" width="300" trigger="hover">
                    <div class="parcel-info">
                      <div>姓名：{{ item.warehouseAddressInfoVO.name }}</div>
                      <div>
                        电话：{{ item.warehouseAddressInfoVO.mobilePhone }}
                      </div>
                      <div>
                        详细地址：{{ item.warehouseAddressInfoVO.country || ""
                        }}{{ item.warehouseAddressInfoVO.state || ""
                        }}{{ item.warehouseAddressInfoVO.city || ""
                        }}{{ item.warehouseAddressInfoVO.district || ""
                        }}{{ item.warehouseAddressInfoVO.address || "" }}
                      </div>
                    </div>
                    <span slot="reference" class="address">详细地址</span>
                  </el-popover>
                </div>
              </div> -->
              <div class="flex-1 btns">
                <!-- <el-button
                  type="text"
                  size="medium"
                  style="margin-right: 7px"
                  @click="addMFlowNo(item)"
                  >追加物流单号</el-button
                > -->

                <el-popconfirm
                  v-if="checkPayboxShow(item) && permission.purchase_order_pay"
                  title="确认支付订单吗？"
                  @confirm="onPayOrder(item)"
                >
                  <el-button style="margin-right: 7px" type="text" size="medium" slot="reference"
                    >支付</el-button
                  >
                </el-popconfirm>

                <!-- <el-popconfirm

                  title="确定取消采购吗？"
                  @confirm="onCancelPurchase(item)"
                > -->
                <el-tooltip
                  v-if="item.orderStatus === 1"
                  effect="dark"
                  content="取消后可在客户订单再次发起采购，不会关闭交易"
                  placement="top"
                >
                  <el-button
                    style="margin-right: 7px"
                    type="text"
                    size="medium"
                    class="warning-btn"
                    @click="onCancelPurchase(item)"
                    >取消采购</el-button
                  >
                </el-tooltip>
                <!-- </el-popconfirm> -->
                <el-button
                  v-if="[1, 2, 4, 6].includes(item.orderStatus) && item.platform === 4"
                  style="margin-right: 7px"
                  type="text"
                  size="medium"
                  @click="bindWdOrder(item)"
                  >{{ item.outOrderNo ? "修改微店订单" : "绑定微店订单" }}</el-button
                >
                <el-button
                  v-if="[2, 4, 5, 6, 8].includes(item.orderStatus)"
                  type="text"
                  size="medium"
                  style="margin-right: 7px"
                  @click="bindFlow(item)"
                  >发货/换单</el-button
                >
                <el-button
                  style="margin-right: 7px"
                  type="text"
                  size="medium"
                  v-if="isNeedSupplementary(item)"
                  @click="initiateSupplementary(item)"
                  >发起补款</el-button
                >
                <el-tooltip effect="dark" content="取消后将会关闭该笔交易" placement="top">
                  <el-button
                    v-if="item.orderStatus === 1 || item.orderStatus === 7"
                    style="margin: 0 7px"
                    type="text"
                    class="danger-btn"
                    size="medium"
                    @click="cancelOrder(item)"
                    >取消订单</el-button
                  >
                </el-tooltip>
                <RemarkPopover :row-data="item" @handleOk="changeRemark($event, i)"></RemarkPopover>
              </div>
            </div>
            <div class="head">
              <div class="left-info">
                <div
                  v-for="child in leftColumns"
                  :key="child.prop"
                  class="column"
                  :style="{
                    width: child.width,
                    textAlign: child.align || 'left',
                  }"
                >
                  {{ child.title }}
                </div>
              </div>
              <div class="right-info">
                <div
                  v-for="child in rightColumns"
                  :key="child.prop"
                  class="column"
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
            <el-checkbox-group v-model="item._checkedResult">
              <div class="goods-list">
                <div class="left-info">
                  <div class="goods-infos">
                    <div
                      v-for="(goods, index) in item.purchaseSubOrderList"
                      :key="goods.outOrderNo"
                      class="item-box"
                    >
                      <div class="item-list">
                        <div
                          class="detail cell"
                          :style="{
                            width: leftColumns[0].width ? leftColumns[0].width : '',
                          }"
                        >
                          <div class="checkbox">
                            <el-checkbox :label="goods.subOrderId" :key="goods.subOrderId"
                              >&nbsp;</el-checkbox
                            >
                          </div>
                          <div class="detail-box">
                            <div
                              class="poster"
                              @click="goThirdLink(item.platform, goods.productId)"
                            >
                              <el-image
                                style="width: 80px; height: 80px"
                                :src="goods.skuImg"
                                fit="cover"
                              ></el-image>
                            </div>
                            <div class="info">
                              <div
                                class="title text"
                                :title="goods.productName"
                                @click="goThirdLink(item.platform, goods.productId)"
                              >
                                {{ goods.productName }}
                              </div>
                              <div class="size text">
                                <template v-if="goods.attrList">
                                  <span v-for="sku in goods.attrList" :key="sku.attrValue">
                                    <span>{{ sku.attrName }}:{{ sku.attrValue }}&nbsp;</span>
                                  </span>
                                  <!-- &nbsp;<span class="num">×{{ goods.count }}</span> -->
                                </template>
                              </div>
                              <div v-if="goods.shopName" class="store-name text">
                                店铺名称：{{ goods.shopName }}
                              </div>
                              <!-- <div v-if="goods.outOrderNo" class="orderNo text">
                          订单号：{{ goods.outOrderNo }}
                        </div>
                        <div v-if="goods.outSubOrderNo" class="orderNo text">
                          子订单号：{{ goods.outSubOrderNo }}
                        </div> -->
                            </div>
                          </div>
                        </div>
                        <div
                          class="im cell"
                          :style="{
                            width: leftColumns[1].width ? leftColumns[1].width : '',
                          }"
                        >
                          <span
                            v-if="item.platformType !== 4"
                            class="order-btn"
                            @click="contactSeller(goods)"
                            ><i class="el-icon-chat-dot-square" />&nbsp;联系商家</span
                          >
                          <div class="reply">
                            <span v-if="!goods.messageList" @click="handleReply(goods, '用户留言')"
                              >用户留言</span
                            >
                          </div>
                        </div>
                        <div
                          class="price cell"
                          :style="{
                            width: leftColumns[2].width ? leftColumns[2].width : '',
                          }"
                        >
                          <div>预计：¥{{ (goods.price / 100).toFixed(2) }}</div>
                          <div>实际：¥{{ (goods.realPrice / 100).toFixed(2) }}</div>
                        </div>
                        <div
                          class="num cell"
                          :style="{
                            width: leftColumns[3].width ? leftColumns[3].width : '',
                          }"
                        >
                          <span>×{{ goods.count }}</span>
                        </div>
                        <div
                          class="status cell"
                          :style="{
                            width: leftColumns[4].width ? leftColumns[4].width : '',
                          }"
                        >
                          <span v-if="goods.afterSaleId">{{ goods.afterOrderStatusDesc }}</span>
                        </div>
                        <!-- <div
                      class="amount cell"
                      :style="{
                        width: leftColumns[4].width ? leftColumns[4].width : '',
                      }"
                    >
                      <div>
                        预计：¥{{ (Number(goods.subtotal) / 100).toFixed(2) }}
                      </div>
                      <div>
                        实际：¥{{
                          (Number(goods.realSubtotal) / 100).toFixed(2)
                        }}
                      </div>
                    </div> -->
                      </div>
                      <div v-if="goods.remark" class="remark">
                        <span>商品备注：</span>{{ goods.remark }}
                      </div>
                      <div v-if="goods.logisticsInfos" class="remark logistics">
                        <span>物流单号：</span
                        >{{ goods.logisticsInfos[0].trackingNumber }}&nbsp;&nbsp;&nbsp;&nbsp;{{
                          goods.logisticsInfos[0].deliveryCompany
                        }}
                      </div>
                      <div class="message">
                        <div v-if="goods.messageList" class="box">
                          <div class="msg-con">
                            <div
                              v-for="msg in goods.messageList"
                              :key="msg.gmtCreated"
                              class="text"
                            >
                              <div class="top">
                                <span class="role">{{ msg.userName }}</span
                                >&nbsp;{{ msg.gmtCreated }}
                              </div>
                              <pre>{{ msg.content }}</pre>
                            </div>
                          </div>
                          <div class="reply" @click="handleReply(goods, '回复')">
                            <span>回复</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  :class="['right-info', item.purchaseSubOrderList.length > 1 ? 'border-left' : '']"
                >
                  <div
                    class="amount cell"
                    :style="{
                      width: rightColumns[0].width ? rightColumns[0].width : '',
                    }"
                  >
                    <div>预计：¥{{ (Number(item.subtotal) / 100).toFixed(2) }}</div>
                    <div>实际：¥{{ (Number(item.realSubtotal) / 100).toFixed(2) }}</div>
                  </div>
                  <div
                    class="freight cell"
                    :style="{
                      width: rightColumns[1].width ? rightColumns[1].width : '',
                    }"
                  >
                    <div>预计：¥{{ (item.totalDeliveryFee / 100).toFixed(2) }}</div>
                    <div>实际：¥{{ (item.realTotalDeliveryFee / 100).toFixed(2) }}</div>
                  </div>
                  <div
                    class="status cell"
                    :style="{
                      width: rightColumns[2].width ? rightColumns[2].width : '',
                    }"
                  >
                    <span :class="['approval', 'approval_' + item.orderStatus]">{{
                      item.orderStatusDesc
                    }}</span>
                    <div v-if="item.businessPayStatus">
                      <el-tag size="mini" type="danger">待补款</el-tag>
                    </div>
                    <div v-if="item.cancelReaSon" class="cancel-reason">
                      取消原因：{{ item.cancelReaSon }}
                    </div>
                  </div>

                  <!-- <div
                  class="cell"
                  :style="{
                    width: rightColumns[1].width ? rightColumns[1].width : '',
                  }"
                >
                  <el-button
                    v-if="item.orderStatus > 5 && item.orderStatus < 8"
                    type="text"
                    size="medium"
                    @click="refundOrder(item, item, 'refund')"
                    >申请退款</el-button
                  >

                  <div v-if="item.status === 11" class="last-time"></div>
                </div> -->
                </div>
              </div>
            </el-checkbox-group>
            <div class="total-amount">
              <div>
                货品金额总计：
                <span>
                  <!-- {{
                    item.purchaseSubOrderList[0].pay_currency ||
                    item.purchaseSubOrderList[0].purchase_currency
                  }} -->
                  {{ (item.realSubtotal / 100).toFixed(2) }}</span
                >
              </div>
              <div>
                国内履约运费总计：<span>
                  <!-- {{
                    item.purchaseSubOrderList[0].pay_currency ||
                    item.purchaseSubOrderList[0].purchase_currency
                  }} -->
                  {{ (item.realTotalDeliveryFee / 100).toFixed(2) }}</span
                >
              </div>
              <div>
                金额总计：<span>
                  <!-- {{
                    item.purchaseSubOrderList[0].pay_currency ||
                    item.purchaseSubOrderList[0].purchase_currency
                  }} -->
                  {{ (item.totalAmount / 100).toFixed(2) }}</span
                >
              </div>
            </div>
          </div>
        </div>
        <div v-show="orderData.length" class="page-info">
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
      <!-- <template v-else> -->
      <div v-show="!orderData.length" class="no-data">暂无数据</div>
      <!-- </template> -->
    </div>
    <BindWdDialog ref="refBindWdDialog" @finish="finish" />
    <BindLogisticsDialog ref="refBindLogisticsDialog" @finish="finish" />
    <FlowDialog ref="refFlowDialog" @finish="finish" />
    <CancelReason ref="refCancelReason" type="purchase" :reasonList="reasonList" @finish="finish" />
    <SupplementaryPayment ref="refSupplementaryPayment" @finish="finish" />
    <ReplyPopover ref="refReplyPopover" @finish="finish"></ReplyPopover>
  </basic-container>
</template>

<script>
import {
  purchaseList,
  payOrder,
  getOperatorList,
  getCancelReason,
  getOrderStatus,
  getContractMerchant,
  cancelPurchase,
} from "@/api/order";
import { pickerOptions } from "@/util/date";
import clipboard from "@/util/clipboard";
import store from "@/store";
import CancelReason from "./components/cancelReason.vue";
import SupplementaryPayment from "./components/supplementaryPayment.vue";
import RemarkPopover from "./components/remarkPopover.vue";
import ReplyPopover from "./components/replyPopover.vue";
import FlowDialog from "./components/flowDialog.vue";
import BindWdDialog from "./components/bindWdDialog.vue";
import BindLogisticsDialog from "./components/bindLogisticsDialog.vue";
import { mapGetters, mapActions } from "vuex";

import { goPlatformProductDetail } from "@/util/commonUtil";
export default {
  name: "PurchaseOrderList",
  data() {
    return {
      purchaseLoading: false,
      pickerOptions,
      platformList: store.state.order.platformList,
      stateForm: {
        orderId: undefined,
        orderNo: undefined,
        userId: undefined,
        shopName: undefined,
        outOrderNo: undefined,
        operatorId: undefined,
        platform: undefined,
        orderStatus: undefined,
        gmtCreateTime: [],
        gmtPaySuccess: [],
      },
      msgList: [
        {
          time: "2024-09-03 14:54:23",
          text: "wawawawnajnwawawawnajnwawawawnajnwawawawnajn",
          role: "user",
        },
        {
          time: "2024-09-03 14:54:23",
          text: "认养一头牛纯牛奶250ml*20盒认养一头牛全脂纯牛奶250ml认养一头牛纯牛奶250ml*20盒认养一头牛全脂纯牛奶250ml……认养一头牛纯牛奶250ml*20盒认养一头牛全脂纯牛奶250ml…",
          role: "花花",
        },
      ],
      tabsList: [],
      leftColumns: [
        {
          title: "商品详情",
          prop: "detail",
          width: "50%",
        },
        {
          title: "",
          prop: "im",
          width: "15%",
        },
        {
          title: "单价",
          prop: "price",
          width: "15%",
        },
        {
          title: "数量",
          prop: "forecastPrice",
          width: "10%",
          align: "center",
        },
        {
          title: "",
          prop: "subOrderStatus",
          width: "10%",
        },
        // {
        //   title: "操作",
        //   prop: "action",
        // },
      ],
      rightColumns: [
        {
          title: "货品金额",
          prop: "amount",
          width: "40%",
        },
        {
          title: "邮费",
          prop: "freight",
          width: "30%",
        },
        {
          title: "订单状态",
          prop: "status",
          width: "30%",
        },
        // {
        //   title: "操作",
        //   prop: "action",
        // },
      ],
      orderData: [],
      operatorList: [],
      reasonList: [],
      statusList: [
        {
          label: "采购单创建中",
          value: "BULIDING",
        },
        {
          label: "待付款",
          value: "WAIT_BUYER_P",
        },
        {
          label: "待发货",
          value: "WAIT_SELLER_SEND_GOODS",
        },
        {
          label: "已发货",
          value: "WAIT_BUYER_CONFIRM_GOODS",
        },
        {
          label: "已取消",
          value: "TRADE_CLOSED",
        },
      ],
      refundStatusList: [
        {
          label: "退款成功",
          value: 100,
          color: "green",
        },
        {
          label: "卖家拒绝退款",
          value: -10,
          color: "red",
        },
        {
          label: "退款关闭",
          value: -20,
          color: "#eee",
        },
        {
          label: "待卖家确认收货",
          value: 30,
          color: "blue",
        },
        {
          label: "待买家退货",
          value: 20,
          color: "blue",
        },
        {
          label: "待卖家同意",
          value: 10,
          color: "blue",
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
    FlowDialog,
    CancelReason,
    SupplementaryPayment,
    BindWdDialog,
    BindLogisticsDialog,
    ReplyPopover,
  },
  computed: {
    ...mapGetters(["permission"]),
    checkboxShow() {
      return (value) => {
        let show = false;
        value.purchaseSubOrderList.some((item) => {
          if (item.subOrderStatus === "WAIT_BUYER_P" || item.subOrderStatus === "BULIDING") {
            show = true;
            return true;
          }
        });
        return show;
      };
    },
    checkPayboxShow() {
      return (value) => {
        let show = false;
        if (value.platform === 4) {
          if (
            value.outOrderNo &&
            ((value.orderStatus === 1 && value.additionalPayment === 0) || value.orderStatus === 6)
          ) {
            show = true;
          }
        } else {
          if (
            (value.orderStatus === 1 && value.additionalPayment === 0) ||
            value.orderStatus === 6
          ) {
            show = true;
          }
        }
        return show;
      };
    },
    isNeedSupplementary() {
      return (value) => {
        let show = false;
        if (value.additionalPayment > 0) {
          show = true;
        }
        return show;
      };
    },

    refundStatusConfig() {
      return (val) => {
        let obj = {};
        console.log(this.refundStatusList);
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
    // 获取搜索项的订单状态
    getOrderStatus({
      name: "com.sifubuy.buy.common.enums.EnumPurchaseOrderStatus",
    }).then((res) => {
      this.tabsList = res.data.data.map((item) => {
        return {
          label: item.desc,
          value: String(item.code),
        };
      });
      this.stateForm.orderStatus = this.tabsList[0].value;
      this.getData();
    });
    //采购员列表
    let roleId = "1753972321488531458";
    if (this.$root1.indexOf("dev") > -1) {
      roleId = "1123598816738675202";
    }
    getOperatorList({ roleId }).then((res) => {
      this.operatorList = res.data.data || [];
    });
    // 取消原因
    getCancelReason().then((res) => {
      this.reasonList = res.data.data || [];
    });
  },
  methods: {
    ...mapActions(["GetMessageNum"]),
    isIndeterminate(item) {
      if (
        item._checkedResult.length > 0 &&
        item.purchaseSubOrderList.length > item._checkedResult.length
      ) {
        return true;
      } else {
        return false;
      }
    },
    shopCheckAllChange(val, item) {
      if (val) {
        item._checkedResult = item.purchaseSubOrderList.map((child) => child.subOrderId);
      } else {
        item._checkedResult = [];
      }
    },
    goOrderDetail(id) {
      // this.$router.push(`/order/detail/${id}`);
      const route = this.$router.resolve({ path: `/order/detail/${id}` });
      window.open(route.href, "_blank");
    },
    goThirdLink(platformType, productId) {
      goPlatformProductDetail(platformType, productId);
    },
    contactSeller(item) {
      getContractMerchant({
        subOrderId: item.subOrderId,
      }).then((res) => {
        if (typeof res.data.data === "string") {
          window.open(res.data.data);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 留言回复
    handleReply(goods, title) {
      this.$refs.refReplyPopover.show({ goods, title });
    },
    // 绑定微店
    bindWdOrder(item) {
      this.$refs.refBindWdDialog.show(item);
    },
    bindFlow(item) {
      if (!item._checkedResult.length) {
        this.$message.error("请选择子订单数据");
        return;
      }
      this.$refs.refBindLogisticsDialog.show(item);
    },
    addMFlowNo(item) {
      this.$refs.refFlowDialog.show({
        title: "订单发货",
        rowData: item,
      });
    },
    finish() {
      this.getData();
    },
    onPayOrder(item) {
      payOrder({ purchaseOrderIds: [item.id], platform: item.platform }).then((res) => {
        if (item.platform === 2 || item.platform === 4) {
          this.$message.success("订单支付成功");
          this.finish();
        } else {
          setTimeout(() => {
            window.open(res.data.data);
          }, 2000);
        }
      });
    },
    onCancelPurchase(item) {
      this.$confirm("确定取消采购吗？", {
        confirmButtonText: "确认",
        cancelButtonText: "我再想想",
        type: "warning",
      })
        .then(() => {
          cancelPurchase({ orderId: item.orderId }).then(() => {
            this.finish();
            this.$message({
              type: "success",
              message: "操作成功!",
            });
          });
        })
        .catch(() => {});
    },
    cancelOrder(item) {
      this.$refs.refCancelReason.show({ orderId: item.orderId });
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
      if (this.$route.query.orderId) {
        this.stateForm.orderId = this.$route.query.orderId;
      }
      this.purchaseLoading = true;
      if (this.stateForm.gmtCreateTime && this.stateForm.gmtCreateTime.length) {
        this.stateForm.startGmtCreateTime = this.stateForm.gmtCreateTime[0];
        this.stateForm.endGmtCreateTime = this.stateForm.gmtCreateTime[1];
      } else {
        delete this.stateForm.startGmtCreateTime;
        delete this.stateForm.endGmtCreateTime;
      }
      if (this.stateForm.gmtPaySuccess && this.stateForm.gmtPaySuccess.length) {
        this.stateForm.startPaySuccessTime = this.stateForm.gmtPaySuccess[0];
        this.stateForm.endPaySuccessTime = this.stateForm.gmtPaySuccess[1];
      } else {
        delete this.stateForm.startPaySuccessTime;
        delete this.stateForm.endPaySuccessTime;
      }
      const param = {
        pageNo: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        ...this.stateForm,
      };

      if (!param.outOrderNo) delete param.outOrderNo;
      if (!param.platform) delete param.platform;
      // console.log(param);
      // if (param.orderStatus == 0) {
      //   delete param.orderStatus;
      // }
      purchaseList(param).then((res) => {
        this.orderData = (res.data.data.records || []).map((item) => {
          item._checkedResult = item.purchaseSubOrderList.map((child) => child.subOrderId);
          return item;
        });
        this.total = Number(res.data.data.total || 0);
        setTimeout(() => {
          this.purchaseLoading = false;
          this.GetMessageNum();
        }, 1);
        if (this.$route.query.orderId) {
          this.$router.replace("/order/purchase-list");
        }
      });
    },
    searchChange() {
      this.pagination.pageNum = 1;
      this.getData();
    },
    searchReset() {
      this.$refs.refStateForm.resetFields();
      this.stateForm.orderStatus = this.tabsList[0].value;
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
      width: 65%;
    }
    .right-info {
      display: flex;
      width: 35%;
    }
    .th {
      // border-bottom: 1px solid #f0f0f0;
    }
    .column {
      // flex-grow: 1;
      padding: 16px 0;
      position: relative;
      min-width: 80px;
      font-size: 14px;
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
    .list {
      margin-bottom: 20px;
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
      .order-number span {
        color: #1677ff;
        cursor: pointer;
        // text-decoration: underline;
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
        .el-icon-copy-document {
          cursor: pointer;
        }
      }
      .btns {
        display: flex;
        justify-content: flex-end;
        flex-wrap: wrap;
        .warning-btn {
          color: #e6a23c;
        }
        .danger-btn {
          color: #f56c6c;
        }
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
      .item-box {
        border-bottom: 1px solid #f0f0f0;
        &:last-child {
          border: none;
        }
      }
      .item-list {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 15px 0px;

        .cell {
          flex-shrink: 0;
          // padding: 15px;
          .wuliu {
            padding-top: 10px;
            line-height: normal;
          }
        }
        .detail {
          display: flex;
          align-items: center;
          .detail-box {
            display: flex;
            align-items: center;
          }
          .checkbox {
            width: 30px;
          }
          .poster {
            cursor: pointer;
          }
          .info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            font-size: 14px;
            color: #666;
            padding: 0 10px;
            .title {
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              color: #1677ff;
              // text-decoration: underline;
              // font-weight: 500;
              margin-bottom: 10px;
              cursor: pointer;
            }

            .text {
              word-break: break-all;
            }
          }
        }
        .im {
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ee2624;
          flex-wrap: wrap;
          .order-btn {
            cursor: pointer;
            display: flex;
            align-items: center;
            i {
              font-size: 20px;
            }
          }
          .reply {
            width: 100%;
            text-align: center;
            margin-top: 8px;
            span {
              cursor: pointer;
            }
          }
        }
        .num {
          color: #333;
          font-size: 14px;
          font-weight: bold;
          text-align: center;
        }
        .last-time {
          font-size: 12px;
          color: #666;
        }
      }
      .remark {
        font-size: 12px;
        color: #333;
        word-break: break-word;
        margin-bottom: 5px;
        span {
          // color: #333;
          color: #a65921;
          font-weight: 500;
        }
      }
      .logistics {
        span {
          // color: #333;
          color: #183fcd;
          font-weight: 500;
        }
      }
      .message {
        margin-top: 8px;
        margin-bottom: 20px;
        padding-right: 10px;
        .box {
          background-color: #fff7e6;
          overflow: hidden;
          border-radius: 4px;
          padding: 8px;
          line-height: 16px;
          color: #a65921;
          word-break: break-word;
          .text {
            margin-bottom: 6px;
            .top {
              display: flex;
              align-items: center;
            }
            .role {
              display: inline-block;
              max-width: 300px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              word-break: break-all;
            }
            &:last-child {
              margin-bottom: 0px;
            }
            pre {
              overflow: hidden;
              white-space: pre-wrap;
              font-size: 12px;
              margin: 0;
            }
          }
          .msg-con {
            max-height: 160px;
            overflow-y: auto;
          }
        }
        .reply {
          color: #ee2624;
          text-align: right;
          span {
            cursor: pointer;
          }
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
.no-data {
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #999;
}
</style>
