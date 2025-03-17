// 千分位格式化数值，每3位数加一个逗号
const formatterThousands = num => {
  if (!isNaN(num)) {
    const str = String(num)
    const reg = str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
    return str.replace(reg, '$1,')
  } else {
    return num
  }
}

export { formatterThousands }
