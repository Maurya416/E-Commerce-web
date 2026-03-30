import Header from '../components/Header'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <div className='bg-gray-300'>
    <div className="min-h-screen mx-auto max-w-7xl bg-[#f8f8f8]">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
    </div>
  )
}

export default MainLayout