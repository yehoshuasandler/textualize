import { DiffEditor } from '@monaco-editor/react'
import { useEffect, useState } from 'react'
import { useProject } from '../../context/Project/provider'
import type { DiffOnMount } from '@monaco-editor/react/'
import TextEditorButtons from './TextEditorButtons'
import createDiffEditorInteractions from '../../useCases/createDiffEditorInteractions'
import ReactMarkdown from 'react-markdown'

let editorInteractions: ReturnType<typeof createDiffEditorInteractions>

const TextEditor = () => {
  const { selectedDocumentId, getProcessedAreasByDocumentId } = useProject()
  const [editorHeight, setEditorHeight] = useState(window.innerHeight - 200)
  const [editorValue, setEditorValue] = useState('')
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [modifiedEditorValue, setIsModifiedEditorValue] = useState('')

  const handleEditorDidMount: DiffOnMount = (editor, _) => {
    editorInteractions = createDiffEditorInteractions(editor)
    const modifiedEditor = editor.getModifiedEditor()
    setIsModifiedEditorValue(modifiedEditor.getValue())
    modifiedEditor.onDidChangeModelContent(() => {
      setIsModifiedEditorValue(modifiedEditor.getValue())
    })

    setIsEditorReady(true)
  }

  useEffect(() => {
    if (!selectedDocumentId) {
      setEditorValue('# No Document Selected')
      return
    }

    const requestProcessedArea = async () => {
      let response
      try {
        response = await getProcessedAreasByDocumentId(selectedDocumentId)
        if (!response || response.length === 0) return
        const fullTextOfAreas = response.map(area => area.fullText + '\n').join('\n')
        setEditorValue(fullTextOfAreas)
      } catch (err) { console.error(err) }
    }
    requestProcessedArea()
}, [selectedDocumentId, getProcessedAreasByDocumentId])

  window.addEventListener('resize', () => {
    setEditorHeight(window.innerHeight - 200)
  })

return <div className='relative m-0 p-0'>
  { isEditorReady
    ? <TextEditorButtons
      togglePreview={() => setIsPreviewOpen(!isPreviewOpen)}
      editorInteractions={editorInteractions}
      />
    : ''
  }
  <DiffEditor
    original={editorValue}
    modified={editorValue}
    language='markdown'
    height={`${editorHeight}px`}
    onMount={handleEditorDidMount}
  />

  {isPreviewOpen
     ? <div 
     className='absolute w-1/2 top-[30px] bg-white overflow-y-scroll p-0 m-0'
     style={{'height': `${editorHeight}px`}}> 
     <ReactMarkdown
      components={{
        h1: ({node, ...props}) => <h1 {...props} className='font-extrabold text-2xl' />,
        h2: ({node, ...props}) => <h2 {...props} className='font-extrabold text-xl' />,
        h3: ({node, ...props}) => <h3 {...props} className='font-extrabold text-lg' />,
        h4: ({node, ...props}) => <h4 {...props} className='font-extrabold text-base' />,
        h5: ({node, ...props}) => <h5 {...props} className='font-bold text-base' />,
        h6: ({node, ...props}) => <h6 {...props} className='font-semibold text-base' />,
        ul: ({node, ...props}) => <ul {...props} className='list-disc list-inside ml-2' />,
        ol: ({node, ...props}) => <ol {...props} className='list-decimal list-inside ml-2' />,
      }}
     >
        {modifiedEditorValue}
      </ReactMarkdown>
      </div>
     : ''
  }
</div>
}

export default TextEditor
