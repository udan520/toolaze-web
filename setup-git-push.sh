#!/bin/bash

# Git 自动推送配置脚本
# 用于配置 SSH key，实现自动推送代码到 GitHub

echo "🚀 开始配置 Git 自动推送..."
echo ""

# 检查是否已有 SSH key
if [ -f ~/.ssh/id_ed25519 ] || [ -f ~/.ssh/id_rsa ]; then
    echo "✅ 检测到已有 SSH key"
    if [ -f ~/.ssh/id_ed25519 ]; then
        KEY_FILE=~/.ssh/id_ed25519.pub
    else
        KEY_FILE=~/.ssh/id_rsa.pub
    fi
else
    echo "📝 生成新的 SSH key..."
    read -p "请输入你的 GitHub 邮箱 (可选，直接回车跳过): " email
    if [ -z "$email" ]; then
        ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N ""
    else
        ssh-keygen -t ed25519 -C "$email" -f ~/.ssh/id_ed25519 -N ""
    fi
    KEY_FILE=~/.ssh/id_ed25519.pub
fi

# 启动 SSH agent 并添加 key
echo ""
echo "🔑 添加 SSH key 到 agent..."
eval "$(ssh-agent -s)" > /dev/null
ssh-add ~/.ssh/id_ed25519 2>/dev/null || ssh-add ~/.ssh/id_rsa 2>/dev/null

# 显示公钥
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 请复制下面的 SSH 公钥："
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cat $KEY_FILE
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📌 接下来的步骤："
echo "   1. 打开浏览器访问: https://github.com/settings/keys"
echo "   2. 点击 'New SSH key'"
echo "   3. Title: 填写 'MacBook Air' 或任何名称"
echo "   4. Key 类型: 选择 'Authentication Key'"
echo "   5. Key: 粘贴上面复制的公钥内容"
echo "   6. 点击 'Add SSH key'"
echo ""
read -p "按回车键继续（完成添加 SSH key 后）..." 

# 测试 SSH 连接
echo ""
echo "🔍 测试 GitHub SSH 连接..."
ssh_output=$(ssh -T git@github.com 2>&1)
if echo "$ssh_output" | grep -q "successfully authenticated"; then
    echo "✅ SSH 连接成功！"
else
    echo "⚠️  SSH 连接测试失败，请检查是否已正确添加 SSH key 到 GitHub"
    echo "   输出: $ssh_output"
    exit 1
fi

# 切换远程仓库到 SSH
echo ""
echo "🔄 切换远程仓库到 SSH..."
cd "$(dirname "$0")"
current_url=$(git remote get-url origin 2>/dev/null)
if [[ $current_url == https://* ]]; then
    git remote set-url origin git@github.com:udan520/toolaze-web.git
    echo "✅ 已切换远程仓库地址到 SSH"
else
    echo "ℹ️  远程仓库已经是 SSH 地址"
fi

# 验证配置
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 配置完成！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "现在你可以测试推送："
echo "   git push origin main"
echo ""
echo "或者告诉 AI 助手 '已配置完成'，以后就可以自动推送了！"
echo ""
