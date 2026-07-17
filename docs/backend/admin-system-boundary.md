# 后台管理系统边界

## 当前决策

已经用于真实业务的后台能力随 `main` 管理，不再长期散落在 `toolaze-web-backend-wip`。

当前纳入 `main` 的后台范围：

- 用户后台：查看 Google 注册用户、注册入口 URL、referrer、credits、登录状态和生成次数。
- 生成记录后台：查看全站最近生成记录和单个用户最近使用记录。
- 积分补发：给指定用户补发 credits，并记录 `admin_grant` 交易。
- 媒体预览：后台内联预览受信任生成结果，避免浏览器直接下载。
- 数据迁移：`credit_grants` 和 `user_signup_attribution` 两类后台依赖表。

不属于本次后台边界的内容：

- SEO Factory 草稿能力。
- 前台 landing page、模型页、世界杯页或导航入口实验。
- 图片存储迁移或 R2 架构调整。
- 任何未验证的 backend-wip 临时代码。

## 目录边界

后台代码集中在以下目录：

- `src/app/admin/`：后台页面入口。
- `src/app/api/admin/`：后台 API，包括积分补发和媒体预览代理。
- `src/components/admin/`：后台专用 UI 组件。
- `src/lib/admin/`：后台查询、排序、权限和积分补发逻辑。
- `migrations/`：后台依赖的数据表迁移。

这些后台页面不要出现在前台导航、footer 或 sitemap。

## 权限边界

后台访问统一通过 `src/lib/admin/access.ts` 判断：

- 默认只允许 `localhost`、`127.0.0.1` 和 `::1`。
- 远程后台默认关闭，即使配置了管理员邮箱也不会开放。
- 如后续确实需要公网后台，必须同时配置：
  - `TOOLAZE_ENABLE_REMOTE_ADMIN=true`
  - `TOOLAZE_ADMIN_EMAILS`
  - Cloudflare Access 的 `cf-access-authenticated-user-email` 请求头

短期审核期保持默认本地访问即可，线上普通用户和审核员不会看到后台页面。

## 数据库迁移

后台依赖两份 SQL：

- `migrations/0004_credit_grants.sql`
  - 增加 credits grant 批次和消费分配表。
  - 支持补发 credits、过期时间和幂等 `request_id`。
- `migrations/0005_user_signup_attribution.sql`
  - 增加用户注册来源表。
  - 保存 `signup_path`、`signup_url`、`referrer` 和 UTM 参数。

提交 SQL 文件不等于已经执行生产迁移。生产 D1 执行前需要单独确认。

## 媒体预览边界

后台媒体预览代理位于 `src/app/api/admin/media-preview/route.ts`：

- 只允许 `https://tempfile.aiquickdraw.com/*`。
- 只允许 `image/*` 和 `video/*`。
- 响应头强制 `Content-Disposition: inline`。
- 原始链接仍保留给管理员下载。

## 验证

后台专项测试：

```bash
npm run test:admin
```

发布前建议追加：

```bash
npx tsc --noEmit --pretty false
npm run build
```
