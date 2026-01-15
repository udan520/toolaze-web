# Git 自动推送配置指南

配置完成后，AI 助手就可以自动为你推送代码到 GitHub，无需手动输入密码。

## 推荐方案：SSH Key（最安全且永久有效）

### 步骤 1：生成 SSH Key

在终端运行：

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

**注意事项**：
- 如果提示输入文件名，直接按回车使用默认路径 `~/.ssh/id_ed25519`
- 如果提示输入密码，可以直接按回车（不设密码）或设置一个密码
- 密码是可选的，设置后会增加安全性

### 步骤 2：启动 SSH Agent 并添加 Key

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### 步骤 3：复制公钥

```bash
cat ~/.ssh/id_ed25519.pub
```

复制输出的完整内容（以 `ssh-ed25519` 开头）

### 步骤 4：添加到 GitHub

1. 打开 GitHub：https://github.com/settings/keys
2. 点击 "New SSH key"
3. Title 填写：`MacBook Air`（或任何你喜欢的名称）
4. Key 类型选择：`Authentication Key`
5. Key 内容：粘贴刚才复制的公钥
6. 点击 "Add SSH key"

### 步骤 5：测试 SSH 连接

```bash
ssh -T git@github.com
```

如果看到 `Hi udan520! You've successfully authenticated...` 说明配置成功。

### 步骤 6：切换远程仓库到 SSH

在项目目录运行：

```bash
cd /Users/neva/Desktop/toolaze-web
git remote set-url origin git@github.com:udan520/toolaze-web.git
```

验证：

```bash
git remote -v
```

应该看到 `git@github.com:udan520/toolaze-web.git` 而不是 `https://`

### 步骤 7：测试推送

```bash
git push origin main
```

现在应该可以自动推送，无需输入密码了！

---

## 备选方案：GitHub CLI（简单但需要安装）

### 安装 GitHub CLI

```bash
# 使用 Homebrew 安装
brew install gh
```

### 登录 GitHub

```bash
gh auth login
```

按照提示选择：
- `GitHub.com`
- `HTTPS` 或 `SSH`（推荐 HTTPS）
- `Login with a web browser` 或 `Paste an authentication token`

完成登录后，就可以自动推送了。

---

## 备选方案：Personal Access Token（不推荐，每次需要输入）

如果以上方案都不适合，可以使用 Token：

1. 创建 Token：https://github.com/settings/tokens/new
   - Note: `Toolaze Web Push`
   - Expiration: 选择过期时间（建议 90 天或更长）
   - 勾选 `repo` 权限
   - 点击 "Generate token"
   - **重要**：复制生成的 Token（只显示一次）

2. 推送时使用：
   - Username: 你的 GitHub 用户名
   - Password: 粘贴 Token（不是 GitHub 密码）

这种方式需要每次推送时输入，不够自动化。

---

## 验证配置

配置完成后，运行：

```bash
cd /Users/neva/Desktop/toolaze-web
git push origin main
```

如果不需要输入密码就能推送，说明配置成功！

---

## 配置完成后

配置完成后，告诉 AI 助手"已配置完成"，以后就可以直接使用 `git push` 自动推送代码了。
