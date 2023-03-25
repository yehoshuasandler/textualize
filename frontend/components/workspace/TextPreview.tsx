import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import rehypeRaw from 'rehype-raw'

type Props = { markdown: string, height: number }

const TextPreview = (props: Props) => (
  <div
    className='absolute w-[calc(50%-14px)] top-[38px] bg-white overflow-y-scroll p-4 m-0'
    style={{ 'height': `${props.height}px` }}>
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: ({ node, ...props }) => <h1 {...props} className='font-black text-2xl' />,
        h2: ({ node, ...props }) => <h2 {...props} className='font-extrabold text-xl' />,
        h3: ({ node, ...props }) => <h3 {...props} className='font-bold text-lg' />,
        h4: ({ node, ...props }) => <h4 {...props} className='font-semibold text-base' />,
        h5: ({ node, ...props }) => <h5 {...props} className='font-medium text-base' />,
        h6: ({ node, ...props }) => <h6 {...props} className='font-light text-base underline' />,
        ul: ({ node, ...props }) => <ul {...props} className='list-disc list-inside ml-2' />,
        ol: ({ node, ...props }) => <ol {...props} className='list-decimal list-inside ml-2' />,
        em: ({ node, ...props }) => <em {...props} className='italic font-light' />,
        p: ({ node, ...props }) => <p {...props} className='text-base mb-2' />,
        blockquote: ({ node, ...props }) => <blockquote {...props} className='text-base mb-2 block p-3 bg-slate-50 italic' />,
      }}
    >
      {props.markdown}
    </ReactMarkdown>
  </div>
)

export default TextPreview
