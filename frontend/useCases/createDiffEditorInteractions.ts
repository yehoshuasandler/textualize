import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

export enum MarkdownOperator {
  H1 = '# ',
  H2 = '## ',
  H3 = '### ',
  H4 = '#### ',
  ITALLICS = '__',
  BOLD = '**',
  BULLET = '* ',
}

const wrapperOperators = [
  MarkdownOperator.ITALLICS,
  MarkdownOperator.BOLD
]

const createDiffEditorInteractions = (editor: monaco.editor.IStandaloneDiffEditor)=> {
  const modifiedEditor = editor.getModifiedEditor()
  const originalEditor = editor.getOriginalEditor()

  return {
    undo: () => { },
    redo: () => { },
    insertMarkdownOperator: (operator: MarkdownOperator) => {
      const selection = modifiedEditor.getSelection()
      if (!selection) return
      
      const { startColumn, startLineNumber, endColumn, endLineNumber } = selection

      const doesSelectionHaveRange = (endLineNumber > startLineNumber) || (endColumn > startColumn)
      
      const lineOfCursor = startLineNumber
      const lengthOfLine = (modifiedEditor.getModel()?.getLineLength(lineOfCursor) || 1) + 1

      let range: monaco.IRange = { startColumn, startLineNumber, endColumn, endLineNumber, }
      let newText = modifiedEditor.getModel()?.getValueInRange(range) || ''

      if (wrapperOperators.includes(operator)) {
        if (!doesSelectionHaveRange) {
          range = {
            startLineNumber: lineOfCursor,
            endLineNumber: lineOfCursor,
            startColumn: 0,
            endColumn: lengthOfLine
          }
        }

        newText = `${operator}${modifiedEditor.getModel()?.getValueInRange(range)}${operator}`
      } else {
        const wordAtStartPosition = modifiedEditor.getModel()?.getWordAtPosition({
          column:startColumn, lineNumber: startLineNumber
        })

        if (!doesSelectionHaveRange && wordAtStartPosition) {
          range = {
            startLineNumber,
            startColumn: wordAtStartPosition.startColumn,
            endLineNumber,
            endColumn: wordAtStartPosition.endColumn
          }
        } 

        newText = `${operator}${modifiedEditor.getModel()?.getValueInRange(range)}`
      }

      modifiedEditor.executeEdits('editor', [{
        range,
        text: newText
      }])
    }
  }
}

export default createDiffEditorInteractions
