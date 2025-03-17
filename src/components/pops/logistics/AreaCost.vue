<template>
  <div>
    <el-dialog
      title="编辑国家/地区"
      :visible.sync="showPop"
      :close-on-click-modal="false"
      width="70%"
      :before-close="closePop"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        label-width="100px"
        size="small"
        :disabled="loading"
      >
        <el-form-item label="国家/地区" prop="areaLibraryIdList">
          <!-- checkStrictly: true -->
          <el-cascader
            ref="cascader"
            v-model="form.areaLibraryIdList"
            placeholder="请选择"
            :options="areaList"
            :props="{ multiple: true, value: 'id', label: 'areaName' }"
            filterable
            clearable
            @change="changeAreaLibrary"
            style="width: 500px"
          />
        </el-form-item>
        <el-form-item label="说明">{{ instructions }}</el-form-item>
      </el-form>
      <el-button type="primary" icon="el-icon-plus" size="small" @click="toEditWeightCost()"
        >添加重量范围</el-button
      >

      <el-table :data="form.weightCostList" style="width: 100%">
        <el-table-column label="重量范围(g)" prop="weightScope" width="100">
          <template slot-scope="{ row }">
            <div>{{ row.weightMin }} ~ {{ row.weightMax }}</div>
          </template>
        </el-table-column>
        <el-table-column label="开始重量(g)" prop="weightMin" width="100" />
        <el-table-column label="结束重量(g)" prop="weightMax" width="100" />
        <el-table-column label="首重重量(g)" prop="firstWeight" width="100" />
        <el-table-column label="首重费用(￥)" prop="firstWeightPrice" width="120" />
        <el-table-column label="续重重量(g)" prop="additionalWeight" width="100" />
        <el-table-column label="续重费用(￥)" prop="additionalWeightPrice" width="120" />
        <el-table-column
          label="物流商处理费(￥)"
          prop="logisticsProviderProcessingFee"
          width="100"
        />
        <el-table-column label="燃油费(￥)" prop="fuelCost" width="100" />
        <el-table-column label="操作费(￥)" prop="operationFee" width="100" />
        <el-table-column label="服务费(￥)" prop="servicePrice" width="100" />
        <el-table-column label="操作" fixed="right" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toEditWeightCost(scope.row, scope.$index)"
              >编辑</el-button
            >
            <el-button
              v-if="scope.$index + 1 === form.weightCostList.length"
              type="text"
              size="small"
              @click="toDelete(scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer">
        <el-button size="small" @click="closePop">取消</el-button>
        <el-button :disabled="loading" type="primary" size="small" @click="onSubmit"
          >确定</el-button
        >
      </span>
    </el-dialog>
    <WeightCost
      v-if="showWeightCostPop"
      :showPop.sync="showWeightCostPop"
      :weightCostInfo="weightCostInfo"
      :weightMin="weightMin"
      :weightMax="weightMax"
      @submitWeightCost="submitWeightCost"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import cloneDeep from "lodash-es/cloneDeep";
import { calculatePriceTypeMap } from "@/config/commonConfig.js";
import WeightCost from "@/components/pops/logistics/WeightCost.vue";

export default {
  components: { WeightCost },
  props: {
    showPop: {
      type: Boolean,
      default: false,
    },
    areaCostInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      form: {},
      rules: {
        areaLibraryIdList: [
          {
            required: true,
            message: "请选择国家/地区",
            trigger: ["blur", "change"],
          },
        ],
      },
      loading: false,
      calculatePriceTypeMap,
      instructions: null,
      showWeightCostPop: false,
      weightCostInfo: null,
      weightCostIndex: null,
      weightMin: null,
      weightMax: null,
    };
  },
  computed: {
    ...mapState({
      areaList: (state) => state.logistics.areaList,
    }),
  },
  mounted() {
    this.getAreaList();
    this.form = cloneDeep(this.areaCostInfo) || {};
    const { calculatePriceType } = this.form;
    const _calculatePriceType = this.calculatePriceTypeMap.filter(
      (item) => item.value === calculatePriceType,
    );
    this.instructions = _calculatePriceType[0].instructions;
  },
  methods: {
    ...mapActions(["getAreaList"]),
    // 关闭弹窗
    closePop() {
      this.$emit("update:showPop", false);
    },
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          console.log(this.form);

          const { weightCostList } = this.form;
          if (weightCostList && weightCostList.length) {
            this.$emit("submitAreaCost", this.form);
            this.closePop();
          } else {
            this.$message.error("请设置重量范围");
          }
        }
      });
    },
    // 修改【国家/地区】
    changeAreaLibrary() {
      const checkedNodes = this.$refs.cascader.getCheckedNodes();
      const _list = [];
      checkedNodes.forEach((item) => {
        if (item.level === 2) {
          if (item.parent) {
            // 选中某个国家中部分地区
            const childrenName = item.label;
            const childrenId = item.value;
            const parentName = item.parent.label;
            const parentId = item.parent.value;
            const checkedItem = {
              ids: [parentId, childrenId],
              name: `${parentName}/${childrenName}`,
            };
            _list.push(checkedItem);
          }
        } else if (item.level === 1) {
          // 选中某个国家
          const parentName = item.label;
          const parentId = item.value;
          const checkedItem = { ids: [parentId], name: `${parentName}` };
          _list.push(checkedItem);
        }
      });
      console.log(_list);
      this.form.checkedArea = _list;
    },
    // 删除
    toDelete(index) {
      this.$confirm("是否确认删除该数据？", {
        confirmButtonText: "确认",
        cancelButtonText: "我再想想",
        type: "warning",
      })
        .then(() => {
          this.form.weightCostList.splice(index, 1);
        })
        .catch(() => {});
    },
    // 新增/编辑 【重量范围】
    toEditWeightCost(val, index) {
      this.showWeightCostPop = true;
      this.weightCostInfo = val || {};
      this.weightCostIndex = index;

      const { weightCostList } = this.form;
      const l = (weightCostList && weightCostList.length) || 0;
      if (typeof index !== "number") {
        // 新增
        this.weightMin = l ? weightCostList[l - 1].weightMax : null;
        this.weightMax = null;
      } else {
        if (index === 0) {
          this.weightMin = null;
        } else if (l > index + 1) {
          this.weightMin = weightCostList[index].weightMin;
          this.weightMax = weightCostList[index].weightMax;
        } else if (l === index + 1) {
          this.weightMin = weightCostList[index].weightMin;
          this.weightMax = null;
        }
      }
    },
    // 保存【重量范围】编辑
    submitWeightCost(val) {
      const { weightCostIndex } = this;
      const { weightCostList } = this.form;
      if (typeof weightCostIndex === "number") {
        this.$set(this.form.weightCostList, weightCostIndex, val);
      } else {
        if (weightCostList && weightCostList.length) {
          this.form.weightCostList.push(val);
        } else {
          this.form.weightCostList = [val];
        }
      }
    },
  },
  filters: {},
};
</script>

<style lang="scss" scoped>
@import "@/styles/flex.scss";
@import "@/styles/commonStyle.scss";
</style>
