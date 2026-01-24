# 分支策略说明

## 分支结构

### main 分支（主分支）
- **用途**: 生产环境使用的稳定版本
- **内容**: 不包含 AI 生图/生视频功能
- **状态**: 当前稳定，已部署

### feature/ai-generation 分支（功能分支）
- **用途**: 开发中的 AI 生图/生视频功能
- **内容**: 包含以下功能：
  - 文生图（Text to Image）
  - 图生图（Image to Image）
  - 文生视频（Text to Video）
  - 点数系统（Credits System）
  - Stripe 支付集成
  - 导航栏中的 "AI Video" 菜单

## 相关文件

### 生图/生视频功能文件（仅在 feature/ai-generation 分支）
```
src/app/qwen-demo/              # 图生图页面
src/app/qwen-text-to-image/     # 文生图页面
src/app/text-to-video/          # 文生视频页面
src/lib/credits.ts              # 点数管理工具
src/components/CreditsDisplay.tsx  # 点数显示组件
src/components/StripePaymentLink.tsx  # Stripe 支付链接组件
src/app/payment/                # 支付相关页面
src/app/api/proxy/              # API 代理路由
```

### 导航栏修改（仅在 feature/ai-generation 分支）
- `src/components/Navigation.tsx` 包含 "AI Video" 菜单项

## 分支切换

### 查看所有分支
```bash
git branch -a
```

### 切换到功能分支（开发 AI 功能）
```bash
git checkout feature/ai-generation
```

### 切换回主分支（生产环境）
```bash
git checkout main
```

### 查看当前分支
```bash
git branch
```

## 合并到主分支（当准备上线时）

当准备将 AI 功能上线到生产环境时：

1. **切换到主分支**
   ```bash
   git checkout main
   ```

2. **合并功能分支**
   ```bash
   git merge feature/ai-generation
   ```

3. **解决冲突**（如果有）
   - 主要冲突可能在 `src/components/Navigation.tsx`
   - 需要手动合并 AI Video 菜单项

4. **测试并提交**
   ```bash
   git add .
   git commit -m "feat: Merge AI generation features to main"
   ```

5. **推送到远程**
   ```bash
   git push origin main
   ```

## 推送功能分支到远程

如果需要将功能分支推送到远程仓库（用于备份或协作）：

```bash
# 切换到功能分支
git checkout feature/ai-generation

# 推送到远程
git push -u origin feature/ai-generation
```

## 注意事项

1. **主分支不包含 AI 功能**: main 分支的导航栏中没有 "AI Video" 菜单项
2. **功能分支包含完整功能**: feature/ai-generation 分支包含所有开发中的功能
3. **点数系统**: 点数系统相关代码也在功能分支中，主分支不包含
4. **支付功能**: Stripe 支付集成也在功能分支中

## 当前状态

- ✅ **main 分支**: 干净，不包含 AI 功能入口
- ✅ **feature/ai-generation 分支**: 包含所有 AI 功能，已提交
- ⏳ **待推送**: 功能分支尚未推送到远程仓库（可选）

## 开发工作流

### 开发新功能
1. 切换到功能分支: `git checkout feature/ai-generation`
2. 进行开发
3. 提交更改: `git add . && git commit -m "feat: ..."`
4. 推送到远程（可选）: `git push origin feature/ai-generation`

### 修复主分支问题
1. 切换到主分支: `git checkout main`
2. 创建修复分支: `git checkout -b hotfix/...`
3. 修复并合并回主分支

### 准备上线 AI 功能
1. 在功能分支完成所有开发和测试
2. 切换到主分支并合并功能分支
3. 测试合并后的代码
4. 推送到远程并部署
