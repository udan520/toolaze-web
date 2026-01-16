# 环境安装指南 - Mac 电脑

## 必需的软件

### 1. Node.js（必需）
项目要求 Node.js 版本 >= 20.0.0

**安装方法：**

#### 方法一：使用 Homebrew（推荐）
```bash
# 如果还没有安装 Homebrew，先安装它
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 Node.js
brew install node
```

#### 方法二：从官网下载
访问 [https://nodejs.org/](https://nodejs.org/)
下载并安装 LTS 版本（推荐 v20 或更高版本）

**验证安装：**
```bash
node --version  # 应该显示 v20.x.x 或更高版本
npm --version   # 应该显示 10.x.x 或更高版本
```

### 2. Git（可选，但推荐）
如果你需要从 Git 仓库克隆或提交代码：

```bash
# 检查是否已安装
git --version

# 如果没有，使用 Homebrew 安装
brew install git
```

## 项目安装步骤

安装好 Node.js 后，按照以下步骤设置项目：

### 1. 进入项目目录
```bash
cd /Users/neva/Desktop/toolaze-web
```

### 2. 安装项目依赖
```bash
npm install
```

这将安装以下主要依赖：
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- 以及其他项目依赖

### 3. 运行开发服务器
```bash
npm run dev
```

服务器将在 **http://localhost:3006** 启动（注意：端口是 3006，不是默认的 3000）

### 4. 构建生产版本（可选）
```bash
npm run build    # 构建静态文件
npm start        # 启动生产服务器（端口 3006）
```

## 系统要求

- **操作系统**: macOS（你当前使用的是 macOS 13）
- **Node.js**: >= 20.0.0
- **npm**: 通常随 Node.js 一起安装
- **内存**: 建议至少 4GB RAM
- **磁盘空间**: 至少 500MB 可用空间（用于 node_modules）

## 常见问题

### 如果 npm install 很慢或失败
可以尝试使用国内镜像：
```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com

# 然后重新安装
npm install
```

### 如果端口 3006 已被占用
可以修改 `package.json` 中的端口号，或者关闭占用该端口的程序。

### 权限问题
如果遇到权限问题，可能需要使用 `sudo`，但通常不需要。

## 验证环境是否就绪

运行以下命令检查：
```bash
node --version    # 应该 >= v20.0.0
npm --version     # 应该 >= v10.0.0
cd /Users/neva/Desktop/toolaze-web
npm install       # 安装依赖
npm run dev       # 启动开发服务器
```

如果所有步骤都成功，你应该能在浏览器中访问 http://localhost:3006 看到网站。
