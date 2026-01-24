const fs = require('fs');
const path = require('path');

// 读取 CSV 文件
// 支持两种路径：相对路径（开发时）和绝对路径（用户文件）
const userCsvPath = 'C:\\Users\\admin\\Downloads\\1111\\全屏水印\\font-generator_broad-match_us_2026-01-24.csv';
const csvPath = fs.existsSync(userCsvPath) ? userCsvPath : path.join(__dirname, '../../Downloads/1111/全屏水印/font-generator_broad-match_us_2026-01-24.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// 解析 CSV
const lines = csvContent.split('\n').filter(line => line.trim());
const headers = lines[0].split(',').map(h => h.trim());

// 提取数据
const keywords = [];
for (let i = 1; i < lines.length; i++) {
  const values = lines[i].split(',').map(v => v.trim());
  if (values.length >= 4) {
    keywords.push({
      keyword: values[0],
      volume: parseInt(values[1]) || 0,
      difficulty: parseInt(values[2]) || 0,
      results: parseInt(values[3]) || 0
    });
  }
}

// 分类关键词
const primaryKeywords = [];
const longTailKeywords = [];
const relatedKeywords = [];

// 主关键词：搜索量大（>=10000），用于核心页面
// 长尾关键词：搜索量中等（1000-10000），用于特定三级页面
// 相关关键词：搜索量较小（<1000）或搜索量大但难度高的，用于内容嵌入

keywords.forEach(kw => {
  // 主关键词：搜索量 >= 10000
  if (kw.volume >= 10000) {
    primaryKeywords.push({
      keyword: kw.keyword,
      searchVolume: kw.volume,
      difficulty: kw.difficulty,
      type: 'primary',
      notes: `主关键词，搜索量 ${kw.volume.toLocaleString()}，难度 ${kw.difficulty}`
    });
  }
  // 长尾关键词：搜索量 1000-9999，或搜索量>=10000但难度较低（<50）
  else if (kw.volume >= 1000 || (kw.volume >= 5000 && kw.difficulty < 50)) {
    // 尝试推断目标页面
    let targetPage = null;
    const keywordLower = kw.keyword.toLowerCase();
    
    // 根据关键词推断页面
    if (keywordLower.includes('cursive')) targetPage = 'cursive-font-generator';
    else if (keywordLower.includes('fancy')) targetPage = 'fancy-font-generator';
    else if (keywordLower.includes('bold')) targetPage = 'bold-font-generator';
    else if (keywordLower.includes('tattoo')) targetPage = 'tattoo-font-generator';
    else if (keywordLower.includes('cool')) targetPage = 'cool-font-generator';
    else if (keywordLower.includes('instagram')) targetPage = 'instagram-font-generator';
    else if (keywordLower.includes('italic')) targetPage = 'italic-font-generator';
    else if (keywordLower.includes('calligraphy')) targetPage = 'calligraphy-font-generator';
    else if (keywordLower.includes('gothic')) targetPage = 'gothic-font-generator';
    else if (keywordLower.includes('discord')) targetPage = 'discord-font-generator';
    else if (keywordLower.includes('old english')) targetPage = 'old-english-font-generator';
    else if (keywordLower.includes('3d')) targetPage = '3d-font-generator';
    else if (keywordLower.includes('cute')) targetPage = 'cute-font-generator';
    else if (keywordLower.includes('minecraft')) targetPage = 'minecraft-font-generator';
    else if (keywordLower.includes('script')) targetPage = 'script-font-generator';
    else if (keywordLower.includes('disney')) targetPage = 'disney-font-generator';
    else if (keywordLower.includes('bubble')) targetPage = 'bubble-font-generator';
    else if (keywordLower.includes('upside down')) targetPage = 'upside-down-font-generator';
    else if (keywordLower.includes('star wars')) targetPage = 'star-wars-font-generator';
    
    longTailKeywords.push({
      keyword: kw.keyword,
      searchVolume: kw.volume,
      difficulty: kw.difficulty,
      type: 'long-tail',
      targetPage: targetPage,
      notes: `长尾关键词，搜索量 ${kw.volume.toLocaleString()}，难度 ${kw.difficulty}${targetPage ? `，建议页面：${targetPage}` : ''}`
    });
  }
  // 相关关键词：其他所有关键词
  else {
    relatedKeywords.push({
      keyword: kw.keyword,
      searchVolume: kw.volume,
      difficulty: kw.difficulty,
      type: 'related',
      notes: `相关关键词，搜索量 ${kw.volume.toLocaleString()}，难度 ${kw.difficulty}`
    });
  }
});

// 按搜索量排序
primaryKeywords.sort((a, b) => b.searchVolume - a.searchVolume);
longTailKeywords.sort((a, b) => b.searchVolume - a.searchVolume);
relatedKeywords.sort((a, b) => b.searchVolume - a.searchVolume);

// 限制数量（避免文件过大）
const maxPrimary = 20;
const maxLongTail = 100;
const maxRelated = 200;

// 构建 JSON 结构
const result = {
  tool: 'font-generator',
  lastUpdated: new Date().toISOString().split('T')[0],
  primaryKeywords: primaryKeywords.slice(0, maxPrimary),
  longTailKeywords: longTailKeywords.slice(0, maxLongTail),
  relatedKeywords: relatedKeywords.slice(0, maxRelated),
  internalLinking: [
    {
      keyword: 'image converter',
      targetPage: 'image-converter',
      anchorText: 'convert images',
      notes: '内链关键词，链接到图片转换工具页面'
    },
    {
      keyword: 'image compressor',
      targetPage: 'image-compressor',
      anchorText: 'compress images',
      notes: '内链关键词，链接到图片压缩工具页面'
    }
  ],
  statistics: {
    totalKeywords: keywords.length,
    primaryCount: primaryKeywords.length,
    longTailCount: longTailKeywords.length,
    relatedCount: relatedKeywords.length,
    topSearchVolume: keywords[0]?.volume || 0,
    averageDifficulty: Math.round(keywords.reduce((sum, kw) => sum + kw.difficulty, 0) / keywords.length)
  }
};

// 保存到文件
const outputPath = path.join(__dirname, '../docs/keywords/font-generator-keywords.json');
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');

console.log('✅ 关键词处理完成！');
console.log(`📊 统计信息：`);
console.log(`   - 总关键词数：${result.statistics.totalKeywords}`);
console.log(`   - 主关键词：${result.statistics.primaryCount}（已保存前 ${maxPrimary} 个）`);
console.log(`   - 长尾关键词：${result.statistics.longTailCount}（已保存前 ${maxLongTail} 个）`);
console.log(`   - 相关关键词：${result.statistics.relatedCount}（已保存前 ${maxRelated} 个）`);
console.log(`   - 最高搜索量：${result.statistics.topSearchVolume.toLocaleString()}`);
console.log(`   - 平均难度：${result.statistics.averageDifficulty}`);
console.log(`\n📁 文件已保存到：${outputPath}`);
