
import './App.css'
import Navbar from './Component/Navbar/Navbar'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Shop from './Pages/Shop'
import Product from './Pages/Product'
import ShopCategory from './Pages/ShopCategory'
import LoginSignup from './Pages/LoginSignup'
import VerifyEmail from './Pages/VerifyEmail'
import Cart from './Pages/Cart'
import Checkout from './Pages/Checkout'
import OrderConfirmation from './Pages/OrderConfirmation'
import Footer from './Component/Footer/Footer'
import men_banner from './assets/men_banner.png'
import women_banner from './assets/women_banner.png'
import kid_banner from './assets/kid_banner.png'




function App() {
  

  return (
    <div>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Shop/>}/>
          <Route path='/mens' element={<ShopCategory banner={men_banner} category="men"/>}/>
          <Route path='/womens' element={<ShopCategory banner={women_banner} category="women"/>}/>
          <Route path='/kids' element={<ShopCategory banner={kid_banner} category="kid"/>}/>
          <Route path="/product" element={<Product/>}>
            <Route path=':productId' element={<Product/>}/>
          </Route>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/checkout' element={<Checkout/>}/>
          <Route path='/order-confirmation' element={<OrderConfirmation/>}/>
          <Route path='/login' element={<LoginSignup/>}/>
          <Route path='/verify-email' element={<VerifyEmail/>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
      
    </div>
  )
}

export default App
