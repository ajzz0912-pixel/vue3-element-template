# Vue3 管理后台项目模板

基于 **Vue 3 + Element Plus + Pinia + Vite + TypeScript + UnoCSS** 的轻量级管理后台脚手架，内置常用布局、表格示例与 Mock 接口，适合快速搭建中小型后台项目。

> 本模板**不包含完整的 RBAC 权限控制**，仅提供登录态校验与路由 meta 预留字段，更适合轻量场景或作为二次开发起点。

## 特性

### 技术栈

- [Vue 3](https://cn.vuejs.org/) — Composition API + `<script setup lang="ts">`
- [Vite 8](https://cn.vitejs.dev/) — 开发即时 HMR，生产构建优化
- [Element Plus](https://element-plus.org/zh-CN/) — 企业级 UI 组件库
- [Pinia](https://pinia.vuejs.org/zh/) — 状态管理
- [Vue Router 5](https://router.vuejs.org/zh/) — Hash 路由模式
- [UnoCSS](https://unocss.dev/) — 原子化 CSS，支持 Iconify 图标
- [VueUse](https://vueuse.org/) — 常用组合式工具
- TypeScript — 全链路类型支持

### 工程能力

- **自动导入** — Vue API、VueUse、项目 composables 与 Element Plus 组件按需注册
- **Vue Macros** — 增强 `<script setup>` 开发体验
- **Mock 服务** — 基于 [vite-plugin-fake-server](https://github.com/condorheroblog/vite-plugin-fake-server)，开发环境开箱即用
- **主题切换** — 内置明暗主题与布局配置（侧边栏折叠、标签页、全屏等）
- **Keep-Alive** — 路由级页面缓存，可在路由 meta 中配置
- **代码规范** — ESLint + Stylelint + vue-tsc 类型检查

### 内置页面

| 模块             | 说明                                          |
| ---------------- | --------------------------------------------- |
| 仪表盘           | 数据概览与统计卡片                            |
| 表格页面         | CRUD 表格、分类联动表格、树联动表格、卡片列表 |
| 系统管理         | 用户 / 角色 / 部门管理                        |
| 多级菜单         | 嵌套路由与菜单示例                            |
| 登录 / 404 / 401 | 基础功能页                                    |

## 环境要求

- **Node.js** >= 18
- **pnpm** >= 9（推荐 11，见 `packageManager` 字段）

## 快速开始

```bash
pnpm i
pnpm serve
```

### 开发

```bash
pnpm serve
```

开发服务器默认地址：`http://localhost:3101`（自动打开浏览器）

**测试账号**（Mock 数据，密码均为 `123456`）：

| 用户名   | 说明     |
| -------- | -------- |
| `admin`  | 管理员   |
| `editor` | 编辑人员 |
| `test`   | 测试账号 |

### 构建

```bash
pnpm build_test   # 测试环境（--mode test）
pnpm build_pre    # 预发布环境（--mode staging）
pnpm build_prod   # 生产环境
```

### 预览构建产物

```bash
pnpm start
```

### 代码检查

```bash
pnpm lint         # ESLint 检测
pnpm lint:fix     # ESLint 检测并修复
pnpm lint:ts      # TypeScript 类型检查
pnpm lint:css     # Stylelint 检测并修复
```

## 环境变量

项目通过 Vite 环境文件区分运行模式，主要变量如下：

| 变量              | 说明                                                                  |
| ----------------- | --------------------------------------------------------------------- |
| `VITE_APP_ENV`    | 运行环境标识（`development` / `test` / `pre-release` / `production`） |
| `VITE_BASE_URL`   | API 请求前缀（开发默认 `/api`，预发布/测试为 `/mock`）                |
| `VITE_ASSETS_URL` | 静态资源前缀                                                          |

对应文件：`.env.development`、`.env.test`、`.env.staging`、`.env.production`

## Mock 数据

Mock 接口定义在 `mock/` 目录，使用 `defineFakeRoute` 声明路由：

```
mock/
├── user.fake.ts          # 登录 / 用户信息
├── table.fake.ts         # 表格数据
├── card.fake.ts          # 卡片列表
├── work.fake.ts          # 工作台
├── system.user.fake.ts   # 用户管理
├── system.role.fake.ts   # 角色管理
├── system.dept.fake.ts   # 部门管理
└── utils.ts              # 公共工具
```

- **开发环境**：Mock 自动启用，请求 `/api/*` 经 Vite 代理转发至 Mock 服务
- **预发布环境**：构建产物中仍启用 Mock（`VITE_APP_ENV=pre-release`）
- **生产环境**：Mock 关闭，需对接真实后端 API

修改 `vite.config.build.ts` 中的 `proxy` 配置即可将 `/api` 代理到实际后端地址。

## 目录结构

```
├── mock/                   # Mock 接口
├── public/                 # 静态资源
├── src/
│   ├── assets/             # 样式、图片等资源
│   ├── components/         # 全局组件
│   ├── composables/        # 组合式函数（axios、fetch、storage 等）
│   ├── config/             # 全局配置
│   ├── layout/             # 布局（侧边栏、顶栏、标签页）
│   ├── plugin/             # Vue 插件
│   ├── router/             # 路由与模块
│   ├── stores/             # Pinia Store
│   ├── theme/              # 主题样式
│   ├── types/              # TypeScript 类型
│   ├── utils/              # 工具函数
│   └── views/              # 页面视图
├── vite.config.ts          # Vite 主配置
├── vite.config.build.ts    # 构建与服务端配置
├── unocss.config.ts        # UnoCSS 配置
└── eslint.config.ts        # ESLint 配置
```

### 路由模块

路由按业务拆分为模块，位于 `src/router/modules/`：

- `dashboard.ts` — 首页 / 仪表盘
- `table.ts` — 表格相关页面
- `system.ts` — 系统管理
- `menu.ts` — 多级菜单示例
- `feature.ts` — 登录、404、401 等

新增页面时，在对应模块中添加路由配置即可，菜单会自动同步。

### 状态管理

Pinia Store 位于 `src/stores/`：

- `use-global-store.ts` — 布局、主题等全局状态
- `use-user-store.ts` — 用户登录态
- `use-keep-alive-store.ts` — 页面缓存

## IDE 推荐

建议使用 [VS Code](https://code.visualstudio.com/) + [Vue - Official（Volar）](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 扩展。若安装了 Vetur，请禁用以避免冲突。
