import { entities } from '../../../wailsjs/wailsjs/go/models'
import { SidebarGroup } from './types'

const getNavigationProps = (documents: entities.Document[], groups: entities.Group[]) : SidebarGroup[] => {
  const groupsWithDocuments = groups.map(g => {
    const childrenDocuments = documents
      .filter(d => d.groupId === g.id)
      .map(d => ({
        id: d.id,
        name: d.name,
        areas: d.areas.map(a => ({ id: a.id, name: a.name, order: a.order }))//.sort((a, b) => a.order - b.order)
      }))

    return {
      id: g.id,
      name: g.name,
      documents: childrenDocuments
    }
  })

  const documentsWithoutGroup = documents
    .filter(d => !d.groupId || d.groupId === 'Uncategorized')
    .map(d => ({
      id: d.id,
      name: d.name,
      areas: d.areas.map(a => ({ id: a.id, name: a.name, order: a.order }))//.sort((a, b) => a.order - b.order)
    }))

  return [
    ...groupsWithDocuments,
    {
      id: '',
      name: 'Uncategorized',
      documents: documentsWithoutGroup
    }
  ]
}

export { getNavigationProps }