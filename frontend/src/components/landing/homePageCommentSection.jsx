import {ArrowLeft, Lock, ServerIcon} from "lucide-react";


const HomePageCommentSection = () => {
    return (
        <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <svg
                    aria-hidden="true"
                    className="absolute top-0 left-[max(50%,25rem)] h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
                >
                    <defs>
                        <pattern
                            x="50%"
                            y={-1}
                            id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                            width={200}
                            height={200}
                            patternUnits="userSpaceOnUse"
                        >
                            <path d="M100 200V.5M.5 .5H200" fill="none"/>
                        </pattern>
                    </defs>
                    <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
                        <path
                            d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                            strokeWidth={0}
                        />
                    </svg>
                    <rect fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" width="100%" height="100%" strokeWidth={0}/>
                </svg>
            </div>
            <div
                className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
                {/* Intro Section */}
                <div
                    className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                    <div className="lg:pr-4">
                        <div className="lg:max-w-lg">
                            <p className="text-base/7 font-semibold text-indigo-600">
                                Find your ideal getaway
                            </p>
                            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                                Discover Your Perfect Stay
                            </h1>
                            <p className="mt-6 text-xl/8 text-gray-700">
                                At Apprise Marketplace, explore a curated selection of unique homes, cozy apartments,
                                and luxurious retreats. Every listing is handpicked to ensure comfort, quality, and a
                                memorable travel experience.
                            </p>
                        </div>
                    </div>
                </div>
                {/* Image Section */}
                <div
                    className="-mt-12 -ml-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
                    <img
                        alt="App screenshot"
                        src="https://res.cloudinary.com/dtjcj2krm/image/upload/v1740045850/Screenshot_2025-02-20_at_10.03.40_t9bkki.png"
                        className="w-[48rem] max-w-none rounded-xl bg-gray-900 ring-1 shadow-xl ring-gray-400/10 sm:w-[45rem]"
                    />
                </div>
                {/* Features and Details Section */}
                <div
                    className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                    <div className="lg:pr-4">
                        <div className="max-w-xl text-base/7 text-gray-700 lg:max-w-lg">
                            <p>
                                Our platform offers a seamless and secure booking experience for discerning travelers
                                seeking that perfect stay.
                            </p>
                            <ul role="list" className="mt-8 space-y-8 text-gray-600">
                                <li className="flex gap-x-3">
                                    <ArrowLeft aria-hidden="true" className="mt-1 size-5 flex-none text-indigo-600"/>
                                    <span>
                <strong className="font-semibold text-gray-900">Curated Listings.</strong> Browse handpicked properties that meet high standards for quality and comfort.
              </span>
                                </li>
                                <li className="flex gap-x-3">
                                    <Lock aria-hidden="true" className="mt-1 size-5 flex-none text-indigo-600"/>
                                    <span>
                <strong className="font-semibold text-gray-900">Verified Hosts.</strong> Stay with confidence knowing every host is thoroughly verified.
              </span>
                                </li>
                                <li className="flex gap-x-3">
                                    <ServerIcon aria-hidden="true" className="mt-1 size-5 flex-none text-indigo-600"/>
                                    <span>
                <strong className="font-semibold text-gray-900">Secure Bookings.</strong> Enjoy a smooth, secure, and transparent booking process.
              </span>
                                </li>
                            </ul>
                            <p className="mt-8">
                                Discover, book, and experience a world of unique stays designed to make your journey
                                unforgettable.
                            </p>
                            <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
                                Your journey starts here
                            </h2>
                            <p className="mt-6">
                                Whether planning a weekend escape or a month-long adventure, Apprise Marketplace makes
                                it easy to book the perfect stay—anywhere, anytime.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePageCommentSection;