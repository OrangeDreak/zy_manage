<template>
  <el-dialog
    title="运费测算"
    :close-on-click-modal="false"
    :visible.sync="showPop"
    width="50%"
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
        <el-cascader
          v-model="form.areaLibraryIdList"
          placeholder="请选择"
          :options="areaList"
          :props="{ checkStrictly: true, value: 'id', label: 'areaName' }"
          filterable
          clearable
        />
      </el-form-item>
      <el-form-item label="重量" prop="weight">
        <el-input v-model="form.weight" placeholder="请输入" clearable style="width: 180px">
          <template slot="append">g</template>
        </el-input>
      </el-form-item>
      <el-form-item label="长" prop="length">
        <el-input v-model="form.length" placeholder="请输入" clearable style="width: 180px">
          <template slot="append">cm</template>
        </el-input>
      </el-form-item>
      <el-form-item label="宽" prop="width">
        <el-input v-model="form.width" placeholder="请输入" clearable style="width: 180px">
          <template slot="append">cm</template>
        </el-input>
      </el-form-item>
      <el-form-item label="高" prop="height">
        <el-input v-model="form.height" placeholder="请输入" clearable style="width: 180px">
          <template slot="append">cm</template>
        </el-input>
      </el-form-item>
      <el-form-item label=" ">
        <el-button size="small" @click="onClean">一键重置</el-button>
      </el-form-item>
    </el-form>
    <div class="fs12">运费计算规则：运费=首重费用+（包裹重量-首重）/ 续重单位重量*单价+服务费</div>
    <div v-if="freightPrice" class="fs18 fw6 mt20">测算结果：{{ freightPrice }}</div>
    <span slot="footer">
      <el-button size="small" @click="closePop">取消</el-button>
      <el-button :disabled="loading" type="primary" size="small" @click="onSubmit">{{
        freightPrice ? "重新测算" : "开始测算"
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import cloneDeep from "lodash-es/cloneDeep";
import { convertFenToYuan } from "@/util/commonUtil.js";
import { calculate, getListArea } from "@/api/logistics/logistics";

export default {
  components: {},
  props: {
    showPop: {
      type: Boolean,
      default: false,
    },
    logisticsLineId: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      form: {},
      rules: {
        areaLibraryIdList: [
          { required: true, message: "请选择国家地区", trigger: ["blur", "change"] },
        ],
        weight: [{ required: true, message: "请输入重量", trigger: ["blur", "change"] }],
        length: [{ required: true, message: "请输入长度", trigger: ["blur", "change"] }],
        width: [{ required: true, message: "请输入宽度", trigger: ["blur", "change"] }],
        height: [{ required: true, message: "请输入高度", trigger: ["blur", "change"] }],
      },
      loading: false,
      freightPrice: null,
      areaList: [],
    };
  },
  computed: {},
  mounted() {
    this.getAreaList();
  },
  methods: {
    // 查询配置的【国家区域】
    async getAreaList() {
      const { logisticsLineId } = this;
      try {
        const { data = {} } = await getListArea({ logisticsLineId });
        if (!data.success) return;
        if (data.data) {
          let _entry = data.data;
          _entry.forEach((item) => {
            if (!(item.children && item.children.length)) {
              delete item.children;
            } else {
              item.children.forEach((children) => {
                if (!(children.children && children.children.length)) {
                  delete children.children;
                }
              });
            }
          });
          this.areaList = _entry || [];
        }
      } catch (error) {
        console.log(error);
      }
    },
    onClean() {
      this.$refs.form.resetFields();
      this.freightPrice = null;
    },
    // 关闭弹窗
    closePop() {
      this.$emit("update:showPop", false);
    },
    onSubmit() {
      // this.handleData();
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          const param = this.handleData();
          try {
            const { data = {} } = await calculate(param);
            this.loading = false;
            if (data.success && data.data) {
              const { freightPrice } = data.data;
              this.freightPrice = convertFenToYuan(freightPrice, { sign: "￥" });
            } else {
              this.freightPrice = null;
              this.$message.error(data.msg || "网络异常，请稍后再试");
            }
          } catch {
            this.loading = false;
          }
        }
      });
    },
    handleData() {
      const { logisticsLineId, form } = this;
      const { areaLibraryIdList } = form;
      const _form = cloneDeep(form);
      if (areaLibraryIdList && areaLibraryIdList.length) {
        _form.areaLibraryId = areaLibraryIdList[areaLibraryIdList.length - 1];
        delete _form.areaLibraryIdList;
      }
      const param = { logisticsLineId, ..._form };
      return param;
    },
  },
  filters: {},
};
</script>

<style lang="scss" scoped>
@import "@/styles/flex.scss";
@import "@/styles/commonStyle.scss";
</style>
