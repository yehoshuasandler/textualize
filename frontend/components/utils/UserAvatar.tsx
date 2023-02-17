import { useProject } from '../../context/Project/provider'

type Props = { overrideImagePath?: string }

const UserAvatar = (props?: Props) => {
  const { currentSession } = useProject()

  const avatarPath = props?.overrideImagePath ?? currentSession?.user?.avatarPath

  if (avatarPath) return <img
    className="h-8 w-8 rounded-full"
    src={avatarPath}
    alt="user avatar"
  />
  else if (currentSession?.user?.firstName || currentSession?.user?.lastName) return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
      <span className="text-sm font-medium leading-none text-white">
        {`${currentSession?.user?.firstName[0]}${currentSession?.user?.lastName[0]}`}
      </span>
    </span>
  )
  else return <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  </span>
}

export default UserAvatar