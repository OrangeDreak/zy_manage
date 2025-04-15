<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('ticket.ticketDetailForm.title')"
    width="800px"
    :close-on-click-modal="false"
  >


    <div class="order-list-content">

            <el-table :data="dataSource.data" style="width: 100%" stripe max-height="500px" :show-header="false" ref="tableRef">
                  <el-table-column width="60" >
                     <template #default="{ row }">
                         <div v-if="row.source===0">
                            <el-avatar style="background-color: #f389d6;"> User </el-avatar>
                         </div>
                     </template>
                  </el-table-column>
                  <el-table-column width="320" >
                      <template #default="{ row }" >
                        <div v-if="row.source===0" class="message-other">
                           <p>{{ row.gmtCreate}}</p>
                           <p>{{ row.content}}</p>
                        </div>
                      </template>
                  </el-table-column>
                  <el-table-column width="320" >
                       <template #default="{ row }" >
                          <div v-if="row.source===1" class="message-me">
                              <p>{{ row.gmtCreate}}</p>
                              <p>{{ row.content}}</p>
                          </div>
                       </template>
                  </el-table-column>
                  <el-table-column width="60" >
                        <template #default="{ row }">
                           <div v-if="row.source===1">
                             <el-avatar style="background-color: rgb(154 164 252);"> ME </el-avatar>
                           </div>
                        </template>
                  </el-table-column>
            </el-table>
    </div>

    <!-- 表单区域 -->
    <el-form
      ref="formRef"
      :model="ticketForm"
      :rules="rules"
      label-width="0px"
      class="address-form"
      v-if="ticketStatus !=2"
    >
        <el-form-item :label="$t('ticket.ticketDetailForm.contentLabel')" >
             <el-input
               v-model="ticketForm.content"
               type="textarea"
               :rows="3"
               :placeholder="$t('ticket.ticketDetailForm.contentPlaceholder')"
             />
        </el-form-item>

    </el-form>

    <!-- 底部按钮 -->
    <template #footer v-if="ticketStatus !==2">
      <span class="dialog-footer">
        <el-button @click="handleClose">{{$t('global_cancel')}}</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{$t('gloabl_confirm')}}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeMount, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { replyTicket, getRecords } from "@/api/ticket"

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  ticketId: {
      type: Number,
      default: ''
  },
  ticketStatus: {
      type: Number,
      default: ''
  },
})

const dataSource = reactive({ data: [] });

const emit = defineEmits(['update:modelValue', 'submit'])
// 表单数据
const formRef = ref(null)
const ticketId = ref(null)
const ticketStatus = ref(0)
const loading = ref(false)
const ticketForm = ref({
  content: ''
})
const tableRef = ref();
// 对话框显示状态
const dialogVisible = ref(false)
watch(() => props.modelValue, val => {
  dataSource.data = [];
  dialogVisible.value = val;
  ticketForm.value = {};
  if (props.ticketId) {
      ticketId.value = props.ticketId;
  }
  ticketStatus.value = props.ticketStatus;
  listRecord();
})
watch(() => dialogVisible.value, val => {
  emit('update:modelValue', val)
})

// 表单验证规则
const rules = {
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' }
  ]
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (!ticketForm.value || !ticketForm.value.content) {

            return;
        }
        const params = ticketForm.value;
        params.ticketId = ticketId.value;
        await replyTicket(params);
        ticketForm.value = {};
        listRecord();

      } catch (err) {
         ElMessage.error(err);
      }
    }
  })
}

const handleClose = async () => {
    dataSource.data = [];
    dialogVisible.value = false;
    emit('submit', ticketForm.value);
}

// 提交表单
const listRecord = async () => {
    try {
       const result = await getRecords(ticketId.value);
       dataSource.data = result.data || [];
       setTimeout(() => {
          nextTick();
       }, 600);
    } catch (err) {
       const msg = err.message || "Get ticket detail fail";
       ElMessage.error(msg);
    } finally {

    }
}

// 在表格数据加载完成后执行
const nextTick = () => {
  const table = tableRef.value;
  const $bodyWrapper = table.$el.querySelector(".el-table__body");
  if ($bodyWrapper) {
     console.log(2);
     table.setScrollTop($bodyWrapper.scrollHeight);
  }
};


onMounted(() => {

});

</script>

<style lang="less" scoped>
@import '@/styles/variables.less';
.primary-btn{
  color: #fff !important;
  background-color: @primary-color !important;
}

.parse-area {
  background-color: @primary-light;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  position: relative;

  .parse-tip {
    position: absolute;
    top: 10px;
    right: 15px;
    color: #909399;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
}

.address-form {
  :deep(.el-input__wrapper) {
    background-color: #f5f7fa;
  }

  :deep(.el-input-group__append) {
    cursor: pointer;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.message {
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 8px;
  margin: 5px 15px;
  word-wrap: break-word;
}

/* 我的消息样式 (右侧) */
.message-me {
  padding: 8px 12px;
  border-radius: 8px;
  margin: 5px 15px;
  word-wrap: break-word;
  background-color: #95EC69; /* 微信绿色 */
  margin-left: auto; /* 右对齐 */
  border-top-right-radius: 2px; /* 微信特色小三角 */
}

/* 对方消息样式 (左侧) */
.message-other {
  padding: 8px 12px;
  border-radius: 8px;
  margin: 5px 15px;
  word-wrap: break-word;
  background-color: #FFFFFF;
  margin-right: auto; /* 左对齐 */
  border-top-left-radius: 2px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
</style>