import { DocumentPlusIcon } from '@heroicons/react/24/outline'

export default function NoSelectedDocument() {
  return (
    <button
      type="button"
      className="relative block w-full rounded-lg border-4 border-dashed border-gray-200 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        fill="none"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <DocumentPlusIcon />
      </svg>
      <span className="mt-2 block text-sm font-medium text-gray-900">Add Document</span>
    </button>
  )
}