<template>
  <div class="user-list">
    <el-card>
      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>

      <!-- 用户表格 -->
      <el-table :data="userList" v-loading="loading">
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        @current-change="handlePageChange"
      />
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'edit' ? '编辑用户' : '新增用户'"
      width="500px"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogType === 'add'">
          <el-input v-model="editForm.password" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave" :loading="saveLoading">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { user } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const userList = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const searchForm = ref({
  username: ''
})

const dialogVisible = ref(false)
const dialogType = ref('edit') // 'edit' 或 'add'
const editForm = ref({
  id: '',
  username: '',
  email: '',
  password: ''
})
const saveLoading = ref(false)

const editRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

// 获取用户列表
const getUserList = async () => {
  loading.value = true
  try {
    const res = await user.getUsers({
      page: page.value,
      pageSize: pageSize.value,
      ...searchForm.value
    })
    userList.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  page.value = 1
  getUserList()
}

// 页码改变
const handlePageChange = () => {
  getUserList()
}

// 打开编辑对话框
const handleEdit = (row) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  editForm.value = { ...row }
}

// 打开新增对话框
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  editForm.value = {
    username: '',
    email: '',
    password: ''
  }
}

// 保存用户
const handleSave = async () => {
  if (!editFormRef.value) return
  
  await editFormRef.value.validate(async (valid) => {
    if (valid) {
      saveLoading.value = true
      try {
        if (dialogType.value === 'edit') {
          await user.updateUser(editForm.value.id, editForm.value)
          ElMessage.success('更新成功')
        } else {
          await user.createUser(editForm.value)
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
        getUserList()
      } catch (error) {
        console.error('保存失败:', error)
      } finally {
        saveLoading.value = false
      }
    }
  })
}

// 删除用户
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确认删除该用户吗？', '提示', {
      type: 'warning'
    })
    await user.deleteUser(row.id)
    ElMessage.success('删除成功')
    getUserList()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

onMounted(() => {
  getUserList()
})
</script>

<style lang="less" scoped>
.user-list {
  .search-form {
    margin-bottom: 20px;
  }

  .operation-column {
    .el-button {
      margin-left: 10px;
    }
  }

  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style> 