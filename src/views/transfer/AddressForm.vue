<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增/修改用户地址"
    width="800px"
    :close-on-click-modal="false"
  >
    <!-- 智能解析区域 -->
    <div class="parse-area">
      <el-input
        v-model="fullAddress"
        type="textarea"
        :rows="3"
        placeholder="请输入完整地址，系统将自动解析"
      />
      <div class="parse-tip">
        地址智能解析
        <el-tooltip content="支持粘贴完整地址进行智能解析" placement="top">
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
    </div>

    <!-- 表单区域 -->
    <el-form
      ref="formRef"
      :model="addressForm"
      :rules="rules"
      label-width="80px"
      class="address-form"
    >
      <el-row :gutter="20">
        <!-- 左列 -->
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input 
              v-model="addressForm.name"
              placeholder="请输入姓名"
            />
          </el-form-item>
          
          <el-form-item label="地址" prop="address">
            <el-input 
              v-model="addressForm.address"
              placeholder="请输入详细地址"
            />
          </el-form-item>
          
          <el-form-item label="电话" prop="phone">
            <el-input 
              v-model="addressForm.phone"
              placeholder="请输入联系电话"
            />
          </el-form-item>
        </el-col>

        <!-- 右列 -->
        <el-col :span="12">
          <el-form-item label="国家" prop="country">
            <el-input 
              v-model="addressForm.country"
              placeholder="请选择国家"
            >
              <template #append>
                <el-tooltip content="收货地址所在国家" placement="top">
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </template>
            </el-input>
          </el-form-item>
          
          <el-form-item label="邮编" prop="zipCode">
            <el-input 
              v-model="addressForm.zipCode"
              placeholder="请输入邮政编码"
            >
              <template #append>
                <el-tooltip content="收货地址邮政编码" placement="top">
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

// 对话框显示状态
const dialogVisible = ref(false)
watch(() => props.modelValue, val => {
  dialogVisible.value = val
})
watch(() => dialogVisible.value, val => {
  emit('update:modelValue', val)
})

// 表单数据
const formRef = ref(null)
const loading = ref(false)
const fullAddress = ref('')
const addressForm = ref({
  name: '',
  address: '',
  phone: '',
  country: '',
  zipCode: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  country: [
    { required: true, message: '请选择国家', trigger: 'blur' }
  ],
  zipCode: [
    { required: true, message: '请输入邮编', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '请输入正确的邮政编码', trigger: 'blur' }
  ]
}

// 监听完整地址变化，进行智能解析
watch(fullAddress, async (val) => {
  if (!val) return
  try {
    // TODO: 调用地址解析API
    // const result = await parseAddress(val)
    // addressForm.value = {
    //   ...addressForm.value,
    //   ...result
    // }
    
    // 模拟解析
    setTimeout(() => {
      const parsed = {
        name: '张三',
        address: '北京市朝阳区xxx街道xxx号',
        phone: '13800138000',
        country: '中国',
        zipCode: '100000'
      }
      addressForm.value = parsed
      ElMessage.success('地址解析成功')
    }, 500)
  } catch (error) {
    console.error('地址解析失败:', error)
    ElMessage.error('地址解析失败')
  }
})

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // TODO: 调用保存地址API
        await new Promise(resolve => setTimeout(resolve, 500))
        emit('submit', addressForm.value)
        ElMessage.success('保存成功')
        dialogVisible.value = false
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

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