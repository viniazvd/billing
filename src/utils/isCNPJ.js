const getType = (value) => {
  const string = Object.prototype.toString.call(value)
  const [ , type ] = /\[object (\w*)\]/.exec(string)
  return type
}
const isType = (type) => (value) => getType(value) === type

const isString = isType('String')

const isCNPJ = (value) => {
  if (!isString(value)) return false

  const digits = value.replace(/[\D]/gi, '')

  let dig1 = 0
  let dig2 = 0

  const validation = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

  const digito = parseInt(digits.charAt(12) + digits.charAt(13))

  const getRest = dig => (((dig % 11) < 2) ? 0 : (11 - (dig % 11)))

  validation.map((v, i) => {
    dig1 += (i > 0 ? (digits.charAt(i - 1) * v) : 0)
    dig2 += digits.charAt(i) * v
  })

  dig1 = getRest(dig1)
  dig2 = getRest(dig2)

  return (((dig1 * 10) + dig2) === digito)
}

export const isCNPJRule = {
  getMessage: () => 'CNPJ inválido.',
  validate: isCNPJ
}

export default isCNPJ
