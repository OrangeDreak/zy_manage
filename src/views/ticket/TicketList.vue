<template>
    <div class="order-list">

      <!-- 搜索工具栏 -->
      <div class="search-toolbar">
        <el-input
          v-model="searchForm.keyword"
          :placeholder="$t('ticket.keywordPlaceholder')"
          class="search-input"
        ></el-input>
        <el-select
            :placeholder="$t('ticket.statusPlaceholder')"
            v-model="searchForm.status"
            style = "width: 30%;"
        >
           <el-option
             v-for="item in statusItems"
             :key="item.status"
             :label="item.label"
             :value="item.status"
           ></el-option>
        </el-select>
        <el-button @click="handleSearch">搜索</el-button>
      </div>

      <!--
      <div class="search-toolbar">
           <el-button
              type="primary"
              link
              class="new-address"
              @click="handleAddTicket"
           >
              {{$t('ticket.add')}}
           </el-button>
      </div>
      -->

      <!-- 工单列表 -->
      <div class="order-list-content">
        <el-table :data="ticketList" style="width: 100%" stripe @row-dblclick="handleView" :highlight-current-row="true">
          <el-table-column prop="title" :label="$t('ticket.title')" width="500" />
          <el-table-column prop="gmtCreate" :label="创建时间" />
          <el-table-column :label="$t('ticket.status')" >
               <template #default="{ row }">
                  <el-tag>
                     {{ row.statusDesc }}
                  </el-tag>
               </template>
          </el-table-column>
          <el-table-column  :label="操作" width="150">
            <template #default="scope">
              <div v-if="scope.row.unReadMsgNum">
                 <el-badge :value="scope.row.unReadMsgNum" class="unReadMsgNum">
                    <el-button type="text"  @click="handleView(scope.row)">{{$t('ticket.view')}}</el-button>
                 </el-badge>
              </div>
              <div v-else>
                 <el-button type="text"  @click="handleView(scope.row)">{{$t('ticket.view')}}</el-button>
              </div>
              <div v-if="scope.row.status !== 2">
                  <el-button type="text"  @click="handleCompleted(scope.row)">完结</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <div class="total">共 {{ total }} 条</div>
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="total"
          layout="prev, pager, next, sizes"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!-- 新增工单对话框 -->
    <TicketForm
      v-model="ticketDialogVisible"
      @submit="handleTicketSubmit"
    />
    <!-- 工单详情对话框 -->
    <TicketDetailForm
       v-model="ticketDetailDialogVisible"
       :ticketId="detailTicketId"
       :ticketStatus="detailTicketStatus"
       @submit="handleTicketDetailSubmit"
    />
  </template>

  <script lang="ts">
  import { defineComponent, reactive, ref, computed, getCurrentInstance } from "vue"
  import { ElMessage } from "element-plus"
  import { listTicket, completedTicket, replyTicket, getRecords } from "@/api/ticket"
  import TicketForm from './TicketForm.vue'
  import TicketDetailForm from './TicketDetailForm.vue'

  interface Ticket {
    id: number;
    title: string;
    status: number;
    statusDesc: string;
    statusDescTrans: string;
    unReadMsgNum: number;
    gmtCreate: string;
  }

  interface SearchForm {
    keyword: string;
    status: number;
  }


  export default defineComponent({
    name: "TicketList",
    components: {
      TicketForm,
      TicketDetailForm
    },
    setup() {
      // 分页状态
      const pagination = reactive({
        currentPage: 1,
        pageSize: 10,
      });
      // 搜索表单
      const searchForm = reactive({
        keyword: "",
        status: null
      });
      const { proxy } = getCurrentInstance();

      // 状态：0已提交、1处理中、2已完结
      const statusItems = computed(() => [
        {
          status: 0,
          label: proxy.$t("ticket.statusItem.submitted"),
        },
        {
          status: 1,
          label: proxy.$t("ticket.statusItem.processing"),
        },
        {
          status: 2,
          label: proxy.$t("ticket.statusItem.completed"),
        }
      ]);

      const ticketDialogVisible = ref(false)

      const ticketDetailDialogVisible = ref(false)
      const detailTicketId = ref(null)
      const detailTicketStatus = ref(null)

      // 订单列表
      const ticketList = ref<Ticket[]>([]);
      const total = ref(0);
      const loading = ref(false);
      const error = ref<string | null>(null);
      const formData = ref({});


      // 加载订单列表
      const loadTickets = async () => {
        try {
          loading.value = true;
          error.value = null;

          let params:any = {
            pageNo: pagination.currentPage,
            pageSize: pagination.pageSize,
            ...searchForm,
          };

          const result = await listTicket(params);
          ticketList.value = result.data;
          total.value = result.total;
        } catch (err) {
          error.value = err.message || "获取工单失败";
          ElMessage.error(error.value);
        } finally {
          loading.value = false;
        }
      };

      // 添加搜索处理方法
      const handleSearch = () => {
        // 搜索时重置到第一页
        pagination.currentPage = 1;
        loadTickets();
      };

      // 分页事件处理
      const handleSizeChange = (val: number) => {
         pagination.pageSize = val;
         loadTickets();
      };

      const handleCurrentChange = (val: number) => {
          pagination.currentPage = val;
          loadTickets();
      };

     // 处理工单提交
     const handleTicketSubmit = () => {
        loadTickets();
     };

     // 处理工单提交
     const handleTicketDetailSubmit = () => {
        loadTickets();
     };


      // 添加地址
      const handleAddTicket = () => {
        formData.value = {};
        ticketDialogVisible.value = true
      }

      const handleView = (ticket: Ticket) => {
        ticketDetailDialogVisible.value = true;
        detailTicketId.value = ticket.id;
        detailTicketStatus.value = ticket.status;
      }

      const handleCompleted = async (ticket: Ticket) => {
              try {
                loading.value = true;
                error.value = null;

                let params:any = {
                  id: ticket.id
                };
                await completedTicket(params);
                loadTickets();
              } catch (err) {
                error.value = err.message || "操作失败";
                ElMessage.error(error.value);
              } finally {
                loading.value = false;
              }

      }


      // 组件挂载时加载数据
      loadTickets();
      return {
        statusItems,
        searchForm,
        ticketList,
        total,
        pagination,
        formData,
        handleSizeChange,
        handleCurrentChange,
        handleSearch,
        handleAddTicket,
        ticketDialogVisible,
        ticketDetailDialogVisible,
        handleTicketSubmit,
        handleTicketDetailSubmit,
        handleView,
        handleCompleted,
        detailTicketId,
        detailTicketStatus
      };
    },
  });
  </script>

  <style scoped>
  .order-list {
    padding: 20px;
  }
  .user-info{
    display: flex;
    align-items: center;
    min-width: 310px;
    word-break: break-all;
  }
  .order-flow {
    display: flex;
    margin-bottom: 20px;
    background: #fff;
    border-radius: 8px;
  }

  .flow-item {
    display: flex;
    align-items: center;
    /* margin-right: 40px; */
    color: #666;
    padding: 20px;
  }

  .flow-item.active {
    color: #c803be;
    background: #fcf2fc;
  }

  .search-toolbar {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
  }

  .search-input {
    width: 200px;
  }

  .order-card {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 16px;
  }

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .tracking-no {
    font-size: 16px;
    font-weight: bold;
  }

  .order-info {
    margin-bottom: 16px;
  }

  .info-item {
    margin-bottom: 8px;
  }

  .info-item .label {
    color: #666;
  }

  .tracking-info {
    color: #409eff;
  }

  .order-footer {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .share-count {
    color: #666;
    font-size: 14px;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background: #fff;
    padding: 10px 20px;
  }
  .unReadMsgNum {
    top: 7px;
    right: 0px
  }
  </style>