# QC elf 转运系统

QC elf 是一个现代化的跨境转运管理系统，提供便捷的转运订单管理、仓库管理等功能。

## 技术栈

- 前端框架：Vue 3
- UI 组件库：Element Plus
- 状态管理：Pinia
- 路由管理：Vue Router
- 样式处理：Less
- HTTP 请求：Axios
- 构建工具：Vite

## 项目结构

```
src/
├── api/                # API 接口定义
├── assets/             # 静态资源
├── components/         # 公共组件
├── layouts/            # 布局组件
├── router/             # 路由配置
├── stores/             # 状态管理
├── styles/             # 全局样式
└── views/              # 页面组件
    ├── auth/           # 认证相关页面
    ├── transfer/       # 转运相关页面
    └── warehouse/      # 仓库相关页面
```

## 功能模块

### 1. 用户认证
- 登录页 (`/login`)
  - 邮箱密码登录
  - 记住登录状态
  - 主题色：#c803be

- 注册页 (`/register`)
  - 邮箱注册
  - 密码确认
  - 用户协议

### 2. 转运管理
- 转运列表页 (`/transfer-list`)
  - 订单搜索和筛选
  - 订单状态管理
  - 物流信息查看
  - 订单分享功能

- 添加转运订单页 (`/add-transfer`)
  - 仓库地址获取
  - 自定义编码
  - 快递单号管理
  - 商品照片上传

- 订单分享页 (`/share/:id`)
  - 订单详细信息
  - 收件人信息
  - 物流状态
  - 包裹图片

### 3. 仓库管理
- 我的仓库页 (`/warehouse`)
  - 商品列表
  - 入库记录
  - 商品分类
  - 重量和尺寸信息

### 4. 系统管理
- 用户管理 (`/users`)
  - 用户列表
  - 权限管理

- 登录日志 (`/login-logs`)
  - 操作记录
  - 安全审计

## 主题定制

系统使用统一的主题配色：

```less
// 主题色
@primary-color: #c803be;
@primary-light: #f7e6f7;
@primary-bg: #faf0fa;
@primary-lighter: #fdf5fd;

// 文字颜色
@text-primary: #303133;
@text-regular: #606266;
@text-secondary: #909399;

// 边框颜色
@border-color: #EBEEF5;

// 背景颜色
@background-color: #f0f2f5;
```

## 页面布局

1. 带导航栏的后台页面
   - 左侧固定导航
   - 顶部面包屑
   - 内容区自适应

2. 独立页面
   - 登录/注册
   - 添加转运订单
   - 订单分享页

## 开发指南

1. 安装依赖
```bash
npm install
```

2. 启动开发服务器
```bash
npm run dev
```

3. 构建生产版本
```bash
npm run build
```

## 部署说明

1. 环境要求
   - Node.js >= 16
   - npm >= 7

2. 环境变量配置
   - 开发环境：`.env.development`
   - 生产环境：`.env.production`

## 注意事项

1. 代码规范
   - 使用 ESLint 进行代码检查
   - 遵循 Vue 3 组合式 API 风格
   - 保持统一的代码格式

2. 样式规范
   - 使用 Less 预处理器
   - 遵循 BEM 命名规范
   - 优先使用主题变量

3. 性能优化
   - 路由懒加载
   - 组件按需导入
   - 图片资源优化

## 更新日志

### v1.0.0 (2024-03-08)
- 初始化项目
- 实现基础功能模块
- 统一主题样式

## 接口文档

### 用户相关接口

#### 登录
- 路径: `/api/auth/login`
- 方法: POST
- 参数:
  - username: 用户名
  - password: 密码
- 返回:
  - token: 认证令牌
  - userInfo: 用户信息

#### 注册
- 路径: `/api/auth/register`
- 方法: POST
- 参数:
  - username: 用户名
  - password: 密码
  - email: 邮箱
- 返回:
  - message: 注册结果信息

#### 获取用户列表
- 路径: `/api/users`
- 方法: GET
- 参数:
  - page: 页码
  - pageSize: 每页数量
- 返回:
  - total: 总数
  - list: 用户列表

#### 获取登录日志
- 路径: `/api/logs/login`
- 方法: GET
- 参数:
  - page: 页码
  - pageSize: 每页数量
- 返回:
  - total: 总数
  - list: 日志列表 