#!/bin/bash

# 快速上传图片到 R2 并获取 URL
# 使用方法: ./scripts/quick-upload.sh /path/to/image.jpg

if [ $# -eq 0 ]; then
    echo "❌ 请提供图片路径"
    echo "用法: ./scripts/quick-upload.sh /path/to/image.jpg [自定义文件名]"
    exit 1
fi

IMAGE_PATH="$1"
CUSTOM_NAME="$2"

# 检查文件是否存在
if [ ! -f "$IMAGE_PATH" ]; then
    echo "❌ 文件不存在: $IMAGE_PATH"
    exit 1
fi

# 检查环境变量
if [ -z "$R2_ACCESS_KEY_ID" ] || [ -z "$R2_SECRET_ACCESS_KEY" ] || [ -z "$R2_ENDPOINT_URL" ] || [ -z "$R2_PUBLIC_BASE_URL" ]; then
    echo "❌ 请先设置环境变量："
    echo "  export R2_ACCESS_KEY_ID=\"你的 Access Key\""
    echo "  export R2_SECRET_ACCESS_KEY=\"你的 Secret Key\""
    echo "  export R2_ENDPOINT_URL=\"你的 Endpoint URL\""
    echo "  export R2_PUBLIC_BASE_URL=\"你的 R2 公网域名\""
    exit 1
fi

echo "📤 正在上传: $IMAGE_PATH"
echo ""

if [ -z "$CUSTOM_NAME" ]; then
    # 自动生成文件名
    python3 scripts/r2_upload.py "$IMAGE_PATH"
else
    # 使用自定义文件名
    python3 scripts/r2_upload.py "$IMAGE_PATH" "$CUSTOM_NAME"
fi
