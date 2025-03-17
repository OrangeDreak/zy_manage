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
      <template slot="status" slot-scope="{ row }">
        <el-switch
          v-model="row.status"
          active-color="#13ce66"
          :active-value="0"
          :inactive-value="1"
          @change="statusChange(row)"
        >
        </el-switch>
        {{ row.status ? "已停用" : "已启用" }}
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {
  articleCategoryList,
  articleCategoryDel,
  articleCategoryEdit,
  articleCategoryAdd,
} from "@/api/operate/article";

export default {
  components: {},
  data() {
    return {
      form: {},
      search: {},
      loading: true,
      data: [],
      option: {
        searchMenuSpan: 6,
        labelWidth: 140,
        searchLabelWidth: 100,

        searchMenuPosition: "right",
        menuWidth: 180,
        column: [
          {
            label: "栏目名称",
            prop: "name",
            rules: [
              { required: true, message: "请输入栏目名称", trigger: "blur" },
            ],
            search: true,
          },
          {
            label: "类型",
            prop: "type",
            type: "select",
            editDisplay: false,
            dicData: [
              { label: "文章", value: 0 },
              { label: "协议", value: 1 },
            ],
            rules: [
              { required: true, message: "请选择栏目类型", trigger: "blur" },
            ],
          },
          {
            label: "语言",
            type: "select",
            prop: "language",
            rules: [{ required: true, message: "请选择语言", trigger: "blur" }],
            dicData: [
              { label: "zh", value: 0 },
              { label: "en", value: 1 },
            ],
            formatter: (val) => val.languageEnName,
          },
          {
            label: "创建时间",
            prop: "gmtCreate",
            overHidden: true,
            addDisplay: false,
            editDisplay: false,
          },
          {
            label: "序号",
            prop: "sort",
            type: "number",
            min: 0,
            precision: 0,
            rules: [{ required: true, message: "请输入序号", trigger: "blur" }],
          },
          {
            label: "状态",
            prop: "status",
            type: "radio",
            value: 1,
            search: true,
            rules: [{ required: true, message: "请选择状态", trigger: "blur" }],
            dicData: [
              { label: "已停用", value: 1 },
              { label: "已启用", value: 0 },
            ],
            formatter: (val) => val.statusName,
          },
        ],
      },
      query: {},
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
    };
  },
  computed: {
    ...mapState({
      regionList: (state) => state.logistics.regionList,
    }),
  },
  mounted() {
    this.getRegionList();
  },
  methods: {
    ...mapActions(["getRegionList"]),
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    searchReset() {
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
        current: page.currentPage,
        size: page.pageSize,
        ...Object.assign(params, this.query),
      };
      articleCategoryList(param).then((res) => {
        if (res && res.data && res.data.data) {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
        }
      });
    },
    // 新增
    rowSave(row, done, loading) {
      articleCategoryAdd(row).then(
        () => {
          done();
          this.onLoad(this.page);
          this.$message.success("操作成功!");
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    // 编辑
    rowUpdate(row, index, done, loading) {
      articleCategoryEdit(row).then(
        () => {
          done();
          this.onLoad(this.page);
          this.$message.success("操作成功!");
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    // 删除
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        articleCategoryDel({ ids: [row.id] }).then(() => {
          this.$message.success("删除成功!");
          this.page.currentPage = 1;
          this.onLoad(this.page);
        });
      });
    },
    // 更新状态
    statusChange(row) {
      this.$confirm(`是否确认${row.status === 0 ? "启用" : "停用"}该栏目？`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          articleCategoryEdit(row)
            .then(() => {
              this.onLoad(this.page);
              this.$message.success("操作成功!");
            })
            .catch(() => {
              row.status = row.status === 1 ? 0 : 1;
            });
        })
        .catch(() => {
          row.status = row.status === 1 ? 0 : 1;
        });
    },
    // 显示弹窗
    beforeOpen(done, type) {
      done();
    },
  },
};
</script>

<style lang="scss" scoped></style>
