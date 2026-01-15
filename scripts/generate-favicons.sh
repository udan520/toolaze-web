#!/bin/bash

# 生成不同尺寸的 favicon 文件
# 需要安装 ImageMagick 或使用在线工具

echo "🎨 生成 Favicon 文件..."
echo ""

# 检查 ImageMagick 是否安装
if command -v convert &> /dev/null; then
    echo "✅ 检测到 ImageMagick"
    
    # 从 SVG 生成 PNG
    if [ -f "public/favicon.svg" ]; then
        # 生成 16x16
        convert -background none -resize 16x16 public/favicon.svg public/favicon-16x16.png
        echo "✅ 生成 favicon-16x16.png"
        
        # 生成 32x32
        convert -background none -resize 32x32 public/favicon.svg public/favicon-32x32.png
        echo "✅ 生成 favicon-32x32.png"
        
        # 生成 180x180 (Apple touch icon)
        convert -background white -resize 180x180 public/favicon.svg public/apple-touch-icon.png
        echo "✅ 生成 apple-touch-icon.png"
        
        echo ""
        echo "✨ 所有 favicon 文件已生成！"
    else
        echo "❌ 未找到 public/favicon.svg"
    fi
else
    echo "⚠️  未安装 ImageMagick"
    echo ""
    echo "请选择以下方式之一："
    echo ""
    echo "1. 安装 ImageMagick（推荐）："
    echo "   brew install imagemagick"
    echo "   然后重新运行此脚本"
    echo ""
    echo "2. 使用在线工具："
    echo "   - 访问 https://realfavicongenerator.net/"
    echo "   - 上传 public/favicon.svg"
    echo "   - 下载并解压到 public/ 目录"
    echo ""
    echo "3. 手动创建："
    echo "   - 在图像编辑器中打开 favicon.svg"
    echo "   - 导出为以下尺寸的 PNG："
    echo "     - favicon-16x16.png (16x16)"
    echo "     - favicon-32x32.png (32x32)"
    echo "     - apple-touch-icon.png (180x180，带白色背景)"
fi
