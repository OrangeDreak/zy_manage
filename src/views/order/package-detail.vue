<template>
  <!-- <basic-container > -->
  <div class="detail fs14" v-loading="loading">
    <el-card shadow="never">
      <div class="head">
        <el-form class="order-detail-form head-form" :model="orderInfo" inline>
          <el-form-item label="包裹订单号:">{{ orderInfo.packageOrderNo }}</el-form-item>
          <el-form-item label="创建时间:">{{ orderInfo.gmtCreateTime }}</el-form-item>
          <div class="stash-list">
            <el-form-item
              v-for="(item, index) in orderInfo.warehouseOrderNoList"
              :key="index"
              :label="`仓库订单号${index + 1}:`"
              >{{ item }}</el-form-item
            >
          </div>
        </el-form>
      </div>
      <div class="status">
        <div v-if="orderInfo.status == 0" class="con">
          <div class="title">{{ orderInfo.statusDesc }}</div>
          <div class="desc">
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
          </div>
        </div>
        <div v-else class="con">
          <div class="title">{{ orderInfo.statusDesc }}</div>
        </div>
      </div>
    </el-card>
    <UploadVideo :orderInfo="orderInfo" @finish="finish"></UploadVideo>
    <el-card class="list" shadow="never">
      <avue-crud
        :option="option1"
        :header-cell-class-name="thStyle"
        :span-method="spanMethod1"
        :data="stashData"
      >
        <template slot="empty"> 暂无数据 </template>
        <template slot="img" slot-scope="{ row }">
          <el-image style="width: 80px; height: 80px" :src="row.img" :preview-src-list="[row.img]">
          </el-image>
        </template>
        <template slot="info" slot-scope="{ row }">
          <div class="stash-info">
            <div class="con">
              <!-- <div class="store">{{ row.store }}</div> -->
              <div class="sku">
                <span v-for="sku in row.attrList" :key="sku.attrValue">
                  <span>{{ sku.attrName }}:{{ sku.attrValue }}&nbsp;</span>
                </span>
              </div>
            </div>
            <div class="num">×{{ row.skuCount }}</div>
          </div>
        </template>
      </avue-crud>
    </el-card>
    <el-card class="list" shadow="never">
      <avue-crud
        class="take-table"
        :header-cell-class-name="thStyle"
        :cell-class-name="cellClassName"
        :option="option2"
        :data="takeData"
      >
        <template slot="info" slot-scope="{ row }">
          <div class="take-info">
            <div
              v-for="(val, key, i) in row.item"
              :key="key"
              :class="[i % 2 == 0 ? 'label' : 'value', i === row.length - 1 ? 'last-item' : '']"
            >
              {{ val }}
            </div>
          </div>
        </template>
        <template slot="empty"> 暂无数据 </template>
      </avue-crud>
    </el-card>
    <el-card class="list" shadow="never">
      <avue-crud :header-cell-class-name="thStyle" :option="option5" :data="packageInfoData">
        <template slot="addService" slot-scope="{ row }">
          <div class="add-service">
            <el-checkbox-group v-model="row.addService" disabled>
              <span v-for="item in addServiceList" :key="item.value">
                <el-checkbox v-if="row.addService.includes(item.value)" :label="item.value"
                  ><span class="add-service-item"
                    >{{ item.label }}
                    <el-tooltip effect="dark" placement="top">
                      <pre class="add-service-box" slot="content">{{ item.tip }}</pre>
                      <i class="el-icon-question"></i></el-tooltip></span
                ></el-checkbox>
              </span>
            </el-checkbox-group>
          </div>
        </template>
      </avue-crud>
    </el-card>
    <el-card class="list" shadow="never">
      <avue-crud
        :header-cell-class-name="thStyle"
        :option="option3"
        :span-method="spanMethod2"
        :data="clearanceData"
      >
        <template slot="attr" slot-scope="{ row }">
          <el-checkbox-group v-model="row.attr">
            <el-checkbox :label="item.label" v-for="item in row.attr" :key="item.label">{{
              item.label
            }}</el-checkbox>
          </el-checkbox-group>
        </template>
        <template slot="empty"> 暂无数据 </template>
      </avue-crud>
    </el-card>
    <el-card class="list" shadow="never">
      <avue-crud :header-cell-class-name="thStyle" :option="option4" :data="flowData">
        <template slot="transhipmentTrackingNo" slot-scope="{ row }">
          {{ row.transhipmentTrackingNo }}&nbsp;&nbsp;<el-button
            type="text"
            icon="el-icon-edit"
            @click="editTrackingNo"
            >编辑</el-button
          >
        </template>
        <template slot="empty"> 暂无数据 </template>
      </avue-crud>
    </el-card>
    <TrackingNoEdit ref="refTrackingNoEdit" @finish="finish"></TrackingNoEdit>
  </div>

  <!-- </basic-container> -->
</template>

<script>
import countDown from "@/components/count-down";
import UploadVideo from "./components/uploadVideo.vue";
import { convertFenToYuan } from "@/util/commonUtil.js";
import { getPackageDetail } from "@/api/order";
import { getLabel } from "@/util/util";
import clipboard from "@/util/clipboard";
import store from "@/store";
import TrackingNoEdit from "./components/trackingNoEdit.vue";

const payModelList = store.state.order.payModelList;
export default {
  data() {
    return {
      loading: false,
      payModelList,
      orderInfo: {
        warehouseOrderNoList: [],
      },
      countDownTime: "",
      option1: {
        menu: false,
        header: false,
        align: "center",
        column: [
          { label: "仓库订单号", prop: "warehouseOrderNo" },
          {
            label: "仓库",
            prop: "warehouseName",
          },
          // {
          //   label: "单价",
          //   prop: "skuPrice",
          //   formatter: (val) => convertFenToYuan(val.subtotal, { sign: "￥" }),
          // },
          {
            label: "商品名称",
            prop: "productName",
          },
          {
            label: "商品图",
            prop: "img",
          },
          {
            label: "商品信息",
            prop: "info",
            align: "left",
            // formatter: (val) => getLabel(val.status, goodsStatusList),
          },
          {
            label: "重量（g）",
            prop: "weight",
            // formatter: (val) => getLabel(val.status, goodsStatusList),
          },
          {
            label: "体积（cm）",
            prop: "volume",
            formatter: (val) => {
              return val.length + "*" + val.width + "*" + val.height;
            },
          },
          {
            label: "属性",
            prop: "attributes",
            // formatter: (val) => getLabel(val.status, goodsStatusList),
          },
        ],
      },
      option2: {
        menu: false,
        border: true,
        header: false,
        headerAlign: "center",
        align: "center",
        column: [
          {
            label: "收货信息",
            prop: "info",
          },
        ],
      },
      option3: {
        menu: false,
        border: true,
        header: false,
        headerAlign: "center",
        align: "center",
        column: [
          {
            label: "报关信息",
            prop: "skuName",
            children: [
              {
                label: "中文名",
                prop: "productName",
              },
              {
                label: "英文名",
                prop: "productNameEn",
              },
              {
                label: "申报金额 USD",
                prop: "amount",
              },
              {
                label: "预估税费 USD",
                prop: "taxes",
              },
              {
                label: "seel保险 USD",
                prop: "seelPrice",
                // formatter: (val) => val.seelPriceTrans + "g",
              },
              // {
              //   label: "报关属性",
              //   prop: "attr",
              // },
            ],
          },
        ],
      },
      option4: {
        menu: false,
        border: true,
        header: false,
        headerAlign: "center",
        align: "center",
        column: [
          {
            label: "物流信息",
            prop: "skuName",
            children: [
              {
                label: "买家选择方式",
                prop: "deliverName",
              },
              {
                label: "实际物流方式",
                prop: "actualDeliverName",
              },
              {
                label: "预估押金（元）",
                prop: "estimateFreightDeposit",
                formatter: (val) => convertFenToYuan(val.estimateFreightDeposit, { sign: "￥" }),
              },
              {
                label: "国际物流单号",
                prop: "transhipmentTrackingNo",
              },
              {
                label: "备注",
                prop: "remark",
              },
            ],
          },
        ],
      },
      option5: {
        menu: false,
        border: true,
        header: false,
        headerAlign: "center",
        align: "center",
        column: [
          {
            label: "包裹信息",
            prop: "skuName",
            children: [
              {
                label: "包装方式",
                width: "200px",
                prop: "packingMethod",
                dicData: [
                  {
                    label: "纸箱包装(免费服务)",
                    value: 1,
                  },
                  {
                    label: "极简包装(免费服务)",
                    value: 2,
                  },
                ],
              },
              {
                width: "200px",
                label: "包裹材料重量(g)",
                prop: "estimatePackWeight",
              },
              {
                label: "增值服务",
                prop: "addService",
              },
            ],
          },
        ],
      },
      stashData: [],
      takeData: [],
      clearanceData: [],
      flowData: [],
      packageInfoData: [],
      addServiceList: [
        {
          label: this.$t("addService1"),
          tip: this.$t("addServiceTip1"),
          value: 1,
        },
        {
          label: this.$t("addService2"),
          tip: this.$t("addServiceTip2"),
          value: 2,
        },
        {
          label: this.$t("addService3"),
          tip: this.$t("addServiceTip3"),
          value: 3,
        },
        {
          label: this.$t("addService4"),
          tip: this.$t("addServiceTip4"),
          value: 4,
        },
        {
          label: this.$t("addService5"),
          tip: this.$t("addServiceTip5"),
          value: 5,
        },
        {
          label: this.$t("addService6"),
          tip: this.$t("addServiceTip6"),
          value: 6,
        },
        {
          label: this.$t("addService7"),
          tip: this.$t("addServiceTip7"),
          value: 7,
        },
        {
          label: this.$t("addService8"),
          tip: this.$t("addServiceTip8"),
          value: 8,
        },
        {
          label: this.$t("addService9"),
          tip: this.$t("addServiceTip9"),
          value: 9,
        },
        {
          label: this.$t("addService10"),
          tip: this.$t("addServiceTip10"),
          value: 10,
        },
        {
          label: this.$t("addService11"),
          tip: this.$t("addServiceTip11"),
          value: 11,
        },
        {
          label: this.$t("addService12"),
          tip: this.$t("addServiceTip12"),
          value: 12,
        },
      ],
    };
  },
  components: { countDown, UploadVideo, TrackingNoEdit },
  created() {
    this.getData();
  },
  methods: {
    editTrackingNo() {
      this.$refs.refTrackingNoEdit.show(this.flowData[0]);
    },
    getData() {
      this.loading = true;
      getPackageDetail({ id: this.$route.params.id })
        .then((res) => {
          this.orderInfo = res.data.data || {};
          this.orderInfo.warehouseOrderNoList = res.data.data.warehouseOrderNoList || [];
          // 包裹数据
          const arr = res.data.data.warehouseOrderList || [];
          const arr2 = [];
          arr.forEach((item) => {
            const arr3 = [];
            item.skuDetailDTOList.forEach((child, index) => {
              arr3.push(child);
            });
            arr3[0] = { ...arr3[0], ...item };
            arr2.push(...arr3);
          });
          this.stashData = arr2;
          // 收货数据
          this.takeData = [
            {
              item: {
                label1: "收件人",
                value1: this.orderInfo.receiver,
                label2: "手机号",
                value2: this.orderInfo.receiverPhone,
                label3: "国家/地区",
                value3: this.orderInfo.country,
                label4: "邮编",
                value4: this.orderInfo.postCode,
                label5: "详细地址",
                value6: this.orderInfo.receiverAddress,
              },
              length: 10,
            },
            // {
            //   item: {
            //     label1: "详细地址",
            //     value1: this.orderInfo.receiverAddress,
            //     // label2: "",
            //   },
            //   length: 2,
            // },
            {
              item: {
                label1: "包裹地址",
                value1: this.orderInfo.fullReceiverAddress,
                // label2: "",
              },
              length: 2,
            },
            ...(this.orderInfo.fullBillingAddressList || []).map((item, i) => {
              return {
                item: {
                  label1: `账单地址${i + 1}`,
                  value1: item,
                },
                length: 2,
              };
            }),
          ];
          // 报关数据
          const arr4 = this.orderInfo.declarationType.declarationSkuDetails || [];
          if (arr4.length) {
            arr4[0].weight = this.orderInfo.declarationType.weight;
            arr4[0].amount = convertFenToYuan(this.orderInfo.declarationType.amount);
            arr4[0].taxes = convertFenToYuan(this.orderInfo.declarationType.taxReportingFeeTrans);
            arr4[0].seelPrice = convertFenToYuan(this.orderInfo.declarationType.seelPriceTrans);
            arr4[0].declarationSkuDetails = this.orderInfo.declarationType.declarationSkuDetails;
          }
          this.clearanceData = arr4;
          // 增值服务
          // console.log(this.orderInfo);
          this.packageInfoData = [
            {
              estimatePackWeight: this.orderInfo.estimatePackWeight,
              addService: this.orderInfo.addedServicesIdList || [],
              packingMethod: this.orderInfo.packingMethod,
            },
          ];
          // this.addedServicesIdList = this.orderInfo.addedServicesIdList;
          // console.log(this.addedServicesIdList);
          // 物流数据
          this.flowData = [
            {
              deliverName: this.orderInfo.deliverName,
              actualDeliverName: this.orderInfo.actualDeliverName,
              estimateFreightDeposit: this.orderInfo.estimateFreightDeposit,
              transhipmentTrackingNo: this.orderInfo.transhipmentTrackingNo,
              remark: this.orderInfo.remark,
            },
          ];
          if (this.orderInfo.status == 0) {
            this.countDownTime =
              new Date(this.orderInfo.gmtCreateTime).getTime() + 24 * 3 * 60 * 60 * 1000;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getLabel,
    convertFenToYuan,
    spanMethod1({ row, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 5 || columnIndex === 6) {
      } else {
        if (row.skuDetailDTOList) {
          return {
            rowspan: row.skuDetailDTOList.length,
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
    spanMethod2({ row, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
      } else {
        if (row.declarationSkuDetails) {
          return {
            rowspan: row.declarationSkuDetails.length,
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
    copyTxt(even, txt) {
      clipboard(txt, even);
    },
    thStyle({ rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "table-th-blue";
      }
    },
    cellClassName({ rowIndex, columnIndex }) {
      return "take-tabl-cell";
    },
    finish() {
      this.getData();
    },
  },
};
</script>

<style lang="scss" scoped>
.add-service-box {
  padding: 0;
  margin: 0;
  width: 300px;
}
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
  }
  .add-service {
    padding: 10px 0;
    text-align: left;
    .add-service-item {
      display: inline-block;
      width: 190px;
    }
    :deep(.el-checkbox__input.is-disabled + span.el-checkbox__label) {
      color: rgba(0, 0, 0, 0.6);
    }
  }
  .list {
    margin-top: 20px;
    .stash-info {
      display: flex;
      align-items: center;
      font-size: 12px;
      .con {
        margin-right: 10px;
      }
      .store {
        max-width: 200px;
      }
      .num {
        white-space: nowrap;
      }
    }
  }
  .take-info {
    display: flex;

    .label {
      width: 6%;
      border-right: 1px solid #ebeef5;
      padding: 10px 0;
    }
    .value {
      width: 12%;
      padding: 10px 0;
      border-right: 1px solid #ebeef5;
      &:last-child {
        border-right: none;
      }
    }
    .last-item {
      flex: 1;
    }
  }
}
:deep(.el-table thead.is-group th.table-th-blue) {
  background: #409eff;
  color: #fff;
}
:deep(.avue-crud .el-table th.table-th-blue) {
  background: #409eff;
  color: #fff;
}
:deep(.take-table .take-tabl-cell) {
  padding: 0;
}
</style>
