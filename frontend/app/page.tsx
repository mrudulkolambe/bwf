import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { ArrowRight, Wrench, Car, Zap, ShieldCheck, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/bwf.svg" alt="BWF Logo" className="h-8" />
            <span className="font-bold tracking-tight text-xl">BWF CONNECT</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#services" className="text-sm font-medium hover:text-neutral-500 transition-colors">Services</Link>
            <Link href="#partners" className="text-sm font-medium hover:text-neutral-500 transition-colors">For Partners</Link>
            <Link href="/auth/login" className={cn(buttonVariants({ variant: "ghost" }), "rounded-full")}>
              Login
            </Link>
            <Link href="/auth/role" className={cn(buttonVariants({ variant: "default" }), "rounded-full bg-black text-white hover:bg-neutral-800")}>
              Get Started
            </Link>
          </nav>
          {/* Simple Mobile Get Started Button */}
          <Link href="/auth/role" className={cn(buttonVariants({ variant: "default" }), "md:hidden rounded-full bg-black text-white px-4 text-xs h-9")}>
            Join
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-24 lg:py-32 overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-[10px] font-bold uppercase tracking-widest mb-6">
                <Zap className="w-3 h-3 fill-black" />
                The Service Revolution
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tighter leading-none sm:leading-[0.9] mb-8">
                Connecting <br className="hidden sm:block" />
                <span className="text-neutral-400">people services.</span>
              </h1>
              <p className="text-lg sm:text-xl text-neutral-500 mb-10 leading-relaxed max-w-xl">
                BWF Connect bridges the gap between professional service partners and customers.
                From emergency tyre repairs to premium car washing—expert care is just a tap away.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/auth/role"
                  className={cn(buttonVariants({ size: "lg" }), "h-16 px-10 rounded-full bg-black text-white hover:bg-neutral-800 text-lg font-semibold w-full sm:w-auto flex items-center justify-center")}
                >
                  Join as a Partner <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <div className="text-sm font-medium text-neutral-400 px-6 italic text-center sm:text-left">
                  Customer Portal launching soon
                </div>
              </div>
            </div>
          </div>
          {/* Abstract visual element */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-neutral-50 rounded-full blur-[120px] -z-10" />
        </section>

        {/* Services Grid */}
        <section id="services" className="py-24 bg-neutral-50">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <h2 className="text-4xl font-bold tracking-tight mb-4">On-Demand Expertise</h2>
                <p className="text-neutral-500 max-w-md">Access a curated network of professional service providers ready to assist you anywhere.</p>
              </div>
              <div className="h-px flex-1 bg-neutral-200 hidden md:block mx-12 mb-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Emergency Support",
                  desc: "Instant connection to nearby professionals for critical repairs and urgent assistance, when every minute counts."
                },
                {
                  icon: Car,
                  title: "Vehicle Care",
                  desc: "A wide array of detailing, washing, and maintenance services delivered right to your location."
                },
                {
                  icon: Wrench,
                  title: "Expert Maintenance",
                  desc: "Access specialized technicians for everything from routine checkups to complex technical fixes."
                }
              ].map((service, i) => (
                <div key={i} className="group bg-white p-10 rounded-[32px] border border-neutral-100 hover:border-black transition-all duration-500">
                  <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                    <service.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-neutral-500 leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <p className="text-sm font-medium text-neutral-400">
                + Many more professional categories launching every week
              </p>
            </div>
          </div>
        </section>

        {/* For Partners Section */}
        <section id="partners" className="py-32 overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="relative">
                <div className="aspect-square bg-neutral-100 rounded-[48px] overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center p-20 text-neutral-200">
                    <Users className="w-full h-full opacity-20" />
                  </div>
                </div>
                {/* Float card effect */}
                <div className="absolute -bottom-10 -right-10 bg-black text-white p-8 rounded-3xl hidden md:block max-w-[240px] shadow-2xl">
                  <div className="text-3xl font-bold mb-1">100+</div>
                  <div className="text-xs uppercase tracking-widest font-bold opacity-60">Verified Partners</div>
                </div>
              </div>

              <div>
                <h2 className="text-5xl font-bold tracking-tighter mb-8 leading-[1.1]">
                  Grow your business <br />
                  with BWF Connect.
                </h2>
                <div className="space-y-8 mb-12">
                  {[
                    { icon: ShieldCheck, title: "Verified Identity", desc: "Join an elite network of trusted service professionals." },
                    { icon: Clock, title: "Work Flexibly", desc: "Manage your availability and accept bookings on your own terms." },
                    { icon: Zap, title: "Direct Growth", desc: "Expand your reach and find new customers without marketing costs." }
                  ].map((feat, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="mt-1">
                        <feat.icon className="w-6 h-6 text-neutral-400" />
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">{feat.title}</h4>
                        <p className="text-sm text-neutral-500 leading-relaxed">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/auth/role"
                  className={cn(buttonVariants({ size: "lg" }), "h-16 px-10 rounded-full bg-black text-white hover:bg-neutral-800 text-lg font-semibold w-full sm:w-auto flex items-center justify-center")}
                >
                  Get Started Now
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-100 py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <img src="/bwf.svg" alt="BWF Logo" className="h-6" />
                <span className="font-bold tracking-tight">BWF CONNECT</span>
              </div>
              <p className="text-neutral-500 max-w-sm">
                Empowering service providers and simplifying convenience for everyone. Join the future of on-demand services.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-6 uppercase text-[10px] tracking-widest text-neutral-400">Platform</h5>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link href="#services" className="hover:text-neutral-500 transition-colors">Services</Link></li>
                <li><Link href="#partners" className="hover:text-neutral-500 transition-colors">Partner Program</Link></li>
                <li><Link href="/auth/login" className="hover:text-neutral-500 transition-colors">Partner Login</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6 uppercase text-[10px] tracking-widest text-neutral-400">Company</h5>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link href="#" className="hover:text-neutral-500 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-neutral-500 transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-neutral-500 transition-colors">Contact Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-neutral-100 text-xs font-medium text-neutral-400 flex flex-col md:flex-row justify-between gap-4">
            <div>© 2026 BWF Connect. All rights reserved.</div>
            <div className="flex gap-8 italic">Crafted for Excellence.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
