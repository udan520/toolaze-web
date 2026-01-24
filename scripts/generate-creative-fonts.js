// 生成有创意、有差别的Unicode字体样式
// 每个分类20个不同的字体样式
const fs = require('fs')
const path = require('path')

// 各种Unicode块映射（真正有差别的）
const unicodeBlocks = {
  // Mathematical Bold
  bold: {
    'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉',
    'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓',
    'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
    'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣',
    'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭',
    'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  },
  // Mathematical Bold Italic
  boldItalic: {
    'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱',
    'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻',
    'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
    'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋',
    'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕',
    'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛'
  },
  // Mathematical Sans-Serif Bold
  sansSerifBold: {
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝',
    'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧',
    'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷',
    'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁',
    'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
    '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
  },
  // Mathematical Monospace
  monospace: {
    'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶', 'H': '𝙷', 'I': '𝙸', 'J': '𝙹',
    'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽', 'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃',
    'U': '𝚄', 'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉',
    'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑', 'i': '𝚒', 'j': '𝚓',
    'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙', 'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝',
    'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡', 'y': '𝚢', 'z': '𝚣',
    '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿'
  },
  // Mathematical Italic
  italic: {
    'A': '𝐴', 'B': '𝐵', 'C': '𝐶', 'D': '𝐷', 'E': '𝐸', 'F': '𝐹', 'G': '𝐺', 'H': '𝐻', 'I': '𝐼', 'J': '𝐽',
    'K': '𝐾', 'L': '𝐿', 'M': '𝑀', 'N': '𝑁', 'O': '𝑂', 'P': '𝑃', 'Q': '𝑄', 'R': '𝑅', 'S': '𝑆', 'T': '𝑇',
    'U': '𝑈', 'V': '𝑉', 'W': '𝑊', 'X': '𝑋', 'Y': '𝑌', 'Z': '𝑍',
    'a': '𝑎', 'b': '𝑏', 'c': '𝑐', 'd': '𝑑', 'e': '𝑒', 'f': '𝑓', 'g': '𝑔', 'h': 'ℎ', 'i': '𝑖', 'j': '𝑗',
    'k': '𝑘', 'l': '𝑙', 'm': '𝑚', 'n': '𝑛', 'o': '𝑜', 'p': '𝑝', 'q': '𝑞', 'r': '𝑟', 's': '𝑠', 't': '𝑡',
    'u': '𝑢', 'v': '𝑣', 'w': '𝑤', 'x': '𝑥', 'y': '𝑦', 'z': '𝑧'
  },
  // Mathematical Script (Cursive)
  cursive: {
    'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ', 'G': '𝒢', 'H': 'ℋ', 'I': 'ℐ', 'J': '𝒥',
    'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩', 'O': '𝒪', 'P': '𝒫', 'Q': '𝒬', 'R': 'ℛ', 'S': '𝒮', 'T': '𝒯',
    'U': '𝒰', 'V': '𝒱', 'W': '𝒲', 'X': '𝒳', 'Y': '𝒴', 'Z': '𝒵',
    'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': '𝑒', 'f': '𝒻', 'g': '𝑔', 'h': '𝒽', 'i': '𝒾', 'j': '𝒿',
    'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃', 'o': '𝑜', 'p': '𝓅', 'q': '𝓆', 'r': '𝓇', 's': '𝓈', 't': '𝓉',
    'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍', 'y': '𝓎', 'z': '𝓏'
  },
  // Mathematical Bold Script
  boldCursive: {
    'A': '𝓐', 'B': '𝓑', 'C': '𝓒', 'D': '𝓓', 'E': '𝓔', 'F': '𝓕', 'G': '𝓖', 'H': '𝓗', 'I': '𝓘', 'J': '𝓙',
    'K': '𝓚', 'L': '𝓛', 'M': '𝓜', 'N': '𝓝', 'O': '𝓞', 'P': '𝓟', 'Q': '𝓠', 'R': '𝓡', 'S': '𝓢', 'T': '𝓣',
    'U': '𝓤', 'V': '𝓥', 'W': '𝓦', 'X': '𝓧', 'Y': '𝓨', 'Z': '𝓩',
    'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱', 'i': '𝓲', 'j': '𝓳',
    'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹', 'q': '𝓺', 'r': '𝓻', 's': '𝓼', 't': '𝓽',
    'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁', 'y': '𝔂', 'z': '𝔃'
  },
  // Mathematical Fraktur (Gothic)
  gothic: {
    'A': '𝔄', 'B': '𝔅', 'C': 'ℭ', 'D': '𝔇', 'E': '𝔈', 'F': '𝔉', 'G': '𝔊', 'H': 'ℌ', 'I': 'ℑ', 'J': '𝔍',
    'K': '𝔎', 'L': '𝔏', 'M': '𝔐', 'N': '𝔑', 'O': '𝔒', 'P': '𝔓', 'Q': '𝔔', 'R': 'ℜ', 'S': '𝔖', 'T': '𝔗',
    'U': '𝔘', 'V': '𝔙', 'W': '𝔚', 'X': '𝔛', 'Y': '𝔜', 'Z': 'ℨ',
    'a': '𝔞', 'b': '𝔟', 'c': '𝔠', 'd': '𝔡', 'e': '𝔢', 'f': '𝔣', 'g': '𝔤', 'h': '𝔥', 'i': '𝔦', 'j': '𝔧',
    'k': '𝔨', 'l': '𝔩', 'm': '𝔪', 'n': '𝔫', 'o': '𝔬', 'p': '𝔭', 'q': '𝔮', 'r': '𝔯', 's': '𝔰', 't': '𝔱',
    'u': '𝔲', 'v': '𝔳', 'w': '𝔴', 'x': '𝔵', 'y': '𝔶', 'z': '𝔷'
  },
  // Mathematical Double-Struck
  doubleStruck: {
    'A': '𝔸', 'B': '𝔹', 'C': 'ℂ', 'D': '𝔻', 'E': '𝔼', 'F': '𝔽', 'G': '𝔾', 'H': 'ℍ', 'I': '𝕀', 'J': '𝕁',
    'K': '𝕂', 'L': '𝕃', 'M': '𝕄', 'N': 'ℕ', 'O': '𝕆', 'P': 'ℙ', 'Q': 'ℚ', 'R': 'ℝ', 'S': '𝕊', 'T': '𝕋',
    'U': '𝕌', 'V': '𝕍', 'W': '𝕎', 'X': '𝕏', 'Y': '𝕐', 'Z': 'ℤ',
    'a': '𝕒', 'b': '𝕓', 'c': '𝕔', 'd': '𝕕', 'e': '𝕖', 'f': '𝕗', 'g': '𝕘', 'h': '𝕙', 'i': '𝕚', 'j': '𝕛',
    'k': '𝕜', 'l': '𝕝', 'm': '𝕞', 'n': '𝕟', 'o': '𝕠', 'p': '𝕡', 'q': '𝕢', 'r': '𝕣', 's': '𝕤', 't': '𝕥',
    'u': '𝕦', 'v': '𝕧', 'w': '𝕨', 'x': '𝕩', 'y': '𝕪', 'z': '𝕫',
    '0': '𝟘', '1': '𝟙', '2': '𝟚', '3': '𝟛', '4': '𝟜', '5': '𝟝', '6': '𝟞', '7': '𝟟', '8': '𝟠', '9': '𝟡'
  },
  // Mathematical Sans-Serif
  sansSerif: {
    'A': '𝖠', 'B': '𝖡', 'C': '𝖢', 'D': '𝖣', 'E': '𝖤', 'F': '𝖥', 'G': '𝖦', 'H': '𝖧', 'I': '𝖨', 'J': '𝖩',
    'K': '𝖪', 'L': '𝖫', 'M': '𝖬', 'N': '𝖭', 'O': '𝖮', 'P': '𝖯', 'Q': '𝖰', 'R': '𝖱', 'S': '𝖲', 'T': '𝖳',
    'U': '𝖴', 'V': '𝖵', 'W': '𝖶', 'X': '𝖷', 'Y': '𝖸', 'Z': '𝖹',
    'a': '𝖺', 'b': '𝖻', 'c': '𝖼', 'd': '𝖽', 'e': '𝖾', 'f': '𝖿', 'g': '𝗀', 'h': '𝗁', 'i': '𝗂', 'j': '𝗃',
    'k': '𝗄', 'l': '𝗅', 'm': '𝗆', 'n': '𝗇', 'o': '𝗈', 'p': '𝗉', 'q': '𝗊', 'r': '𝗋', 's': '𝗌', 't': '𝗍',
    'u': '𝗎', 'v': '𝗏', 'w': '𝗐', 'x': '𝗑', 'y': '𝗒', 'z': '𝗓',
    '0': '𝟢', '1': '𝟣', '2': '𝟤', '3': '𝟥', '4': '𝟦', '5': '𝟧', '6': '𝟨', '7': '𝟩', '8': '𝟪', '9': '𝟫'
  },
  // Fullwidth (全角字符)
  fullwidth: {
    'A': 'Ａ', 'B': 'Ｂ', 'C': 'Ｃ', 'D': 'Ｄ', 'E': 'Ｅ', 'F': 'Ｆ', 'G': 'Ｇ', 'H': 'Ｈ', 'I': 'Ｉ', 'J': 'Ｊ',
    'K': 'Ｋ', 'L': 'Ｌ', 'M': 'Ｍ', 'N': 'Ｎ', 'O': 'Ｏ', 'P': 'Ｐ', 'Q': 'Ｑ', 'R': 'Ｒ', 'S': 'Ｓ', 'T': 'Ｔ',
    'U': 'Ｕ', 'V': 'Ｖ', 'W': 'Ｗ', 'X': 'Ｘ', 'Y': 'Ｙ', 'Z': 'Ｚ',
    'a': 'ａ', 'b': 'ｂ', 'c': 'ｃ', 'd': 'ｄ', 'e': 'ｅ', 'f': 'ｆ', 'g': 'ｇ', 'h': 'ｈ', 'i': 'ｉ', 'j': 'ｊ',
    'k': 'ｋ', 'l': 'ｌ', 'm': 'ｍ', 'n': 'ｎ', 'o': 'ｏ', 'p': 'ｐ', 'q': 'ｑ', 'r': 'ｒ', 's': 'ｓ', 't': 'ｔ',
    'u': 'ｕ', 'v': 'ｖ', 'w': 'ｗ', 'x': 'ｘ', 'y': 'ｙ', 'z': 'ｚ',
    '0': '０', '1': '１', '2': '２', '3': '３', '4': '４', '5': '５', '6': '６', '7': '７', '8': '８', '9': '９'
  },
  // Small Caps (小型大写字母)
  smallCaps: {
    'A': 'ᴀ', 'B': 'ʙ', 'C': 'ᴄ', 'D': 'ᴅ', 'E': 'ᴇ', 'F': 'ғ', 'G': 'ɢ', 'H': 'ʜ', 'I': 'ɪ', 'J': 'ᴊ',
    'K': 'ᴋ', 'L': 'ʟ', 'M': 'ᴍ', 'N': 'ɴ', 'O': 'ᴏ', 'P': 'ᴘ', 'Q': 'ǫ', 'R': 'ʀ', 'S': 's', 'T': 'ᴛ',
    'U': 'ᴜ', 'V': 'ᴠ', 'W': 'ᴡ', 'X': 'x', 'Y': 'ʏ', 'Z': 'ᴢ',
    'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ',
    'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ',
    'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ',
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9'
  },
  // Circled (圆圈字母)
  circled: {
    'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ', 'G': 'Ⓖ', 'H': 'Ⓗ', 'I': 'Ⓘ', 'J': 'Ⓙ',
    'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ', 'O': 'Ⓞ', 'P': 'Ⓟ', 'Q': 'Ⓠ', 'R': 'Ⓡ', 'S': 'Ⓢ', 'T': 'Ⓣ',
    'U': 'Ⓤ', 'V': 'Ⓥ', 'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ',
    'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ', 'h': 'ⓗ', 'i': 'ⓘ', 'j': 'ⓙ',
    'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ', 'o': 'ⓞ', 'p': 'ⓟ', 'q': 'ⓠ', 'r': 'ⓡ', 's': 'ⓢ', 't': 'ⓣ',
    'u': 'ⓤ', 'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ', 'y': 'ⓨ', 'z': 'ⓩ',
    '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨'
  },
  // Parenthesized (括号字母)
  parenthesized: {
    'A': '⒜', 'B': '⒝', 'C': '⒞', 'D': '⒟', 'E': '⒠', 'F': '⒡', 'G': '⒢', 'H': '⒣', 'I': '⒤', 'J': '⒥',
    'K': '⒦', 'L': '⒧', 'M': '⒨', 'N': '⒩', 'O': '⒪', 'P': '⒫', 'Q': '⒬', 'R': '⒭', 'S': '⒮', 'T': '⒯',
    'U': '⒰', 'V': '⒱', 'W': '⒲', 'X': '⒳', 'Y': '⒴', 'Z': '⒵',
    'a': '⒜', 'b': '⒝', 'c': '⒞', 'd': '⒟', 'e': '⒠', 'f': '⒡', 'g': '⒢', 'h': '⒣', 'i': '⒤', 'j': '⒥',
    'k': '⒦', 'l': '⒧', 'm': '⒨', 'n': '⒩', 'o': '⒪', 'p': '⒫', 'q': '⒬', 'r': '⒭', 's': '⒮', 't': '⒯',
    'u': '⒰', 'v': '⒱', 'w': '⒲', 'x': '⒳', 'y': '⒴', 'z': '⒵',
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9'
  },
  // Squared (方块字母)
  squared: {
    'A': '🄰', 'B': '🄱', 'C': '🄲', 'D': '🄳', 'E': '🄴', 'F': '🄵', 'G': '🄶', 'H': '🄷', 'I': '🄸', 'J': '🄹',
    'K': '🄺', 'L': '🄻', 'M': '🄼', 'N': '🄽', 'O': '🄾', 'P': '🄿', 'Q': '🅀', 'R': '🅁', 'S': '🅂', 'T': '🅃',
    'U': '🅄', 'V': '🅅', 'W': '🅆', 'X': '🅇', 'Y': '🅈', 'Z': '🅉',
    'a': '🄰', 'b': '🄱', 'c': '🄲', 'd': '🄳', 'e': '🄴', 'f': '🄵', 'g': '🄶', 'h': '🄷', 'i': '🄸', 'j': '🄹',
    'k': '🄺', 'l': '🄻', 'm': '🄼', 'n': '🄽', 'o': '🄾', 'p': '🄿', 'q': '🅀', 'r': '🅁', 's': '🅂', 't': '🅃',
    'u': '🅄', 'v': '🅅', 'w': '🅆', 'x': '🅇', 'y': '🅈', 'z': '🅉',
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9'
  },
  // Superscript (上标字符)
  superscript: {
    'A': 'ᴬ', 'B': 'ᴮ', 'C': 'ᶜ', 'D': 'ᴰ', 'E': 'ᴱ', 'F': 'ᶠ', 'G': 'ᴳ', 'H': 'ᴴ', 'I': 'ᴵ', 'J': 'ᴶ',
    'K': 'ᴷ', 'L': 'ᴸ', 'M': 'ᴹ', 'N': 'ᴺ', 'O': 'ᴼ', 'P': 'ᴾ', 'Q': 'ᵠ', 'R': 'ᴿ', 'S': 'ˢ', 'T': 'ᵀ',
    'U': 'ᵁ', 'V': 'ⱽ', 'W': 'ᵂ', 'X': 'ˣ', 'Y': 'ʸ', 'Z': 'ᶻ',
    'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ', 'j': 'ʲ',
    'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ', 'q': 'ᵠ', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ',
    'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ',
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
  },
  // Subscript (下标字符)
  subscript: {
    'A': 'ₐ', 'B': 'ᵦ', 'C': 'ᵨ', 'D': 'ᵈ', 'E': 'ₑ', 'F': 'ᵧ', 'G': 'ᵍ', 'H': 'ₕ', 'I': 'ᵢ', 'J': 'ⱼ',
    'K': 'ₖ', 'L': 'ₗ', 'M': 'ₘ', 'N': 'ₙ', 'O': 'ₒ', 'P': 'ₚ', 'Q': 'ᵩ', 'R': 'ᵣ', 'S': 'ₛ', 'T': 'ₜ',
    'U': 'ᵤ', 'V': 'ᵥ', 'W': 'ᵥ', 'X': 'ₓ', 'Y': 'ᵧ', 'Z': 'ᵨ',
    'a': 'ₐ', 'b': 'ᵦ', 'c': 'ᵨ', 'd': 'ᵈ', 'e': 'ₑ', 'f': 'ᵧ', 'g': 'ᵍ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ',
    'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ', 'p': 'ₚ', 'q': 'ᵩ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ',
    'u': 'ᵤ', 'v': 'ᵥ', 'w': 'ᵥ', 'x': 'ₓ', 'y': 'ᵧ', 'z': 'ᵨ',
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
  },
  // Inverted (倒置字符 - 使用特殊Unicode字符)
  inverted: {
    'A': '∀', 'B': 'ᗺ', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'ᖴ', 'G': 'פ', 'H': 'H', 'I': 'I', 'J': 'ſ',
    'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ', 'Q': 'Q', 'R': 'ᴿ', 'S': 'S', 'T': '┴',
    'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z',
    'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ',
    'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ',
    'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
    '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6'
  },
  // Wide (宽体字符 - 使用全角字符的变体，与fullwidth相同但作为独立样式)
  wide: {
    'A': 'Ａ', 'B': 'Ｂ', 'C': 'Ｃ', 'D': 'Ｄ', 'E': 'Ｅ', 'F': 'Ｆ', 'G': 'Ｇ', 'H': 'Ｈ', 'I': 'Ｉ', 'J': 'Ｊ',
    'K': 'Ｋ', 'L': 'Ｌ', 'M': 'Ｍ', 'N': 'Ｎ', 'O': 'Ｏ', 'P': 'Ｐ', 'Q': 'Ｑ', 'R': 'Ｒ', 'S': 'Ｓ', 'T': 'Ｔ',
    'U': 'Ｕ', 'V': 'Ｖ', 'W': 'Ｗ', 'X': 'Ｘ', 'Y': 'Ｙ', 'Z': 'Ｚ',
    'a': 'ａ', 'b': 'ｂ', 'c': 'ｃ', 'd': 'ｄ', 'e': 'ｅ', 'f': 'ｆ', 'g': 'ｇ', 'h': 'ｈ', 'i': 'ｉ', 'j': 'ｊ',
    'k': 'ｋ', 'l': 'ｌ', 'm': 'ｍ', 'n': 'ｎ', 'o': 'ｏ', 'p': 'ｐ', 'q': 'ｑ', 'r': 'ｒ', 's': 'ｓ', 't': 'ｔ',
    'u': 'ｕ', 'v': 'ｖ', 'w': 'ｗ', 'x': 'ｘ', 'y': 'ｙ', 'z': 'ｚ',
    '0': '０', '1': '１', '2': '２', '3': '３', '4': '４', '5': '５', '6': '６', '7': '７', '8': '８', '9': '９'
  },
  // Negative Circled (负圆圈 - 使用不同的圆圈字符)
  negativeCircled: {
    'A': '🅐', 'B': '🅑', 'C': '🅒', 'D': '🅓', 'E': '🅔', 'F': '🅕', 'G': '🅖', 'H': '🅗', 'I': '🅘', 'J': '🅙',
    'K': '🅚', 'L': '🅛', 'M': '🅜', 'N': '🅝', 'O': '🅞', 'P': '🅟', 'Q': '🅠', 'R': '🅡', 'S': '🅢', 'T': '🅣',
    'U': '🅤', 'V': '🅥', 'W': '🅦', 'X': '🅧', 'Y': '🅨', 'Z': '🅩',
    'a': '🅐', 'b': '🅑', 'c': '🅒', 'd': '🅓', 'e': '🅔', 'f': '🅕', 'g': '🅖', 'h': '🅗', 'i': '🅘', 'j': '🅙',
    'k': '🅚', 'l': '🅛', 'm': '🅜', 'n': '🅝', 'o': '🅞', 'p': '🅟', 'q': '🅠', 'r': '🅡', 's': '🅢', 't': '🅣',
    'u': '🅤', 'v': '🅥', 'w': '🅦', 'x': '🅧', 'y': '🅨', 'z': '🅩',
    '0': '⓿', '1': '➊', '2': '➋', '3': '➌', '4': '➍', '5': '➎', '6': '➏', '7': '➐', '8': '➑', '9': '➒'
  },
  // Mathematical Sans-Serif Italic (U+1D608-1D6FF)
  sansSerifItalic: {
    'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏', 'I': '𝘐', 'J': '𝘑',
    'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙', 'S': '𝘚', 'T': '𝘛',
    'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡',
    'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩', 'i': '𝘪', 'j': '𝘫',
    'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵',
    'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹', 'y': '𝘺', 'z': '𝘻'
  },
  // Mathematical Bold Fraktur (U+1D56C-1D59F)
  boldFraktur: {
    'A': '𝔄', 'B': '𝔅', 'C': 'ℭ', 'D': '𝔇', 'E': '𝔈', 'F': '𝔉', 'G': '𝔊', 'H': 'ℌ', 'I': 'ℑ', 'J': '𝔍',
    'K': '𝔎', 'L': '𝔏', 'M': '𝔐', 'N': '𝔑', 'O': '𝔒', 'P': '𝔓', 'Q': '𝔔', 'R': 'ℜ', 'S': '𝔖', 'T': '𝔗',
    'U': '𝔘', 'V': '𝔙', 'W': '𝔚', 'X': '𝔛', 'Y': '𝔜', 'Z': 'ℨ',
    'a': '𝔞', 'b': '𝔟', 'c': '𝔠', 'd': '𝔡', 'e': '𝔢', 'f': '𝔣', 'g': '𝔤', 'h': '𝔥', 'i': '𝔦', 'j': '𝔧',
    'k': '𝔨', 'l': '𝔩', 'm': '𝔪', 'n': '𝔫', 'o': '𝔬', 'p': '𝔭', 'q': '𝔮', 'r': '𝔯', 's': '𝔰', 't': '𝔱',
    'u': '𝔲', 'v': '𝔳', 'w': '𝔴', 'x': '𝔵', 'y': '𝔶', 'z': '𝔷'
  },
  // Mathematical Bold Script (U+1D4D0-1D4FF) - 与boldCursive相同，但作为独立样式
  boldScript: {
    'A': '𝓐', 'B': '𝓑', 'C': '𝓒', 'D': '𝓓', 'E': '𝓔', 'F': '𝓕', 'G': '𝓖', 'H': '𝓗', 'I': '𝓘', 'J': '𝓙',
    'K': '𝓚', 'L': '𝓛', 'M': '𝓜', 'N': '𝓝', 'O': '𝓞', 'P': '𝓟', 'Q': '𝓠', 'R': '𝓡', 'S': '𝓢', 'T': '𝓣',
    'U': '𝓤', 'V': '𝓥', 'W': '𝓦', 'X': '𝓧', 'Y': '𝓨', 'Z': '𝓩',
    'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱', 'i': '𝓲', 'j': '𝓳',
    'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹', 'q': '𝓺', 'r': '𝓻', 's': '𝓼', 't': '𝓽',
    'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁', 'y': '𝔂', 'z': '𝔃'
  },
  // Mathematical Script (U+1D49C-1D4CF) - 与cursive相同，但作为独立样式
  script: {
    'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ', 'G': '𝒢', 'H': 'ℋ', 'I': 'ℐ', 'J': '𝒥',
    'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩', 'O': '𝒪', 'P': '𝒫', 'Q': '𝒬', 'R': 'ℛ', 'S': '𝒮', 'T': '𝒯',
    'U': '𝒰', 'V': '𝒱', 'W': '𝒲', 'X': '𝒳', 'Y': '𝒴', 'Z': '𝒵',
    'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': '𝑒', 'f': '𝒻', 'g': '𝑔', 'h': '𝒽', 'i': '𝒾', 'j': '𝒿',
    'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃', 'o': '𝑜', 'p': '𝓅', 'q': '𝓆', 'r': '𝓇', 's': '𝓈', 't': '𝓉',
    'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍', 'y': '𝓎', 'z': '𝓏'
  },
  // Negative Squared (负方块 - 使用不同的方块字符)
  negativeSquared: {
    'A': '🅰', 'B': '🅱', 'C': '🅲', 'D': '🅳', 'E': '🅴', 'F': '🅵', 'G': '🅶', 'H': '🅷', 'I': '🅸', 'J': '🅹',
    'K': '🅺', 'L': '🅻', 'M': '🅼', 'N': '🅽', 'O': '🅾', 'P': '🅿', 'Q': '🆀', 'R': '🆁', 'S': '🆂', 'T': '🆃',
    'U': '🆄', 'V': '🆅', 'W': '🆆', 'X': '🆇', 'Y': '🆈', 'Z': '🆉',
    'a': '🅰', 'b': '🅱', 'c': '🅲', 'd': '🅳', 'e': '🅴', 'f': '🅵', 'g': '🅶', 'h': '🅷', 'i': '🅸', 'j': '🅹',
    'k': '🅺', 'l': '🅻', 'm': '🅼', 'n': '🅽', 'o': '🅾', 'p': '🅿', 'q': '🆀', 'r': '🆁', 's': '🆂', 't': '🆃',
    'u': '🆄', 'v': '🆅', 'w': '🆆', 'x': '🆇', 'y': '🆈', 'z': '🆉',
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9'
  },
  // Greek Style (希腊字母风格 - 类似Wizard风格，使用希腊字母映射)
  greekStyle: {
    'A': 'Α', 'B': 'Β', 'C': 'C', 'D': 'Δ', 'E': 'Ε', 'F': 'Φ', 'G': 'Γ', 'H': 'Η', 'I': 'Ι', 'J': 'J',
    'K': 'Κ', 'L': 'Λ', 'M': 'Μ', 'N': 'Ν', 'O': 'Ο', 'P': 'Π', 'Q': 'Q', 'R': 'Ρ', 'S': 'Σ', 'T': 'Τ',
    'U': 'Υ', 'V': 'V', 'W': 'Ω', 'X': 'Χ', 'Y': 'Υ', 'Z': 'Ζ',
    'a': 'α', 'b': 'β', 'c': 'c', 'd': 'δ', 'e': 'ε', 'f': 'φ', 'g': 'γ', 'h': 'η', 'i': 'ι', 'j': 'j',
    'k': 'κ', 'l': 'λ', 'm': 'μ', 'n': 'ν', 'o': 'ο', 'p': 'π', 'q': 'q', 'r': 'ρ', 's': 'σ', 't': 'τ',
    'u': 'υ', 'v': 'v', 'w': 'ω', 'x': 'χ', 'y': 'ψ', 'z': 'ζ',
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9'
  },
  // Mathematical Bold Sans-Serif (U+1D5D4-1D607)
  boldSansSerif: {
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝',
    'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧',
    'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷',
    'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁',
    'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
    '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
  },
  // Mathematical Bold Sans-Serif Italic (U+1D63C-1D66F)
  boldSansSerifItalic: {
    'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝘿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅',
    'K': '𝙆', 'L': '𝙇', 'M': '𝙈', 'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏',
    'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
    'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟',
    'k': '𝙠', 'l': '𝙡', 'm': '𝙢', 'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩',
    'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
  },
  // Mathematical Bold Italic Sans-Serif (U+1D670-1D6A3)
  boldItalicSansSerif: {
    'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶', 'H': '𝙷', 'I': '𝙸', 'J': '𝙹',
    'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽', 'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃',
    'U': '𝚄', 'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉',
    'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑', 'i': '𝚒', 'j': '𝚓',
    'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙', 'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝',
    'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡', 'y': '𝚢', 'z': '𝚣'
  },
  // Regional Indicator Symbols (国旗风格字母 - U+1F1E6-1F1FF)
  regionalIndicator: {
    'A': '🇦', 'B': '🇧', 'C': '🇨', 'D': '🇩', 'E': '🇪', 'F': '🇫', 'G': '🇬', 'H': '🇭', 'I': '🇮', 'J': '🇯',
    'K': '🇰', 'L': '🇱', 'M': '🇲', 'N': '🇳', 'O': '🇴', 'P': '🇵', 'Q': '🇶', 'R': '🇷', 'S': '🇸', 'T': '🇹',
    'U': '🇺', 'V': '🇻', 'W': '🇼', 'X': '🇽', 'Y': '🇾', 'Z': '🇿',
    'a': '🇦', 'b': '🇧', 'c': '🇨', 'd': '🇩', 'e': '🇪', 'f': '🇫', 'g': '🇬', 'h': '🇭', 'i': '🇮', 'j': '🇯',
    'k': '🇰', 'l': '🇱', 'm': '🇲', 'n': '🇳', 'o': '🇴', 'p': '🇵', 'q': '🇶', 'r': '🇷', 's': '🇸', 't': '🇹',
    'u': '🇺', 'v': '🇻', 'w': '🇼', 'x': '🇽', 'y': '🇾', 'z': '🇿',
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9'
  },
  // Latin Extended Additional (带重音字母 - U+1E00-1EFF)
  latinExtended: {
    'A': 'Ḁ', 'B': 'Ḃ', 'C': 'Ḉ', 'D': 'Ḋ', 'E': 'Ḛ', 'F': 'Ḟ', 'G': 'Ḡ', 'H': 'Ḣ', 'I': 'Ḭ', 'J': 'Ḱ',
    'K': 'Ḳ', 'L': 'Ḷ', 'M': 'Ṁ', 'N': 'Ṅ', 'O': 'Ṍ', 'P': 'Ṕ', 'Q': 'Q', 'R': 'Ṙ', 'S': 'Ṡ', 'T': 'Ṫ',
    'U': 'Ṳ', 'V': 'Ṽ', 'W': 'Ẁ', 'X': 'Ẋ', 'Y': 'Ỳ', 'Z': 'Ẓ',
    'a': 'ḁ', 'b': 'ḃ', 'c': 'ḉ', 'd': 'ḋ', 'e': 'ḛ', 'f': 'ḟ', 'g': 'ḡ', 'h': 'ḣ', 'i': 'ḭ', 'j': 'ḱ',
    'k': 'ḳ', 'l': 'ḷ', 'm': 'ṁ', 'n': 'ṅ', 'o': 'ṍ', 'p': 'ṕ', 'q': 'q', 'r': 'ṙ', 's': 'ṡ', 't': 'ṫ',
    'u': 'ṳ', 'v': 'ṽ', 'w': 'ẁ', 'x': 'ẋ', 'y': 'ỳ', 'z': 'ẓ',
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9'
  },
  // Latin Extended-B (特殊拉丁字母变体 - U+0180-024F)
  latinExtendedB: {
    'A': 'Ⱥ', 'B': 'Ɓ', 'C': 'Ƈ', 'D': 'Đ', 'E': 'Ǝ', 'F': 'Ƒ', 'G': 'Ǥ', 'H': 'Ħ', 'I': 'Ɨ', 'J': 'Ɉ',
    'K': 'Ƙ', 'L': 'Ł', 'M': 'Ɯ', 'N': 'Ɲ', 'O': 'Ø', 'P': 'Ƥ', 'Q': 'Ɋ', 'R': 'Ř', 'S': 'Ș', 'T': 'Ŧ',
    'U': 'Ų', 'V': 'Ʋ', 'W': 'Ŵ', 'X': 'X', 'Y': 'Ŷ', 'Z': 'Ƶ',
    'a': 'Ⱥ', 'b': 'ƀ', 'c': 'ƈ', 'd': 'đ', 'e': 'ǝ', 'f': 'ƒ', 'g': 'ǥ', 'h': 'ħ', 'i': 'ɨ', 'j': 'ɉ',
    'k': 'ƙ', 'l': 'ł', 'm': 'ɯ', 'n': 'ɲ', 'o': 'ø', 'p': 'ƥ', 'q': 'ɋ', 'r': 'ř', 's': 'ș', 't': 'ŧ',
    'u': 'ų', 'v': 'ʋ', 'w': 'ŵ', 'x': 'x', 'y': 'ŷ', 'z': 'ƶ',
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9'
  },
  // Cyrillic Style (西里尔字母风格 - U+0400-04FF)
  cyrillicStyle: {
    'A': 'А', 'B': 'В', 'C': 'С', 'D': 'Д', 'E': 'Е', 'F': 'Ф', 'G': 'Г', 'H': 'Н', 'I': 'І', 'J': 'Ј',
    'K': 'К', 'L': 'Л', 'M': 'М', 'N': 'Н', 'O': 'О', 'P': 'Р', 'Q': 'Q', 'R': 'Я', 'S': 'Ѕ', 'T': 'Т',
    'U': 'Ц', 'V': 'Ѵ', 'W': 'Ш', 'X': 'Х', 'Y': 'У', 'Z': 'З',
    'a': 'а', 'b': 'в', 'c': 'с', 'd': 'д', 'e': 'е', 'f': 'ф', 'g': 'г', 'h': 'н', 'i': 'і', 'j': 'ј',
    'k': 'к', 'l': 'л', 'm': 'м', 'n': 'н', 'o': 'о', 'p': 'р', 'q': 'q', 'r': 'я', 's': 'ѕ', 't': 'т',
    'u': 'ц', 'v': 'ѵ', 'w': 'ш', 'x': 'х', 'y': 'у', 'z': 'з',
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9'
  }
}

// 为每个分类定义字体样式（每个分类20个不同的样式）
const categoryFonts = {
  'bold': [
    { name: 'Bold', style: 'bold' },
    { name: 'Bold Italic', style: 'boldItalic' },
    { name: 'Sans Serif Bold', style: 'sansSerifBold' },
    { name: 'Bold Script', style: 'boldCursive' },
    { name: 'Bold Fraktur', style: 'boldFraktur' },
    { name: 'Bold Superscript', style: 'superscript' },
    { name: 'Bold Subscript', style: 'subscript' }
  ],
  'italic': [
    { name: 'Italic', style: 'italic' },
    { name: 'Bold Italic', style: 'boldItalic' },
    { name: 'Italic Script', style: 'cursive' },
    { name: 'Italic Sans Serif', style: 'sansSerif' },
    { name: 'Italic Gothic', style: 'gothic' }
  ],
  'cursive': [
    { name: 'Cursive', style: 'cursive' },
    { name: 'Bold Cursive', style: 'boldCursive' },
    { name: 'Cursive Italic', style: 'italic' },
    { name: 'Cursive Sans Serif', style: 'sansSerif' },
    { name: 'Cursive Gothic', style: 'gothic' },
    { name: 'Cursive Small Caps', style: 'smallCaps' },
    { name: 'Cursive Script', style: 'script' },
    { name: 'Cursive Bold Script', style: 'boldScript' }
  ],
  'gothic': [
    { name: 'Gothic', style: 'gothic' },
    { name: 'Gothic Bold', style: 'bold' },
    { name: 'Gothic Italic', style: 'italic' },
    { name: 'Gothic Bold Italic', style: 'boldItalic' },
    { name: 'Gothic Sans Serif', style: 'sansSerif' }
  ],
  'fancy': [
    { name: 'Double Struck', style: 'doubleStruck' },
    { name: 'Sans Serif', style: 'sansSerif' },
    { name: 'Sans Serif Bold', style: 'sansSerifBold' },
    { name: 'Sans Serif Italic', style: 'sansSerifItalic' },
    { name: 'Bold Sans Serif', style: 'boldSansSerif' },
    { name: 'Bold Sans Serif Italic', style: 'boldSansSerifItalic' },
    { name: 'Bold Italic Sans Serif', style: 'boldItalicSansSerif' },
    { name: 'Monospace', style: 'monospace' },
    { name: 'Fullwidth', style: 'fullwidth' },
    { name: 'Circled', style: 'circled' },
    { name: 'Negative Circled', style: 'negativeCircled' },
    { name: 'Squared', style: 'squared' },
    { name: 'Negative Squared', style: 'negativeSquared' },
    { name: 'Parenthesized', style: 'parenthesized' },
    { name: 'Small Caps', style: 'smallCaps' },
    { name: 'Bold Script', style: 'boldCursive' },
    { name: 'Italic Script', style: 'cursive' },
    { name: 'Gothic Fancy', style: 'gothic' },
    { name: 'Bold Fraktur', style: 'boldFraktur' },
    { name: 'Greek Style', style: 'greekStyle' },
    { name: 'Cyrillic Style', style: 'cyrillicStyle' },
    { name: 'Regional Indicator', style: 'regionalIndicator' },
    { name: 'Latin Extended', style: 'latinExtended' },
    { name: 'Latin Extended-B', style: 'latinExtendedB' },
    { name: 'Fancy Bold', style: 'bold' },
    { name: 'Fancy Italic', style: 'italic' },
    { name: 'Fancy Bold Italic', style: 'boldItalic' },
    { name: 'Cursive', style: 'cursive' },
    { name: 'Bold Cursive', style: 'boldCursive' },
    { name: 'Superscript', style: 'superscript' },
    { name: 'Subscript', style: 'subscript' },
    { name: 'Inverted', style: 'inverted' },
    { name: 'Wide', style: 'wide' },
    { name: 'Script', style: 'script' },
    { name: 'Bold Script Alt', style: 'boldScript' }
  ],
  'tattoo': [
    // 有个性的样式（优先）
    { name: 'Bold Fraktur', style: 'boldFraktur' },
    { name: 'Gothic Fraktur', style: 'gothic' },
    { name: 'Bold Script', style: 'boldScript' },
    { name: 'Script', style: 'script' },
    { name: 'Bold Cursive', style: 'boldCursive' },
    { name: 'Cursive', style: 'cursive' },
    { name: 'Greek Style', style: 'greekStyle' },
    { name: 'Cyrillic Style', style: 'cyrillicStyle' },
    { name: 'Regional Indicator', style: 'regionalIndicator' },
    { name: 'Latin Extended', style: 'latinExtended' },
    { name: 'Latin Extended-B', style: 'latinExtendedB' },
    { name: 'Inverted', style: 'inverted' },
    { name: 'Double Struck', style: 'doubleStruck' },
    { name: 'Negative Circled', style: 'negativeCircled' },
    { name: 'Negative Squared', style: 'negativeSquared' },
    { name: 'Circled', style: 'circled' },
    { name: 'Squared', style: 'squared' },
    { name: 'Small Caps', style: 'smallCaps' },
    { name: 'Superscript', style: 'superscript' },
    { name: 'Subscript', style: 'subscript' },
    { name: 'Monospace', style: 'monospace' },
    { name: 'Fullwidth', style: 'fullwidth' },
    { name: 'Wide', style: 'wide' },
    { name: 'Bold Sans Serif', style: 'boldSansSerif' },
    { name: 'Bold Sans Serif Italic', style: 'boldSansSerifItalic' },
    { name: 'Bold Italic Sans Serif', style: 'boldItalicSansSerif' },
    { name: 'Sans Serif Italic', style: 'sansSerifItalic' }
  ],
  'cool': [
    { name: 'Bold', style: 'bold' },
    { name: 'Sans Serif Bold', style: 'sansSerifBold' },
    { name: 'Sans Serif Italic', style: 'sansSerifItalic' },
    { name: 'Bold Sans Serif', style: 'boldSansSerif' },
    { name: 'Bold Sans Serif Italic', style: 'boldSansSerifItalic' },
    { name: 'Bold Italic Sans Serif', style: 'boldItalicSansSerif' },
    { name: 'Monospace', style: 'monospace' },
    { name: 'Double Struck', style: 'doubleStruck' },
    { name: 'Fullwidth', style: 'fullwidth' },
    { name: 'Circled', style: 'circled' },
    { name: 'Squared', style: 'squared' },
    { name: 'Bold Italic', style: 'boldItalic' },
    { name: 'Small Caps', style: 'smallCaps' },
    { name: 'Parenthesized', style: 'parenthesized' },
    { name: 'Bold Script', style: 'boldCursive' },
    { name: 'Gothic Bold', style: 'gothic' },
    { name: 'Bold Fraktur', style: 'boldFraktur' },
    { name: 'Greek Style', style: 'greekStyle' },
    { name: 'Cyrillic Style', style: 'cyrillicStyle' },
    { name: 'Regional Indicator', style: 'regionalIndicator' },
    { name: 'Latin Extended', style: 'latinExtended' },
    { name: 'Latin Extended-B', style: 'latinExtendedB' },
    { name: 'Cool Italic', style: 'italic' },
    { name: 'Cool Sans Serif', style: 'sansSerif' },
    { name: 'Cool Cursive', style: 'cursive' },
    { name: 'Cool Superscript', style: 'superscript' },
    { name: 'Cool Subscript', style: 'subscript' },
    { name: 'Cool Inverted', style: 'inverted' }
  ],
  'instagram': [
    { name: 'Cursive', style: 'cursive' },
    { name: 'Bold Cursive', style: 'boldCursive' },
    { name: 'Fancy', style: 'doubleStruck' },
    { name: 'Sans Serif', style: 'sansSerif' },
    { name: 'Sans Serif Bold', style: 'sansSerifBold' },
    { name: 'Circled', style: 'circled' },
    { name: 'Squared', style: 'squared' },
    { name: 'Fullwidth', style: 'fullwidth' },
    { name: 'Small Caps', style: 'smallCaps' },
    { name: 'Italic', style: 'italic' },
    { name: 'Bold Italic', style: 'boldItalic' },
    { name: 'Monospace', style: 'monospace' },
    { name: 'Instagram Bold', style: 'bold' },
    { name: 'Instagram Gothic', style: 'gothic' },
    { name: 'Instagram Parenthesized', style: 'parenthesized' }
  ],
  'calligraphy': [
    { name: 'Cursive', style: 'cursive' },
    { name: 'Bold Cursive', style: 'boldCursive' },
    { name: 'Italic', style: 'italic' },
    { name: 'Bold Italic', style: 'boldItalic' },
    { name: 'Gothic', style: 'gothic' },
    { name: 'Sans Serif', style: 'sansSerif' },
    { name: 'Fullwidth', style: 'fullwidth' },
    { name: 'Circled', style: 'circled' },
    { name: 'Squared', style: 'squared' },
    { name: 'Small Caps', style: 'smallCaps' },
    { name: 'Double Struck', style: 'doubleStruck' },
    { name: 'Monospace', style: 'monospace' },
    { name: 'Calligraphy Bold', style: 'bold' },
    { name: 'Calligraphy Sans Serif Bold', style: 'sansSerifBold' },
    { name: 'Calligraphy Parenthesized', style: 'parenthesized' }
  ],
  'discord': [
    { name: 'Bold', style: 'bold' },
    { name: 'Monospace', style: 'monospace' },
    { name: 'Sans Serif Bold', style: 'sansSerifBold' },
    { name: 'Fullwidth', style: 'fullwidth' },
    { name: 'Circled', style: 'circled' },
    { name: 'Squared', style: 'squared' },
    { name: 'Double Struck', style: 'doubleStruck' },
    { name: 'Bold Italic', style: 'boldItalic' },
    { name: 'Small Caps', style: 'smallCaps' },
    { name: 'Parenthesized', style: 'parenthesized' },
    { name: 'Gothic Bold', style: 'gothic' },
    { name: 'Sans Serif', style: 'sansSerif' },
    { name: 'Discord Italic', style: 'italic' },
    { name: 'Discord Cursive', style: 'cursive' },
    { name: 'Discord Bold Cursive', style: 'boldCursive' }
  ],
  'old-english': [
    { name: 'Gothic', style: 'gothic' },
    { name: 'Bold', style: 'bold' },
    { name: 'Bold Italic', style: 'boldItalic' },
    { name: 'Italic', style: 'italic' },
    { name: 'Sans Serif', style: 'sansSerif' },
    { name: 'Sans Serif Bold', style: 'sansSerifBold' },
    { name: 'Fullwidth', style: 'fullwidth' },
    { name: 'Circled', style: 'circled' },
    { name: 'Squared', style: 'squared' },
    { name: 'Double Struck', style: 'doubleStruck' },
    { name: 'Small Caps', style: 'smallCaps' },
    { name: 'Monospace', style: 'monospace' },
    { name: 'Old English Cursive', style: 'cursive' },
    { name: 'Old English Bold Cursive', style: 'boldCursive' },
    { name: 'Old English Parenthesized', style: 'parenthesized' }
  ],
  '3d': [
    { name: 'Bold', style: 'bold' },
    { name: 'Sans Serif Bold', style: 'sansSerifBold' },
    { name: 'Bold Italic', style: 'boldItalic' },
    { name: 'Monospace', style: 'monospace' },
    { name: 'Fullwidth', style: 'fullwidth' },
    { name: 'Circled', style: 'circled' },
    { name: 'Squared', style: 'squared' },
    { name: 'Double Struck', style: 'doubleStruck' },
    { name: 'Small Caps', style: 'smallCaps' },
    { name: 'Parenthesized', style: 'parenthesized' },
    { name: 'Gothic Bold', style: 'gothic' },
    { name: 'Bold Cursive', style: 'boldCursive' },
    { name: '3D Italic', style: 'italic' },
    { name: '3D Cursive', style: 'cursive' },
    { name: '3D Sans Serif', style: 'sansSerif' }
  ],
  'minecraft': [
    { name: 'Monospace', style: 'monospace' },
    { name: 'Bold', style: 'bold' },
    { name: 'Sans Serif Bold', style: 'sansSerifBold' },
    { name: 'Fullwidth', style: 'fullwidth' },
    { name: 'Circled', style: 'circled' },
    { name: 'Squared', style: 'squared' },
    { name: 'Double Struck', style: 'doubleStruck' },
    { name: 'Small Caps', style: 'smallCaps' },
    { name: 'Parenthesized', style: 'parenthesized' },
    { name: 'Bold Italic', style: 'boldItalic' },
    { name: 'Gothic', style: 'gothic' },
    { name: 'Sans Serif', style: 'sansSerif' },
    { name: 'Minecraft Italic', style: 'italic' },
    { name: 'Minecraft Cursive', style: 'cursive' },
    { name: 'Minecraft Bold Cursive', style: 'boldCursive' }
  ],
  'disney': [
    // 可爱手写体（核心手写体样式）
    { name: 'Cute Cursive', style: 'cursive' },
    { name: 'Sweet Script', style: 'script' },
    { name: 'Lovely Bold Script', style: 'boldScript' },
    { name: 'Charming Bold Cursive', style: 'boldCursive' },
    // 装饰性手写体风格（配合手写体使用）
    { name: 'Circled Handwriting', style: 'circled' },
    { name: 'Squared Cursive', style: 'squared' },
    { name: 'Parenthesized Script', style: 'parenthesized' },
    { name: 'Negative Circled Cursive', style: 'negativeCircled' },
    { name: 'Negative Squared Script', style: 'negativeSquared' },
    { name: 'Small Caps Handwriting', style: 'smallCaps' },
    { name: 'Fullwidth Cursive', style: 'fullwidth' },
    { name: 'Wide Handwriting', style: 'wide' },
    // 其他可爱风格（类似手写体效果）
    { name: 'Italic Cursive', style: 'italic' },
    { name: 'Bold Italic Script', style: 'boldItalic' },
    { name: 'Sans Serif Italic', style: 'sansSerifItalic' },
    { name: 'Superscript Cursive', style: 'superscript' },
    { name: 'Subscript Handwriting', style: 'subscript' },
    { name: 'Double Struck Cursive', style: 'doubleStruck' },
    { name: 'Monospace Script', style: 'monospace' },
    // 更多可爱变体
    { name: 'Adorable Cursive', style: 'cursive' },
    { name: 'Precious Script', style: 'script' },
    { name: 'Darling Bold Cursive', style: 'boldCursive' },
    { name: 'Dreamy Bold Script', style: 'boldScript' }
  ],
  'bubble': [
    { name: 'Bold', style: 'bold' },
    { name: 'Sans Serif Bold', style: 'sansSerifBold' },
    { name: 'Circled', style: 'circled' },
    { name: 'Squared', style: 'squared' },
    { name: 'Fullwidth', style: 'fullwidth' },
    { name: 'Double Struck', style: 'doubleStruck' },
    { name: 'Small Caps', style: 'smallCaps' },
    { name: 'Parenthesized', style: 'parenthesized' },
    { name: 'Bold Italic', style: 'boldItalic' },
    { name: 'Monospace', style: 'monospace' },
    { name: 'Bold Cursive', style: 'boldCursive' },
    { name: 'Gothic Bold', style: 'gothic' },
    { name: 'Bubble Italic', style: 'italic' },
    { name: 'Bubble Cursive', style: 'cursive' },
    { name: 'Bubble Sans Serif', style: 'sansSerif' }
  ],
  'star-wars': [
    { name: 'Gothic', style: 'gothic' },
    { name: 'Sans Serif', style: 'sansSerif' },
    { name: 'Sans Serif Bold', style: 'sansSerifBold' },
    { name: 'Bold', style: 'bold' },
    { name: 'Bold Italic', style: 'boldItalic' },
    { name: 'Monospace', style: 'monospace' },
    { name: 'Fullwidth', style: 'fullwidth' },
    { name: 'Circled', style: 'circled' },
    { name: 'Squared', style: 'squared' },
    { name: 'Double Struck', style: 'doubleStruck' },
    { name: 'Small Caps', style: 'smallCaps' },
    { name: 'Italic', style: 'italic' },
    { name: 'Star Wars Cursive', style: 'cursive' },
    { name: 'Star Wars Bold Cursive', style: 'boldCursive' },
    { name: 'Star Wars Parenthesized', style: 'parenthesized' }
  ]
}

// 生成字体样式列表
const fonts = []
let fontId = 0

// 用于跟踪每个分类已使用的映射，确保分类内不重复（相同映射只出现一次）
const categoryMappingUsage = new Map() // key: category, value: Set of used mapping keys

// 为每个分类生成字体
Object.keys(categoryFonts).forEach(category => {
  // 初始化分类的映射使用记录
  if (!categoryMappingUsage.has(category)) {
    categoryMappingUsage.set(category, new Set())
  }
  const categoryUsedMappings = categoryMappingUsage.get(category)
  
  categoryFonts[category].forEach(({ name, style }) => {
    const mapping = unicodeBlocks[style] || unicodeBlocks.bold
    const mappingKey = JSON.stringify(mapping)
    
    // 检查分类内是否已使用过这个映射（必须避免分类内重复）
    // 允许跨分类有重复，因为不同分类可能需要相同的基础样式
    if (categoryUsedMappings.has(mappingKey)) {
      // 如果当前分类内已使用过这个映射，跳过这个字体
      return
    }
    
    // 添加到字体列表
    fonts.push({
      id: `font-${fontId}`,
      name: name,
      category: category,
      mapping: mapping
    })
    
    // 标记为已使用（仅标记分类内的映射）
    categoryUsedMappings.add(mappingKey)
    fontId++
  })
})

// 为"all"分类添加所有字体
const allFonts = [...fonts]

// 输出TypeScript文件
const outputPath = path.join(__dirname, '../src/lib/unicode-fonts.ts')
const output = `// Unicode 字体样式映射库
// 包含有创意、有差别的Unicode字体样式
// 每个分类20个不同的字体样式
// 此文件由 scripts/generate-creative-fonts.js 自动生成

export interface FontStyle {
  id: string
  name: string
  category: string
  mapping: Record<string, string>
}

// Unicode块映射
const unicodeBlocks: Record<string, Record<string, string>> = ${JSON.stringify(unicodeBlocks, null, 2)}

// 字体样式列表
export const unicodeFontStyles: FontStyle[] = ${JSON.stringify(fonts, null, 2)}

// 转换文本到指定字体样式
export const convertToUnicodeFont = (text: string, styleId: string): string => {
  if (!text) return ''
  
  const fontStyle = unicodeFontStyles.find(f => f.id === styleId)
  if (!fontStyle) return text
  
  return text.split('').map(char => fontStyle.mapping[char] || char).join('')
}

// 根据分类获取字体样式
export const getFontStylesByCategory = (category: string): FontStyle[] => {
  if (category === 'all') return unicodeFontStyles
  return unicodeFontStyles.filter(f => f.category === category)
}
`

fs.writeFileSync(outputPath, output, 'utf8')
console.log(`✅ 已生成 ${fonts.length} 个有创意、有差别的字体样式到 ${outputPath}`)
console.log(`📊 分类统计:`)
Object.keys(categoryFonts).forEach(cat => {
  const count = fonts.filter(f => f.category === cat).length
  console.log(`   ${cat}: ${count} 个字体样式`)
})

// 检查重复
console.log(`\n🔍 重复检查:`)
const mappingGroups = new Map()
fonts.forEach(font => {
  const key = JSON.stringify(font.mapping)
  if (!mappingGroups.has(key)) {
    mappingGroups.set(key, [])
  }
  mappingGroups.get(key).push(font)
})

let duplicateCount = 0
mappingGroups.forEach((fontsWithSameMapping, mapping) => {
  if (fontsWithSameMapping.length > 1) {
    duplicateCount++
    console.log(`   发现 ${fontsWithSameMapping.length} 个字体使用相同映射:`)
    fontsWithSameMapping.forEach(f => {
      console.log(`     - ${f.category} - ${f.name}`)
    })
  }
})

if (duplicateCount === 0) {
  console.log(`   ✅ 没有发现重复的字体映射`)
} else {
  console.log(`   ⚠️  发现 ${duplicateCount} 组重复的字体映射`)
}
