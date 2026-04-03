import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Details from './pages/Details'
import Mainlayout from './layouts/MainLayout'
import ScrollToTop from './components/ScrollToTop'
import CartDrawer from './pages/CartDrawer'
import Blog from './pages/Blog_Detail'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Checkout from './pages/Checkout'
import ProtectedRoute from './components/ProtectedRoute'
import MyOrders from './pages/MyOrders'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
      <ScrollToTop />
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route element={<Mainlayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/details/:slug?" element={<Details />} />
          <Route path='/cart' element={<CartDrawer/>}/>
          <Route path='/checkout' element={<ProtectedRoute><Checkout/></ProtectedRoute>}/>
          <Route path='/orders' element={<ProtectedRoute><MyOrders/></ProtectedRoute>}/>
          
          <Route path='/blog' element={<Blog/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App