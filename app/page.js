import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { featuresData, howItWorksData } from "@/data/landing";
import Image from "next/image";

export default function Home() {
  return (
    <div className="mt-20">
      <Hero />

      {/* Features section with green theme */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Everything you need to manage your finances in one place
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <Card
                key={index}
                className="p-6 border border-gray-100 hover:shadow-lg transition-all"
              >
                <CardContent className="space-y-4 pt-4">
                  <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works section with green gradient */}
      <section className="py-20 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {howItWorksData.map((step, index) => (
              <div
                key={index}
                className="text-center bg-white p-8 rounded-lg border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-green-600">{step.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-action section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to take control of your finances?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join us to manage your money better.
          </p>
          <Button className="bg-white text-green-600 hover:bg-green-50 px-8 py-2 rounded-md cursor-pointer text-lg font-medium">
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
}
