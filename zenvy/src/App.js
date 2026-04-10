import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
import './index.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './i18n';
import Navbar from './Navbar/Navbar.js';
import Loading from './Loading/Loading.js';
import Footer from './Home/Footer.js';

// Using Lazy loading
const Home = lazy(() => import('./Home/Home.js'));
const Singin = lazy(() => import('./Navbar/Singin.js'));
const Register = lazy(() => import('./Navbar/Register.js'));
const Create = lazy(() => import('./Navbar/Create.js'));
const Verify = lazy(() => import('./Navbar/Verify.js'));
const Password = lazy(() => import('./Navbar/Password.js'));
const SingleProducts = lazy(() => import('./Products/SingleProducts.js'));
const ProductPage = lazy(() => import('./Products/ProductPage.js'));
const WishList = lazy(() => import('./Navbar/WishList.js'));
const Cart = lazy(() => import('./Navbar/CartProcess/Cart.js'));
const Address = lazy(() => import('./Navbar/Address.js'));
const AddAddress = lazy(() => import('./Navbar/AddAddress.js'));
const CartMethod = lazy(() => import('./Navbar/CartProcess/CartMethod.js'));
const Addpay = lazy(() => import('./Navbar/CartProcess/AddPay.js')); 
const PayPage = lazy(() => import('./Navbar/CartProcess/PayPage.js')); 
const Success = lazy(() => import('./Navbar/CartProcess/Success.js')); 
const OrderTracking = lazy(() => import('./Navbar/CartProcess/OrderTracking.js')); 
const Orders = lazy(() => import('./Navbar/Orders.js')); 
const TrackOrder = lazy(() => import('./Navbar/TrackOrder.js')); 
const ReturnPage = lazy(() => import('./Navbar/ReturnPage.js')); 
const ExchangePage = lazy(() => import('./Navbar/ExchangePage.js'));


// Category Pages
const NewArrvials = lazy(() => import('./Home/NewArrivals.js'));
const Cosmetics = lazy(() => import('./Home/Cosmetics.js'));
const Smartphone = lazy(() => import('./Home/Smartphone.js'));
const Fashion = lazy(() => import('./Home/Fashion.js'));
const Furniture = lazy(() => import('./Home/Furniture.js'));
const Electronics = lazy(() => import('./Home/Electronics.js'));
const Jewelry = lazy(() => import('./Home/Jewelry.js'));
const BestSelling = lazy(() => import('./Home/BestSelling.js'));
const MyAccount = lazy(() => import('./Home/MyAccount.js'));
const HotOffers = lazy(() => import('./Home/HotOffers.js'));
const Recommended = lazy(() => import('./Home/Recommended.js'));
const GiftBoxes = lazy(() => import('./Home/GiftBoxes.js'));
const Article = lazy(() => import('./Home/Article.js'));

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Product Routes */}
          <Route path="/productpage/:id" element={<ProductPage />} />
          <Route path="/singleproducts" element={<SingleProducts />} />
          
          {/* Category Routes - REMOVED CategoryPage, using specific components */}
          <Route path="/jewelry" element={<Jewelry />} />
          <Route path="/smartphone" element={<Smartphone />} />
          <Route path="/cosmetics" element={<Cosmetics />} />
          <Route path="/fashion" element={<Fashion />} />
          <Route path="/furniture" element={<Furniture />} />
          <Route path="/electronics" element={<Electronics />} />
          <Route path="/new-arrivals" element={<NewArrvials />} />
          <Route path="/bestsellers" element={<BestSelling />} />
          <Route path="/hot-offers" element={<HotOffers />} />
          <Route path="/recommends" element={<Recommended />} />
          <Route path="/gift-boxes" element={<GiftBoxes />} />
          <Route path="/articles" element={<Article />} />

  
          {/* Main Routes */}
          <Route path="/" element={<Home/>} />
          <Route path="/wishlist" element={<WishList />} />
          <Route path="/cart" element={<Cart />} />
          
          {/* Auth Routes */}
          <Route path="/signin" element={<Singin/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/create" element={<Create/>} />
          <Route path="/verify" element={<Verify/>} />
          <Route path="/password" element={<Password/>} />
          <Route path='/myAccount' element={<MyAccount/>}/>
          
          {/* Address Routes */}
          <Route path="/Address" element={<Address/>} />
          <Route path="/AddAddress" element={<AddAddress/>} />
          
          {/* Cart Process Routes */}
          <Route path="/cartmethod" element={<CartMethod/>} />
          <Route path="/addpay" element={<Addpay/>} />
          <Route path="/payPage" element={<PayPage/>} />
          <Route path="/success" element={<Success/>} />
          
          {/* Order Routes */}
          <Route path="/orderTracking" element={<OrderTracking/>} />
          <Route path="/orders" element={<Orders/>} />
          <Route path="/track/:id" element={<TrackOrder/>} />
          <Route path="/return/:id" element={<ReturnPage/>} />
          <Route path="/exchange/:id" element={<ExchangePage/>} />
        </Routes>
      </Suspense>
      <Footer/>
    </div>
  );
}

export default App;