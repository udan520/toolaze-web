/**
 * 翻译检查辅助模块
 * 提供统一的技术字段忽略列表和检查函数
 */

const fs = require('fs')
const path = require('path')

// 加载技术字段配置
let ignoreFieldsConfig = null
try {
  const configPath = path.join(__dirname, 'translation-ignore-fields.json')
  ignoreFieldsConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'))
} catch (error) {
  console.warn('警告: 无法加载 translation-ignore-fields.json，使用默认配置')
  ignoreFieldsConfig = {
    technicalFields: ['in_menu', 'sectionsOrder', 'icon', 'iconType']
  }
}

const TECHNICAL_FIELDS = ignoreFieldsConfig.technicalFields || []

/**
 * 检查字段是否为技术字段（不需要翻译）
 * @param {string} fieldName - 字段名
 * @returns {boolean} - 如果是技术字段返回 true
 */
function isTechnicalField(fieldName) {
  return TECHNICAL_FIELDS.includes(fieldName)
}

/**
 * 递归查找未翻译的字段
 * @param {object} enObj - 英文对象
 * @param {object} langObj - 目标语言对象
 * @param {string} path - 当前路径（用于错误报告）
 * @returns {array} - 未翻译的字段路径列表
 */
function findUntranslated(enObj, langObj, currentPath = '') {
  let untranslated = []

  if (typeof enObj !== 'object' || enObj === null) {
    return untranslated
  }

  for (const key in enObj) {
    // 跳过技术字段
    if (isTechnicalField(key)) {
      continue
    }

    const fieldPath = currentPath ? `${currentPath}.${key}` : key

    if (typeof enObj[key] === 'object' && enObj[key] !== null) {
      if (Array.isArray(enObj[key])) {
        enObj[key].forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            untranslated = untranslated.concat(
              findUntranslated(item, langObj?.[key]?.[index], `${fieldPath}[${index}]`)
            )
          } else if (typeof item === 'string') {
            if (!langObj?.[key]?.[index] || langObj[key][index].trim() === '') {
              untranslated.push(`${fieldPath}[${index}]`)
            }
          }
        })
      } else {
        untranslated = untranslated.concat(findUntranslated(enObj[key], langObj?.[key], fieldPath))
      }
    } else if (typeof enObj[key] === 'string') {
      if (!langObj || !langObj[key] || langObj[key].trim() === '') {
        untranslated.push(fieldPath)
      }
    }
  }

  return untranslated
}

/**
 * 获取技术字段列表（用于文档或日志）
 * @returns {array} - 技术字段列表
 */
function getTechnicalFields() {
  return [...TECHNICAL_FIELDS]
}

module.exports = {
  isTechnicalField,
  findUntranslated,
  getTechnicalFields,
  TECHNICAL_FIELDS
}
