const serialize = (value: unknown) => {
  return JSON.parse(JSON.stringify(value))
}

const deserialize = (value: Record<string, any>, constructor: any): any => {
  return constructor(value)
}

export { serialize, deserialize }