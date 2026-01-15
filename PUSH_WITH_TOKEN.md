# 使用 Personal Access Token 推送代码

由于你的网络环境可能阻止了SSH连接，我们使用HTTPS + Token的方式。

## 快速设置（一次性操作）

### 步骤 1：创建 GitHub Personal Access Token

1. 访问：https://github.com/settings/tokens/new
2. 填写信息：
   - **Note**: `Toolaze Web Push`
   - **Expiration**: 选择 `90 days` 或 `No expiration`（根据你的安全需求）
   - **勾选权限**: `repo`（所有仓库权限）
3. 点击 **"Generate token"**
4. **重要**：复制生成的 token（只显示一次，格式类似：`ghp_xxxxxxxxxxxxxxxxxxxx`）

### 步骤 2：配置 Git Credential Helper

在终端运行：

```bash
# macOS 使用钥匙串存储
git config --global credential.helper osxkeychain
```

### 步骤 3：首次推送时输入凭据

运行推送命令：

```bash
cd /Users/neva/Desktop/toolaze-web
git push origin main
```

当提示时输入：
- **Username**: `udan520`（你的GitHub用户名）
- **Password**: 粘贴刚才复制的 Token（不是GitHub密码）

macOS会自动将凭据保存到钥匙串，**以后就不需要再输入了**！

---

## 验证配置

配置完成后，再次推送：

```bash
git push origin main
```

应该可以直接推送，不需要输入密码。

---

## 备选：使用 SSH（如果网络允许）

如果你的网络环境支持SSH，可以：

1. 确认SSH key已添加到GitHub：
   - 检查：`cat ~/.ssh/id_ed25519.pub`
   - 访问：https://github.com/settings/keys
   - 确保公钥已添加

2. 切换回SSH：
   ```bash
   git remote set-url origin git@github.com:udan520/toolaze-web.git
   git push origin main
   ```

---

## 完成后

配置完成后，告诉AI助手"Token已配置完成"，以后就可以自动推送了！
