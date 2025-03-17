<template>
  <div>
    <el-form
      ref="form"
      :model="logisticsInfo"
      label-width="120px"
      label-position="left"
      size="small"
    >
      <el-form-item label="物流干线名称">
        <div>{{ logisticsInfo.logisticsLineName }}</div>
      </el-form-item>
      <el-form-item label="计价方式" prop="calculatePriceType">
        <el-radio-group v-model="logisticsInfo.calculatePriceType">
          <el-radio v-for="(item, index) in calculatePriceTypeMap" :key="index" :label="item.value">
            <span>{{ item.label }}</span
            ><span class="ml8 fs12 light-gray">({{ item.instructions }})</span>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="体积重量" prop="volumeWeight">
        <el-input v-model="logisticsInfo.volumeWeight" style="width: 200px"
          ><template slot="append">=1kg</template></el-input
        >
      </el-form-item>
    </el-form>
    <div class="btns">
      <el-button type="primary" icon="el-icon-plus" size="small" @click="toEditAreaCost()"
        >添加国家/地区</el-button
      >
      <el-button size="small" :loading="subLoading" type="primary" @click="onSubmit"
        >保存</el-button
      >
    </div>
    <el-table :data="logisticsInfo.logisticsLineCostList" style="width: 100%">
      <el-table-column label="国家/地区" prop="areaLibraryName" />
      <el-table-column label="重量范围(g)" prop="weightScope">
        <template slot-scope="{ row }">
          <div>{{ row.weightMin }} ~ {{ row.weightMax }}</div>
        </template>
      </el-table-column>
      <el-table-column label="首重重量(g)" prop="firstWeight">
        <template slot-scope="scope">
          <el-input
            v-if="editKey === 'firstWeight' + scope.$index"
            v-model="scope.row.firstWeight"
            @blur="editKey = ''"
          ></el-input>
          <div v-else @click="editKey = 'firstWeight' + scope.$index">
            {{ scope.row.firstWeight }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="首重费用(￥)" prop="firstWeightPrice">
        <template slot-scope="scope">
          <el-input
            v-if="editKey === 'firstWeightPrice' + scope.$index"
            v-model="scope.row.firstWeightPrice"
            @blur="editKey = ''"
          ></el-input>
          <div v-else @click="editKey = 'firstWeightPrice' + scope.$index">
            {{ scope.row.firstWeightPrice }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="续重重量(g)" prop="additionalWeight">
        <template slot-scope="scope">
          <el-input
            v-if="editKey === 'additionalWeight' + scope.$index"
            v-model="scope.row.additionalWeight"
            @blur="editKey = ''"
          ></el-input>
          <div v-else @click="editKey = 'additionalWeight' + scope.$index">
            {{ scope.row.additionalWeight }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="续重费用(￥)" prop="additionalWeightPrice">
        <template slot-scope="scope">
          <el-input
            v-if="editKey === 'additionalWeightPrice' + scope.$index"
            v-model="scope.row.additionalWeightPrice"
            @blur="editKey = ''"
          ></el-input>
          <div v-else @click="editKey = 'additionalWeightPrice' + scope.$index">
            {{ scope.row.additionalWeightPrice }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="物流商处理费(￥)" prop="logisticsProviderProcessingFee" width="140">
        <template slot-scope="scope">
          <el-input
            v-if="editKey === 'logisticsProviderProcessingFee' + scope.$index"
            v-model="scope.row.logisticsProviderProcessingFee"
            @blur="editKey = ''"
          ></el-input>
          <div v-else @click="editKey = 'logisticsProviderProcessingFee' + scope.$index">
            {{ scope.row.logisticsProviderProcessingFee }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="燃油费(￥)" prop="fuelCost">
        <template slot-scope="scope">
          <el-input
            v-if="editKey === 'fuelCost' + scope.$index"
            v-model="scope.row.fuelCost"
            @blur="editKey = ''"
          ></el-input>
          <div v-else @click="editKey = 'fuelCost' + scope.$index">
            {{ scope.row.fuelCost }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作费(￥)" prop="operationFee">
        <template slot-scope="scope">
          <el-input
            v-if="editKey === 'operationFee' + scope.$index"
            v-model="scope.row.operationFee"
            @blur="editKey = ''"
          ></el-input>
          <div v-else @click="editKey = 'operationFee' + scope.$index">
            {{ scope.row.operationFee }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="服务费(￥)" prop="servicePrice">
        <template slot-scope="scope">
          <el-input
            v-if="editKey === 'servicePrice' + scope.$index"
            v-model="scope.row.servicePrice"
            @blur="editKey = ''"
          ></el-input>
          <div v-else @click="editKey = 'servicePrice' + scope.$index">
            {{ scope.row.servicePrice }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="toEditAreaCost(scope.row, scope.$index)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="toDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div
      v-if="logisticsInfo.logisticsLineCostList && logisticsInfo.logisticsLineCostList.length > 10"
      class="pagination"
    >
      <el-button size="small" :loading="subLoading" type="primary" @click="onSubmit"
        >保存</el-button
      >
    </div>
    <AreaCost
      v-if="showAreaCostPop"
      :showPop.sync="showAreaCostPop"
      :areaCostInfo="areaCostInfo"
      @submitAreaCost="submitAreaCost"
    />
  </div>
</template>

<script>
import cloneDeep from "lodash-es/cloneDeep";
import { getUrlParamJs, convertFenToYuan, convertYuanToFen } from "@/util/commonUtil.js";
import { calculatePriceTypeMap } from "@/config/commonConfig.js";
import {
  getLogisticsCost,
  saveLogisticsCost,
  delLogisticsCostItem,
} from "@/api/logistics/logistics";
import AreaCost from "@/components/pops/logistics/AreaCost.vue";

export default {
  components: { AreaCost },
  data() {
    return {
      loading: false,
      logisticsLineId: null,
      logisticsInfo: { calculatePriceType: 1 },
      calculatePriceTypeMap,
      showAreaCostPop: false,
      areaCostInfo: null,
      areaCostIndex: null,
      subLoading: false,
      editKey: "",
    };
  },
  computed: {},
  created() {},
  mounted() {
    if (getUrlParamJs("id")) {
      this.logisticsLineId = getUrlParamJs("id");
    }
    this.getDetail();
  },
  methods: {
    async getDetail() {
      this.loading = true;
      const { data = {} } = await getLogisticsCost({
        logisticsLineId: this.logisticsLineId,
      });
      this.loading = false;
      this.logisticsInfo = data.data || {};
      this.logisticsInfo.calculatePriceType = 1;
      const { logisticsLineCostList } = this.logisticsInfo;
      logisticsLineCostList &&
        logisticsLineCostList.forEach((item) => {
          item.firstWeightPrice = convertFenToYuan(item.firstWeightPrice);
          item.additionalWeightPrice = convertFenToYuan(item.additionalWeightPrice);
          item.logisticsProviderProcessingFee = convertFenToYuan(
            item.logisticsProviderProcessingFee,
          );
          item.fuelCost = convertFenToYuan(item.fuelCost);
          item.operationFee = convertFenToYuan(item.operationFee);
          item.servicePrice = convertFenToYuan(item.servicePrice);
        });
    },
    // 删除
    toDelete(index, row) {
      console.log(row);

      if (row.lineCostId) {
        this.$confirm("是否确认该国家下所有数据？", {
          confirmButtonText: "确认",
          cancelButtonText: "我再想想",
          type: "warning",
        })
          .then(() => {
            // 国家维度删除，国家下的城市全部删除
            delLogisticsCostItem({
              logisticsLineId: this.$route.query.id,
              // lineCostId: row.lineCostId,
              countryId: row.areaLibraryIdList[0][0],
            }).then(() => {
              this.$message.success("删除成功");
              this.getDetail();
            });
          })
          .catch(() => {});
      } else {
        this.$confirm("是否确认删除该数据？", {
          confirmButtonText: "确认",
          cancelButtonText: "我再想想",
          type: "warning",
        })
          .then(() => {
            this.logisticsInfo.logisticsLineCostList.splice(index, 1);
            this.$message.success("删除成功");
          })
          .catch(() => {});
      }
    },
    // 新增/编辑 【国家/地区】
    toEditAreaCost(val, index) {
      const { calculatePriceType } = this.logisticsInfo;
      this.showAreaCostPop = true;
      val && (val.weightCostList = [{ ...val }]);
      this.areaCostInfo = { ...val, calculatePriceType };
      this.areaCostIndex = index;
    },
    // 保存【国家/地区】编辑
    submitAreaCost(val) {
      const { areaCostIndex } = this;
      const { logisticsLineCostList } = this.logisticsInfo;
      const { weightCostList, checkedArea, areaLibraryName, areaLibraryIdList } = val;
      const _list = [];
      if (checkedArea && checkedArea.length) {
        checkedArea.forEach((item) => {
          weightCostList.forEach((weightCostItme) => {
            _list.push({
              ...weightCostItme,
              areaLibraryIdList: [item.ids],
              areaLibraryName: item.name,
            });
          });
        });
      } else {
        weightCostList.forEach((weightCostItme) =>
          _list.push({ ...weightCostItme, areaLibraryName, areaLibraryIdList }),
        );
      }
      console.log(_list);

      if (typeof areaCostIndex === "number") {
        const arr2 = logisticsLineCostList.slice(areaCostIndex + 1);
        if (areaCostIndex === 0) {
          this.logisticsInfo.logisticsLineCostList = _list.concat(arr2);
        } else {
          const arr1 = logisticsLineCostList.slice(0, areaCostIndex);
          this.logisticsInfo.logisticsLineCostList = arr1.concat(_list, arr2);
        }
      } else {
        if (logisticsLineCostList && logisticsLineCostList.length) {
          this.logisticsInfo.logisticsLineCostList = logisticsLineCostList.concat(_list);
        } else {
          this.logisticsInfo.logisticsLineCostList = Object.freeze(_list);
        }
      }
    },
    // 保存
    async onSubmit() {
      this.subLoading = true;
      const { logisticsLineCostList } = this.logisticsInfo;
      const _logisticsLineCostList = cloneDeep(logisticsLineCostList);
      _logisticsLineCostList &&
        _logisticsLineCostList.forEach((item) => {
          item.firstWeightPrice = convertYuanToFen(item.firstWeightPrice);
          item.additionalWeightPrice = convertYuanToFen(item.additionalWeightPrice);
          item.logisticsProviderProcessingFee = convertYuanToFen(
            item.logisticsProviderProcessingFee,
          );
          item.fuelCost = convertYuanToFen(item.fuelCost);
          item.operationFee = convertYuanToFen(item.operationFee);
          item.servicePrice = convertYuanToFen(item.servicePrice);
        });
      if (!(logisticsLineCostList && logisticsLineCostList.length)) {
        this.$message.error("请添加国家地区设置运费");
        this.subLoading = false;
        return;
      }


      const param = {
        ...this.logisticsInfo,
        logisticsLineCostList: _logisticsLineCostList,
      };
      // console.log(param);
      // return;
      try {
        const { data = {} } = await saveLogisticsCost(param);
        this.subLoading = false;
        if (data.success) {
          this.$message.success("保存成功!");
          this.$router.push("/logistics/logisticsList");
        } else {
          this.$message.error(data.msg || "操作失败");
        }
      } catch (e) {
        this.subLoading = false;
      }
    },
  },
};
</script>

<style scoped="scoped" lang="scss">
@import "@/styles/flex.scss";
@import "@/styles/commonStyle.scss";
@import '@smallwei/avue/lib/index.css';
.btns {
  display: flex;
  justify-content: space-between;
}
</style>
