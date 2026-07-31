# Toolaze 模型成本定价表

最后同步日期：2026-07-31

## 覆盖范围

本文档覆盖当前共享生成组件中已经接入的图片与视频模型：

- 图片模型：`src/lib/ai-image-generator-config.ts`
- 视频模型：`src/lib/ai-video-generator-config.ts`
- 前端扣点函数：`src/lib/generation-credits.ts`
- Cloudflare 后端扣点函数：`functions/_shared/generation-credits.mjs`

## 定价规则

- Toolaze 收入口径固定按 **$0.005 / credit**（当前最便宜套餐折算）。
- 图片类已核实 KIE 成本规格使用：**目标售价 = KIE API成本 × 3**。
- 视频类已核实 KIE 成本规格使用：**目标售价 = KIE API成本 × 2**。
- 视频 Toolaze 扣点使用：**credits = round(目标售价 / $0.005)**，即按最接近的整数 credits 四舍五入。
- 末位为 9 的 credits 统一进位到下一个整十，例如 9→10、19→20、29→30。
- 图片示例：KIE API成本 **$0.015 / 张图** → 目标售价 **$0.045** → **9 credits** → **10 credits**。
- 视频示例：KIE API成本 **$0.008 / 输出秒** → 目标售价 **$0.016** → `0.016 / 0.005 = 3.2` → **3 credits / 输出秒**。
- Toolaze 收入 = `credits × $0.005`；由于 credits 必须是整数且视频使用四舍五入，收入可能略高或略低于对应目标倍数。
- 成本率 = `KIE API成本 / Toolaze收入`；毛利率 = `(Toolaze收入 - KIE API成本) / Toolaze收入`。
- KIE 成本缺失、单位不匹配或页面未列出的规格标为待确认，不用现有 Toolaze 功能价反推供应商成本。
- 未计入支付通道手续费、失败重试、退款、存储、带宽和客服成本。

## 图片模型扣点表

| 模型 | modelId | Provider | 菜单最低 | 全部档位 | 备注 |
| --- | --- | --- | ---: | --- | --- |
| Nano Banana Pro | `nano-banana-pro` | Google | 24 credits ($0.120) | 1K: 24 credits<br>2K: 24 credits<br>4K: 42 credits | 按 KIE 成本 ×3 |
| Nano Banana 2 | `nano-banana-2` | Google | 15 credits ($0.075) | 1K: 15 credits<br>2K: 24 credits<br>4K: 36 credits | 按 KIE 成本 ×3 |
| Nano Banana 2 Lite | `nano-banana-2-lite` | Google | 10 credits ($0.050) | 1K: 10 credits | $0.015 ×3 → 9 credits → 10 credits |
| GPT Image 2 | `gpt-image-2` | OpenAI | 10 credits ($0.050) | 1K: 10 credits<br>2K: 15 credits<br>4K: 24 credits | 按 KIE 中文可见价口径；1K 9→10 |
| GPT Image 1.5 | `gpt-image-1-5` | OpenAI | 12 credits ($0.060) | medium: 12 credits<br>high: 66 credits | 按 KIE 成本 ×3 |
| Grok 1.5 Image | `grok-1-5-image` | xAI | 10 credits（待确认） | 1K: 10 credits<br>2K: 15 credits<br>4K: 20 credits | KIE 成本单位与 1K/2K/4K 不一致，成本率待确认 |
| Grok Video 1.5 | `grok-video-1-5` | xAI | 3 credits/s | 480p: 3 credits/s<br>720p: 6 credits/s | 使用 Grok 1.5 Video 同一套视频扣点 |
| Seedream 4.5 | `seedream-4-5` | ByteDance | 20 credits ($0.100) | 1K: 20 credits<br>2K: 20 credits<br>4K: 20 credits | 按 KIE 成本 ×3 |
| Seedream 5.0 Lite | `seedream-5-0-lite` | ByteDance | 17 credits ($0.085) | 1K: 17 credits<br>2K: 17 credits<br>4K: 17 credits | 按 KIE 成本 ×3 |
| Seedream 5.0 Pro | `seedream-5-0-pro` | ByteDance | 21 credits ($0.105) | 1K: 21 credits<br>2K: 42 credits | 按 KIE 成本 ×3 |
| Wan 2.7 Image | `wan-2-7-image` | Wan AI | 15 credits ($0.075) | 1K: 15 credits<br>2K: 15 credits<br>4K: 15 credits | 按 KIE 成本 ×3 |
| Flux 2 Pro | `flux-2-pro` | Black Forest Labs | 15 credits ($0.075) | 1K: 15 credits<br>2K: 21 credits | 按 KIE 成本 ×3 |
| Flux 2 Flex | `flux-2-flex` | Black Forest Labs | 42 credits ($0.210) | 1K: 42 credits<br>2K: 72 credits | 按 KIE 成本 ×3 |

## 视频模型菜单最低点数

| 模型 | modelId | Provider | 菜单最低 | 计算依据 | Native Audio |
| --- | --- | --- | ---: | --- | --- |
| Grok 1.5 Video | `grok-1-5-video` | xAI | 3+ credits | 480p × 1秒 | 能力标签支持输出；无独立加价表 |
| Seedance 2.0 | `seedance-2` | ByteDance | 190+ credits | 480p × 5秒 | 能力标签支持输出；无独立加价表 |
| Seedance 2.0 Mini | `seedance-2-mini` | ByteDance | 100+ credits | 480p × 5秒 | 能力标签支持输出；无独立加价表 |
| Seedance 2.0 Fast | `seedance-2-fast` | ByteDance | 155+ credits | 480p × 5秒 | 未核实成本，暂不开放 Native Audio 定价 |
| Seedance 1.5 Pro | `seedance-1-5-pro` | ByteDance | 16+ credits | 480p × 4秒 | 有独立加价表 |
| Seedance 1.0 Pro Fast | `seedance-1-pro-fast` | ByteDance | 32+ credits | 720p × 5秒 × 1个视频 | 不支持 |
| Seedance 1.0 Pro | `seedance-1-pro` | ByteDance | 30+ credits | 480p × 5秒 | 不支持 |
| Seedance 1.0 Lite | `seedance-1-lite` | ByteDance | 20+ credits | 480p × 5秒 | 不支持 |
| Wan 2.7 | `wan-2-7` | Alibaba | 64+ credits | 720p × 2秒 | 不支持 |
| Wan 2.6 | `wan-2-6` | Alibaba | 140+ credits | 720p × 5秒 | 能力标签支持输出；无独立加价表 |
| Wan 2.5 | `wan-2-5` | Alibaba | 120+ credits | 720p × 5秒 | 能力标签支持输出；无独立加价表 |
| Wan 2.2 | `wan-2-2` | Alibaba | 16+ credits | 480p × 5秒 × 1个视频 | 不支持 |
| Kling 3 Turbo | `kling-3-turbo` | Kuaishou | 180+ credits | 720p × 5秒 | 能力标签支持输出；无独立加价表 |
| Kling 3.0 | `kling-3` | Kuaishou | 84+ credits | 720p × 3秒 | 有独立加价表 |
| Kling 2.6 | `kling-2-6` | Kuaishou | 110+ credits | 720p × 5秒 | 有独立加价表 |
| Kling 2.5 Turbo Pro | `kling-2-5` | Kuaishou | 85+ credits | 1080p × 5秒 | 不支持 |
| Kling 2.1 Master | `kling-2-1` | Kuaishou | 320+ credits | 1080p × 5秒 | 不支持 |
| Veo 3.1 Lite | `veo-3-1-lite` | Google | 30+ credits | 720p × 1个视频 | 能力标签支持输出；无独立加价表 |
| Veo 3.1 Fast | `veo-3-1-fast` | Google | 60+ credits | 720p × 1个视频 | 能力标签支持输出；无独立加价表 |
| Veo 3.1 Quality | `veo-3-1-quality` | Google | 450+ credits | 720p × 1个视频 | 能力标签支持输出；无独立加价表 |
| PixVerse V6 | `pixverse-v6` | PixVerse | 8+ credits | 360p × 1秒 | 有独立加价表 |
| HappyHorse 1.1 | `happyhorse-1-1` | Alibaba | 135+ credits | 720p × 3秒 | 能力标签支持输出；无独立加价表 |
| HappyHorse | `happyhorse` | Alibaba | 168+ credits | 720p × 3秒 | 能力标签支持输出；无独立加价表 |

## 视频模型扣点规则

| 模型 | modelId | 计费方式 | 普通扣点 | Native Audio 扣点 |
| --- | --- | --- | --- | --- |
| Grok 1.5 Video | `grok-1-5-video` | 按秒 | 480p: 3/s<br>720p: 6/s | 无独立加价表 |
| Seedance 2.0 | `seedance-2` | 按秒 | 480p: 38/s<br>720p: 82/s<br>1080p: 204/s<br>4K: 416/s | 无独立加价表 |
| Seedance 2.0 Mini | `seedance-2-mini` | 按秒 | 480p: 20/s<br>720p: 41/s | 无独立加价表 |
| Seedance 2.0 Fast | `seedance-2-fast` | 按秒 | 480p: 31/s<br>720p: 66/s<br>1080p/4K: 待确认，暂不开放 | 待确认，暂不开放 |
| Seedance 1.5 Pro | `seedance-1-5-pro` | 按秒 | 480p: 4/s<br>720p: 7/s<br>1080p: 15/s | 480p: 7/s<br>720p: 14/s<br>1080p: 30/s |
| Seedance 1.0 Pro Fast | `seedance-1-pro-fast` | 固定规格 | 720p: 5s = 32, 10s = 72<br>1080p: 5s = 72, 10s = 144 | 不支持 |
| Seedance 1.0 Pro | `seedance-1-pro` | 按秒 | 480p: 6/s<br>720p: 12/s<br>1080p: 28/s | 不支持 |
| Seedance 1.0 Lite | `seedance-1-lite` | 按秒 | 480p: 4/s<br>720p: 10/s<br>1080p: 20/s | 不支持 |
| Wan 2.7 | `wan-2-7` | 按秒 | 720p: 32/s<br>1080p: 48/s | 不支持 |
| Wan 2.6 | `wan-2-6` | 按秒 | 720p: 28/s<br>1080p: 42/s | 无独立加价表 |
| Wan 2.5 | `wan-2-5` | 按秒 | 720p: 24/s<br>1080p: 40/s | 无独立加价表 |
| Wan 2.2 | `wan-2-2` | 混合 | 480p: 5秒单个视频 = 16<br>720p: 32/s | 不支持 |
| Kling 3 Turbo | `kling-3-turbo` | 按秒 | 720p: 36/s<br>1080p: 45/s | 无独立加价表 |
| Kling 3.0 | `kling-3` | 按秒 | 720p: 28/s<br>1080p: 36/s<br>4K: 134/s | 720p: 40/s<br>1080p: 54/s |
| Kling 2.6 | `kling-2-6` | 按秒 | 720p: 22/s<br>1080p: 22/s | 720p: 44/s<br>1080p: 44/s |
| Kling 2.5 Turbo Pro | `kling-2-5` | 按秒 | 1080p: 17/s | 不支持 |
| Kling 2.1 Master | `kling-2-1` | 按秒 | 1080p: 64/s | 不支持 |
| Veo 3.1 Lite | `veo-3-1-lite` | 固定每条 | 720p: 30/video<br>1080p: 45/video | 无独立加价表 |
| Veo 3.1 Fast | `veo-3-1-fast` | 固定每条 | 720p: 60/video<br>1080p: 75/video | 无独立加价表 |
| Veo 3.1 Quality | `veo-3-1-quality` | 固定每条 | 720p: 450/video<br>1080p: 465/video | 无独立加价表 |
| PixVerse V6 | `pixverse-v6` | 按秒 | 360p: 8/s<br>540p: 11/s<br>720p: 14/s<br>1080p: 30/s | 360p: 11/s<br>540p: 14/s<br>720p: 20/s<br>1080p: 37/s |
| HappyHorse 1.1 | `happyhorse-1-1` | 按秒 | 720p: 45/s<br>1080p: 58/s | 无独立加价表 |
| HappyHorse | `happyhorse` | 按秒 | 720p: 56/s<br>1080p: 96/s | 无独立加价表 |

## 已复核供应商成本口径

以下只展示 KIE / 官方成本已经写入表格的代表性规格；完整明细见 `docs/model-costs.csv` 和 `docs/model-costs.xlsx`。

| 模型 | 分辨率 / 规格 | KIE / 官方成本 | Toolaze 扣点 | Toolaze 收入 | 成本率 | 毛利率 |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Nano Banana 2 Lite | 1K | $0.0150/张图 | 10/张图 | $0.0500/张图 | 30.0% | 70.0% |
| GPT Image 1.5 | high | $0.1100/张图 | 66/张图 | $0.3300/张图 | 33.3% | 66.7% |
| Flux 2 Flex | 2K | $0.1200/张图 | 72/张图 | $0.3600/张图 | 33.3% | 66.7% |
| Grok 1.5 Video | 480p | $0.0080/s | 3/s | $0.0150/s | 53.3% | 46.7% |
| Grok 1.5 Video | 720p | $0.0150/s | 6/s | $0.0300/s | 50.0% | 50.0% |
| Seedance 2.0 | 480p | $0.0950/s | 38/s | $0.1900/s | 50.0% | 50.0% |
| Seedance 2.0 | 1080p | $0.5100/s | 204/s | $1.0200/s | 50.0% | 50.0% |
| Seedance 2.0 Fast | 480p | $0.0775/s | 31/s | $0.1550/s | 50.0% | 50.0% |
| Seedance 2.0 Fast | 1080p / 4K / Native Audio | 待确认 | 待确认 | 待确认 | 待确认 | 待确认 |
| Seedance 1.0 Pro Fast | 720p 5秒 | $0.0800/视频 | 32/视频 | $0.1600/视频 | 50.0% | 50.0% |
| Wan 2.2 | 480p 5秒 | $0.0400/视频 | 16/视频 | $0.0800/视频 | 50.0% | 50.0% |
| Kling 3.0 | 4K | $0.3350/s | 134/s | $0.6700/s | 50.0% | 50.0% |
| Kling 3.0 + Native Audio | 1080p | $0.1350/s | 54/s | $0.2700/s | 50.0% | 50.0% |
| Veo 3.1 Fast | 1080p | $0.1875/视频 | 75/视频 | $0.3750/视频 | 50.0% | 50.0% |
| HappyHorse | 1080p | $0.2400/s | 96/s | $0.4800/s | 50.0% | 50.0% |

## 成本来源摘要

| 模型 | 成本口径 | Toolaze 定价来源 |
| --- | --- | --- |
| Grok 1.5 Video | KIE 公开页：480p $0.008/s，720p $0.015/s | `VIDEO_GENERATION_CREDIT_RATES['grok-1-5-video']` |
| Seedance 2.0 | KIE Seedance 2 no-video 列：480p $0.095/s，720p $0.205/s，1080p $0.51/s，4K $1.04/s | `VIDEO_GENERATION_CREDIT_RATES['seedance-2']` |
| Seedance 2.0 Mini | KIE Seedance 2.0 Mini：480p $0.0475/s，720p $0.1025/s | `VIDEO_GENERATION_CREDIT_RATES['seedance-2-mini']` |
| Seedance 2.0 Fast | KIE Seedance 2.0 Fast：普通 480p $0.0775/s，720p $0.165/s；1080p、4K 和 Native Audio 待确认 | `VIDEO_GENERATION_CREDIT_RATES['seedance-2-fast']` |
| Wan 2.7 | KIE Wan 2.7：720p $0.08/s，1080p $0.12/s | `VIDEO_GENERATION_CREDIT_RATES['wan-2-7']` |
| Wan 2.6 / Wan 2.5 | KIE Wan 2.6：720p $0.07/s，1080p $0.105/s；Wan 2.5：720p $0.06/s，1080p $0.10/s | `VIDEO_GENERATION_CREDIT_RATES['wan-2-6']` / `['wan-2-5']` |
| Kling 3.0 | KIE Kling 3.0：720p $0.07/s，1080p $0.09/s，4K $0.335/s；Native Audio：720p $0.10/s，1080p $0.135/s | `VIDEO_GENERATION_CREDIT_RATES['kling-3']` |
| Veo 3.1 | KIE Veo 3.1 固定视频价：Lite / Fast / Quality 三档 | `VIDEO_GENERATION_CREDIT_RATES['veo-3-1-*']` |
| PixVerse V6 | PixVerse V6 官方价格映射到 Toolaze credits | `VIDEO_GENERATION_CREDIT_RATES['pixverse-v6']` |
| HappyHorse | KIE HappyHorse 产品价映射到 Toolaze credits | `VIDEO_GENERATION_CREDIT_RATES['happyhorse*']` |

## 实现说明

- 前端和后端必须保持同一套扣点规则：`src/lib/generation-credits.ts` 与 `functions/_shared/generation-credits.mjs`。
- Generate 按钮显示：`calculateVideoGenerationCredits(selectedModelId, resolution, duration, { nativeAudio }) ?? modelConfig.minCredits`。
- Cloudflare Function 会用同一规则计算 `requiredCredits`；若视频模型没有可用价格，会返回 `Video pricing is not configured for this model.`。
- 如果供应商调整任意模型成本，需要同步更新：
  - `functions/_shared/generation-credits.mjs`
  - `src/lib/generation-credits.ts`
  - `docs/video-model-costs.md`
  - `docs/model-costs.csv`
  - `docs/model-costs.xlsx`
- 生产发布前建议重新核对 KIE 后台成本，尤其是 Seedance、Wan、Veo、PixVerse、HappyHorse 这些新增或波动较大的模型。
