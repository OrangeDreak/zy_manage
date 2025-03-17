<template>
  <basic-container>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      ref="crud"
      :permission="permissionList"
      :search.sync="search"
      :page="page"
      @row-del="rowDel"
      @search-change="searchChange"
      @search-reset="searchReset"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template slot="menuLeft">
        <el-button
          v-if="permission.level_add_edit_del"
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="
            showEditPop = true;
            rowId = '';
          "
          >新 增</el-button
        >
      </template>
      <template slot-scope="{ row }" slot="menu">
        <el-button
          v-if="permission.level_add_edit_del"
          type="text"
          icon="el-icon-edit"
          size="small"
          @click.stop="
            showEditPop = true;
            rowId = row.id;
          "
          >修 改</el-button
        >
        <!-- 0开启；1关闭 -->
        <el-button
          v-if="permission.level_add_edit_del"
          type="text"
          icon="el-icon-refresh"
          size="small"
          @click.stop="updateStatus(row)"
          >{{ row.status ? "开启" : "关闭" }}</el-button
        >
      </template>
    </avue-crud>
    <PointsEdit
      v-if="showEditPop"
      :showPop.sync="showEditPop"
      :rowId="rowId"
      @onSubmit="refreshChange"
    />
  </basic-container>
</template>

<script>
import { getList, remove, update } from "@/api/member/points";
import PointsEdit from "@/components/pops/points/PointsEdit.vue";
import { pointsTypeMap } from "@/config/commonConfig.js";
import { mapGetters } from "vuex";

export default {
  components: { PointsEdit },
  data() {
    return {
      rowId: null,
      search: {},
      loading: true,
      query: {},
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      option: {
        height: "auto",
        calcHeight: 210,
        searchShow: true,
        searchMenuSpan: 6,
        span: 24,
        tip: false,
        addBtn: false,
        editBtn: false,
        column: [
          { label: "规则ID", prop: "id" },
          {
            label: "规则名称",
            prop: "name",
            search: true,
            rules: [{ required: true, message: "请输入规则名称", trigger: "blur" }],
          },
          {
            label: "积分类型",
            prop: "type",
            type: "select",
            search: true,
            dicData: pointsTypeMap,
          },
          {
            label: "奖励比例",
            prop: "rate",
            html: true,
            formatter: (val) => `${(val.rate || 0) / 100}%`,
          },
          { label: "规则有效期", prop: "expiryDate" },
          {
            label: "规则状态",
            prop: "status",
            type: "select",
            search: true,
            dicData: [
              { label: "开启", value: 0 },
              { label: "关闭", value: 1 },
            ],
          },
          {
            label: "创建时间",
            prop: "gmtCreate",
            addDisplay: false,
            editDisplay: false,
          },
        ],
      },
      data: [],
      showEditPop: false,
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
  methods: {
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
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
        current: page.currentPage,
        size: page.pageSize,
        ...Object.assign(params, this.query),
      };
      getList(param).then((res) => {
        if (res && res.data && res.data.data) {
          const data = res.data.data;
          this.page.total = Number(data.total || 0);
          this.data = data.records;
          this.loading = false;
        }
      });
    },
    // 点击【删除】
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove({ ids: [row.id] });
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
    },
    updateStatus(row) {
      const { status } = row;
      // status状态 0开启；1关闭
      this.$confirm(`是否确认${status ? "开启" : "关闭"}该规则？`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const param = { ...row, status: status === 1 ? 0 : 1 };
          const { data = {} } = await update(param);
          if (data.success) {
            this.onLoad(this.page);
            this.$message.success("操作成功!");
          } else {
            this.$message.error(data.msg || "操作失败");
          }
        })
        .catch(() => {});
    },
  },
};
</script>
