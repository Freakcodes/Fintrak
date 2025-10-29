

import { statsData, featuresData, howItWorksData, testimonialsData } from "@/lib/data/landing";
import Image from "next/image";
import Link from "next/link"
export default function HomeContent() {
return ( <main className="mt-24 space-y-32">
{/* Stats Section */} <section aria-labelledby="stats-heading" className="text-center max-w-6xl mx-auto px-4"> <h2 id="stats-heading" className="sr-only">Finance Tracker Statistics</h2> <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
{statsData.map((stat, i) => ( <div key={i}> <h3 className="text-4xl font-extrabold text-blue-600">{stat.value}</h3> <p className="text-gray-600 dark:text-gray-300 mt-2">{stat.label}</p> </div>
))} </div> </section>


  {/* Features Section */}
  <section aria-labelledby="features-heading" className="text-center max-w-6xl mx-auto px-4">
    <h2
      id="features-heading"
      className="text-4xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
    >
      Powerful Features
    </h2>
    <div className="grid md:grid-cols-3 gap-10">
      {featuresData.map((feature, i) => (
        <div
          key={i}
          className="p-8 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white/50 dark:bg-slate-800/50 hover:shadow-lg transition-all"
        >
          <div className="mb-4 flex justify-center text-blue-600">{feature.icon}</div>
          <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
          <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
        </div>
      ))}
    </div>
  </section>

  {/* How It Works Section */}
  <section
    aria-labelledby="how-it-works-heading"
    className="text-center bg-slate-50 dark:bg-slate-900 py-20 rounded-3xl max-w-7xl mx-auto px-4"
  >
    <h2
      id="how-it-works-heading"
      className="text-4xl font-bold mb-10 text-blue-700 dark:text-blue-400"
    >
      How It Works
    </h2>
    <div className="grid md:grid-cols-3 gap-10">
      {howItWorksData.map((step, i) => (
        <div
          key={i}
          className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition"
        >
          <div className="mb-4 flex justify-center text-purple-600">{step.icon}</div>
          <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
          <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
        </div>
      ))}
    </div>
  </section>

  {/* Testimonials Section */}
  <section aria-labelledby="testimonials-heading" className="text-center max-w-6xl mx-auto px-4">
    <h2
      id="testimonials-heading"
      className="text-4xl font-bold mb-10 text-blue-700 dark:text-blue-400"
    >
      What Our Users Say
    </h2>
    <div className="grid md:grid-cols-3 gap-10">
      {testimonialsData.map((t, i) => (
       
        <div
          key={i}
          className="p-8 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white/50 dark:bg-slate-800/50 hover:shadow-lg transition"
        >
          <Image
            width={20}
            height={20}
            src={t.image}
            alt={`Photo of ${t.name}, ${t.role}`}
            className="w-20 h-20 mx-auto rounded-full mb-4 object-cover"
          />
          <p className="text-gray-700 dark:text-gray-300 italic mb-4">“{t.quote}”</p>
          <h4 className="font-semibold text-lg">{t.name}</h4>
          <p className="text-sm text-gray-500">{t.role}</p>
        </div>
      ))}
    </div>
  </section>

  {/* CTA Section */}
  <section className="text-center py-20 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-3xl max-w-6xl mx-auto px-4">
    <h2 className="text-4xl font-bold mb-6">Start Tracking Smarter Today</h2>
    <p className="mb-8 text-lg opacity-90">
      Join thousands of users already managing their finances efficiently.
    </p>
    <Link
      href="/sign-in"
      className="inline-block bg-white text-blue-700 font-semibold px-8 py-3 rounded-full shadow hover:bg-gray-100 transition"
    >
      Get Started
    </Link>
  </section>
</main>


);
}
