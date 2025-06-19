import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

interface Ailment {
  id: string
  imagePath: string
  displayName: string
}

const ailments: Ailment[] = [
  {
    id: "skin-care",
    imagePath: "/assets/ailments/skin-care.png",
    displayName: "Skin Care",
  },
  {
    id: "mind-care",
    imagePath: "/assets/ailments/mind-care.png",
    displayName: "Mental Wellness",
  },
  {
    id: "stomach-care",
    imagePath: "/assets/ailments/stomach-care.png",
    displayName: "Digestive Health",
  },
  {
    id: "women-care",
    imagePath: "/assets/ailments/women-care.png",
    displayName: "Women Care",
  },
  {
    id: "respiratory-care",
    imagePath: "/assets/ailments/respiratory-care.png",
    displayName: "Respiratory Health",
  },
  {
    id: "cardiac-care",
    imagePath: "/assets/ailments/cardiac.png",
    displayName: "Cardiac Health",
  },
  {
    id: "weight-care",
    imagePath: "/assets/ailments/weight-care.png",
    displayName: "Weight Management",
  },
  {
    id: "bone-muscle-care",
    imagePath: "/assets/ailments/bone-joint.png",
    displayName: "Bone & Joint Health",
  },
  {
    id: "constipation",
    imagePath: "/assets/ailments/constipation.png",
    displayName: "Constipation Relief",
  },
  {
    id: "diabetes",
    imagePath: "/assets/ailments/diabetes.png",
    displayName: "Diabetes Management",
  },
  {
    id: "kidney-liver-care",
    imagePath: "/assets/ailments/kidney-liver.png",
    displayName: "Kidney & Liver Health",
  },
  {
    id: "cough-cold-care",
    imagePath: "/assets/ailments/cough-cold.png",
    displayName: "Cough & Cold Relief",
  },
  {
    id: "infections",
    imagePath: "/assets/ailments/infections.png",
    displayName: "Infection Treatment",
  },
  {
    id: "hygeine-care",
    imagePath: "/assets/ailments/personal-hygeine.png",
    displayName: "Personal Hygiene",
  },
  {
    id: "eye-ear-care",
    imagePath: "/assets/ailments/ear-eye.png",
    displayName: "Eye & Ear Health",
  },
  {
    id: "weakness",
    imagePath: "/assets/ailments/vitality.png",
    displayName: "Energy & Vitality",
  },
  {
    id: "sexualwellness",
    imagePath: "/assets/ailments/sexual-wellness.png",
    displayName: "Sexual Wellness",
  },

  {
    id: "hair-care",
    imagePath: "/assets/ailments/hair-care.png",
    displayName: "Hair Health",
  },

  {
    id: "oral-care",
    imagePath: "/assets/ailments/oral-care.png",
    displayName: "Dental Health",
  },
  {
    id: "baby-care",
    imagePath: "/assets/ailments/baby-care.png",
    displayName: "Baby Care",
  },
]

export default function AilmentsPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center text-sm text-gray-500">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-brand">Ailments</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        Browse Products by Ailment
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {ailments.map((ailment) => (
          <Link
            key={ailment.id}
            href={`/products/all?ailment=${ailment.id}`}
            className="block transition-transform hover:scale-105"
          >
            <Card className="overflow-hidden border border-gray-200 hover:border-brand hover:shadow-md transition-all duration-300">
              <div className="p-4">
                <div className="aspect-square relative mb-4">
                  <Image
                    src={ailment.imagePath}
                    alt={ailment.displayName}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <h3 className="text-center font-semibold py-2 text-lg">
                  {ailment.displayName}
                </h3>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
