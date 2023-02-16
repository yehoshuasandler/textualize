import { DiffEditor } from '@monaco-editor/react'
import { useEffect, useState } from 'react'
import { useProject } from '../../context/Project/provider'
import type { DiffOnMount } from '@monaco-editor/react/'
import TextEditorButtons from './TextEditorButtons'
import createDiffEditorInteractions from '../../useCases/createDiffEditorInteractions'
import TextPreview from './TextPreview'
import createDebounce from '../../utils/createDebounce'

let editorInteractions: ReturnType<typeof createDiffEditorInteractions>

const TextEditor = () => {
  const { selectedDocumentId, getProcessedAreasByDocumentId, requestUpdateDocumentUserMarkdown, getUserMarkdownByDocumentId } = useProject()
  const [editorHeight, setEditorHeight] = useState(window.innerHeight - 200)
  const [editorValue, setEditorValue] = useState('')
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [modifiedEditorValue, setModifiedEditorValue] = useState('')

  const handleEditorDidMount: DiffOnMount = async (editor, monaco) => {
    const currentDocumentId = selectedDocumentId

    editorInteractions = createDiffEditorInteractions(editor)
    const modifiedEditor = editor.getModifiedEditor()
    const originalEditor = editor.getOriginalEditor()

    setModifiedEditorValue(originalEditor.getValue())

    try {
      const initialStoredUserMarkdownResponse = await getUserMarkdownByDocumentId(selectedDocumentId)
      if (initialStoredUserMarkdownResponse.value) {
        setModifiedEditorValue(initialStoredUserMarkdownResponse.value)
        modifiedEditor.getModel()?.setValue(initialStoredUserMarkdownResponse.value)
      }
    } catch (err) {
      console.log(err)
    }

    modifiedEditor.onDidChangeModelContent(createDebounce(async () => {
      const modifiedMarkdown = modifiedEditor.getValue()
      requestUpdateDocumentUserMarkdown(currentDocumentId, modifiedMarkdown)
      setModifiedEditorValue(modifiedMarkdown)
    }))

    setIsEditorReady(true)
  }

  useEffect(() => {
    if (!selectedDocumentId) {
      setEditorValue('# No Document Selected')
      return
    }

    const requestProcessedArea = async () => {
      try {
        const response = await getProcessedAreasByDocumentId(selectedDocumentId)
        if (!response || response.length === 0) return
        const fullTextOfAreas = response.map(area => area.fullText + '\n').join('\n')
        setEditorValue(fullTextOfAreas)
      } catch (err) {
        console.error(err)
        setEditorValue('# No Areas on Document were textualized')
      }
    }
    requestProcessedArea()
  }, [selectedDocumentId, getProcessedAreasByDocumentId])

  window.addEventListener('resize', () => {
    setEditorHeight(window.innerHeight - 200)
  })

  return <div className='relative m-0 p-0'>
    {isEditorReady
      ? <TextEditorButtons
        isPreviewOpen={isPreviewOpen}
        togglePreview={() => setIsPreviewOpen(!isPreviewOpen)}
        editorInteractions={editorInteractions}
      />
      : ''
    }
    <DiffEditor
      original={editorValue}
      modified={modifiedEditorValue}
      language='markdown'
      height={`${editorHeight}px`}
      onMount={handleEditorDidMount}
      options={{
        renderMarginRevertIcon: true,
        enableSplitViewResizing: false,
      }}
    />

    {isPreviewOpen ? <TextPreview markdown={modifiedEditorValue} height={editorHeight} /> : ''}
  </div>
}

export default TextEditor
