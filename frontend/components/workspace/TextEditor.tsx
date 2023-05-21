import { loader, DiffEditor } from '@monaco-editor/react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { useEffect, useState } from 'react'
import { useProject } from '../../context/Project/provider'
import type { DiffOnMount } from '@monaco-editor/react/'
import TextEditorButtons from './TextEditorButtons'
import createDiffEditorInteractions from '../../useCases/createDiffEditorInteractions'
import TextPreview from './TextPreview'
import createDebounce from '../../utils/createDebounce'
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline'

loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.34.0/min/vs',
  },
})

let editorInteractions: ReturnType<typeof createDiffEditorInteractions>
const editorHeightOffset = 174

const fontSizeStep = 1
const maxFontSize = 36

let editorRefernce: monaco.editor.IStandaloneDiffEditor | null

const TextEditor = () => {
  const { getSelectedDocument, getProcessedAreasByDocumentId, requestUpdateDocumentUserMarkdown, getUserMarkdownByDocumentId } = useProject()
  const [editorHeight, setEditorHeight] = useState(window.innerHeight - editorHeightOffset)
  const [editorValue, setEditorValue] = useState('')
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [modifiedEditorValue, setModifiedEditorValue] = useState('')
  const [fontSize, setFontSize] = useState(16)

  const selectedDocument = getSelectedDocument()
  const selectedDocumentId = selectedDocument?.id || ''

  const handleEditorDidMount: DiffOnMount = async (editor, _) => {
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

    editorRefernce = editor
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
        const linesofArea = response.map(area => area.lines.map(line => line.fullText + '\n')).join('\n')
        setEditorValue(linesofArea)
      } catch (err) {
        console.error(err)
        setEditorValue('# No Areas on Document were textualized')
      }
    }
    requestProcessedArea()
  }, [selectedDocumentId, getProcessedAreasByDocumentId])

  useEffect(() => {
      editorRefernce?.updateOptions({ fontSize })
  }, [fontSize, isEditorReady])

  window.addEventListener('resize', () => {
    setEditorHeight(window.innerHeight - editorHeightOffset)
  })

  return <div className='m-0 p-0 relative'>
    <span className="flex z-0 rounded-md shadow-sm mb-2 justify-between align-top">
      {isEditorReady
        ? <>
          <TextEditorButtons
            isPreviewOpen={isPreviewOpen}
            togglePreview={() => setIsPreviewOpen(!isPreviewOpen)}
            editorInteractions={editorInteractions}
          />
          <div>
            <div className='flex justify-evenly items-center mt-2 mb-0'>
              <MagnifyingGlassMinusIcon className='w-4 h-4' />
              <input
                id="zoomRange" type="range" min={fontSizeStep} max={maxFontSize} step={fontSizeStep}
                value={fontSize} className="w-[calc(100%-50px)] h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer p-0"
                onChange={(e) => { setFontSize(e.currentTarget.valueAsNumber) }}
              />
              <MagnifyingGlassPlusIcon className='w-4 h-4' />
            </div>

          </div>
        </>
        : ''
      }
    </span>
    <DiffEditor
      original={editorValue}
      modified={modifiedEditorValue}
      language='markdown'
      height={`${editorHeight}px`}
      onMount={handleEditorDidMount}
      options={{
        renderMarginRevertIcon: true,
        enableSplitViewResizing: false,
        glyphMargin: true,
      }}
    />

    {isPreviewOpen ? <TextPreview markdown={modifiedEditorValue} height={editorHeight} /> : ''}
  </div>
}

export default TextEditor
