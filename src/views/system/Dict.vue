<template>
  <div class="basic-container">
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      ref="crud"
      v-model="form"
      :before-open="beforeOpen"
      :before-close="beforeClose"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @on-load="onLoad"
    >
      <template #menu="data, index">
        <el-button
          type="text"
          icon="el-icon-circle-plus-outline"
          size="small"
          @click.stop="handleAdd(data.row)"
          >新增子项
        </el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { add, getDict, getDictTree, getList, remove, update } from "@/api/dict";
import '@smallwei/avue/lib/index.css'

export default {
  data() {
    return {
      form: {},
      selectionList: [],
      loading: true,
      query: {},
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      option: {
        searchShow: true,
        searchMenuSpan: 6,
        tip: false,
        tree: true,
        border: true,
        index: true,
        selection: false,
        viewBtn: true,
        menuWidth: 300,
        column: [
          {
            label: "字典编号",
            prop: "code",
            search: true,
            span: 24,
            rules: [
              {
                required: true,
                message: "请输入字典编号",
                trigger: "blur",
              },
            ],
          },
          {
            label: "字典名称",
            prop: "dictValue",
            search: true,
            rules: [
              {
                required: true,
                message: "请输入字典名称",
                trigger: "blur",
              },
            ],
          },
          {
            label: "上级字典",
            prop: "parentId",
            type: "tree",
            dicData: [],
            hide: true,
            props: {
              label: "title",
            },
            rules: [
              {
                required: false,
                message: "请选择上级字典",
                trigger: "click",
              },
            ],
          },
          {
            label: "字典键值",
            prop: "dictKey",
            type: "number",
            rules: [
              {
                required: true,
                message: "请输入字典键值",
                trigger: "blur",
              },
            ],
          },
          {
            label: "字典排序",
            prop: "sort",
            type: "number",
            rules: [
              {
                required: true,
                message: "请输入字典排序",
                trigger: "blur",
              },
            ],
          },
          {
            label: "字典备注",
            prop: "remark",
            search: true,
            span: 24,
            hide: true,
          },
        ],
      },
      data: [],
    };
  },
  computed: {
    ids() {
      let ids = [];
      this.selectionList.forEach((ele) => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
  },
  methods: {
    handleAdd(row) {
      this.$refs.crud.option.column.filter((item) => {
        if (item.prop === "code") {
          item.value = row.code;
          item.addDisabled = true;
        }
        if (item.prop === "parentId") {
          item.value = row.id;
          item.addDisabled = true;
        }
      });
      this.$refs.crud.rowAdd();
    },
    rowSave(row, done, loading) {
      add(row).then(
        () => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        },
        (error) => {
          window.console.log(error);
          loading();
        },
      );
    },
    rowUpdate(row, index, done, loading) {
      update(row).then(
        () => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        },
        (error) => {
          window.console.log(error);
          loading();
        },
      );
    },
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
    },
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
    selectionChange(list) {
      this.selectionList = list;
    },
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        getDict(this.form.id).then((res) => {
          this.form = res.data;
        });
      }
      done();
    },
    beforeClose(done, type) {
       this.$refs.crud.option.column.filter((item) => {
               if (item.prop === "code") {
                 item.value = '';
                 item.addDisabled = false;
               }
               if (item.prop === "parentId") {
                 item.value = '';
                 item.addDisabled = false;
               }
             });
       done();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad(page, params = {}) {
      this.loading = true;
      getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then((res) => {
        this.data = res.data;
        this.loading = false;
        getDictTree().then((res) => {
          const column = this.findObject(this.option.column, "parentId");
          column.dicData = res.data;
        });
      });
    },
  },
};
</script>

<style></style>
