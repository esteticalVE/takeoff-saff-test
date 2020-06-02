export function createCorrectPhone(value) {
  const placeholder = '+0(000)000-00-00'

  let numbers = value.replace(/[^\d]/g, '')

  if (numbers === '') {
    return ''
  }

  let numberList = numbers.split('')

  if (numberList[0] === '8' || numberList[0] === '7') {
    numberList[0] = '7'
  } else {
    numberList.unshift('7')
  }

  if (numberList.length > 11) {
    throw new Error('Phone must consist 11 digits')
  }

  {
    let result = ''
    let index = 0

    for (const sym of placeholder) {
      if (sym === '0') {
        result += numberList[index]
        index++
      } else {
        result += sym
      }
    }

    return result
  }
}
