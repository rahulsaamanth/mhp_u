// import Blog from "@/components/blog"
import FeaturedProducts from "@/components/featured-products"
import Hero from "@/components/hero"
import OurProducts from "@/components/our-products"
import PopularProducts from "@/components/popular-products"
import SearchByAilment from "@/components/search-by-ailment"
import Testimonials from "@/components/testimonials"

export default async function Home() {
  // Add artificial delay for testing loading states
  await new Promise((resolve) => setTimeout(resolve, 4000)) // 2 second delay

  return (
    <main className="flex flex-col gap-8">
      <Hero />
      <SearchByAilment />
      <PopularProducts />
      <FeaturedProducts />
      <OurProducts />
      {/* <Blog /> */}
      <Testimonials />
    </main>
  )
}
