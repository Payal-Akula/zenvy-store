import Carousel from './Carousel'
import ProductDisplay from './ProductDisplay'
import BestDeal from './BestDeals'
import NewArrivals from './NewArrivals'
import BestSelling from './BestSelling'

function Home() {
  return (
    <>
    <Carousel className="mb-3"/>
    <ProductDisplay className="mb-3"/>
    <BestDeal className="mb-3"/>
    <NewArrivals className="mb-3"/>
    <BestSelling/>
    </>
  )
}

export default Home 