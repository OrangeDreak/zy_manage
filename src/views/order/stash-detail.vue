<template>
  <!-- <basic-container class="fs14" v-loading="loading"> -->
  <div class="detail fs14" v-loading="loading">
    <el-card shadow="never">
      <div class="head">
        <el-form class="order-detail-form" :model="orderInfo" inline>
          <el-form-item label="主订单ID:">{{ orderInfo.orderId }}</el-form-item>
          <el-form-item label="用户订单号:">{{ orderInfo.orderNo }}</el-form-item>
          <el-form-item label="下单时间:">{{ orderInfo.gmtCreateOrder }}</el-form-item>
          <el-form-item label="支付方式:">{{
            orderInfo.payModel | getLabel(payModelList)
          }}</el-form-item>
          <el-form-item label="采购员:">{{ orderInfo.operator }}</el-form-item>
        </el-form>
      </div>
      <div class="status">
        <div v-if="orderInfo.orderStatus == 1" class="con">
          <div class="title">{{ orderInfo.orderStatusDesc }}</div>
          <!-- <div class="desc">
            若买家未在
            <span>
              <count-down :end="countDownTime" v-slot="timeObj">
                <div class="count-down">
                  <span>{{ Number(timeObj.d) * 24 + Number(timeObj.hh) }}</span
                  >小时<span>{{ timeObj.mm }}</span
                  >分钟<span>{{ timeObj.ss }}</span
                  >秒
                </div>
              </count-down>
            </span>
            内付款，订单将按照设置逾期自动关闭
          </div> -->
        </div>
        <div v-else class="con">
          <div class="title">{{ orderInfo.orderStatusDesc }}</div>
          <div class="desc">入仓时间：{{ orderInfo.gmtSignTime }}</div>
        </div>
        <!-- <div v-else-if="orderInfo.orderStatus == 3" class="con">
          <div class="title">{{ orderInfo.orderStatusDesc }}</div>
        </div> -->
      </div>
      <div class="main">
        <el-row>
          <!-- <el-col :span="6">
            <div class="con">
              <div class="title">物流信息</div>
              <el-form :model="orderInfo">
                <el-form-item label="收货人:">{{
                  orderInfo.recipientName
                }}</el-form-item>
                <el-form-item label="联系电话:">{{
                  orderInfo.recipientPhone
                }}</el-form-item>
                <el-form-item label="收货地址:">{{
                  orderInfo.address
                }}</el-form-item>
              </el-form>
            </div>
          </el-col> -->
          <el-col :span="6">
            <div class="con">
              <div class="title">物流信息</div>
              <el-form :model="orderInfo" size="">
                <el-form-item label="物流名称:">{{ orderInfo.deliveryCompany }}</el-form-item>
                <el-form-item label="物流单号:">{{ orderInfo.trackingNumber }}</el-form-item>
                <!-- <el-form-item label="">
                  <el-button size="small" @click="lookWl"
                    >查看物流详情</el-button
                  >
                </el-form-item> -->
              </el-form>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="con">
              <div class="title">付款信息</div>
              <el-form :model="orderInfo" size="">
                <el-form-item label="实付金额:">{{
                  orderInfo.totalPayAmount | convertFenToYuan({ sign: "￥" })
                }}</el-form-item>
                <el-form-item label="付款方式:">{{
                  orderInfo.payModel | getLabel(payModelList)
                }}</el-form-item>
                <el-form-item label="付款时间:">{{ orderInfo.gmtPaySuccess }}</el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="con">
              <div class="title">买家信息</div>
              <el-form :model="orderInfo" size="">
                <el-form-item label="买家姓名:">{{ orderInfo.customerName }}</el-form-item>
                <el-form-item label="买家留言:">{{ orderInfo.remark }}</el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card class="list" shadow="never">
      <div>
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
          <template v-if="packageData && packageData.length">
            <div class="content">
              <div class="list">
                <div v-for="(item, j) in packageData" :key="j" class="goods-list">
                  <div class="left-info">
                    <div>
                      <div class="item-list">
                        <div class="product-detail cell" :style="{ width: leftColumns[0].width }">
                          <div class="checkbox"></div>
                          <div class="poster">
                            <img :src="item.headPic" alt="" />
                          </div>
                          <div class="product-info">
                            <div class="info">
                              <div class="product">
                                <div class="title" :title="item.productName">
                                  {{ item.productName }}
                                </div>
                                <div class="size">
                                  <template v-if="item.attrs">
                                    <span v-for="(sku, index) in item.attrs" :key="index">
                                      <span>{{ sku.attrName }}:{{ sku.attrValue }}&nbsp;</span>
                                    </span>
                                  </template>
                                </div>
                                <div v-if="item.shopName" class="store-name text">
                                  店铺名称：{{ item.shopName }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="num price center" :style="{ width: leftColumns[1].width }">
                          {{ convertFenToYuan(item.price, { sign: "￥" }) }}
                        </div>
                        <div class="num center" :style="{ width: leftColumns[2].width }">
                          ×{{ item.skuNum }}
                        </div>
                      </div>
                      <div v-if="item.photoRequire" class="photo-box">
                        <div class="photo-price">
                          <div class="title" :style="{ width: leftColumns[0].width }">
                            【精细化拍照】
                            <div class="photo-con">
                              <div class="photo-title">拍照要求：</div>
                              <ol>
                                <li v-for="(photo, j) in item.photoRequire.requires" :key="j">
                                  {{ photo }}
                                </li>
                              </ol>
                            </div>
                          </div>
                          <div class="price" :style="{ width: leftColumns[1].width }">
                            {{ convertFenToYuan(item.photoRequire.unitPrice, { sign: "￥" }) }}
                          </div>
                          <div class="num" :style="{ width: leftColumns[2].width }">
                            x{{ item.photoRequire.requires.length }}

                            <div v-if="item.takeFinePictures !== null" class="photo-status">
                              <el-tag
                                effect="dark"
                                :type="item.takeFinePictures ? 'success' : 'danger'"
                                >{{ item.takeFinePictures ? "已确认" : "待确认" }}</el-tag
                              >&nbsp;
                              <PhotoConfirmPopover :subOrderData="item"></PhotoConfirmPopover>
                            </div>
                          </div>
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
                    </div>
                    <div
                      class="cell center"
                      :style="{ width: rightColumns[1].width ? rightColumns[1].width : '' }"
                    >
                      <div class="product-type">
                        <div v-if="!editData['_' + item.subOrderId]">
                          <template v-if="item.productTypeLabel">
                            <el-tag v-for="item in item.productTypeLabel" :key="item.labelId"
                              >{{ item.parentLabelName }}/{{ item.labelName }}</el-tag
                            >
                          </template>
                          <template v-else
                            ><el-tag v-for="item in orderInfo.packageTypeList" :key="item">{{
                              item
                            }}</el-tag></template
                          >
                        </div>
                        <div v-else>
                          <el-cascader
                            v-model="editData['_' + item.subOrderId]"
                            :options="productTypeList"
                            collapse-tags
                            :props="{ multiple: true, value: 'labelId', label: 'labelName' }"
                            clearable
                          ></el-cascader>
                        </div>
                        <el-button
                          v-if="!editData['_' + item.subOrderId]"
                          type="text"
                          @click="changeProductType(item)"
                          >编辑</el-button
                        >
                        <el-button
                          v-if="editData['_' + item.subOrderId]"
                          type="text"
                          size="mini"
                          @click="cancelChange(item.subOrderId)"
                          >取消</el-button
                        >
                        <el-button
                          v-if="editData['_' + item.subOrderId]"
                          type="text"
                          size="mini"
                          :loading="editData['_' + item.subOrderId + 'loading']"
                          @click="saveProductType(item.subOrderId)"
                          >保存</el-button
                        >
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
      </div>
    </el-card>
    <el-card class="list" shadow="hover">
      <div class="warehouse">
        <div class="picture item">
          <div class="title">仓库拍照：</div>
          <div class="picture-wrap">
            <el-button
              v-if="!pictureList.length"
              type="primary"
              :loading="subLoading"
              @click="getQc"
              >手动更新QC照片</el-button
            >
            <template v-else>
              <el-image
                style="width: 100px; height: 100px"
                v-for="(img, index) in pictureList"
                :key="img"
                :src="img"
                :preview-src-list="pictureList"
              >
              </el-image>
            </template>
          </div>
        </div>
        <div class="time item">
          <div><span class="title">入库时间：</span>{{ orderInfo.gmtSignTime }}</div>
          <span class="days">
            <!-- <i class="el-icon-timer"></i> -->
            剩余{{ orderInfo.daysLeft }} 天
          </span>
        </div>
        <div class="size item">
          <div class="title">尺寸：</div>
          <div class="con">
            <el-card shadow="never">
              <div class="flex">
                <span>体积(cm):</span>
                <!-- <span>{{ orderInfo.length }}*{{ orderInfo.width }}*{{ orderInfo.height }}</span> -->

                <span class="weight">
                  <template v-if="!editSizeInfo.status">
                    <span>{{ orderInfo.length }}*{{ orderInfo.width }}*{{ orderInfo.height }}</span>
                    &nbsp;
                    <i class="el-icon-edit" @click="editSize"></i>
                  </template>
                  <el-form v-else ref="form" :model="editSizeInfo" @submit.native.prevent>
                    <el-form-item label="">
                      <el-input
                        v-model="editSizeInfo.size"
                        placeholder="请输入"
                        style="width: 220px"
                        @input="handleInput"
                        @blur="editSizeInfo.status = false"
                        @keyup.enter.native="changeSize"
                      >
                        <template slot="append">cm</template>
                      </el-input>
                      回车提交
                    </el-form-item>
                  </el-form>
                </span>
              </div>
              <div class="flex">
                <span>实重(g):</span>
                <span class="weight">
                  <template v-if="!editInfo.status">
                    <span>{{ orderInfo.weight }}</span
                    >&nbsp;
                    <i class="el-icon-edit" @click="editWeight"></i>
                  </template>
                  <el-form v-else ref="form" :model="editInfo" @submit.native.prevent>
                    <el-form-item label="">
                      <el-input
                        v-model="editInfo.weight"
                        placeholder="请输入"
                        style="width: 220px"
                        @input="handleInput"
                        @blur="editInfo.status = false"
                        @keyup.enter.native="changeWeight"
                      >
                        <template slot="append">g</template>
                      </el-input>
                      回车提交
                    </el-form-item>
                  </el-form>
                </span>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </el-card>
  </div>

  <!-- </basic-container> -->
</template>

<script>
import countDown from "@/components/count-down";
import { convertFenToYuan } from "@/util/commonUtil.js";
import {
  getWarehouseDetail,
  saveTypeLabel,
  getWarehouseOrderPhoto,
  updatePackageSize,
  updateTakeFinePictures,
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
          title: "订单金额",
          align: "center",
          width: "40%",
        },
        {
          title: "商品类型",
          align: "center",
          width: "60%",
        },
      ],
      photoVisible: false,
      confirmLoading: false,
      photoForm: {
        confirmNum: 0,
      },
      packageData: [],
      pictureList: [],
      editData: {},
      subLoading: false,
      editInfo: {
        weight: "",
        status: false,
      },
      editSizeInfo: {
        size: "",
        status: false,
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
    ...mapActions(["getProductTypeList"]),
    getLabel,
    convertFenToYuan,
    formatNum(val) {
      const value = val.replace(/[^0-9]/g, "");
      this.photoForm.confirmNum = value;
    },
    confirmSubmit(item) {
      this.$refs.refConfirmForm[0].validate(async (valid) => {
        if (valid) {
          try {
            this.confirmLoading = true;
            await updateTakeFinePictures({
              subOrderId: item.subOrderId,
              takeFinePictures: this.photoForm.confirmNum,
            });
            item.takeFinePictures = Number(this.photoForm.confirmNum);
            this.confirmLoading = false;
            this.photoVisible = false;
            this.$message.success("操作成功");
          } catch (e) {
            this.confirmLoading = false;
            console.log(e);
          }
        }
      });
    },
    confirmOpen(item) {
      this.photoForm.confirmNum = item.takeFinePictures
        ? item.takeFinePictures
        : item.photoRequire.requires.length;
    },
    getQc() {
      this.subLoading = true;
      getWarehouseOrderPhoto({
        warehouseOrderNo: this.orderInfo.warehouseOrderNo,
      })
        .then(() => {
          this.getData();
        })
        .finally(() => {
          this.subLoading = false;
        });
    },
    getData() {
      this.loading = true;
      getWarehouseDetail({ id: this.$route.params.id })
        .then((res) => {
          this.orderInfo = res.data.data || {};
          this.packageData = (res.data.data.skuDetailList || []).map((item) => {
            if (item.productTypeLabel) {
              item.productTypeLabel = JSON.parse(item.productTypeLabel);
              item.productType = item.productTypeLabel.map((val) => {
                return [val.parentLabelId, val.labelId];
              });
            } else {
              item.productType = [];
            }
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
          this.pictureList = (res.data.data.imgList || []).map((item, i) => item + "?t=" + i);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleInput(value) {
      // 如果输入的是空字符串或者正整数，则保留原值
      if (/^\d*$/.test(value)) {
        this.editInfo.weight = value;
      } else {
        // 否则恢复到上一次的合法值
        this.editInfo.weight = this.editInfo.weight.replace(/[^0-9]/g, "");
      }
    },
    editWeight() {
      this.editInfo.weight = this.orderInfo.weight;
      this.editInfo.status = true;
    },
    changeWeight() {
      updatePackageSize({
        packageId: this.$route.params.id,
        weight: this.editInfo.weight,
      }).then(() => {
        this.getData();
        this.$message.success("编辑成功");
        this.editInfo.status = false;
      });
    },
    editSize() {
      this.editSizeInfo.size = `${this.orderInfo.length}*${this.orderInfo.width}*${this.orderInfo.height}`;
      this.editSizeInfo.status = true;
    },
    changeSize() {
      const sizeArr = this.editSizeInfo.size.trim().split("*");
      const length = sizeArr[0];
      const width = sizeArr[1];
      const height = sizeArr[2];
      if (!length || !width || !height || length == 0 || width == 0 || height == 0) {
        this.$message.error("请填写正确的尺寸数据");
        return;
      }
      // console.log(Number(length).toFixed(2), Number(width).toFixed(2), Number(height).toFixed(2));
      // return;
      updatePackageSize({
        packageId: this.$route.params.id,
        length: Number(length).toFixed(2),
        width: Number(width).toFixed(2),
        height: Number(height).toFixed(2),
      }).then(() => {
        this.getData();
        this.$message.success("编辑成功");
        this.editSizeInfo.status = false;
      });
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
    changeProductType(row) {
      this.$set(this.editData, "_" + row.subOrderId, [...row.productType]);
      this.$set(this.editData, "_" + row.subOrderId + "loading", false);
    },
    cancelChange(subOrderId) {
      this.$set(this.editData, "_" + subOrderId, undefined);
      this.$set(this.editData, "_" + subOrderId + "loading", false);
    },
    saveProductType(subOrderId) {
      if (this.editData["_" + subOrderId] && !this.editData["_" + subOrderId].length) {
        this.$message.error("请选择产品类型");
        return;
      }
      this.editData["_" + subOrderId + "loading"] = true;
      const params = {
        subOrderId,
        labelList: [],
      };
      const ids = this.editData["_" + subOrderId];
      ids.forEach((idItem) => {
        this.productTypeList.forEach((item) => {
          if (idItem[0] === item.labelId) {
            item.children.some((child) => {
              if (idItem[1] === child.labelId) {
                params.labelList.push({
                  labelId: child.labelId,
                  labelName: child.labelName,
                  labelNameEn: child.labelNameEn,
                  parentLabelId: item.labelId,
                  parentLabelName: item.labelName,
                  parentLabelNameEn: item.labelNameEn,
                });
                return true;
              }
            });
            return true;
          }
        });
      });
      saveTypeLabel([params])
        .then(() => {
          this.$message.success("保存成功");
          this.cancelChange(subOrderId);
          this.getData();
        })
        .catch(() => {
          this.editData["_" + subOrderId + "loading"] = false;
        });
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
    margin-bottom: 10px;
  }
  :deep(.order-detail-form .el-form-item__label) {
    font-weight: 500;
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
  .goods-detail {
    display: flex;
    align-items: center;
    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 12px;
      color: #666;
      margin-left: 10px;
      width: 0;
      flex-grow: 1;
      .title {
        width: 100%;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
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
    }
  }
  .list {
    margin-top: 20px;
  }
  .warehouse {
    .item {
      display: flex;
      margin-bottom: 20px;
      font-size: 14px;
      font-weight: 500;
      .title {
        width: 130px;
        text-align: right;
      }
      .con {
        flex-grow: 1;
        padding: 0 10px;
      }
    }
    .picture {
      .title {
        flex-shrink: 0;
      }
      .picture-wrap {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        .el-image {
          margin-left: 20px;
          margin-bottom: 10px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
    .time {
      .title {
        display: inline-block;
        flex-shrink: 0;
      }
      .days {
        margin-left: 280px;
      }
    }
    .size {
      .con {
        width: 500px;
        flex-grow: inherit;
        .flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          &:last-child {
            margin-bottom: 0;
          }
          .weight i {
            color: #409eff;
            cursor: pointer;
          }
        }
      }
    }
  }
  .product-type {
    :deep(.el-tag) {
      margin-bottom: 5px;
      margin-right: 5px;
    }
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
            color: #666;
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
        .num {
          font-size: 14px;
          color: #333;
        }
        .spilt-order {
          margin-top: 10px;
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
      }
      .photo-rule {
        padding: 0 16px;
        display: flex;
        margin-bottom: 16px;
      }
      .photo-price {
        display: flex;
        // border-top: 1px solid #eee;
        font-size: 12px;
        color: #131313;
        // height: 38px;
        padding: 10px 0 10px 16px;
        text-align: center;
        .title {
          text-align: left;
          .photo-con {
            display: flex;
            align-items: flex-start;
            padding-top: 10px;
            padding-left: 5px;
            color: #999999;
            word-wrap: break-word;
            .photo-title {
              flex-shrink: 0;
            }
            ol {
              margin: 0;
            }
          }
        }
        .price {
          color: #333333;
          font-weight: 500;
          // line-height: 38px;
        }
        .num {
          color: #333333;
          font-weight: 500;
          .photo-status {
            margin-top: 5px;
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
  .no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #999;
    height: 100px;
  }
}
</style>
