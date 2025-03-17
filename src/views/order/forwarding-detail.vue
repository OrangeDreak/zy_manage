<template>
  <!-- <basic-container > -->
  <div class="detail fs14" v-loading="loading">
    <el-card shadow="never">
      <div class="head">
        <el-form class="order-detail-form head-form" :model="orderInfo" inline>
          <el-form-item label="主订单ID:">{{ orderInfo.orderId }}</el-form-item>
          <el-form-item label="订单编号:">{{ orderInfo.orderNo }}</el-form-item>
          <el-form-item label="创建时间:">{{ orderInfo.gmtOrderPay }}</el-form-item>
          <!-- <el-form-item label="支付方式:">
            <template v-if="[1, 12, 8, 9].includes(orderInfo.orderStatus)">--</template>
            <template v-else>{{ getLabel(orderInfo.payModel, payModelList) }}</template>
          </el-form-item> -->
          <!-- <el-form-item v-if="orderInfo.operator" label="采购员:">{{
            orderInfo.operator
          }}</el-form-item> -->
        </el-form>
      </div>
      <div class="status">
        <div class="con">
          <div class="title">{{ orderInfo.orderStatusDesc }}</div>
        </div>
        <div class="remark">
          <span>备注:</span>
          <div class="textarea" v-loading="remarkLoading">
            <template v-if="remarkShow">
              <el-input
                ref="refTextarea"
                v-model="remark"
                :rows="3"
                type="textarea"
                resize="none"
                maxlength="200"
                show-word-limit
                @keyup.enter.native="changeRemark"
                @blur="blur"
              />
              <div class="desc"><i class="el-icon-info"></i> 回车提交</div>
            </template>
            <div v-else>
              <span>{{ orderInfo.remark }}</span>
              <i class="el-icon-edit" @click="editRemark"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="main">
        <!-- <el-descriptions title="收货人信息" layout="vertical">
        <el-descriptions-item label="收货人">{{ orderInfo.recipientName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ orderInfo.recipientPhone }}</el-descriptions-item>
        <el-descriptions-item label="收货地址">{{ orderInfo.address }}</el-descriptions-item>
      </el-descriptions> -->
        <el-row>
          <!-- <el-col :span="6">
            <div class="con">
              <div class="title">收货人信息</div>
              <el-form :model="orderInfo">
                <el-form-item label="收货人:">{{
                  orderInfo.receiver
                }}</el-form-item>
                <el-form-item label="联系电话:">{{
                  orderInfo.receiverPhone
                }}</el-form-item>
                <el-form-item label="收货地址:">{{
                  orderInfo.receiverAddress
                }}</el-form-item>
              </el-form>
            </div>
          </el-col> -->
          <el-col :span="6">
            <div class="con">
              <div class="title">物流信息</div>
              <div v-for="item in orderInfo.deliveryInfoList" :key="item.deliveryId">
                <el-form :model="item" size="">
                  <el-form-item label="物流名称:">{{ item.deliveryCompany }}</el-form-item>
                  <el-form-item label="物流单号:">{{ item.trackingNumber }}</el-form-item>
                  <el-form-item label="">
                    <el-button size="small" @click="lookWl(item)">查看物流详情</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-col>
          <!-- v-if="[5].includes(orderInfo.orderStatus)" -->
          <el-col :span="6">
            <div class="con">
              <div class="title">退货信息</div>
              <el-form :model="orderInfo" size="">
                <el-form-item label="退货地址:">{{ orderInfo.refundAddress }}</el-form-item>
              </el-form>
            </div>
          </el-col>
          <!-- <el-col :span="6">
            <div class="con">
              <div class="title">买家信息</div>
              <el-form :model="orderInfo" size="">
                <el-form-item label="买家姓名:">{{ orderInfo.customerName }}</el-form-item>
              </el-form>
            </div>
          </el-col> -->
        </el-row>
      </div>
    </el-card>
    <el-card class="list" shadow="never">
      <div>
        <!-- <avue-crud :option="option" :data="subOrderData">
          <template slot="skuName" slot-scope="{ row }">
            <div class="goods-detail">
              <div class="poster">
                <el-image
                  style="width: 80px; height: 80px"
                  :src="row.skuImg"
                  fit="cover"
                ></el-image>
              </div>
              <div class="info">
                <div class="title text" :title="row.skuName">
                  {{ row.skuName }}
                </div>
                <div class="size text">
                  <template v-if="row.attrs">
                    <span v-for="sku in row.attrs" :key="sku.attrValue">
                      <span
                        >{{ sku.attrName }}:{{
                          sku.attrValue
                        }}&nbsp;</span
                      >
                    </span>
                  </template>
                </div>
              </div>
            </div>
          </template>
        </avue-crud> -->
        <div class="data-table">
          <div class="header">
            <div class="left-info">
              <div
                v-for="(child, index) in leftColumns"
                :key="child.dataIndex"
                :class="['column', index !== 0 ? 'center' : 'pdlt']"
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
                :key="child.dataIndex"
                class="column center"
                :style="{
                  width: child.width,
                }"
              >
                {{ child.title }}
              </div>
            </div>
          </div>
          <template v-if="subOrderData && subOrderData.length">
            <div class="content">
              <div class="list">
                <div v-for="(item, j) in subOrderData" :key="j" class="goods-list">
                  <div class="left-info">
                    <div>
                      <div class="item-list">
                        <div class="product-detail cell" :style="{ width: leftColumns[0].width }">
                          <div class="checkbox"></div>
                          <div class="poster">
                            <img :src="item.skuImg" alt="" />
                          </div>
                          <div class="product-info">
                            <div class="info">
                              <div class="product">
                                <div class="title" :title="item.skuName">
                                  {{ item.skuName }}
                                </div>
                                <div class="size">
                                  <template v-if="item.attrs">
                                    <span v-for="(sku, index) in item.attrs" :key="index">
                                      <span>{{ sku.attrName }}:{{ sku.attrValue }}&nbsp;</span>
                                    </span>
                                  </template>
                                </div>
                                <!-- <div class="order-no">{{ item.subOrderNo }}</div> -->
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="price center" :style="{ width: leftColumns[1].width }">
                          {{ convertFenToYuan(item.skuPrice, { sign: "￥" }) }}
                        </div>
                        <div class="num center" :style="{ width: leftColumns[2].width }">
                          ×{{ item.skuCount }}
                        </div>
                      </div>
                      <div v-if="item.photoRequire" class="photo-box">
                        <div class="photo-price">
                          <div class="title" :style="{ width: leftColumns[0].width }">
                            【精细化拍照】
                          </div>
                          <div class="price" :style="{ width: leftColumns[1].width }">
                            {{ convertFenToYuan(item.photoRequire.unitPrice, { sign: "￥" }) }}
                          </div>
                          <div class="num" :style="{ width: leftColumns[2].width }">
                            x{{ item.photoRequire.requires.length }}
                          </div>
                        </div>
                        <div class="photo-rule">
                          <div class="photo-title">拍照要求：</div>
                          <div class="photo-con">
                            <div v-for="(photo, j) in item.photoRequire.requires" :key="j">
                              {{ photo }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="message">
                        <div v-if="item.sfSubOrderMessageVOList" class="box">
                          <div class="msg-con">
                            <div
                              v-for="msg in item.sfSubOrderMessageVOList"
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
                          <div class="reply" @click="handleReply(item, '回复')">
                            <span>回复</span>
                          </div>
                        </div>
                        <div v-else class="reply">
                          <span @click="handleReply(item, '用户留言')">用户留言</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div :class="['right-info', 'border-left']">
                    <div
                      class="cell center"
                      :style="{ width: rightColumns[0].width ? rightColumns[0].width : '' }"
                    >
                      <div class="amount">
                        {{ convertFenToYuan(item.subtotal, { sign: "￥" }) }}
                      </div>
                      <!-- <div class="freight">(运费:)</div>
                    <div v-if="row.totalPhotoExtraCharge" class="freight">
                      (附加服务费:{{ row.totalPhotoExtraCharge }})
                    </div> -->
                    </div>
                    <div
                      class="cell center"
                      :style="{ width: rightColumns[1].width ? rightColumns[1].width : '' }"
                    >
                      <div class="remark">
                        {{ item.remark }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="no-data">暂无数据</div>
          </template>
        </div>
        <!-- <div class="count-amout">
          <el-form :model="amoutForm" label-width="100px" class="order-detail-form">
            <el-form-item label="商品总价：">{{ amoutForm.goodsAmount }} 元</el-form-item>
            <el-form-item v-if="orderInfo.orderStatus > 1" label="到仓运费："
              >{{ amoutForm.freight }} 元</el-form-item
            >
            <el-form-item v-if="orderInfo.orderStatus > 1" label="附加服务费："
              >{{ amoutForm.totalPhotoExtraCharge }}元</el-form-item
            >
            <el-form-item v-if="orderInfo.orderStatus > 1">
              <span slot="label" class="total-amount">总金额：</span>

              <span class="total-amount"
                >{{ amoutForm.totalAmount | formatterThousands }} 元</span
              ></el-form-item
            >
          </el-form>
        </div> -->
      </div>
    </el-card>
    <el-dialog :visible.sync="wlVisible" @close="closeWl">
      <div class="wl">
        <div class="title">基本信息:</div>
        <el-card shadow="never">
          <div>物流名称：{{ wlInfo.deliveryCompany }}</div>
          <div>
            物流单号：{{ wlInfo.trackingNumber }}
            <i
              class="el-icon-copy-document"
              @click="copyTxt($event, wlInfo.trackingNumber)"
              style="font-size: 14px; color: #1890ff"
            />
          </div>
        </el-card>
        <div class="title">物流详情:</div>
        <div class="wl-line">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in wlList"
              :key="index"
              :timestamp="activity.gmtCreateTime"
            >
              {{ activity.desc }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-dialog>
    <ReplyPopover ref="refReplyPopover" @finish="getData"></ReplyPopover>
  </div>

  <!-- </basic-container> -->
</template>

<script>
import countDown from "@/components/count-down";
import { convertFenToYuan } from "@/util/commonUtil.js";
import { getDetail, setRemark, logisticsTracking } from "@/api/order";
import { getLabel } from "@/util/util";
import clipboard from "@/util/clipboard";
import ReplyPopover from "./components/replyPopover.vue";
import store from "@/store";

const payModelList = store.state.order.payModelList;
export default {
  // forwardingStatus0: "待入库",
  // forwardingStatus1: "已入库",
  // forwardingStatus2: "处理中",
  // forwardingStatus3: "已发货",
  // forwardingStatus4: "已完成",
  // forwardingStatus5: "退货",
  data() {
    return {
      loading: false,
      payModelList,
      orderInfo: {},
      wlList: [],
      remarkLoading: false,
      remark: "",
      remarkShow: false,
      // 支付倒计时3天
      payEndTime: 24 * 3 * 60 * 60 * 1000,
      countDownTime: 0,
      option: {
        menu: false,
        header: false,
        column: [
          { label: "商品", prop: "skuName", width: "300px" },
          {
            label: "单价",
            prop: "skuPrice",
            formatter: (val) => convertFenToYuan(val.skuPrice, { sign: "￥" }),
          },
          {
            label: "数量",
            prop: "skuCount",
          },
          // {
          //   label: "优惠",
          //   prop: "aa",
          //   formatter: (val) => {
          //     return "--";
          //   },
          // },
          {
            label: "小计",
            prop: "subtotal",
            formatter: (val) => convertFenToYuan(val.subtotal, { sign: "￥" }),
          },
          // {
          //   label: "订单状态",
          //   prop: "status",
          // },
          {
            label: "买家备注",
            prop: "remark",
          },
        ],
      },
      subOrderData: [],
      wlVisible: false,
      wlInfo: {},
      amoutForm: {
        totalAmount: "",
        goodsAmount: "",
        freight: "",
        totalPhotoExtraCharge: "",
      },
      // 列表数据
      leftColumns: [
        {
          title: "商品",
          width: "50%",
        },
        {
          title: "单价",
          width: "25%",
          align: "center",
        },
        {
          title: "数量",
          width: "25%",
          // width: '90px',
          align: "center",
        },
      ],
      rightColumns: [
        {
          title: "小计",
          align: "center",
          width: "40%",
        },
        {
          title: "买家备注",
          align: "center",
          width: "60%",
        },
      ],
    };
  },
  components: { countDown, ReplyPopover },
  computed: {
    // 倒计时显示，条件：待支付/待补款并且已采购前。采购之后的补款不再倒计时
    countDownShow() {
      if (
        ([1, 4, 14].includes(this.orderInfo.orderStatus) ||
          (this.orderInfo.businessPayStatus &&
            [2, 3, 4, 5, 6].includes(this.orderInfo.orderStatus))) &&
        new Date().getTime() < this.countDownTime
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    this.getData();
  },
  methods: {
    getLabel,
    convertFenToYuan,
    getData() {
      this.loading = true;
      getDetail({ id: this.$route.params.id })
        .then((res) => {
          this.orderInfo = res.data.data || {};
          this.subOrderData = (res.data.data.skuDetailList || []).map((item) => {
            item.attrs = item.skuAttr ? JSON.parse(item.skuAttr) : [];
            if (item.photoRequire) {
              const obj = JSON.parse(item.photoRequire);

              if (Array.isArray(obj)) {
                item.photoRequire = null; // 兼容脏数据
              } else {
                item.photoRequire = obj;
              }
            }
            return item;
          });
          this.amoutForm = {
            totalAmount: convertFenToYuan(this.orderInfo.actualPayAmount),
            goodsAmount: convertFenToYuan(this.orderInfo.orderAmount),
            freight: convertFenToYuan(this.orderInfo.deliveryAmount),
            totalPhotoExtraCharge: convertFenToYuan(this.orderInfo.totalPhotoExtraCharge),
          };
          if (
            this.orderInfo.orderStatus == 1 ||
            this.orderInfo.orderStatus == 4 ||
            this.orderInfo.orderStatus == 14 ||
            (this.orderInfo.businessPayStatus && [2, 3, 4, 5, 6].includes(orderInfo.orderStatus))
          ) {
            this.countDownTime =
              new Date(this.orderInfo.gmtOperateTime).getTime() + this.payEndTime;
            if (Date.now() >= this.countDownTime) {
              this.orderInfo.orderStatus = 9;
            }
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 留言回复
    handleReply(goods, title) {
      this.$refs.refReplyPopover.show({ goods, title });
    },
    editRemark() {
      this.remarkShow = true;
      this.remark = this.orderInfo.remark;
      this.$nextTick(() => {
        this.$refs.refTextarea.focus();
      });
    },
    blur() {
      this.remarkShow = false;
    },
    changeRemark() {
      this.remarkLoading = true;
      setRemark({
        orderId: this.orderInfo.orderId,
        remark: this.remark.replace(/\n$/, ""),
      })
        .then(() => {
          this.orderInfo.remark = this.remark;
          this.$message.success("备注编辑成功");
          this.remarkShow = false;
        })
        .finally(() => {
          this.remarkLoading = false;
        });
    },
    countDownEnd() {
      this.orderInfo.status = 9;
    },
    lookWl(item) {
      this.wlInfo = item;
      this.wlVisible = true;
      logisticsTracking({
        deliverId: item.deliveryId,
      })
        .then((res) => {
          this.wlList = res.data.data || [];
        })
        .catch(() => {
          this.wlList = [];
        });
    },
    closeWl() {
      this.wlInfo = {};
    },
    copyTxt(even, txt) {
      clipboard(txt, even);
    },
  },
};
</script>

<style lang="scss" scoped>
.detail {
  padding: 20px 20px 80px;
  .head {
    font-size: 14px;
    margin-bottom: 10px;
  }
  :deep(.order-detail-form .el-form-item__label) {
    font-weight: 500;
  }
  :deep(.head-form) {
    .el-form-item {
      margin-right: 50px;
    }
  }
  .status {
    display: flex;
    .con {
      margin-right: 30px;
      width: 500px;
      padding-right: 20px;
      .desc {
        display: flex;
        flex-wrap: wrap;
      }
      .count-down {
        color: #1b77ff;
        span {
          width: 22px;
          justify-content: center;
          flex-shrink: 0;
          display: inline-flex;
        }
      }
    }
    .title {
      font-size: 20px;
      font-weight: bold;
      line-height: 50px;
      word-break: break-all;
    }
    .remark {
      width: 500px;
      display: flex;
      padding-top: 20px;
      span {
        margin-right: 10px;
      }
      .textarea {
        flex-grow: 1;
        .desc {
          display: flex;
          align-items: center;
          i {
            margin: 0;
            margin-right: 4px;
            color: #999;
            cursor: default;
          }
          font-size: 12px;
          color: #999;
        }
        i {
          color: #1b77ff;
          font-size: 16px;
          margin-left: 3px;
          margin-top: 3px;
          cursor: pointer;
          &:hover {
            display: inline-block;
          }
        }
      }
    }
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
  .data-table {
    .left-info {
      width: 60%;
    }
    .right-info {
      width: 40%;
    }
    .center {
      text-align: center;
    }

    .header {
      display: flex;
      color: #333333;
      font-weight: 500;
      height: 48px;
      align-items: center;
      background: #f5f5f5;
      font-size: 12px;
      .column {
        flex-shrink: 0;
      }
      .left-info,
      .right-info {
        display: flex;
      }
      .pdlt {
        padding-left: 16px;
      }
    }
    .content {
      width: 100%;
      color: rgba(0, 0, 0, 0.85);
      border-bottom: 1px solid #f0f0f0;

      .list {
        // margin-bottom: 20px;
        background-color: #fff;
        border: 1px solid #eeeeee;
        border-bottom: none;
        &:last-child {
          margin-bottom: 0px;
          // border-bottom: 1px solid #eeeeee;
        }
      }
      .goods-list {
        display: flex;
        font-size: 12px;
        color: #333;
        border-bottom: 1px solid #eeeeee;
        // margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0px;
          border-bottom: none;
        }
        .right-info {
          display: flex;
          border-left: 1px solid #eee;
          .cell {
            padding-top: 16px;
            flex-shrink: 0;
            // border-right: 1px solid #eee;
            &:last-child {
              border-right: none;
            }
          }
        }
        .border-left {
          // border-left: 1px solid #eee;
        }
        .item-list {
          border-bottom: 1px solid #eee;
          display: flex;
          position: relative;
          padding: 16px 0;
          &:last-child {
            border-bottom: none;
          }
          // .cell {
          //   padding: 16px 0px;
          // }

          .product-detail {
            // width: 85%;
            flex-shrink: 0;
            display: flex;
            .checkbox {
              width: 16px;
              flex-shrink: 0;
            }
            .poster {
              width: 80px;
              height: 80px;
              border-radius: 4px;
              overflow: hidden;
              flex-shrink: 0;
              display: flex;
              // align-items: center;
              justify-content: center;
              cursor: pointer;
              img {
                width: 100%;
              }
            }
            .product-info {
              flex-grow: 1;
              color: #999999;
              padding-left: 12px;
              .info {
                margin-bottom: 8px;
                display: flex;
                overflow: hidden;
                .product {
                  width: 223px;
                  flex-shrink: 0;
                  .title {
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-bottom: 5px;
                    color: #333;
                    &:hover {
                      color: var(--primary-color);
                      cursor: pointer;
                    }
                  }
                  .order-no {
                    margin-top: 8px;
                    color: #333;
                  }
                }
                .price {
                  width: 124px;
                  flex-shrink: 0;
                  font-size: 14px;
                  color: #333;
                  font-weight: 500;
                  .cny {
                    color: #999;
                    font-size: 12px;
                    font-weight: normal;
                  }
                }
                .num {
                  width: 90px;
                  flex-shrink: 0;
                  font-size: 14px;
                  color: #333;
                  font-weight: 500;
                }
              }
              .remark {
                display: flex;
                height: 24px;
                align-items: center;
                padding-right: 16px;
                .text {
                  flex-grow: 1;
                  width: 0;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 1;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                img {
                  margin-left: 6px;
                  cursor: pointer;
                }
              }
            }
          }
          .shrink {
            flex-shrink: 0;
          }
          .tips {
            padding: 0 16px 0;
            margin-top: 8px;
            p {
              margin: 0;
              line-height: 20px;
            }
            .box {
              background-color: #fff7e6;
              overflow: hidden;
              border-radius: 4px;
              padding: 8px;
              line-height: 16px;
              color: #a65921;
              word-break: break-all;
            }
          }
          .photo-rule {
            padding: 0 16px;
            display: flex;
            .photo-title {
              flex-shrink: 0;
            }
            .photo-con {
              flex-grow: 1;
              width: 0;
              word-wrap: break-word;
            }
          }
        }
        .photo-rule {
          padding: 0 16px;
          display: flex;
          margin-bottom: 16px;
          .photo-title {
            flex-shrink: 0;
          }
          .photo-con {
            flex-grow: 1;
            width: 0;
            color: #999999;
            word-wrap: break-word;
          }
        }
        .photo-box {
          padding-bottom: 5px;
          border-bottom: 1px solid #eee;
        }
        .photo-price {
          display: flex;
          // border-top: 1px solid #eee;
          font-size: 12px;
          color: #131313;
          height: 38px;
          padding-left: 16px;
          text-align: center;
          .title {
            display: flex;
            align-items: center;
            width: 316px;
            .icon {
              font-size: 22px;
              color: var(--primary-color);
              margin-right: 10px;
            }
          }
          .price {
            width: 124px;
            color: #333333;
            font-weight: 500;
            line-height: 38px;
          }
          .num {
            width: 90px;
            color: #333333;
            font-weight: 500;
            line-height: 38px;
          }
        }
        .message {
          margin-top: 8px;
          margin-bottom: 20px;
          padding: 0 10px;
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
        .status {
          // display: flex;
          // align-items: center;
          // justify-content: center;
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          padding: 32px 0;
          border-left: 1px solid #eee;
          img {
            width: 12px;
            margin-left: 2px;
            margin-bottom: 2px;
          }
        }
        .order-detail-btn {
          margin-top: 8px;
          cursor: pointer;
          display: inline-block;
          &:hover {
            color: var(--primary-color);
          }
        }
        .amount {
          font-weight: 500;
          font-size: 14px;
        }
        .freight {
          margin-top: 2px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          .cny {
            width: 100%;
            text-align: right;
          }
          .icon {
            cursor: pointer;
          }
        }
        .count-down {
          line-height: normal;
        }
        .btn-link {
          line-height: normal;
          padding: 0 4px;
          height: auto;
          color: #333;
          font-size: 12px;
          margin-top: 4px;
          &:hover {
            color: var(--primary-color);
          }
        }
      }
      .after-sale-info {
        padding: 16px;
        :deep(.ant-form-item) {
          line-height: normal;
          margin-bottom: 2px;
        }
        :deep(.ant-form-item-label > label) {
          font-size: 12px;
          color: #666;
          height: auto;
        }
        :deep(.ant-form-item-control-input) {
          min-height: auto;
        }
        .copy {
          display: inline-block;
          padding: 0.5px 6px;
          border: 0.5px solid #999999;
          border-radius: 11px;
          cursor: pointer;
          font-size: 11px;
          margin-left: 4px;
          background-color: #fff;
        }
      }
    }
  }
  // .list {
  //   margin-top: 20px;
  //   .goods-detail {
  //     display: flex;
  //     align-items: center;
  //     .info {
  //       display: flex;
  //       flex-grow: 1;
  //       width: 0;
  //       flex-direction: column;
  //       justify-content: space-between;
  //       font-size: 12px;
  //       color: #666;
  //       margin-left: 10px;
  //       .title {
  //         width: 100%;
  //         overflow: hidden;
  //         text-overflow: ellipsis;
  //         white-space: nowrap;
  //         color: #000;
  //         font-weight: 500;
  //         margin-bottom: 10px;
  //       }
  //       .num {
  //         color: #333;
  //         font-size: 14px;
  //         font-weight: bold;
  //         margin-left: 10px;
  //       }
  //     }
  //   }
  // }
  .count-amout {
    padding-right: 100px;
    display: flex;
    justify-content: flex-end;
  }
  .total-amount {
    color: #ee2624;
  }
}
.wl {
  font-size: 14px;
  .title {
    font-size: 16px;
    font-weight: bold;
    padding-bottom: 20px;
    margin-top: 20px;
  }
  .wl-line {
    max-height: 700px;
    overflow-y: auto;
  }
  i {
    cursor: pointer;
  }
}
</style>
