<template>
  <basic-container>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      :search.sync="search"
      v-model="form"
      :page="page"
      :before-open="beforeOpen"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @search-change="searchChange"
      @search-reset="searchReset"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template slot-scope="{ size }" slot="search">
        <el-form :model="search" :size="size" label-width="120px">
          <el-form-item label="覆盖区域:" :key="1">
            <el-cascader
              v-model="search.areaLibraryIdList"
              placeholder="请选择"
              :options="areaList"
              :props="{ multiple: true, value: 'id', label: 'areaName' }"
              filterable
              clearable
            />
          </el-form-item>
        </el-form>
      </template>
      <template slot="outLineIdForm">
        <el-select
          placeholder="请选择 外部物流干线"
          v-model="form.outLineId"
          @change="outLineIdChange"
        >
          <el-option
            v-for="item in outLineIdList"
            :key="item.channelId"
            :label="item.title"
            :value="item.channelId"
          ></el-option>
        </el-select>
        <span>线路code：{{ outLineInfo.code || "--" }}</span>
      </template>
      <template slot="packageLimitForm">
        <div class="package-limit">
          <div class="label">最低限制</div>
          <el-input-number
            v-model="form.packageWeightMin"
            :precision="0"
            :controls="false"
            placeholder="请输入"
          ></el-input-number>
          &nbsp;g，最高限制&nbsp;
          <el-input-number
            v-model="form.packageWeightMax"
            :precision="0"
            :controls="false"
            placeholder="请输入"
          ></el-input-number>
          &nbsp;g
        </div>
        <div class="package-limit">
          <div class="label">尺寸限制</div>
          <el-input
            v-model="form.sizeLimit"
            type="textarea"
            :rows="2"
            resize="nono"
            placeholder="请输入"
          ></el-input>
        </div>
        <div class="package-limit">
          <div class="label">体积计费限制</div>
          <el-input
            v-model="form.volumeChargeLimit"
            type="textarea"
            :rows="2"
            resize="nono"
            placeholder="请输入"
          ></el-input>
        </div>
        <!-- </el-form-item> -->
      </template>
      <template slot="volumeLimitForm">
        <div class="package-limit package-limit2">
          <div class="label">第一长边最大限制&nbsp;</div>
          <el-input-number
            v-model="form.packageLengthLimit"
            :precision="0"
            :controls="false"
            placeholder="请输入"
          ></el-input-number>
          &nbsp;cm
        </div>
        <div class="package-limit package-limit2">
          <div class="label">第二长边最大限制&nbsp;</div>
          <el-input-number
            v-model="form.packageWidthLimit"
            :precision="0"
            :controls="false"
            placeholder="请输入"
          ></el-input-number>
          &nbsp;cm
        </div>
        <div class="package-limit package-limit2">
          <div class="label">第三长边最大限制&nbsp;</div>
          <el-input-number
            v-model="form.packageHeightLimit"
            :precision="0"
            :controls="false"
            placeholder="请输入"
          ></el-input-number>
          &nbsp;cm
        </div>
        <div class="package-limit package-limit2">
          <div class="label">三边长最大限制&nbsp;</div>
          <el-input-number
            v-model="form.packageSideLengthSumLimit"
            :precision="0"
            :controls="false"
            placeholder="请输入"
          ></el-input-number>
          &nbsp;cm
        </div>
        <div class="package-limit package-limit2">
          <div class="label">
            围长最大限制
            <el-tooltip class="item" effect="dark" content="长+（宽+高）*2" placement="top">
              <i class="el-icon-question" /> </el-tooltip
            >&nbsp;
          </div>
          <el-input-number
            v-model="form.packageGirthLimit"
            :precision="0"
            :controls="false"
            placeholder="请输入"
          ></el-input-number>
          &nbsp;cm
        </div>
      </template>
      <!-- <template slot="declarationAmountLimitForm">
        <el-input-number
          v-model="form.declarationAmountLimit"
          :precision="2"
          style="width: 50%"
          :controls="false"
          placeholder="请输入"
        ></el-input-number>
        USD
      </template> -->
      <template slot="cargoValueRatioForm" slot-scope="{ type }">
        <el-input-number
          v-model="form.cargoValueRatio"
          :min="0"
          :precision="2"
          :disabled="type === 'view'"
          class="my-el-input-number"
          style="width: 50%"
          :controls="false"
          data-unit="%"
        ></el-input-number>
      </template>
      <template slot="taxReportingRatioForm" slot-scope="{ type }">
        <el-input-number
          v-model="form.taxReportingRatio"
          :min="0"
          :precision="2"
          :disabled="type === 'view'"
          class="my-el-input-number"
          style="width: 50%"
          :controls="false"
          data-unit="%"
        ></el-input-number>
      </template>
      <!-- <template slot="logisticsLineTypeForm" slot-scope="{ type }">
        <el-cascader
          :disabled="type === 'view' || loading"
          v-model="form.logisticsLineType"
          placeholder="请选择"
          :options="productTypeList"
          :props="{ multiple: true, value: 'labelId', label: 'labelName' }"
          filterable
          clearable
        />
      </template> -->
      <template slot="nonsupportProductTypeListForm" slot-scope="{ type }">
        <el-cascader
          :disabled="type === 'view' || loading"
          v-model="form.nonsupportProductTypeList"
          placeholder="请选择"
          :options="productTypeList"
          :props="{ multiple: true, value: 'labelId', label: 'labelName' }"
          filterable
          clearable
        />
      </template>
      <template slot="logisticsTimeForm" slot-scope="{ type }">
        <el-input
          :disabled="type === 'view' || loading"
          v-model="form.logisticsTimeMin"
          class="w40b"
          ><template slot="append">天</template></el-input
        >
        <span> —— </span>
        <el-input
          :disabled="type === 'view' || loading"
          v-model="form.logisticsTimeMax"
          class="w40b"
          ><template slot="append">天</template></el-input
        >
      </template>
      <template slot="declarationAmountLimitForm" slot-scope="{ type }">
        <el-input-number
          v-model="form.declarationAmountMinLimit"
          :precision="2"
          class="w40b my-el-input-number"
          data-unit="USD"
          :controls="false"
          placeholder="请输入最小申报金额"
        ></el-input-number>
        <span> —— </span>
        <el-input-number
          v-model="form.declarationAmountMaxLimit"
          :precision="2"
          class="w40b my-el-input-number"
          data-unit="USD"
          :controls="false"
          placeholder="请输入最大申报金额"
        ></el-input-number>
      </template>
      <template slot-scope="{ row }" slot="menu">
        <!-- 状态 0:已停用，1:已启用 -->
        <el-button
          type="text"
          icon="el-icon-refresh"
          size="small"
          @click.stop="toUpdateStatus(row)"
          >{{ row.logisticsLineStatus ? "停用" : "启用" }}</el-button
        >
        <el-button
          type="text"
          icon="el-icon-collection-tag"
          size="small"
          @click.stop="bindLine(row)"
          >{{ row.outLineId ? "编辑" : "绑定" }}外部干线</el-button
        >
        <el-button
          type="text"
          icon="el-icon-edit-outline"
          size="small"
          @click.stop="toSetCost(row.logisticsLineId)"
          >费用设置</el-button
        >
        <el-button
          v-if="row.areaLibraryNameListDesc"
          type="text"
          icon="el-icon-truck"
          size="small"
          @click.stop="
            showPop = true;
            logisticsLineId = row.logisticsLineId;
          "
          >运费测算</el-button
        >
      </template>
    </avue-crud>
    <FreightCalculation
      v-if="showPop"
      :showPop.sync="showPop"
      :logisticsLineId="logisticsLineId"
      @onSubmit="refreshChange"
    />
    <BindLineDialog ref="refBindLineDialog"></BindLineDialog>
  </basic-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { convertFenToYuan, convertYuanToFen } from "@/util/commonUtil.js";
import {
  getList,
  detail,
  remove,
  updateStatus,
  save,
  getLineCodeList,
} from "@/api/logistics/logistics";
import FreightCalculation from "@/components/pops/logistics/FreightCalculation.vue";
import BindLineDialog from "./components/bindLineDialog.vue";

export default {
  name: "LogisticsList",
  components: { FreightCalculation, BindLineDialog },
  data() {
    return {
      form: {},
      query: {},
      search: {},
      loading: true,
      data: [],
      option: {
        // viewBtn: true,
        // menuWidth: 180,
        searchMenuSpan: 8,
        labelWidth: 190,
        span: 24,
        searchSpan: 8,
        searchLabelWidth: 120,
        searchMenuPosition: "right",
        column: [
          // {
          //   label: "绑定物流干线",
          //   prop: "outLineId",
          //   type: "select",
          //   hide: true,
          //   rules: [
          //     {
          //       required: false,
          //       message: "请输入绑定物流干线的ID",
          //       trigger: "blur",
          //     },
          //   ],
          // },
          {
            label: "ID",
            addDisplay: false,
            editDisplay: false,
            prop: "logisticsLineId",
          },
          {
            label: "物流干线名称",
            prop: "logisticsLineName",
            width: 120,
            search: true,
            overHidden: true,
            rules: [
              {
                required: true,
                message: "请输入物流干线名称",
                trigger: "blur",
              },
            ],
          },
          {
            label: "物流干线英文名称",
            prop: "logisticsLineNameEn",
            width: 120,
            rules: [
              {
                required: true,
                message: "请输入物流干线英文名称",
                trigger: "blur",
              },
            ],
          },
          {
            label: "物流干线icon",
            prop: "logisticsLineIcon",
            // hide: true,
            type: "upload",
            accept: ".png,.jpg,.jpeg",
            listType: "picture-img",
            action: "/resource/oss/upload",
            tip: "支持jpg、png格式，建议尺寸：px，不超过2M",
            propsHttp: { url: "url", res: "data" },
            uploadBefore: (file, done, loading) => {
              var fileSize = file.size / 1024 / 1024 < 2;
              if (!fileSize) {
                this.$message.error("文件大小不能超过2MB");
                loading();
              } else {
                done();
              }
            },
            rules: [
              {
                required: true,
                message: "请上传物流干线icon",
                trigger: "blur",
              },
            ],
          },
          {
            label: "覆盖区域",
            prop: "areaLibraryNameListDesc",
            width: 120,
            overHidden: true,
            addDisplay: false,
            editDisplay: false,
          },
          {
            label: "支持包裹类型",
            prop: "logisticsLineType",
            hide: true,
            dicData: [],
            html: true,
            multiple: true,
            type: "select",
            disabled: true,
            addDisplay: false,
            editDisplay: true,
            placeholder: "请 绑定外部物流干线",
            rules: [
              {
                required: false,
                message: "请选择支持包裹类型",
                trigger: "change",
              },
            ],
          },
          {
            label: "不支持包裹类型",
            prop: "nonsupportProductTypeList",
            width: 120,
            overHidden: true,
            type: "tree",
            rules: [
              {
                required: true,
                message: "请选择干线不支持包裹类型",
                trigger: "change",
              },
            ],
            dicData: [],
            html: true,
            formatter: (val) => {
              return val.nonsupportProductTypeListDesc;
            },
          },

          {
            label: "归属仓库",
            prop: "warehouseId",
            type: "select",
            dicData: [],
            html: true,
            formatter: (val) => {
              return val.warehouseName;
            },
            rules: [
              {
                required: true,
                message: "请选择归属苍库",
                trigger: "change",
              },
            ],
          },
          {
            label: "运输时效",
            prop: "logisticsTime",
            html: true,
            formatter: (val) => {
              return `${val.logisticsTimeMin || 0}-${val.logisticsTimeMax || 0}天`;
            },
            rules: [
              {
                required: true,
                trigger: "blur",
                validator: (rule, value, callback) => {
                  const { logisticsTimeMin, logisticsTimeMax } = this.form;
                  // if (!logisticsTimeMin || !logisticsTimeMax) {
                  //   callback(new Error("请设置运输时效"));
                  // } else if (logisticsTimeMin >= logisticsTimeMax) {
                  //   callback(new Error("结束时间必须大于开始时间"));
                  // }
                  // callback();
                  if (!Number(logisticsTimeMin) || !Number(logisticsTimeMax)) {
                    callback(new Error("请设置运输时效"));
                  } else if (Number(logisticsTimeMin) >= Number(logisticsTimeMax)) {
                    callback(new Error("结束时间必须大于开始时间"));
                  } else {
                    callback();
                  }
                },
              },
            ],
          },
          {
            label: "排序",
            prop: "logisticsLineSort",
            rules: [
              {
                required: true,
                message: "请输入物流干线名称",
                trigger: "blur",
              },
            ],
          },
          {
            label: "包裹限制",
            prop: "packageLimit",
            hide: true,
            rules: [
              {
                required: true,
                trigger: "change",
                validator: (rule, value, callback) => {
                  const { packageWeightMin, packageWeightMax, sizeLimit, volumeChargeLimit } =
                    this.form;
                  if (!packageWeightMin || !packageWeightMax || !sizeLimit || !volumeChargeLimit) {
                    callback(new Error("请输入完整包裹限制数据"));
                  } else if (Number(packageWeightMin) >= Number(packageWeightMax)) {
                    callback(new Error("最高限制重量必须大于最低限制重量"));
                  }
                  callback();
                },
              },
            ],
          },
          {
            label: "包裹体积限制",
            prop: "volumeLimit",
            hide: true,
            // rules: [
            //   {
            //     required: false,
            //     trigger: "change",
            //     validator: (rule, value, callback) => {
            //       const { packageWeightMin, packageWeightMax, sizeLimit, volumeChargeLimit } =
            //         this.form;
            //       if (!packageWeightMin || !packageWeightMax || !sizeLimit || !volumeChargeLimit) {
            //         callback(new Error("请输入完整包裹限制数据"));
            //       } else if (Number(packageWeightMin) >= Number(packageWeightMax)) {
            //         callback(new Error("最高限制重量必须大于最低限制重量"));
            //       }
            //       callback();
            //     },
            //   },
            // ],
          },
          {
            label: "状态",
            prop: "logisticsLineStatus",
            type: "select",
            search: true,
            editDisplay: false,
            addDisplay: false,
            dicData: [
              { label: "已停用", value: 0 },
              { label: "使用中", value: 1 },
            ],
          },
          {
            label: "是否免税",
            prop: "includeTaxes",
            hide: true,
            type: "checkbox",
            dicData: [{ label: "", value: 1 }],
            control: (val, form) => {
              console.log(val);
              if (val.length) {
                return {
                  isPrepaidTax: {
                    display: false,
                  },
                  taxReportingRatio: {
                    display: false,
                  },
                };
              } else {
                return {
                  isPrepaidTax: {
                    display: true,
                  },
                  taxReportingRatio: {
                    display: true,
                  },
                };
              }
            },
          },
          {
            label: "是否预收税",
            prop: "isPrepaidTax",
            display: true,
            hide: true,
            type: "switch",
            value: 0,
            dicData: [
              {
                label: "关",
                value: 0,
              },
              {
                label: "开",
                value: 1,
              },
            ],
          },
          {
            label: "报税比例",
            prop: "taxReportingRatio",
            type: "number",
            display: true,
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入报税比例",
                trigger: "blur",
              },
            ],
            formatter: (val) => (val.taxReportingRatio ? `${val.taxReportingRatio}%` : ""),
          },
          {
            label: "系统货值申报比例",
            prop: "cargoValueRatio",
            type: "number",
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入系统货值申报比例",
                trigger: "blur",
              },
            ],
            formatter: (val) => (val.cargoValueRatio ? `${val.cargoValueRatio}%` : ""),
          },
          {
            label: "申报金额限制",
            prop: "declarationAmountLimit",
            type: "number",
            hide: true,
            rules: [
              {
                required: false,
                trigger: "blur",
                validator: (rule, value, callback) => {
                  const { declarationAmountMinLimit, declarationAmountMaxLimit } = this.form;
                  if (Number(declarationAmountMinLimit) >= Number(declarationAmountMaxLimit)) {
                    callback(new Error("最大申报金额必须大于最小申报金额"));
                  } else {
                    callback();
                  }
                },
              },
            ],
          },
          {
            label: "是否允许使用转运商家折扣",
            prop: "useTransportDiscount",
            hide: true,
            type: "checkbox",
            dicData: [{ label: "", value: 1 }],
          },

          {
            label: "计费方式说明",
            prop: "volumeWeightDesc",
            hide: true,
            overHidden: true,
            type: "textarea",
            rules: [
              {
                required: true,
                message: "请输入计费方式说明",
                trigger: "blur",
              },
            ],
          },
          {
            label: "干线说明",
            prop: "logisticsLineDesc",
            overHidden: true,
            type: "textarea",
            rules: [
              {
                required: true,
                message: "请输入干线说明",
                trigger: "blur",
              },
            ],
          },
          {
            label: "是否配置保险",
            prop: "configureInsurance",
            hide: true,
            type: "checkbox",
            dicData: [
              { label: "", value: 1 },
              // { label: "使用中", value: 1 },
            ],
          },

          {
            label: "干线保险说明",
            prop: "insuranceDesc",
            overHidden: true,
            type: "textarea",
            rules: [
              {
                required: true,
                message: "请输入干线保险说明",
                trigger: "blur",
              },
            ],
          },
        ],
      },
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      outLineIdList: [],
      outLineInfo: {
        title: "",
        code: "",
      },
      logisticsLineId: null,
      showPop: false,
    };
  },
  computed: {
    ...mapState({
      areaList: (state) => state.logistics.areaList,
      warehouseList: (state) => state.logistics.warehouseList,
      productTypeList: (state) => state.logistics.productTypeList,
    }),
  },
  watch: {
    "warehouseList.length": {
      handler() {
        this.findObject(this.option.column, "warehouseId").dicData = this.warehouseList;
        // console.log(this.warehouseList);
      },
      deep: true,
      immediate: true,
    },
    "productTypeList.length": {
      handler() {
        this.findObject(this.option.column, "nonsupportProductTypeList").dicData =
          this.productTypeList;
        // this.findObject(this.option.column, "logisticsLineType").dicData = this.productTypeList;
        // console.log(this.productTypeList);
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  mounted() {
    this.getLogustucsIds();
    this.getAreaList();
    this.getWarehouseList();
    this.getProductTypeList();
  },
  methods: {
    ...mapActions(["getAreaList", "getWarehouseList", "getProductTypeList"]),
    getLogustucsIds() {
      getLineCodeList().then((res) => {
        this.outLineIdList = res.data.data || [];
      });
    },
    outLineIdChange() {
      if (this.form.outLineId) {
        this.outLineIdList.some((item) => {
          if (item.channelId === this.form.outLineId) {
            this.outLineInfo = item;
            const arr = (item.packageTypeVOList || []).map((child) => child.id);
            this.findObject(this.option.column, "logisticsLineType").dicData =
              item.packageTypeVOList.map((child) => {
                return {
                  label: child.title,
                  value: child.id,
                };
              });
            this.form.logisticsLineType = arr;
            return true;
          }
        });
      } else {
        this.form.logisticsLineType = [];
      }
    },
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    searchReset() {
      this.search = {};
      this.query = {};
      this.onLoad(this.page);
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      this.loading = true;
      const param = {
        pageNo: page.currentPage,
        pageSize: page.pageSize,
        ...Object.assign(params, this.query),
      };
      getList(param).then((res) => {
        if (res && res.data && res.data.data) {
          const data = res.data.data;
          this.page.total = Number(data.total || 0);
          this.data = (data.records || []).map((item) => this.handleData(item));
          this.loading = false;
        }
      });
    },
    handleData(val = {}) {
      val.productSizeDesc = "";
      if (val.productSize) {
        const { weight, length, width, height } = val.productSize;
        weight && (val.productSizeDesc = `重量：${weight}克；`);
        length && (val.productSizeDesc = `${val.productSizeDesc}长度：${length}CM；`);
        width && (val.productSizeDesc = `${val.productSizeDesc}宽度：${width}CM；`);
        height && (val.productSizeDesc = `${val.productSizeDesc}高度：${height}CM；`);
      } else {
        val.productSize = {};
      }
      val.isPrepaidTax = val.isPrepaidTax ?? 0;
      val.packageLengthLimit = val.packageLengthLimit || undefined;
      val.packageWidthLimit = val.packageWidthLimit || undefined;
      val.packageHeightLimit = val.packageHeightLimit || undefined;
      val.packageSideLengthSumLimit = val.packageSideLengthSumLimit || undefined;
      val.packageGirthLimit = val.packageGirthLimit || undefined;
      val.productPriceHandled = convertFenToYuan(val.productPrice, {
        sign: "￥",
      });
      val.productOriginalPriceHandled = convertFenToYuan(val.productOriginalPrice, { sign: "￥" });
      // const arr = (val.packageTypeVOList || []).map((child) => child.id);
      // val.logisticsLineType = arr;
      val.declarationAmountMinLimit = val.declarationAmountMinLimit
        ? (val.declarationAmountMinLimit / 100).toFixed(2)
        : undefined;
      val.declarationAmountMaxLimit = val.declarationAmountMaxLimit
        ? (val.declarationAmountMaxLimit / 100).toFixed(2)
        : undefined;
      if (val.configureInsurance) {
        val.configureInsurance = [1];
      } else {
        val.configureInsurance = [];
      }
      if (val.includeTaxes) {
        val.includeTaxes = [1];
      } else {
        val.includeTaxes = [];
      }
      if (val.useTransportDiscount) {
        val.useTransportDiscount = [1];
      } else {
        val.useTransportDiscount = [];
      }
      return val;
    },
    // 新增
    rowSave(row, done, loading) {
      this.loading = true;
      const params = { ...row };
      if (!params.nonsupportProductTypeList) delete params.nonsupportProductTypeList;
      delete params.outLineId;
      if (params.configureInsurance.length) {
        params.configureInsurance = 1;
      } else {
        params.configureInsurance = 0;
      }
      if (params.includeTaxes.length) {
        params.includeTaxes = 1;
      } else {
        params.includeTaxes = 0;
      }
      if (params.useTransportDiscount.length) {
        params.useTransportDiscount = 1;
      } else {
        params.useTransportDiscount = 0;
      }
      if (params.declarationAmountMinLimit) {
        params.declarationAmountMinLimit = convertYuanToFen(params.declarationAmountMinLimit);
      }
      if (params.declarationAmountMaxLimit) {
        params.declarationAmountMaxLimit = convertYuanToFen(params.declarationAmountMaxLimit);
      }
      if (!params.includeTaxes && !params.taxReportingRatio) {
        this.$message.error("请填写报税比例");
        this.loading = false;
        loading();
        return;
      }
      save(params)
        .then(() => {
          done();
          this.onLoad(this.page);
          this.$message.success("操作成功!");
        })
        .finally(() => {
          loading();
        });
    },
    // 编辑
    rowUpdate(row, index, done, loading) {
      this.loading = true;
      const params = { ...row };
      params.editCanEmpty = true;
      if (!params.nonsupportProductTypeList) delete params.nonsupportProductTypeList;
      delete params.outLineId;
      if (params.configureInsurance.length) {
        params.configureInsurance = 1;
      } else {
        params.configureInsurance = 0;
      }
      if (params.includeTaxes.length) {
        params.includeTaxes = 1;
      } else {
        params.includeTaxes = 0;
      }
      if (params.useTransportDiscount.length) {
        params.useTransportDiscount = 1;
      } else {
        params.useTransportDiscount = 0;
      }
      if (!params.includeTaxes && !params.taxReportingRatio) {
        this.$message.error("请填写报税比例");
        this.loading = false;
        loading();
        return;
      }
      if (params.includeTaxes) {
        params.taxReportingRatio = 0;
      }
      if (params.declarationAmountMinLimit) {
        params.declarationAmountMinLimit = convertYuanToFen(params.declarationAmountMinLimit);
      }
      if (params.declarationAmountMaxLimit) {
        params.declarationAmountMaxLimit = convertYuanToFen(params.declarationAmountMaxLimit);
      }
      // console.log(params);
      // loading();
      // return;
      save(params)
        .then(() => {
          done();
          this.onLoad(this.page);
          this.$message.success("操作成功!");
        })
        .finally(() => {
          loading();
        });
    },
    // 删除
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const param = { logisticsLineId: row.logisticsLineId };
          return remove(param);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message.success("操作成功!");
        });
    },
    // 更新状态
    toUpdateStatus(row) {
      const { logisticsLineStatus } = row;
      // 物流干线状态 0:已停用，1:已启用
      this.$confirm(`是否确认${logisticsLineStatus ? "停用" : "启用"}该物流干线？`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const param = {
            ...row,
            logisticsLineStatus: logisticsLineStatus === 1 ? 0 : 1,
          };
          const { data = {} } = await updateStatus(param);
          if (data.success) {
            this.onLoad(this.page);
            this.$message.success("操作成功!");
          } else {
            this.$message.error(data.msg || "操作失败");
          }
        })
        .catch(() => {});
    },
    // 显示弹窗
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        const param = { logisticsLineId: this.form.logisticsLineId };
        detail(param).then((res) => {
          this.form = this.handleData(res.data.data);
          // this.outLineInfo = res.data.data.info || {};
          this.outLineIdChange();
        });
      }
      done();
    },
    bindLine(item) {
      let title = "绑定外部干线";
      if (item.outLineId) {
        title = "编辑外部干线";
      }
      this.$refs.refBindLineDialog.show({ title, ...item });
    },
    toSetCost(id) {
      this.$router.push(`/logisticsCost/index?id=${id}`);
    },
  },
};
</script>

<style scoped="scoped" lang="scss">
@import "@/styles/flex.scss";
@import "@/styles/commonStyle.scss";

.package-limit {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .label {
    width: 110px;
    text-align: right;
    padding-right: 10px;
    flex-shrink: 0;
  }
}
.package-limit2 {
  .label {
    width: 150px;
  }
}
</style>
