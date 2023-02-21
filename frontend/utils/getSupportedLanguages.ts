import { GetSuppportedLanguages } from '../wailsjs/wailsjs/go/ipc/Channel'

const getSupportedLanguages = async () => {
  const response = await GetSuppportedLanguages()
  return response
}

export default getSupportedLanguages
