import Advert from "@/components/advert"
import Blog from "@/components/blog"
import FeaturedProducts from "@/components/featured-products"
import Footer from "@/components/footer"
import Hero from "@/components/hero"
import Navbar from "@/components/navbar"
import OurProducts from "@/components/our-products"
import PopularProducts from "@/components/popular-products"
import SearchByAilment from "@/components/search-by-ailment"
import Testimonials from "@/components/testimonials"
import { db } from "@/db/db"

export default async function Home() {
  return (
    <main className="flex flex-col gap-8">
      <Hero />
      <SearchByAilment />
      <PopularProducts />
      <FeaturedProducts />
      <OurProducts />
      <Blog />
      <Testimonials />
    </main>
  )
}
