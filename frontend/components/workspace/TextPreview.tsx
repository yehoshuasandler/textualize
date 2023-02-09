import { ReactMarkdown } from 'react-markdown/lib/react-markdown'

type Props = { markdown: string, height: number }

const TextPreview = (props: Props) => (
  <div
    className='absolute w-1/2 top-[30px] bg-white overflow-y-scroll p-0 m-0'
    style={{ 'height': `${props.height}px` }}>
    <ReactMarkdown
      components={{
        h1: ({ node, ...props }) => <h1 {...props} className='font-extrabold text-2xl' />,
        h2: ({ node, ...props }) => <h2 {...props} className='font-extrabold text-xl' />,
        h3: ({ node, ...props }) => <h3 {...props} className='font-extrabold text-lg' />,
        h4: ({ node, ...props }) => <h4 {...props} className='font-extrabold text-base' />,
        h5: ({ node, ...props }) => <h5 {...props} className='font-bold text-base' />,
        h6: ({ node, ...props }) => <h6 {...props} className='font-semibold text-base' />,
        ul: ({ node, ...props }) => <ul {...props} className='list-disc list-inside ml-2' />,
        ol: ({ node, ...props }) => <ol {...props} className='list-decimal list-inside ml-2' />,
        em: ({ node, ...props }) => <em {...props} className='italic font-light' />,
        p: ({ node, ...props }) => <p {...props} className='text-base mb-2' />,
      }}
    >
      {props.markdown}
    </ReactMarkdown>
  </div>
)

export default TextPreview
