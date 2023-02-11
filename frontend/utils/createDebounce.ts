const createDebounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      return fn.apply(this, args)
    }, ms)
  }
}

export default createDebounce
