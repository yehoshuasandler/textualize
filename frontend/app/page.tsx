import 'server-only'
import MainHead from '../components/MainHead'
import DocumentRenderer from '../components/workspace/DocumentRenderer'
import Navigation from '../components/workspace/Navigation'

export default function Home() {
  return (
    <>
      <MainHead />
      <Navigation />

      <main className=" bg-gray-100 h-[calc(100vh-4rem)] ml-64 ">
        <div className='flex-1'>
          <div className="py-6">
            <div className="mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="mx-auto  px-4 sm:px-6 md:px-8">
              <div className="py-4">
                <div className=" min-h-96 rounded-lg border-4 border-dashed border-gray-200">
                  <DocumentRenderer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
