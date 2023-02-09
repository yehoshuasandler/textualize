import { ListBulletIcon } from '@heroicons/react/20/solid'
import { EyeIcon } from '@heroicons/react/24/outline'
import createDiffEditorInteractions, { MarkdownOperator } from '../../useCases/createDiffEditorInteractions'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

type Props = {
  editorInteractions: ReturnType<typeof createDiffEditorInteractions>
  togglePreview: () => void
}

const TextEditorButtons = (props: Props) => {
  const { editorInteractions, togglePreview } = props
  return <span className="isolate inline-flex rounded-md shadow-sm">
    <button
        type="button"
        onClick={togglePreview}
        className="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-0 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <span className="sr-only">Next</span>
        <EyeIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    <button
      type="button"
      onClick={() => editorInteractions.insertMarkdownOperator(MarkdownOperator.H1)}
      className={classNames(
        'text-lg relative inline-flex items-center rounded-l-md border',
        'border-gray-300 bg-white px-2 py-0 text-gray-700 hover:bg-gray-50',
        'focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1',
        'focus:ring-indigo-500 font-extrabold',
      )}>
      <span className="sr-only">Header 1</span>
      H1
    </button>
    <button
      type="button"
      onClick={() => editorInteractions.insertMarkdownOperator(MarkdownOperator.H2)}
      className={classNames(
        'text-base relative inline-flex items-center border',
        'border-gray-300 bg-white px-2 py-0 text-gray-700 hover:bg-gray-50',
        'focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1',
        'focus:ring-indigo-500 font-bold',
      )}>
      <span className="sr-only">Header 2</span>
      H2
    </button>
    <button
      type="button"
      onClick={() => editorInteractions.insertMarkdownOperator(MarkdownOperator.H3)}
      className={classNames(
        'text-sm relative inline-flex items-center border',
        'border-gray-300 bg-white px-2 py-0 text-gray-700 hover:bg-gray-50',
        'focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1',
        'focus:ring-indigo-500 font-bold',
      )}>
      <span className="sr-only">Header 3</span>
      H3
    </button>
    <button
      type="button"
      onClick={() => editorInteractions.insertMarkdownOperator(MarkdownOperator.H4)}
      className={classNames(
        'text-xs relative inline-flex items-center border',
        'border-gray-300 bg-white px-2 py-0 text-gray-700 hover:bg-gray-50',
        'focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1',
        'focus:ring-indigo-500 font-bold',
      )}>
      <span className="sr-only">Header 4</span>
      H4
    </button>

    <button
      type="button"
      onClick={() => editorInteractions.insertMarkdownOperator(MarkdownOperator.ITALLICS)}
      className={classNames(
        'text-sm relative inline-flex items-center rounded-r-md border',
        'border-gray-300 bg-white px-2 py-0 text-gray-700 hover:bg-gray-50',
        'focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1',
        'focus:ring-indigo-500 italic font-serif',
      )}>
      <span className="sr-only">Italic</span>
      I
    </button>

    <button
      type="button"
      onClick={() => editorInteractions.insertMarkdownOperator(MarkdownOperator.BOLD)}
      className={classNames(
        'text-sm relative inline-flex items-center rounded-r-md border',
        'border-gray-300 bg-white px-2 py-0 text-gray-700 hover:bg-gray-50',
        'focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1',
        'focus:ring-indigo-500 font-extrabold',
      )}>
      <span className="sr-only">Bold</span>
      B
    </button>

    <button
      type="button"
      onClick={() => editorInteractions.insertMarkdownOperator(MarkdownOperator.BULLET)}
      className={classNames(
        'text-sm relative inline-flex items-center rounded-r-md border',
        'border-gray-300 bg-white px-2 py-0 text-gray-700 hover:bg-gray-50',
        'focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1',
        'focus:ring-indigo-500 italic',
      )}>
      <span className="sr-only">Bullet</span>
      <ListBulletIcon className="h-5 w-5" aria-hidden="true" />
    </button>
  </span>
}

export default TextEditorButtons
