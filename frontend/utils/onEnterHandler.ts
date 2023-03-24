const onEnterHandler = (event: React.KeyboardEvent<HTMLInputElement>, callback: Function) => {
  if (event.key === 'Enter') callback()
}

export default onEnterHandler
