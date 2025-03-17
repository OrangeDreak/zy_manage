<template>
  <basic-container>
    <el-tabs class="mt24" v-model="activeTab" type="card" @tab-click="changeTab">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="item.label"
        :name="item.value"
      />
    </el-tabs>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      :permission="permissionList"
      v-model="form"
      :before-open="beforeOpen"
      @refresh-change="refreshChange"
      @on-load="onLoad"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
    >
      <template slot="growthConditionForm" slot-scope="{ type }">
        <el-input :disabled="type === 'view'" v-model="form.growthCondition"
          ><template slot="append">成长值</template></el-input
        >
      </template>
      <template slot="equityForm" slot-scope="{ type }">
        <!-- <el-input :disabled="type === 'view'" v-model="form.equity"
          ><template slot="append">%</template></el-input
        > -->
        <el-input-number
          v-model="form.equity"
          :min="0"
          :precision="2"
          :disabled="type === 'view'"
          class="my-el-input-number"
          style="width: 100%"
          :controls="false"
          data-unit="%"
        ></el-input-number>
      </template>
      <template slot="pointConditionForm" slot-scope="{ type }">
        <el-input :disabled="type === 'view'" v-model="form.pointCondition"
          ><template slot="append">积分</template></el-input
        >
      </template>
      <template slot="teamUserCountForm" slot-scope="{ type }">
        <el-input :disabled="type === 'view'" v-model="form.teamUserCount"
          ><template slot="append">人</template></el-input
        >
      </template>
      <template slot="commissionRate1Form" slot-scope="{ type }">
        <!-- <el-input :disabled="type === 'view'" v-model="form.commissionRate1"
          ><template slot="append">%</template></el-input
        > -->
        <el-input-number
          v-model="form.commissionRate1"
          :min="0"
          :precision="2"
          :disabled="type === 'view'"
          class="my-el-input-number"
          style="width: 100%"
          :controls="false"
          data-unit="%"
        ></el-input-number>
      </template>
      <template slot="commissionRate2Form" slot-scope="{ type }">
        <!-- <el-input :disabled="type === 'view'" v-model="form.commissionRate2"
          ><template slot="append">%</template></el-input
        > -->
        <el-input-number
          v-model="form.commissionRate2"
          :min="0"
          :precision="2"
          :disabled="type === 'view'"
          class="my-el-input-number"
          style="width: 100%"
          :controls="false"
          data-unit="%"
        ></el-input-number>
      </template>
      <template slot="commissionRate3Form" slot-scope="{ type }">
        <!-- <el-input :disabled="type === 'view'" v-model="form.commissionRate3"
          ><template slot="append">%</template></el-input
        > -->
        <el-input-number
          v-model="form.commissionRate3"
          :min="0"
          :precision="2"
          :disabled="type === 'view'"
          class="my-el-input-number"
          style="width: 100%"
          :controls="false"
          data-unit="%"
        ></el-input-number>
      </template>
      <template slot="pointRate1Form" slot-scope="{ type }">
        <!-- <el-input :disabled="type === 'view'" v-model="form.pointRate1"
          ><template slot="append">%</template></el-input
        > -->
        <el-input-number
          v-model="form.pointRate1"
          :min="0"
          :precision="2"
          :disabled="type === 'view'"
          class="my-el-input-number"
          style="width: 100%"
          :controls="false"
          data-unit="%"
        ></el-input-number>
      </template>
      <template slot="pointRate2Form" slot-scope="{ type }">
        <!-- <el-input :disabled="type === 'view'" v-model="form.pointRate2"
          ><template slot="append">%</template></el-input
        > -->
        <el-input-number
          v-model="form.pointRate2"
          :min="0"
          :precision="2"
          :disabled="type === 'view'"
          class="my-el-input-number"
          style="width: 100%"
          :controls="false"
          data-unit="%"
        ></el-input-number>
      </template>
      <template slot="pointRate3Form" slot-scope="{ type }">
        <!-- <el-input :disabled="type === 'view'" v-model="form.pointRate3"
          ><template slot="append">%</template></el-input
        > -->
        <el-input-number
          v-model="form.pointRate3"
          :min="0"
          :precision="2"
          :disabled="type === 'view'"
          class="my-el-input-number"
          style="width: 100%"
          :controls="false"
          data-unit="%"
        ></el-input-number>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import cloneDeep from "lodash-es/cloneDeep";
import { mapGetters } from "vuex";
import {
  getMemberGradeList,
  getPromotionGradeList,
  getMemberGradeDetail,
  getPromotionGradeDetail,
  addMemberGrade,
  updateMemberGrade,
  deleteMemberGrade,
  addPromotionGrade,
  updatePromotionGrade,
  deletePromotionGrade,
} from "@/api/member/lv";

const columnMemberGrade = [
  {
    label: "等级",
    prop: "grade",
    rules: [{ required: true, message: "请输入会员等级", trigger: "blur" }],
  },
  {
    label: "等级名称",
    prop: "name",
    rules: [{ required: true, message: "请输入等级名称", trigger: "blur" }],
  },
  {
    label: "等级名称(英文)",
    prop: "nameEn",
    rules: [{ required: true, message: "请输入等级名称", trigger: "blur" }],
  },
  {
    label: "等级图片",
    prop: "picture",
    type: "upload",
    listType: "picture-img",
    accept: ".png,.jpg,.jpeg",
    action: "/resource/oss/upload",
    tip: "800*800 像素，仅支持JPG/PNG格式",
    propsHttp: { url: "url", res: "data" },
    rules: [{ required: true, message: "请上传等级图片", trigger: "blur" }],
  },
  {
    label: "获得条件",
    prop: "growthCondition",
    formslot: true,
    rules: [{ required: true, message: "请输入获得条件", trigger: "blur" }],
    html: true,
    formatter: (val) => {
      const growthConditionDeac = val.growthCondition
        ? `成长值满${val.growthCondition}`
        : "注册即得";
      return growthConditionDeac;
    },
  },
  {
    label: "运费折扣",
    prop: "equity",
    formslot: true,
    rules: [{ required: true, message: "请输入运费折扣", trigger: "blur" }],
    formatter: (val) => {
      const equityDeac = val.equity ? `${val.equity}%` : "-";
      return equityDeac;
    },
  },
  {
    label: "会员人数",
    prop: "userCount",
    addDisplay: false,
    editDisplay: false,
  },
  {
    label: "创建时间",
    prop: "gmtCreate",
    addDisplay: false,
    editDisplay: false,
  },
];
const columnPromotionGrade = [
  {
    label: "等级",
    prop: "grade",
    rules: [{ required: true, message: "请输入推广会员等级", trigger: "blur" }],
  },
  {
    label: "等级名称",
    prop: "name",
    rules: [{ required: true, message: "请输入等级名称", trigger: "blur" }],
  },
  {
    label: "等级名称(英文)",
    prop: "nameEn",
    rules: [{ required: true, message: "请输入等级名称", trigger: "blur" }],
  },
  {
    label: "等级图片",
    prop: "picture",
    type: "upload",
    listType: "picture-img",
    action: "/resource/oss/upload",
    accept: ".png,.jpg,.jpeg",
    tip: "800*800 像素，仅支持JPG/PNG格式",
    propsHttp: { url: "url", res: "data" },
    rules: [{ required: true, message: "请上传等级图片", trigger: "blur" }],
  },
  {
    label: "获得条件",
    prop: "pointCondition",
    formslot: true,
    rules: [{ required: true, message: "请输入获得条件", trigger: "blur" }],
    html: true,
    formatter: (val) => {
      const pointConditionDeac = val.pointCondition ? `积分满${val.pointCondition}` : "注册即得";
      return pointConditionDeac;
    },
  },
  {
    label: "提现所需团队人数",
    prop: "teamUserCount",
    width: 140,
    rules: [{ required: true, message: "请输入提现所需团队人数", trigger: "blur" }],
    html: true,
    formatter: (val) => `${val.teamUserCount || 0}人`,
  },
  {
    label: "1级佣金比例",
    prop: "commissionRate1",
    width: 100,
    rules: [{ required: true, message: "请输入1级佣金比例", trigger: "blur" }],
    html: true,
    formatter: (val) => `${val.commissionRate1 || 0}%`,
  },
  // {
  //   label: "2级佣金比例",
  //   prop: "commissionRate2",
  //   width: 100,
  //   rules: [{ required: true, message: "请输入2级佣金比例", trigger: "blur" }],
  //   html: true,
  //   formatter: (val) => `${val.commissionRate2 || 0}%`,
  // },
  // {
  //   label: "3级佣金比例",
  //   prop: "commissionRate3",
  //   width: 100,
  //   rules: [{ required: true, message: "请输入3级佣金比例", trigger: "blur" }],
  //   html: true,
  //   formatter: (val) => `${val.commissionRate3 || 0}%`,
  // },
  {
    label: "1级推广积分比例",
    prop: "pointRate1",
    width: 120,
    rules: [{ required: true, message: "请输入1级推广积分比例", trigger: "blur" }],
    html: true,
    formatter: (val) => `${val.pointRate1 || 0}%`,
  },
  // {
  //   label: "2级推广积分比例",
  //   prop: "pointRate2",
  //   width: 120,
  //   rules: [{ required: true, message: "请输入2级推广积分比例", trigger: "blur" }],
  //   html: true,
  //   formatter: (val) => `${val.pointRate2 || 0}%`,
  // },
  // {
  //   label: "3级推广积分比例",
  //   prop: "pointRate3",
  //   width: 120,
  //   rules: [{ required: true, message: "请输入3级推广积分比例", trigger: "blur" }],
  //   html: true,
  //   formatter: (val) => `${val.pointRate3 || 0}%`,
  // },
  {
    label: "会员人数",
    prop: "userCount",
    addDisplay: false,
    editDisplay: false,
  },
  {
    label: "创建时间",
    prop: "gmtCreate",
    addDisplay: false,
    editDisplay: false,
  },
];

export default {
  components: {},
  data() {
    return {
      form: {},
      loading: true,
      data: [],
      option: {
        viewBtn: true,
        span: 24,
        labelWidth: 140,
        column: cloneDeep(columnMemberGrade),
      },
      activeTab: "1",
      tabList: [
        {
          label: "普通会员",
          value: "1",
          listApi: getMemberGradeList,
          detailApi: getMemberGradeDetail,
          addApi: addMemberGrade,
          updateApi: updateMemberGrade,
          deleteApi: deleteMemberGrade,
        },
        {
          label: "推广会员",
          value: "2",
          listApi: getPromotionGradeList,
          detailApi: getPromotionGradeDetail,
          addApi: addPromotionGrade,
          updateApi: updatePromotionGrade,
          deleteApi: deletePromotionGrade,
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.level_add_edit_del, false),
        delBtn: this.vaildData(this.permission.level_add_edit_del, false),
        editBtn: this.vaildData(this.permission.level_add_edit_del, false),
      };
    },
  },
  created() {},
  methods: {
    changeTab() {
      this.option.column =
        this.activeTab === "1" ? cloneDeep(columnMemberGrade) : cloneDeep(columnPromotionGrade);
      this.onLoad();
    },
    refreshChange() {
      this.onLoad();
    },
    onLoad() {
      this.loading = true;
      const _activeTabInfo = this.getApi();
      _activeTabInfo.listApi().then((res) => {
        if (res && res.data && res.data.data) {
          this.data = (res.data.data || []).map((item) => {
            if (item.commissionRate1) {
              item.commissionRate1 = item.commissionRate1 / 100;
              item.commissionRate2 = item.commissionRate2 / 100;
              item.commissionRate3 = item.commissionRate3 / 100;
              item.pointRate1 = item.pointRate1 / 100;
              item.pointRate2 = item.pointRate2 / 100;
              item.pointRate3 = item.pointRate3 / 100;
            }
            return item;
          });
          this.loading = false;
        }
      });
    },
    // 数据处理
    handleEditData(val, type) {
      const _val = cloneDeep(val);
      delete _val.createTime;
      return _val;
    },
    // 新增
    rowSave(row, done, loading) {
      const _activeTabInfo = this.getApi();
      _activeTabInfo.addApi(this.handleEditData(row)).then(
        () => {
          done();
          this.onLoad(this.page);
          this.$message.success("操作成功!");
        },
        (error) => {
          window.console.log(error);
          loading();
        },
      );
    },
    // 编辑
    rowUpdate(row, index, done, loading) {
      const _activeTabInfo = this.getApi();
      _activeTabInfo.updateApi(this.handleEditData(row, "edit")).then(
        () => {
          done();
          this.onLoad(this.page);
          this.$message.success("操作成功!");
        },
        (error) => {
          window.console.log(error);
          loading();
        },
      );
    },
    // 删除
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const params = { ids: [row.id] };
          const _activeTabInfo = this.getApi();
          return _activeTabInfo.deleteApi(params);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message.success("操作成功!");
        });
    },
    // 显示弹窗
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        const _activeTabInfo = this.getApi();
        _activeTabInfo.detailApi({ id: this.form.id }).then((res) => {
          if (res && res.data && res.data.data) {
            if (res.data.data.commissionRate1) {
              res.data.data.commissionRate1 = res.data.data.commissionRate1 / 100;
              res.data.data.commissionRate2 = res.data.data.commissionRate2 / 100;
              res.data.data.commissionRate3 = res.data.data.commissionRate3 / 100;
              res.data.data.pointRate1 = res.data.data.pointRate1 / 100;
              res.data.data.pointRate2 = res.data.data.pointRate2 / 100;
              res.data.data.pointRate3 = res.data.data.pointRate3 / 100;
            }
            this.form = res.data.data || {};
          }
        });
      }
      done();
    },
    getApi() {
      const { tabList, activeTab } = this;
      const _activeTab = tabList.filter((item) => item.value === activeTab);
      return _activeTab[0];
    },
  },
};
</script>
<style scoped="scoped" lang="scss">
@import "@/styles/flex.scss";
@import "@/styles/commonStyle.scss";
</style>
