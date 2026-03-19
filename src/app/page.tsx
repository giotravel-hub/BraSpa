import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section>
        <div className="max-w-[90rem] mx-auto px-4 pt-20 pb-16">
          <div className="flex items-center justify-between">
            {/* Left — 2 figures, right one flipped to face inward */}
            <div className="hidden lg:flex items-center -space-x-6 flex-shrink-0 w-72 justify-end -translate-y-20">
              <Image
                src="/humaan-standing.svg"
                alt=""
                width={314}
                height={421}
                className="h-52 w-auto"
                priority
              />
              <Image
                src="/humaan-standing-2.svg"
                alt=""
                width={261}
                height={442}
                className="h-52 w-auto -scale-x-100"
                priority
              />
            </div>

            {/* Center content */}
            <div className="text-center max-w-2xl flex-1 px-6 lg:px-10">
              <h1 className="text-4xl md:text-5xl font-semibold text-plum-800 mb-6" style={{ lineHeight: 1.2 }}>
                Supporting each other,
                <br />
                one perfect fit at a time
              </h1>
              <p className="text-lg text-stone-600 mb-4 leading-relaxed">
                A neighborhood space where breast cancer survivors in Walnut Creek, Concord, Pleasant Hill,
                Lafayette, Martinez, Moraga, and Orinda can exchange bras they no longer need with others.
              </p>
              <p className="text-stone-500 mb-10">
                Mastectomy bras, post-surgical bras, prosthesis forms &mdash;
                whatever you have to offer or need to find.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup"
                  className="px-8 py-3 bg-plum-700 text-white rounded-full text-lg font-medium hover:bg-plum-800 transition-colors"
                >
                  Join the Community
                </Link>
                <Link
                  href="/listings"
                  className="px-8 py-3 border border-plum-300 text-plum-800 rounded-full text-lg font-medium hover:bg-plum-50 transition-colors"
                >
                  Browse Listings
                </Link>
              </div>
            </div>

            {/* Right — 2 figures facing each other */}
            <div className="hidden lg:flex items-center -space-x-6 flex-shrink-0 w-72 justify-start translate-y-16">
              <Image
                src="/humaan-standing-3.svg"
                alt=""
                width={271}
                height={442}
                className="h-52 w-auto"
                priority
              />
              <Image
                src="/humaan-standing-4.svg"
                alt=""
                width={197}
                height={421}
                className="h-52 w-auto -scale-x-100"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div>
              <div className="w-14 h-14 blob-shape bg-plum-100 flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-plum-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-stone-800 mb-2">
                Share with Care
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Post items you no longer need and help someone in your community
                find what they&apos;re looking for.
              </p>
            </div>
            <div>
              <div className="w-14 h-14 blob-shape bg-linen-200 flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-linen-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-stone-800 mb-2">
                Easy to Find
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Search by size, category, and condition to find exactly what
                you need, quickly.
              </p>
            </div>
            <div>
              <div className="w-14 h-14 blob-shape-2 bg-plum-100 flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-plum-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-stone-800 mb-2">
                Local &amp; Trusted
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Connect via email with people in Central Contra Costa. All listings come from
                verified local zip codes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
