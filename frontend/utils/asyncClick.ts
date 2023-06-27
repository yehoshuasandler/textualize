const asyncClick = (e: React.MouseEvent, callback: (e: React.MouseEvent) => Promise<void>) => {
  e.preventDefault()
  callback(e)
}

export default asyncClick
