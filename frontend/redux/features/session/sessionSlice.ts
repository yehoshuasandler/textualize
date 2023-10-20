import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { entities } from '../../../wailsjs/wailsjs/go/models'
import { CreateNewProject, GetCurrentSession, RequestChangeSessionProjectByName, RequestChooseUserAvatar, RequestUpdateCurrentUser } from '../../../wailsjs/wailsjs/go/ipc/Channel'
import { UserProps } from './types'
import { serialize } from '../../serialize'

const initialState = {
  currentSession: serialize(new entities.Session()) as entities.Session,
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    updateSession: (state, action: PayloadAction<undefined>) => {
      GetCurrentSession().then(response => {
        if (response) state.currentSession = response
      }).catch(console.error)
    },
    createNewProject: (state, action: PayloadAction<string>)=> {
      const newProjectName = action.payload
      CreateNewProject(newProjectName).then(createdSession => {
        if (createdSession) state.currentSession = serialize(createdSession)
      }).catch(console.error)
    },
    requestUpdateCurrentUser: (state, action: PayloadAction<UserProps>) => {
      const userProps = action.payload
      RequestUpdateCurrentUser(new entities.User(userProps)).then(updatedUser => {
        state.currentSession.user = serialize(updatedUser)
      }).catch(console.error)
    },
    requestSelectProjectByName: (state, action: PayloadAction<string>) => {
      const projectName = action.payload
      console.log('projectName: ', projectName)
      RequestChangeSessionProjectByName(projectName).then(success => {
        if (success) GetCurrentSession().then(response => {
          console.log(response)
          if (response) state.currentSession = serialize(response)
        }).catch(console.error)
      }).catch(console.error)
    }
  }
})

export const {
  updateSession,
  createNewProject,
  requestUpdateCurrentUser,
  requestSelectProjectByName
} = sessionSlice.actions

export default sessionSlice.reducer
