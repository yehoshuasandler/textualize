import { GetSupportedLanguages } from '../wailsjs/wailsjs/go/ipc/Channel'

const getSupportedLanguages = async () => {
  const response = await GetSupportedLanguages()
  return response
}

export default getSupportedLanguages
