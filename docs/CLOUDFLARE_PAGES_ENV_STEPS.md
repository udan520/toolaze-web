# Cloudflare Pages 环境变量设置详细步骤

## 📍 找不到 Environment variables？按这个步骤来

### 步骤 1：登录并进入项目

1. 访问 https://dash.cloudflare.com/
2. 登录你的账号
3. 在左侧菜单点击 **"Workers & Pages"**
4. 找到并点击你的项目（如 `toolaze-web`）

### 步骤 2：进入 Settings（设置）

进入项目后，你会看到顶部有多个标签页：
- Overview（概览）
- Deployments（部署）
- **Settings（设置）** ← 点击这个
- Custom domains（自定义域名）
- Analytics（分析）

点击 **"Settings"** 标签页。

### 步骤 3：找到 Environment variables

在 Settings 页面中，向下滚动，你会看到几个部分：

#### 方式 A：在 "Builds & deployments" 部分（最常见）

1. 找到 **"Builds & deployments"** 部分
2. 在这个部分中，你会看到：
   - Build command
   - Build output directory
   - **Environment variables** ← 点击这里
3. 点击 **"Environment variables"** 旁边的 **"Add variable"** 按钮

#### 方式 B：直接在 Settings 页面查找

1. 在 Settings 页面中，查找 **"Environment variables"** 部分
2. 可能位于页面的中间或底部
3. 点击 **"Add variable"** 或展开该部分

#### 方式 C：如果还是找不到

1. 在 Settings 页面，查找 **"Variables"** 或 **"Environment"** 相关选项
2. 或者查看页面右上角是否有 **"Edit"** 或 **"Configure"** 按钮
3. 有些界面版本可能将环境变量放在 **"Build configuration"** 下

### 步骤 4：添加环境变量

1. **点击 "Add variable" 按钮**

2. **选择环境类型**：
   - **Production**：生产环境（必须）
   - **Preview**：预览环境（可选）

3. **填写变量信息**：
   - **Variable name（变量名）**：`NEXT_PUBLIC_IMAGE_UPLOAD_URL`
   - **Value（值）**：`https://toolaze-web.pages.dev/api/upload`
     - ⚠️ **重要**：将 `toolaze-web.pages.dev` 替换为你实际的 Pages 域名
     - 如果使用自定义域名，使用自定义域名（如 `https://toolaze.com/api/upload`）

4. **点击 "Save" 保存**

### 步骤 5：验证和重新部署

1. **确认变量已添加**：
   - 在 Environment variables 列表中，应该能看到你刚添加的变量
   - 确认环境类型（Production/Preview）正确

2. **重新部署项目**：
   - 方法 1：推送代码触发自动部署
   - 方法 2：在 **Deployments** 标签页，点击最新的部署 → **"Retry deployment"**
   - 方法 3：在 **Deployments** 标签页，点击 **"Create deployment"**

3. **等待部署完成**：
   - 部署通常需要 2-5 分钟
   - 可以在 Deployments 页面查看进度

## 🖼️ 界面参考

### Settings 页面结构（典型布局）

```
Settings 页面
├── General（常规设置）
│   ├── Project name
│   └── ...
├── Builds & deployments（构建和部署）
│   ├── Build command
│   ├── Build output directory
│   ├── Root directory
│   └── Environment variables ← 在这里！
│       └── [Add variable 按钮]
├── Functions（函数）
│   ├── R2 bucket bindings
│   └── Environment variables（这是给 Functions 用的，不是这个）
└── Custom domains（自定义域名）
```

## ❓ 常见问题

### Q: 我看到了两个 "Environment variables"，应该用哪个？

A: 
- **Builds & deployments** 下的 Environment variables：用于构建时的环境变量（包括 `NEXT_PUBLIC_*`）
- **Functions** 下的 Environment variables：用于 Pages Functions 运行时（如 `R2_PUBLIC_BASE_URL`）

**你需要设置的是第一个**（Builds & deployments 下的）。

### Q: 添加后立即生效吗？

A: 不是。`NEXT_PUBLIC_*` 环境变量在构建时注入，需要重新部署才能生效。

### Q: 如何确认环境变量已正确设置？

A: 
1. 在 Environment variables 列表中确认变量存在
2. 重新部署项目
3. 部署完成后，在浏览器控制台运行：
   ```javascript
   console.log(process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL)
   ```
   如果返回 `undefined`，说明需要重新部署。

### Q: 我使用的是自定义域名，应该填什么？

A: 使用你的自定义域名，例如：
- 如果自定义域名是 `toolaze.com`，则填写：`https://toolaze.com/api/upload`
- 如果自定义域名是 `www.toolaze.com`，则填写：`https://www.toolaze.com/api/upload`

## 🔗 相关链接

- [Cloudflare Pages 官方文档 - 环境变量](https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables)
- [Cloudflare Dashboard](https://dash.cloudflare.com/)

## 💡 提示

如果按照以上步骤仍然找不到 Environment variables，可以：

1. **截图你的 Settings 页面**，我可以帮你定位
2. **尝试搜索功能**：在 Settings 页面使用浏览器的搜索功能（Ctrl+F 或 Cmd+F），搜索 "Environment" 或 "变量"
3. **检查权限**：确保你的账号有修改项目设置的权限
4. **联系支持**：如果项目是团队项目，可能需要联系项目管理员
