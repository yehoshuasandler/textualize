import '../styles/globals.css'

type AppLayoutProps = {
  children: React.ReactNode
}

export default function MainAppLayout({ children }: AppLayoutProps) {
  return <html className='bg-gray-100 bg-opacity-0'><body className='min-h-screen' >{children}</body></html>
}
