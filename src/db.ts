import moment from 'moment'

import { getSheetData } from '@/spreadsheet'

type KEY = string | number
type VALUE = string | number
type TYPE = string
type FORMAT = string
type DATA = string | number | Date | boolean | null | DATA[]
type KeyInfo = {
  name: KEY
  type?: TYPE
  format?: FORMAT
}

type arrayToObjectFunc = (keys: KeyInfo[], arr: VALUE[]) => Record<KEY, VALUE>
const arrayToObject: arrayToObjectFunc = (keys, arr) =>
  arr.reduce(
    (acc, value, index) => (keys[index].type && value ? {
      ...acc,
      [keys[index].name]: typeConvert(
        value,
        keys[index].type,
        keys[index].format,
      ),
    } : acc),
    {},
  )

type typeConvertFunc = (v: VALUE, vtype?: TYPE, format?: FORMAT) => DATA
const typeConvert: typeConvertFunc = (v, vtype = 'string', format?) => {
  if (v === '') return null
  if (vtype.endsWith('[]')) {
    const valueType = vtype.slice(0, -2)
    return String(v)
      .split(',')
      .map(value => typeConvert(value, valueType, format))
  }
  switch (vtype) {
  case 'string':
    return String(v)
  case 'number':
    return Number(v)
  case 'boolean':
    if (typeof v === 'string')
      return !['FALSE', 'X', 'N', '?', '-'].includes(v)
    return !!v
  case 'date':
    return moment(v, format).toDate()
  default:
    return v
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getData = async(
  file: string,
  sheet: string,
  pagination?: { page: number, per: number },
  filter?: any
): Promise<Record<KEY, VALUE>[]> => {
  const data = await getSheetData(file, sheet)
  const types = data[1] as TYPE[]
  const formats = data[2] as FORMAT[]
  const keys: KeyInfo[] = data[0].map((key, i) => ({
    name: key,
    type: types[i],
    format: formats[i],
  }))
  const valueArrays = data.slice(3) as VALUE[][]
  let values = valueArrays.map(arr => arrayToObject(keys, arr))
  if (filter) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filterFunc = (value: any) => {
      const boolArray = Object.entries(filter).map(([k, v]) => value[k] === v)
      return boolArray.reduce((a, b) => a && b, true)
    }
    values = values.filter(filterFunc)
  }
  if (pagination && pagination.page > 0 && pagination.per > 0) {
    const page = pagination.page - 1
    const per = pagination.per
    values = values.slice(page * per, (page + 1) * per)
  }
  return values
}
