import Link from "next/link"

// /home/rahulsaamanth/Code0/mhp_u/app/not-found.tsx

const NotFoundPage = () => {
  return (
    <div className="h-[80vh] w-full flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <div className="text-8xl my-6">🦉</div>
      <p className="text-lg text-muted-foreground mb-8">
        Oops! The page you are looking for does not exist.
      </p>
      <Link href="/" className="text-lg font-medium text-brand hover:underline">
        Go back to Home
      </Link>
    </div>
  )
}

export default NotFoundPage
