import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Details from './pages/Details'
import Mainlayout from './layouts/MainLayout'
import ScrollToTop from './components/ScrollToTop'
import Toast from './components/Toast'
import CartDrawer from './pages/CartDrawer'
import Blog from './pages/Blog_Detail'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Checkout from './pages/Checkout'

function App() {
  return (
    <>
      <ScrollToTop />
      <Toast/>

      <Routes>
        <Route element={<Mainlayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/details" element={<Details />} />
          <Route path='/cart' element={<CartDrawer/>}/>
         <Route path='/blog' element={<Blog/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/checkout' element={<Checkout/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App