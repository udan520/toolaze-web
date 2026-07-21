# Toolaze 视频模型成本表

最后核对日期：2026-07-21

## 覆盖范围

本文档覆盖当前共享视频生成组件中已经接入的视频模型：

- Grok 1.5 Video（`grok-1-5-video`）
- Seedance 2.0（`seedance-2`）
- Seedance 2.0 Mini（`seedance-2-mini`）
- Kling 3.0（`kling-3`）

## 定价规则

- Toolaze 收入假设：**$0.01 / credit**。
- 目标利润：先按 **相对 KIE 成本 200% 利润**计算原始点数，再做用户侧可读的扣点清洗。
- 原始公式：`原始每秒点数 = ceil(KIE 每秒成本 * 3 / 0.01)`。
- 清洗规则：10 以下保留实际值；10 及以上避免零散数字，使用更整齐的 0 / 5 结尾，例如 153 记为 150，158 记为 160。
- 利润率公式：`(Toolaze 收入 - KIE 成本) / KIE 成本`。
- 毛利率公式，仅作参考：`(Toolaze 收入 - KIE 成本) / Toolaze 收入`。
- 未计入支付通道手续费、失败重试、退款、存储、带宽和客服成本。

## 当前按秒定价

| 模型 | 分辨率 | KIE 每秒成本 | Toolaze 每秒扣点 | Toolaze 每秒收入 | 相对成本利润率 | 毛利率 |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Grok 1.5 Video | 480p | $0.0080 | 3 | $0.0300 | 275.0% | 73.3% |
| Grok 1.5 Video | 720p | $0.0150 | 5 | $0.0500 | 233.3% | 70.0% |
| Seedance 2.0 | 480p | $0.0950 | 30 | $0.3000 | 215.8% | 68.3% |
| Seedance 2.0 | 720p | $0.2050 | 60 | $0.6000 | 192.7% | 65.8% |
| Seedance 2.0 | 1080p | $0.5100 | 150 | $1.5000 | 194.1% | 66.0% |
| Seedance 2.0 | 4K | $1.0400 | 310 | $3.1000 | 198.1% | 66.5% |
| Seedance 2.0 Mini | 480p | $0.0475 | 15 | $0.1500 | 215.8% | 68.3% |
| Seedance 2.0 Mini | 720p | $0.1025 | 30 | $0.3000 | 192.7% | 65.8% |
| Kling 3.0 | 720p | $0.0600 | 20 | $0.2000 | 233.3% | 70.0% |
| Kling 3.0 | 1080p | $0.0800 | 25 | $0.2500 | 212.5% | 68.0% |
| Kling 3.0 | 4K | $0.3000 | 90 | $0.9000 | 200.0% | 66.7% |
| Kling 3.0 + Native Audio | 720p | $0.0900 | 30 | $0.3000 | 233.3% | 70.0% |
| Kling 3.0 + Native Audio | 1080p | $0.1200 | 40 | $0.4000 | 233.3% | 70.0% |

## 不同时长示例

| 模型 | 分辨率 | 时长 | KIE 成本 | Toolaze 扣点 | Toolaze 收入 | 相对成本利润率 |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Grok 1.5 Video | 480p | 5s | $0.0400 | 15 | $0.1500 | 275.0% |
| Grok 1.5 Video | 480p | 10s | $0.0800 | 30 | $0.3000 | 275.0% |
| Grok 1.5 Video | 480p | 15s | $0.1200 | 45 | $0.4500 | 275.0% |
| Grok 1.5 Video | 720p | 5s | $0.0750 | 25 | $0.2500 | 233.3% |
| Grok 1.5 Video | 720p | 10s | $0.1500 | 50 | $0.5000 | 233.3% |
| Grok 1.5 Video | 720p | 15s | $0.2250 | 75 | $0.7500 | 233.3% |
| Seedance 2.0 | 480p | 5s | $0.4750 | 150 | $1.5000 | 215.8% |
| Seedance 2.0 | 480p | 10s | $0.9500 | 300 | $3.0000 | 215.8% |
| Seedance 2.0 | 480p | 15s | $1.4250 | 450 | $4.5000 | 215.8% |
| Seedance 2.0 | 720p | 5s | $1.0250 | 300 | $3.0000 | 192.7% |
| Seedance 2.0 | 720p | 10s | $2.0500 | 600 | $6.0000 | 192.7% |
| Seedance 2.0 | 720p | 15s | $3.0750 | 900 | $9.0000 | 192.7% |
| Seedance 2.0 | 1080p | 5s | $2.5500 | 750 | $7.5000 | 194.1% |
| Seedance 2.0 | 1080p | 10s | $5.1000 | 1500 | $15.0000 | 194.1% |
| Seedance 2.0 | 1080p | 15s | $7.6500 | 2250 | $22.5000 | 194.1% |
| Seedance 2.0 | 4K | 5s | $5.2000 | 1550 | $15.5000 | 198.1% |
| Seedance 2.0 | 4K | 10s | $10.4000 | 3100 | $31.0000 | 198.1% |
| Seedance 2.0 | 4K | 15s | $15.6000 | 4650 | $46.5000 | 198.1% |
| Seedance 2.0 Mini | 480p | 5s | $0.2375 | 75 | $0.7500 | 215.8% |
| Seedance 2.0 Mini | 480p | 10s | $0.4750 | 150 | $1.5000 | 215.8% |
| Seedance 2.0 Mini | 480p | 15s | $0.7125 | 225 | $2.2500 | 215.8% |
| Seedance 2.0 Mini | 720p | 5s | $0.5125 | 150 | $1.5000 | 192.7% |
| Seedance 2.0 Mini | 720p | 10s | $1.0250 | 300 | $3.0000 | 192.7% |
| Seedance 2.0 Mini | 720p | 15s | $1.5375 | 450 | $4.5000 | 192.7% |
| Kling 3.0 | 720p | 5s | $0.3000 | 100 | $1.0000 | 233.3% |
| Kling 3.0 | 720p | 10s | $0.6000 | 200 | $2.0000 | 233.3% |
| Kling 3.0 | 720p | 15s | $0.9000 | 300 | $3.0000 | 233.3% |
| Kling 3.0 | 1080p | 5s | $0.4000 | 125 | $1.2500 | 212.5% |
| Kling 3.0 | 1080p | 10s | $0.8000 | 250 | $2.5000 | 212.5% |
| Kling 3.0 | 1080p | 15s | $1.2000 | 375 | $3.7500 | 212.5% |
| Kling 3.0 | 4K | 5s | $1.5000 | 450 | $4.5000 | 200.0% |
| Kling 3.0 | 4K | 10s | $3.0000 | 900 | $9.0000 | 200.0% |
| Kling 3.0 | 4K | 15s | $4.5000 | 1350 | $13.5000 | 200.0% |
| Kling 3.0 + Native Audio | 720p | 5s | $0.4500 | 150 | $1.5000 | 233.3% |
| Kling 3.0 + Native Audio | 720p | 10s | $0.9000 | 300 | $3.0000 | 233.3% |
| Kling 3.0 + Native Audio | 720p | 15s | $1.3500 | 450 | $4.5000 | 233.3% |
| Kling 3.0 + Native Audio | 1080p | 5s | $0.6000 | 200 | $2.0000 | 233.3% |
| Kling 3.0 + Native Audio | 1080p | 10s | $1.2000 | 400 | $4.0000 | 233.3% |
| Kling 3.0 + Native Audio | 1080p | 15s | $1.8000 | 600 | $6.0000 | 233.3% |

## 当前模型菜单最低点数

| 模型 | 菜单最低点数展示 | 计算依据 |
| --- | ---: | --- |
| Grok 1.5 Video | 3+ credits | 480p * 1s * 3 credits/s |
| Seedance 2.0 | 150+ credits | 480p * 5s * 30 credits/s |
| Seedance 2.0 Mini | 75+ credits | 480p * 5s * 15 credits/s |
| Kling 3.0 | 60+ credits | 720p * 3s * 20 credits/s |

## 成本来源

- 注意：KIE 页面里的 Seedance 2 Fast 与 Seedance 2 是两个不同模型类型；当前 `seedance-2` 使用截图中选中的 Seedance 2，不使用 Seedance 2 Fast。
- 当前 Toolaze 未接入 video-to-video 输入，因此 Seedance 2.0 使用 no-video 列；截图里的 with-video 低价列不用于当前扣费。
- Kling 3.0 不是同价：Toolaze UI 使用 720p / 1080p / 4K 三档，API 分别映射到 KIE 的 `std / pro / 4K` mode。
- Kling 3.0 Native Audio 只支持 720p / 1080p；4K 不开放 Native Audio。

| 模型 | KIE 成本口径 | Toolaze 定价来源 |
| --- | --- | --- |
| Grok 1.5 Video | KIE 公开页：480p $0.008/s，720p $0.015/s | `VIDEO_GENERATION_CREDIT_RATES['grok-1-5-video']` |
| Seedance 2.0 | KIE Seedance 2（非 Fast）页面 no-video 列：480p $0.095/s，720p $0.205/s，1080p $0.51/s，4K $1.04/s | `VIDEO_GENERATION_CREDIT_RATES['seedance-2']` |
| Seedance 2.0 Mini | Toolaze 现有 KIE 成本表：480p $0.0475/s，720p $0.1025/s | `VIDEO_GENERATION_CREDIT_RATES['seedance-2-mini']` |
| Kling 3.0 | Kling 3.0 no-native-audio 口径：720p 6 credits/s，1080p 8 credits/s，4K 30 credits/s；Native Audio 口径：720p 9 credits/s，1080p 12 credits/s；当前按 $0.01/credit 折算成本 | `VIDEO_GENERATION_CREDIT_RATES['kling-3']` |

## 实现说明

- 前端和后端现在共用按秒计算的视频扣点表。
- Generate 按钮显示：`calculateVideoGenerationCredits(selectedModelId, resolution, duration, { nativeAudio }) ?? modelConfig.minCredits`。
- Cloudflare Function 会对每个已配置的视频模型返回 `requiredCredits`，不再只对 Seedance 2.0 Mini 返回。
- 如果 KIE 调整任意模型的每秒成本，需要同步更新 `functions/_shared/generation-credits.mjs`、`src/lib/generation-credits.ts` 和本文档。
- Seedance 2.0 Mini 的价格建议在生产发布前用已登录的 KIE 后台再复核一次，因为它的公开价格页展示不如其它模型稳定。
