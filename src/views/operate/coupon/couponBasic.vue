<template>
  <basic-container>
    <h3 style="margin-top: 2vh">优惠券基础配置</h3>
    <el-button
      type="primary"
      icon="el-icon-circle-plus
"
      @click="addCoupon()"
      style="margin-top: 2vh; margin-bottom: 5vh"
      >新增</el-button
    >
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column label="序号" type="index" width="100"> </el-table-column>
      <el-table-column prop="couponTypeName" label="券类型"> </el-table-column>
      <el-table-column prop="languageEnName" label="语言"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="look(scope.row.id)"
            >查看</el-button
          >
          <el-button type="text" size="small" @click="edit(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.current"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.size"
      layout="->,total, sizes, prev, pager, next, jumper"
      :total="page.total"
      background
      style="margin-top: 2vh"
    >
    </el-pagination>
    <basicDialog ref="basicRef" @updateList="getList"></basicDialog>
  </basic-container>
</template>
<script>
import {
  couponLanguageListApi,
  couponLanguageDeleteApi,
} from "../../../api/operate/coupon";
import basicDialog from "./basicDialog.vue";
export default {
  data() {
    return {
      page: {
        current: 1,
        size: 10,
        total: 0,
      },

      tableData: [],
    };
  },
  created() {
    this.getList();
  },
  components: { basicDialog },
  methods: {
    addCoupon() {
      console.log("新增");
      this.$refs.basicRef.open({
        title: "新增券语言配列",
      });
      console.log(this.$refs.basicRef);
    },
    getList(param) {
      const data = this.page;
      console.log(data, "data");
      couponLanguageListApi(data).then((res) => {
        this.tableData = [...res.data.data.records];
        console.log(this.tableData, "res");
        this.page.total = Number(res.data.data.total || 0);
      });
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page.current = val;
      this.getList();
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.page.size = val;
      this.getList();
    },
    look(id) {
      this.$refs.basicRef.open({
        title: "详情",
        id,
      });
    },
    edit(id) {
      this.$refs.basicRef.open({
        title: "编辑",
        id,
      });
    },
    handleDelete(id) {
      couponLanguageDeleteApi({ ids: [id] }).then((res) => {
        console.log(res, "res");
        this.getList();
      });
    },
  },
};
</script>
