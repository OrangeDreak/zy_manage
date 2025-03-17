<template>
  <basic-container>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      ref="crud"
      v-model="form"
      :permission="permissionList"
      :search.sync="search"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      :before-open="beforeOpen"
      :page="page"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template slot="status" slot-scope="{ row }">
        <el-switch
          size="small"
          v-model="row.status"
          :active-value="1"
          :inactive-value="2"
          @change="handleEditStatus(row)"
          >删 除</el-switch
        >
      </template>
      <template slot="menuLeft">
        <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          plain
          v-if="permission.user_delete"
          @click="handleDelete"
          >删 除
        </el-button>
        <el-button
          type="info"
          size="small"
          plain
          v-if="userInfo.authority.includes('admin')"
          icon="el-icon-user"
          @click="handleGrant"
          >角色配置
        </el-button>
        <el-button
          type="primary"
          size="small"
          plain
          v-if="permission.user_reset"
          icon="el-icon-refresh"
          @click="handleReset"
          >密码重置
        </el-button>
        <el-button
          type="success"
          size="small"
          plain
          v-if="userInfo.authority.includes('admin')"
          icon="el-icon-upload2"
          @click="handleImport"
          >导入
        </el-button>
        <el-button
          type="warning"
          size="small"
          plain
          v-if="userInfo.authority.includes('admin')"
          icon="el-icon-download"
          @click="handleExport"
          >导出
        </el-button>
      </template>
      <template slot-scope="{ row }" slot="roleId">
        <el-tag>{{ row.roleName }}</el-tag>
      </template>
      <template slot-scope="{ row }" slot="deptId">
        <el-tag>{{ row.deptName }}</el-tag>
      </template>
    </avue-crud>
    <el-dialog title="用户角色配置" append-to-body :visible.sync="roleBox" width="345px">
      <el-tree
        :data="roleGrantList"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="treeRole"
        :default-checked-keys="roleTreeObj"
        :props="props"
      >
      </el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="roleBox = false">取 消</el-button>
        <el-button type="primary" @click="submitRole">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="用户数据导入" append-to-body :visible.sync="excelBox" width="555px">
      <avue-form :option="excelOption" v-model="excelForm" :upload-after="uploadAfter">
        <template slot="excelTemplate">
          <el-button type="primary" @click="handleTemplate()">
            点击下载<i class="el-icon-download el-icon--right"></i>
          </el-button>
        </template>
      </avue-form>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  getList,
  getUser,
  remove,
  update,
  add,
  grant,
  resetPassword,
  exportFile,
} from "@/api/system/user";
import { getDeptTree } from "@/api/system/dept";
import { getRoleTree } from "@/api/system/role";
import { mapGetters } from "vuex";
import { getToken } from "@/util/auth";
import { isvalidatemobile } from "@/util/validate";
import { exportExcel } from "@/util/export";
import * as XLSX from "xlsx";

export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
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
      roleBox: false,
      excelBox: false,
      loading: true,
      selectionList: [],
      query: {},
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      init: {
        roleTree: [],
        deptTree: [],
      },
      props: {
        label: "title",
        value: "key",
      },
      roleGrantList: [],
      roleTreeObj: [],
      option: {
        height: "auto",
        calcHeight: 210,
        searchShow: true,
        searchMenuPosition: "right",
        searchMenuSpan: 24,
        span: 24,
        tip: false,
        border: true,
        index: true,
        selection: true,
        viewBtn: true,
        column: [
          {
            label: "登录账号",
            prop: "nickname",
            search: true,
            rules: [
              {
                required: true,
                message: "请输入登录账号",
                trigger: "blur",
              },
            ],
          },
          {
            label: "密码",
            prop: "password",
            value: 123456,
            hide: true,
            editDisplay: false,
            viewDisplay: false,
            rules: [{ required: true, validator: validatePass, trigger: "blur" }],
          },
          // {
          //   label: "用户昵称",
          //   prop: "name",
          //   rules: [{
          //     required: true,
          //     message: "请输入用户昵称",
          //     trigger: "blur"
          //   }]
          // },
          {
            label: "用户姓名",
            prop: "realName",
            search: true,
            rules: [
              {
                required: true,
                message: "请输入用户姓名",
                trigger: "blur",
              },
            ],
          },
          {
            label: "手机号码",
            prop: "phone",
            overHidden: true,
            rules: [{ required: true, validator: validatePhone, trigger: "blur" }],
          },
          {
            label: "所属角色",
            prop: "roleId",
            multiple: true,
            type: "tree",
            dicData: [],
            props: {
              label: "title",
            },
            slot: true,
            checkStrictly: true,
            search: true,
            searchType: "select",
            searchMultiple: false,
            rules: [
              {
                required: true,
                message: "请选择所属角色",
                trigger: "click",
              },
            ],
          },
          {
            label: "所属部门",
            prop: "deptId",
            type: "tree",
            multiple: true,
            dicData: [],
            props: {
              label: "title",
            },
            slot: true,
            checkStrictly: true,
            rules: [
              {
                required: true,
                message: "请选择所属部门",
                trigger: "click",
              },
            ],
          },
          {
            label: "微信号",
            prop: "wxCode",
            hide: true,
            overHidden: true,
          },
          {
            label: "工号",
            prop: "code",
            hide: true,
          },
          {
            label: "电子邮箱",
            prop: "email",
            hide: true,
            overHidden: true,
          },
          {
            label: "用户性别",
            prop: "sex",
            type: "select",
            dicData: [
              {
                label: "男",
                value: 1,
              },
              {
                label: "女",
                value: 2,
              },
              {
                label: "未知",
                value: 3,
              },
            ],
            hide: true,
          },
          {
            label: "用户生日",
            type: "date",
            prop: "birthday",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            hide: true,
          },
          {
            label: "账号状态",
            prop: "status",
            type: "select",
            search: true,
            dicData: [
              {
                label: "启用",
                value: 1,
              },
              {
                label: "禁用",
                value: 2,
              },
            ],
            addDisplay: false,
            editDisplay: false,
            slot: true,
          },
          {
            label: "操作人",
            prop: "createUsername",
            addDisplay: false,
            editDisplay: false,
          },
          {
            label: "创建时间",
            prop: "createTime",
            addDisplay: false,
            editDisplay: false,
          },
        ],
      },
      data: [],
      excelForm: {},
      excelOption: {
        submitBtn: false,
        emptyBtn: false,
        column: [
          {
            label: "模板上传",
            prop: "excelFile",
            type: "upload",
            drag: true,
            loadText: "模板上传中，请稍等",
            span: 24,
            propsHttp: {
              res: "data",
            },
            tip: "请上传 .xls,.xlsx 标准格式文件",
            action: "/blade-user/import-user",
          },
          {
            label: "模板下载",
            prop: "excelTemplate",
            formslot: true,
            span: 24,
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["userInfo", "permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.user_add, false),
        viewBtn: this.vaildData(this.permission.user_view, false),
        delBtn: this.vaildData(this.permission.user_delete, false),
        editBtn: this.vaildData(this.permission.user_edit, false),
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach((ele) => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
  },
  methods: {
    submitRole() {
      const roleList = this.$refs.treeRole.getCheckedKeys().join(",");
      grant(this.ids, roleList).then(() => {
        this.roleBox = false;
        this.$message({
          type: "success",
          message: "操作成功!",
        });
        this.onLoad(this.page);
      });
    },
    rowSave(row, done, loading) {
      row.deptId = typeof row.deptId === "string" ? row.deptId : row.deptId.join(",");
      row.roleId = typeof row.roleId === "string" ? row.roleId : row.roleId.join(",");
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
      row.deptId = typeof row.deptId === "string" ? row.deptId : row.deptId.join(",");
      row.roleId = typeof row.roleId === "string" ? row.roleId : row.roleId.join(",");
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
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.$refs.crud.toggleSelection();
        });
    },
    handleReset() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择账号密码重置为123456?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return resetPassword(this.ids);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.$refs.crud.toggleSelection();
        });
    },
    handleGrant() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.roleTreeObj = [];
      if (this.selectionList.length === 1) {
        this.roleTreeObj = this.selectionList[0].roleId.split(",");
      }
      getRoleTree().then((res) => {
        this.roleGrantList = res.data.data;
        this.roleBox = true;
      });
    },
    handleImport() {
      this.excelBox = true;
    },
    uploadAfter(res, done, loading, column) {
      window.console.log(column);
      done();
      this.excelBox = false;
      this.refreshChange();
    },
    handleExport() {
      this.$confirm("是否导出用户数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        exportFile(
          `/api/blade-user/export-user?blade-auth=${getToken()}&nickname=${
            this.search.nickname
          }&realName=${this.search.realName}`,
        )
          .then((response) => {
            exportExcel(response);
          })
          .catch((error) => {
            console.error("Error fetching or processing Excel data:", error);
          });
      });
    },
    handleTemplate() {
      exportFile(`/api/blade-user/export-template?blade-auth=${getToken()}`)
        .then((response) => {
          exportExcel(response);
        })
        .catch((error) => {
          console.error("Error fetching or processing Excel data:", error);
        });
    },
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        getUser(this.form.id).then((res) => {
          this.form = this.arrangeDataItem(res.data.data);
          if (this.form.hasOwnProperty("deptId")) {
            this.form.deptId = this.form.deptId.split(",");
          }
          if (this.form.hasOwnProperty("roleId")) {
            this.form.roleId = this.form.roleId.split(",");
          }
        });
      }
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
      getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then((res) => {
        const data = res.data.data;
        this.page.total = Number(data.total || 0);
        this.data = data.records.map((item) => this.arrangeDataItem(item));
        this.loading = false;
      });
      getDeptTree().then((res) => {
        const column = this.findObject(this.option.column, "deptId");
        column.dicData = res.data.data;
      });
      getRoleTree().then((res) => {
        const column = this.findObject(this.option.column, "roleId");
        column.dicData = res.data.data;
      });
    },
    arrangeDataItem(item) {
      item = item || {};
      const { sex } = item;
      return {
        ...item,
        sex: sex === -1 || !sex ? undefined : sex,
      };
    },
    handleEditStatus(row) {
      this.$refs.crud.value.status = row.status;
      update(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        },
        (error) => {
          window.console.log(error);
          this.loading = false;
        },
      );
    },
  },
};
</script>

<style></style>
