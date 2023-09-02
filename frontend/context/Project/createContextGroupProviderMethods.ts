import { saveContextGroups } from '../../useCases/saveData'
import { RequestConnectProcessedAreas, GetSerializedContextGroups } from '../../wailsjs/wailsjs/go/ipc/Channel'
import { entities } from '../../wailsjs/wailsjs/go/models'


type Dependencies = { updateDocuments: Function }

const createContextGroupProviderMethods = (dependencies?: Dependencies) => {
  
    const requestConnectProcessedAreas = async (headId: string, tailId: string) => {
      let wasSuccessful = false
      try {
        wasSuccessful = await RequestConnectProcessedAreas(headId, tailId)
        await saveContextGroups()
      } catch (err) {
        console.error(err)
      }
      dependencies?.updateDocuments()
      return wasSuccessful
    }
  
    const getSerializedContextGroups = async () => {
      let response: entities.SerializedLinkedProcessedArea[] = []
      try {
        response = await GetSerializedContextGroups()
      } catch (err) {
        console.error(err)
      }
      return response
    }
  
    return {
      requestConnectProcessedAreas,
      getSerializedContextGroups,
    }
}

export default createContextGroupProviderMethods
