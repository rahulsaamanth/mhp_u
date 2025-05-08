import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

interface ReviewCardProps {
  rating: number
  title: string
  content: string
  author: string
  timeAgo: string
}

export function ReviewCard({
  rating,
  title,
  content,
  author,
  timeAgo,
}: ReviewCardProps) {
  return (
    <Card className="relative border bg-white overflow-hidden h-[320px] transition-all duration-300 border-brand-foreground/20">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex-col sm:flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">{author}</h3>
          <div className="flex">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${
                    i < rating ? "text-brand fill-brand" : "text-gray-200"
                  }`}
                />
              ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow relative mb-4">
          <Quote className="size-8 absolute -top-2 -left-2 text-brand/60 rotate-180" />
          <div className="mt-5 px-4 max-h-[160px] overflow-y-auto text-brand-foreground text-sm leading-relaxed">
            {content}
          </div>
          {/* <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div> */}
        </div>

        {/* Footer */}
        {/* <div className="pt-2 mt-auto border-t border-gray-100 absolute bottom-8">
          <p className="text-xs text-brand">{timeAgo}</p>
        </div> */}
      </CardContent>
    </Card>
  )
}
