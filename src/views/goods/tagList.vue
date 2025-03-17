<template>
  <basic-container>
    <avue-crud :option="option" :table-loading="loading" :data="data" :search.sync="search" v-model="form" :page="page"
      :row-style="rowStyle" :before-open="beforeOpen" :before-close="beforeClose" @row-del="rowDel"
      @row-update="rowUpdate" @row-save="rowSave" @search-change="searchChange" @search-reset="searchReset"
      @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad"/>
  </basic-container>
</template>

<script>
import cloneDeep from 'lodash-es/cloneDeep';
import { getList, remove, add, update, detail } from "@/api/goods/tag";

const labelTypeMap = [{ label: "普通标签", value: 1 }];
const labelTypeMapAll = [{ label: "系统标签", value: 0 }, { label: "普通标签", value: 1 }];

export default {
  components: { },
  data() {
    return {
      form: {},
      search: {},
      loading: true,
      data: [],
      option: {
        viewBtn: true,
        labelWidth: 150,
        searchMenuPosition: 'right',
        searchMenuSpan: 12,
        searchLabelWidth: 100,
        column: [
          { label: "标签id", prop: "id", addDisplay: false, editDisabled: true },
          {
            label: "标签名称",
            prop: "name",
            search: true,
            rules: [{ required: true, message: "请输入标签名称", trigger: "blur" }]
          },
          {
            label: "标签编码",
            prop: "code",
            rules: [{ required: true, message: "请输入标签编码", trigger: "blur" }]
          },
          {
            label: "标签描述",
            prop: "description",
            overHidden: true,
            rules: [{ required: true, message: "请输入标签描述", trigger: "blur" }]
          },
          {
            label: "标签类型",
            prop: "labelType",
            search: true,
            type: "select",
            dicData: labelTypeMapAll,
            rules: [{ required: true, message: "请选择标签类型", trigger: "blur" }],
            control: (val, form) => {
              if (val === 2) {
                return {
                  startTime: { display: true },
                  endTime: { display: true }
                }
              } else {
                return {
                  startTime: { display: false },
                  endTime: { display: false }
                }
              }
            },
          },
          {
            label: "创建时间",
            prop: "gmtCreate",
            addDisplay: false,
            editDisplay: false,
          },
        ]
      },
      query: {},
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
    };
  },
  created() { },
  methods: {
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
      }
      getList(param).then(res => {
        if (res && res.data && res.data.data) {
          const data = res.data.data;
          this.page.total = Number(data.total || 0);
          this.data = data.records;
          this.loading = false;
        }
      });
      const columnLabelType = this.findObject(this.option.column, "labelType");
      columnLabelType.dicData = labelTypeMapAll;
    },
    // 操作列按钮显隐控制
    rowStyle(column) {
      this.option.editBtn = !!column.row.labelType;
    },
    // 数据处理
    handleEditData(val) {
      const _val = cloneDeep(val);
      if (_val.labelType !== 2) {
        _val.startTime = null;
        _val.endTime = null;
      }
      if (!_val.id) delete _val.id;
      delete _val.gmtCreate;
      return _val;
    },
    // 新增
    rowSave(row, done, loading) {
      add(this.handleEditData(row)).then(() => {
        done();
        this.onLoad(this.page);
        this.$message.success('操作成功!');
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    // 编辑
    rowUpdate(row, index, done, loading) {
      update(this.handleEditData(row)).then(() => {
        done();
        this.onLoad(this.page);
        this.$message.success('操作成功!');
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    // 删除
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = { ids: [row.id] };
          return remove(params);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message.success('操作成功!');
        });
    },
    // 显示弹窗
    beforeOpen(done, type) {
      const columnLabelType = this.findObject(this.option.column, "labelType");
      if (["edit", "add"].includes(type)) {
        columnLabelType.dicData = labelTypeMap;
      } else {
        columnLabelType.dicData = labelTypeMapAll;
      }
      if (["edit", "view"].includes(type)) {
        detail({ id: this.form.id }).then(res => {
          if (res && res.data && res.data.data) {
            this.form = res.data.data || {};
          }
        });
      }
      done();
    },
    // 关闭弹窗
    beforeClose(done, type) {
      const columnLabelType = this.findObject(this.option.column, "labelType");
      columnLabelType.dicData = labelTypeMapAll;
      done();
    },
  }
};
</script>

<style lang="scss" scoped>
</style>
