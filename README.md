# meishan_screen

眉山大屏前端项目，基于「新金融大数据监测预警平台」改造，用于金融风险监测、预警展示与企业分析相关业务页面。

## 功能概览

- **全局实时监测预警**：首页总览、事件详情、跨区域风险、关联方分析
- **特征事件预警**：专项事件监测与展示
- **企业违规预警**：违规规则相关预警能力
- **智能检索分析**：企业检索、检索结果与分析详情页
- **重点企业监控**：重点对象监控首页
- **企业详情**：支持私募、交易场所、网络借贷、新兴金融、黑名单及其他企业类型详情
- **个人中心**：黑名单、报告、流程等相关功能
- **可视化输出**：雷达图、地图等 PDF / 大屏可视化页面

## 技术栈

| 类别 | 技术 |
| --- | --- |
| 框架 | React 15、Redux、React Router 3 |
| UI | Ant Design 2、mtui |
| 可视化 | ECharts、D3、自研地图组件 |
| 构建 | Webpack 2、Babel、Sass、Gulp |
| 其他 | Axios、Immutable、MockJS |

## 环境要求

- Node.js（建议与项目依赖兼容的 8.x / 10.x 一类版本）
- npm

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务（默认端口见 package.json config.port，一般为 8001）
npm start

# 启动本地 Mock 服务
npm run start:mock
```

开发代理与 Mock 开关可在 `package.json` 的 `config` 中调整：

- `host` / `port`：开发服务地址
- `proxy`：后端接口代理地址
- `mock` / `enableMock`：Mock 服务配置

## 常用脚本

```bash
# 开发构建
npm run build:dev

# 生产构建
npm run build:prod

# 代码检查
npm run lint:js

# 生产构建并打包 zip
npm run package

# 发布相关
npm run release:dev
npm run release:test
npm run release:all
```

Windows 下也可直接使用 `bin/` 目录中的批处理脚本（如 `server.bat`、`build-prod.bat` 等）。

## 目录结构

```text
├── bin/                 # Windows 启动 / 构建脚本
├── mockServer/          # 本地 Mock 数据与服务
├── src/                 # 前端源码
│   ├── components/      # 业务与通用组件
│   ├── layouts/         # 布局
│   ├── routes/          # 路由
│   ├── services/        # 接口请求
│   ├── styles/          # 全局样式
│   └── utils/           # 工具方法
├── webpack.config.*.js  # Webpack 配置
├── gulpfile.babel.js    # 打包 / 发布任务
└── package.json
```

## 说明

- 仓库名：`meishan_screen`
- 当前仓库对应眉山大屏前端代码；业务能力沿用监测预警平台模块，按项目需要进行了本地化调整。
