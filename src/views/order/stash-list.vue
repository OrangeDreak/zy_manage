<template>
  <basic-container>
    <div class="header-search">
      <el-form :model="stateForm" ref="refStateForm" label-width="100px">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="用户订单号:" prop="outOrderNo">
              <el-input
                v-model="stateForm.outOrderNo"
                placeholder="请输入 用户订单号"
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
            <el-form-item label="是否打标:" prop="isTag">
              <el-select
                v-model="stateForm.isTag"
                placeholder="请选择 打标状态"
                size="small"
                clearable
                style="width: 100%"
              >
                <el-option label="未打标" :value="0"> </el-option>
                <el-option label="已打标" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="精细拍照确认:" prop="isTakeFinePictures">
              <el-select
                v-model="stateForm.isTakeFinePictures"
                placeholder="请选择 精细拍照确认状态"
                size="small"
                clearable
                style="width: 100%"
              >
                <el-option label="待确认" :value="0"> </el-option>
                <el-option label="已确认" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="外部订单编号:" prop="outOrderNo">
              <el-input
                v-model="stateForm.outOrderNo"
                placeholder="请输入 外部订单编号"
                size="small"
                clearable
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item label="主订单ID:" prop="orderId">
              <el-input
                v-model="stateForm.orderId"
                placeholder="请选择 主订单ID"
                size="small"
                clearable
                style="width: 100%"
              ></el-input>
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
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="签收时间:" prop="timeRange">
              <el-date-picker
                v-model="stateForm.timeRange"
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
          <el-col :span="24">
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
                  <span class="label">用户订单号:</span>
                  {{ item.orderNo }}&nbsp;<i
                    class="el-icon-copy-document"
                    @click="copyTxt($event, item.orderNo)"
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
                  <span class="label">采购员:</span>
                  {{
                    item.operator ? item.operator.replace(/浙江花熊科技有限公司:/g, "") : "--"
                  }}&nbsp;<i
                    class="el-icon-copy-document"
                    style="font-size: 14px; color: #1890ff"
                    @click="
                      copyTxt(
                        $event,
                        item.operator ? item.operator.replace(/浙江花熊科技有限公司:/g, '') : '',
                      )
                    "
                  />
                </div>
              </div>
              <div class="flex-1">
                <div>
                  <span class="label">仓库名称:</span>
                  {{ item.warehouseName }}
                </div>
                <div>
                  <span class="label">仓库订单号:</span>
                  {{ item.warehouseOrderNo }}
                </div>
              </div>
              <div class="flex-1">
                <div>
                  <span class="label">用户ID:</span>
                  {{ item.userId }}
                </div>
              </div>
            </div>
            <div class="head">
              <div class="left-info">
                <div
                  v-for="(child, i) in leftColumns"
                  :key="i"
                  class="column"
                  :style="{
                    width: child.width,
                    textAlign: child.key === 'confirmStatus' ? 'center' : 'left',
                  }"
                >
                  {{ child.title }}
                </div>
              </div>
              <div class="right-info">
                <div
                  v-for="(child, i) in rightColumns"
                  :key="i"
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

            <div class="goods-list">
              <div class="left-info">
                <div class="goods-infos">
                  <div
                    v-for="(goods, index) in item.purchaseSubOrderList"
                    :key="goods.subOrderId"
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
                          style="width: 80px; height: 80px; border-radius: 4px"
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
                    <div
                      class="price cell"
                      :style="{
                        width: leftColumns[1].width ? leftColumns[1].width : '',
                      }"
                    >
                      ¥{{ (goods.price / 100).toFixed(2) }}
                    </div>
                    <div
                      class="num cell"
                      :style="{
                        width: leftColumns[2].width ? leftColumns[2].width : '',
                      }"
                    >
                      <span class="num">×{{ goods.count }}</span>
                    </div>
                    <div
                      class="amount cell"
                      :style="{
                        width: leftColumns[3].width ? leftColumns[3].width : '',
                      }"
                    >
                      ¥{{ (Number(goods.subtotal) / 100).toFixed(2) }}
                    </div>
                    <div
                      class="confirm-status cell"
                      :style="{
                        width: leftColumns[4].width ? leftColumns[4].width : '',
                      }"
                    >
                      <el-tag
                        v-if="goods.takeFinePictures !== null"
                        effect="dark"
                        :type="goods.takeFinePictures ? 'success' : 'danger'"
                        size="mini"
                        >{{ goods.takeFinePictures ? "已确认" : "待确认" }}</el-tag
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div
                :class="['right-info', item.purchaseSubOrderList.length > 1 ? 'border-left' : '']"
              >
                <div
                  class="status cell"
                  :style="{
                    width: rightColumns[0].width ? rightColumns[0].width : '',
                  }"
                >
                  <!-- <el-tag v-if="item.orderStatus === 1">已入仓</el-tag>
                  <el-tag type="success" v-else-if="item.orderStatus === 2"
                    >已打包</el-tag
                  >
                  <el-tag type="info" v-else>已关闭</el-tag> -->
                  <template
                    v-if="
                      item.orderStatus === 2 || item.orderStatus === 3 || item.orderStatus === 5
                    "
                  >
                    <el-tag effect="dark" type="success">{{
                      getLabel(item.orderStatus, statusList)
                    }}</el-tag>
                  </template>
                  <template v-else-if="item.orderStatus === 1 || item.orderStatus === 4">
                    <el-tag effect="dark">{{ getLabel(item.orderStatus, statusList) }}</el-tag>
                  </template>
                  <template v-else>
                    <el-tag effect="dark" type="info">{{
                      getLabel(item.orderStatus, statusList)
                    }}</el-tag>
                  </template>
                </div>
                <div
                  class="cell"
                  :style="{
                    width: rightColumns[1].width ? rightColumns[1].width : '',
                  }"
                >
                  <el-tag v-if="item.isTag" effect="dark" type="success">已打标</el-tag>
                  <el-tag v-else effect="dark" type="info">未打标</el-tag>
                </div>
                <div
                  class="cell"
                  :style="{
                    width: rightColumns[2].width ? rightColumns[2].width : '',
                  }"
                >
                  {{ item.gmtWarehousingTime }}
                </div>
                <div
                  class="cell"
                  :style="{
                    width: rightColumns[3].width ? rightColumns[3].width : '',
                  }"
                >
                  <el-button type="primary" plain size="small" @click="goDetail(item)"
                    >查看</el-button
                  >
                </div>
              </div>
            </div>
            <div class="total-amount">
              <div>
                货品金额总计：
                <span class="num">
                  <!-- {{
                    item.purchaseSubOrderList[0].pay_currency ||
                    item.purchaseSubOrderList[0].purchase_currency
                  }} -->
                  {{ (item.subtotal / 100).toFixed(2) }}</span
                >
              </div>
              <div>
                国内履约运费总计：<span class="num">
                  <!-- {{
                    item.purchaseSubOrderList[0].pay_currency ||
                    item.purchaseSubOrderList[0].purchase_currency
                  }} -->
                  {{ (item.totalDeliveryFee / 100).toFixed(2) }}</span
                >
              </div>
              <div>
                金额总计：<span class="num">
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
  </basic-container>
</template>

<script>
import { getWarehouseList, getOrderStatus } from "@/api/order";
import { pickerOptions } from "@/util/date";
import { getLabel } from "@/util/util";
import clipboard from "@/util/clipboard";
import store from "@/store";
export default {
  name: "StashOrderList",
  data() {
    return {
      loading: false,
      pickerOptions,
      platformList: store.state.order.platformList,
      stateForm: {
        warehouseOrderId: undefined,
        outOrderNo: undefined,
        userId: undefined,
        orderId: undefined,
        platform: undefined,
        orderStatus: undefined,
        timeRange: [],
        isTag: undefined,
        isTakeFinePictures: undefined,
      },
      leftColumns: [
        {
          title: "订单详情",
          width: "40%",
        },
        // {
        //   title: "",
        //   prop: "im",
        //   width: "10%",
        // },
        {
          title: "单价",
          width: "15%",
        },
        {
          title: "数量",
          width: "15%",
        },
        {
          title: "订单金额",
          width: "15%",
        },
        {
          title: "精细拍照确认",
          key: "confirmStatus",
          width: "15%",
        },
      ],
      rightColumns: [
        {
          title: "订单状态",
          width: "25%",
        },
        {
          title: "打标状态",
          width: "25%",
        },
        {
          title: "签收时间",
          width: "25%",
        },
        {
          title: "操作",
          width: "25%",
          prop: "action",
        },
      ],
      orderData: [],
      statusList: [
        {
          label: "已入仓",
          value: "1",
        },
        {
          label: "已打包",
          value: "2",
        },
        {
          label: "已关闭",
          value: "3",
        },
      ],
      pagination: {
        pageSize: 10,
        pageNum: 1,
      },
      total: 0,
    };
  },
  computed: {},
  created() {
    // 获取搜索项的订单状态
    getOrderStatus({
      name: "com.sifubuy.buy.common.enums.EnumInnerDeliveryStatus",
    }).then((res) => {
      this.statusList = res.data.data.map((item) => {
        return {
          label: item.desc,
          value: String(item.code),
        };
      });
    });
    this.searchChange();
  },
  methods: {
    getLabel,
    goDetail(item) {
      this.$router.push(`/order/stash-detail/${item.id}`);
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
      const param = {
        pageNo: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        ...this.stateForm,
      };
      if (this.stateForm.timeRange && this.stateForm.timeRange.length) {
        param.startGmtCreateTime = this.stateForm.timeRange[0];
        param.endGmtCreateTime = this.stateForm.timeRange[1];
      } else {
        delete param.startGmtCreateTime;
        delete param.endGmtCreateTime;
      }

      getWarehouseList(param)
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
  padding: 20px 10px;
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
      width: 60%;
    }
    .right-info {
      display: flex;
      width: 40%;
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
        padding: 0 10px;
        font-size: 20px;
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
        .detail {
          display: flex;
          align-items: center;
          padding-right: 10px;
          .checkbox {
            width: 30px;
          }
          .poster {
            flex-shrink: 0;
          }
          .info {
            width: 0;
            flex-grow: 1;
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
            .text {
              word-break: break-all;
            }
          }
        }
        .confirm-status {
          text-align: center;
        }
        .last-time {
          font-size: 12px;
          color: #666;
        }
      }
      .right-info {
        padding-top: 46px;
        text-align: center;
        .center {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .border-left {
      border-left: 1px solid #f0f0f0;
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

  .approval_WAIT_BUYER_P {
    &:before {
      background: #52c41a;
    }
  }

  .approval_WAIT_SELLER_SEND_GOODS {
    &:before {
      background: #f6434c;
    }
  }

  .approval_WAIT_BUYER_CONFIRM_GOODS {
    &:before {
      background: #1677ff;
    }
  }
  .approval_BULIDING {
    &:before {
      background: #909399;
    }
  }
  .approval_TRADE_CLOSED {
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
