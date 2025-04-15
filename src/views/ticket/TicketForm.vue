<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('ticket.ticketForm.title')"
    width="800px"
    :close-on-click-modal="false"
  >
    <!-- 表单区域 -->
    <el-form
      ref="formRef"
      :model="ticketForm"
      :rules="rules"
      label-width="150px"
      class="address-form"
    >

        <el-form-item :label="$t('ticket.ticketForm.titleLabel')" prop="title">
            <el-input
              v-model="ticketForm.title"
              :placeholder="$t('ticket.ticketForm.titlePlaceholder')"
            />
        </el-form-item>
        <el-form-item :label="$t('ticket.ticketForm.contentLabel')">
             <el-input
               v-model="ticketForm.content"
               type="textarea"
               :rows="5"
               :placeholder="$t('ticket.ticketForm.contentPlaceholder')"
             />
        </el-form-item>

    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('global_cancel')}}</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{$t('gloabl_confirm')}}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
//import { submitTicket } from "@/api/ticket"

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])
// 表单数据
const formRef = ref(null)
const loading = ref(false)
const ticketForm = ref({
  title: '',
  content: ''
})
// 对话框显示状态
const dialogVisible = ref(false)
watch(() => props.modelValue, val => {
  dialogVisible.value = val;
  ticketForm.value = {};
})
watch(() => dialogVisible.value, val => {
  emit('update:modelValue', val)
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' }
  ]
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        console.log(ticketForm.value);
        const params = ticketForm.value;
        //await submitTicket(params);
        emit('submit', ticketForm.value)
        ElMessage.success('success')
        dialogVisible.value = false
      } catch (err) {
         ElMessage.error(err);
      } finally {
        loading.value = false
      }
    }
  })
}

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
</style>