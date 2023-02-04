import Editor, { DiffEditor, useMonaco } from '@monaco-editor/react'
import { useEffect, useState } from 'react'
import { useProject } from '../../context/Project/provider'

const TextEditor = () => {
  const monaco = useMonaco()
  const { selectedDocumentId, getProcessedAreasByDocumentId } = useProject()
  const [editorHeight, setEditorHeight] = useState(window.innerHeight - 200)
  const [editorValue, setEditorValue] = useState('')

  // useEffect(() => {
  //   if (monaco) {
  //     console.log("here is the monaco instance:", monaco);
  //   }
  // }, [monaco])

  useEffect(() => {
    if (!selectedDocumentId) {
      setEditorValue('# No Document Selected')
      return
    }

    getProcessedAreasByDocumentId(selectedDocumentId)
      .then(response => {
        if (!response || response.length === 0) return

        const fullTextOfAreas = response
          .map(area => area.fullText + '\n')
          .join('\n')

        setEditorValue(fullTextOfAreas)
      })
      .catch(console.error)

  }, [selectedDocumentId])

  window.addEventListener('resize', () => {
    setEditorHeight(window.innerHeight - 200)
  })

  return <div>
    <Editor
      value={editorValue}
      defaultLanguage='markdown'
      height={`${editorHeight}px`}
    />
  </div>
}

export default TextEditor
