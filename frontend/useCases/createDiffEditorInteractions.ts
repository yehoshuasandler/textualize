import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

export enum MarkdownOperator {
  H1 = '# ',
  H2 = '## ',
  H3 = '### ',
  H4 = '#### ',
  H5 = '##### ',
  H6 = '###### ',
  ITALLICS = '_',
  BOLD = '**',
  BULLET = '* ',
  DIVIDER = '\n\n---\n\n'
}

const wrapperOperators = [
  MarkdownOperator.ITALLICS,
  MarkdownOperator.BOLD
]

const createDiffEditorInteractions = (editor: monaco.editor.IStandaloneDiffEditor) => {
  const modifiedEditor = editor.getModifiedEditor()

  return {
    undo: () => { },
    redo: () => { },
    insertMarkdownOperator: (operator: MarkdownOperator) => {
      const selection = modifiedEditor.getSelection()
      if (!selection) return

      const { startColumn, startLineNumber, endColumn, endLineNumber } = selection

      const doesSelectionHaveRange = (endLineNumber > startLineNumber) || (endColumn > startColumn)

      let range: monaco.IRange = { startColumn, startLineNumber, endColumn, endLineNumber, }
      let newText = modifiedEditor.getModel()?.getValueInRange(range) || ''

      const lineOfCursor = startLineNumber
      const lengthOfLine = (modifiedEditor.getModel()?.getLineLength(lineOfCursor) || 1) + 1

      const wordAtStartPosition = modifiedEditor.getModel()?.getWordAtPosition({
        column: startColumn, lineNumber: startLineNumber
      })

      if (operator == MarkdownOperator.DIVIDER) {
        console.log('lineOfCursor:', lineOfCursor)
        console.log('lengthOfLine:', lengthOfLine)
        range = {
          startLineNumber,
          startColumn: lengthOfLine,
          endLineNumber,
          endColumn: lengthOfLine,
        }

        newText = `${operator}`
      } else if (wrapperOperators.includes(operator)) {
        if (!doesSelectionHaveRange && wordAtStartPosition) range = {
          startLineNumber,
          startColumn: wordAtStartPosition.startColumn,
          endLineNumber,
          endColumn: wordAtStartPosition.endColumn
        }
        newText = `${operator}${modifiedEditor.getModel()?.getValueInRange(range)}${operator}`
      } else {
        range = {
          startLineNumber,
          startColumn: 0,
          endLineNumber,
          endColumn: 0
        }

        newText = `${operator}${modifiedEditor.getModel()?.getValueInRange(range)}`
      }

      modifiedEditor.executeEdits('editor', [{
        range,
        text: newText
      }])

      modifiedEditor.pushUndoStop()
    }
  }
}

export default createDiffEditorInteractions
