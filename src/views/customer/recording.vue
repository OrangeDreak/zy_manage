<template>
  <!-- <div>会话记录</div>
   -->
  <basic-container>
    <el-form :model="formInline" label-width="80px" size="small">
      <el-row>
        <el-col :span="8">
          <el-form-item label="访客国家">
            <el-select v-model="formInline.countryId" placeholder="全部" style="width: 100%">
              <el-option
                v-for="item in countryData"
                :key="item.id"
                :label="item.areaName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="会话状态">
            <el-select v-model="formInline.status" placeholder="全部" style="width: 100%">
              <el-option label="全部" value=""></el-option>
              <el-option label="未接入" value="0"></el-option>
              <el-option label="已接入" value="1"></el-option>
              <el-option label="已结束" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="类型">
            <el-select v-model="formInline.initiatorType" placeholder="全部" style="width: 100%">
              <el-option label="全部" value=""></el-option>
              <el-option label="客服发起" value="0"></el-option>
              <el-option label="客户发起" value="1"></el-option>
            </el-select>
            <!-- <el-option
                v-for="item in countryData"
                :key="item.id"
                :label="item.areaName"
                :value="item.id"
              ></el-option> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="时间">
            <el-date-picker
              v-model="formInline.time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="timeSet"
              style="width: 100%"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结束原因">
            <el-select v-model="formInline.endReason" placeholder="请选择" style="width: 100%">
              <el-option label="全部" value=""></el-option>
              <el-option label="客服关闭" value="1"></el-option>
              <el-option label="访客离开超时关闭" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
            <el-button @click="refresh" size="small">清空</el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 表单 -->
    </el-form>

    <div class="search">
      <div class="idBox">
        <el-select v-model="formSearch.keywordType" placeholder="全部" size="small">
          <el-option label="全部" value=""></el-option>
          <el-option label="用户ID" value="0"></el-option>
          <el-option label="会话ID" value="1"></el-option>
          <!-- <el-option label="访问IP" value="2"></el-option> -->
        </el-select>
      </div>
      <div class="searchBox">
        <el-input placeholder="请输入关键字搜索当前列表" v-model="formSearch.keyword" size="small">
          <el-button slot="append" icon="el-icon-search" @click="searchBtn()"></el-button>
        </el-input>
      </div>
    </div>

    <el-table
      :data="tableData"
      v-loading="loading"
      border
      style="width: 100%"
      header-cell-style="text-align:center"
      cell-style="text-align:center"
    >
      <el-table-column prop="dialogueId" label="会话ID" width="100"> </el-table-column>
      <el-table-column prop="gmtCreated" label="访客进入时间" min-width="200"> </el-table-column>
      <el-table-column prop="staffName" label="接待客服" width="100"> </el-table-column>
      <el-table-column prop="userId" label="用户ID" width="100"> </el-table-column>
      <el-table-column prop="startTime" label="会话开始时间" min-width="150"> </el-table-column>
      <el-table-column prop="endTime" label="会话结束时间" min-width="200"> </el-table-column>
      <el-table-column prop="endReasonName" label="会话结束原因" min-width="200">
        <!-- 两种显示样式判断 -->
        <!-- <template slot-scope="scope">
          {{ scope.row.endReasonName == 1 ? "客服关闭" : "访客离开超时关闭" }}
        </template> -->
      </el-table-column>
      <el-table-column prop="workOrderDesc" label="是否关联工单" min-width="150"> </el-table-column>

      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row.userId, scope.row.dialogueId)" type="text"
            >查看</el-button
          >
          <el-button
            v-if="scope.row.status !== 2"
            @click="overSession(scope.row.dialogueId)"
            type="text"
            >结束会话</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.currentPage"
      :page-sizes="[10, 20, 50, 100]"
      background
      :page-size="page.pageSize"
      layout="->,total, sizes, prev, pager, next, jumper"
      :total="page.total"
      style="margin-top: 2vh"
    >
    </el-pagination>
    <sessionDialog ref="sessionDialogRef"></sessionDialog>
  </basic-container>
</template>

<script>
import sessionDialog from "./recording/sessionDialog.vue";
import { getCountry, dialogueListApi } from "../../api/customer/recording";
import { staffCloseApi } from "../../api/customer/session";
// import { getSDK } from "@/util/lib";
export default {
  data() {
    return {
      formInline: {
        countryId: null,
        status: "",
        initiatorType: "",
        time: null,
        endReason: "",
      },
      formSearch: {
        keyword: null,
        keywordType: null,
      },
      tableData: [],
      loading: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      countryData: [],
      timeSet: ["00:00:00", "23:59:59"],
    };
  },
  components: { sessionDialog },
  created() {
    this.country();
    this.getTableList();
  },
  methods: {
    handleClick(userId, dialogueId) {
      console.log("点击查看");
      this.$refs.sessionDialogRef.open({
        title: "会话信息",
        userId,
        dialogueId,
      });
      console.log(this.$refs.basicRef);
    },
    country(params) {
      getCountry(params).then((res) => {
        const countryData = res.data.data;
        this.countryData = countryData;
        // console.log(countryData, "国家列表");
      });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.page.pageSize = val;
      this.getTableList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page.currentPage = val;
      this.getTableList();
    },

    onSubmit() {
      this.page.currentPage = 1;
      this.getTableList();
    },

    searchBtn() {
      // this.page.currentPage = 1;
      this.getTableList();
    },

    getTableList() {
      const pageData = {
        size: this.page.pageSize,
        current: this.page.currentPage,
      };
      let data = { ...this.formInline, ...pageData, ...this.formSearch };
      delete data.time;
      console.log(this.formInline.time);
      if (Array.isArray(this.formInline.time) && this.formInline.time.length == 2) {
        data.startTime = this.formInline.time[0];
        data.endTime = this.formInline.time[1];
      } else {
        data.startTime = null;
        data.endTime = null;
      }

      console.log(this.formInline, data);
      console.log("查询");
      dialogueListApi(data).then((res) => {
        this.tableData = res?.data?.data?.records;
        this.page.total = Number(res?.data?.data?.total);
        console.log(res, "查询列表");
      });
    },
    refresh() {
      this.page.currentPage = 1;
      this.formInline = {
        countryId: null,
        status: "",
        initiatorType: "",
        time: null,
        endReason: "",
      };
      this.formSearch = {
        keyword: null,
        keywordType: null,
      };
      this.getTableList();
    },
    overSession(id) {
      staffCloseApi({ dialogueId: id }).then((res) => {
        if (res?.data?.success) {
          this.getTableList();
          this.$message.success("结束会话成功");
        }
      });
      // console.log(id, "id");
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-range-separator {
  // color: red;
  width: 40px;
  // display: none;
}

// /deep/ .el-range-input {
//   width: 200px;
// }

.search {
  display: flex;
  margin-top: 30px;
  margin-bottom: 10px;
  .idBox {
    margin-right: 20px;
    /deep/ .el-select,
    .el-select--small {
      width: 100px;
      // margin-right: 20px;
    }
  }

  .searchBox {
    /deep/ .el-input,
    .el-input--small,
    .el-input-group,
    .el-input-group--append {
      width: 300px;
      // margin-left: 500px;
    }
  }
}
</style>
