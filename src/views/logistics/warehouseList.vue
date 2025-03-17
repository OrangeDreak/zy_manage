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
        <el-form :model="search" :size="size" label-width="100px">
          <el-form-item label="覆盖区域:" :key="1">
            <el-cascader
              v-model="search.areaCodeList"
              placeholder="请选择"
              :options="regionList"
              :props="{ multiple: true, value: 'code', label: 'name' }"
              filterable
              clearable
            />
          </el-form-item>
        </el-form>
      </template>
      <template slot="areaCodeListForm" slot-scope="{ type }">
        <el-cascader
          :disabled="type === 'view'"
          v-model="form.areaCodeList"
          placeholder="请选择"
          :options="regionList"
          :props="{ value: 'code', label: 'name' }"
          filterable
          clearable
        />
      </template>
      <template slot-scope="{ row }" slot="menu">
        <!-- 0:已停用，1:已启用 -->
        <el-button
          type="text"
          icon="el-icon-refresh"
          size="small"
          @click.stop="updateStatus(row)"
          >{{ row.warehouseAddressStatus ? "停用" : "启用" }}</el-button
        >
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { getWarehouseList, remove, add, update, detail } from "@/api/logistics/warehouse";
import { isvalidatemobile } from "@/util/validate";

export default {
  name: "WarehouseList",
  components: {},
  data() {
    const validatePhone = (rule, value, callback) => {
      if (isvalidatemobile(value)[0]) {
        callback(new Error(isvalidatemobile(value)[1]));
      } else {
        callback();
      }
    };
    return {
      form: {},
      search: {},
      loading: true,
      data: [],
      option: {
        searchMenuSpan: 12,
        labelWidth: 140,
        searchLabelWidth: 100,
        viewBtn: true,
        searchMenuPosition: "right",
        menuWidth: 180,
        column: [
          {
            label: "姓",
            prop: "firstName",
            hide: true,
            rules: [{ required: true, message: "请输入仓库名称", trigger: "blur" }],
          },
          {
            label: "名",
            prop: "lastName",
            hide: true,
            rules: [{ required: true, message: "请输入仓库名称", trigger: "blur" }],
          },
          {
            label: "手机号",
            prop: "mobile",
            hide: true,
            rules: [{ required: true, validator: validatePhone, trigger: "blur" }],
          },
          {
            label: "仓库id",
            prop: "id",
            addDisplay: false,
            editDisabled: true,
          },
          {
            label: "仓库名称",
            prop: "name",
            search: true,
            rules: [{ required: true, message: "请输入仓库名称", trigger: "blur" }],
          },
          {
            label: "仓库地址",
            prop: "areaCodeList",
            rules: [{ required: true, message: "请选择仓库地址", trigger: "blur" }],
            html: true,
            formatter: (val) => val.warehouseAddress,
          },
          {
            label: "邮编",
            prop: "postcode",
            overHidden: true,
            rules: [{ required: true, message: "请输入邮编", trigger: "blur" }],
          },
          {
            label: "详细地址",
            prop: "address",
            type: "textarea",
            hide: true,
          },
          {
            label: "状态",
            prop: "warehouseAddressStatus",
            type: "select",
            search: true,
            dicData: [
              { label: "已停用", value: 0 },
              { label: "已启用", value: 1 },
            ],
            addDisplay: false,
            editDisplay: false,
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
      getWarehouseList(param).then((res) => {
        if (res && res.data && res.data.data) {
          const data = res.data.data;
          this.page.total = Number(data.total || 0);
          this.data = data.records;
          this.loading = false;
        }
      });
    },
    // 新增
    rowSave(row, done, loading) {
      add(row).then(
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
      add(row).then(
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
          const params = { id: row.id };
          return remove(params);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message.success("操作成功!");
        });
    },
    // 更新状态
    updateStatus(row) {
      const { id, warehouseAddressStatus } = row;
      this.$confirm(`是否确认${warehouseAddressStatus ? "停用" : "启用"}该仓库？`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const param = {
            id,
            warehouseAddressStatus: warehouseAddressStatus === 1 ? 0 : 1,
          };
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
    // 显示弹窗
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        detail({ id: this.form.id }).then((res) => {
          if (res && res.data && res.data.data) {
            this.form = res.data.data || {};
          }
        });
      }
      done();
    },
  },
};
</script>

<style lang="scss" scoped></style>
