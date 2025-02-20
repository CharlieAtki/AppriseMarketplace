import React from 'react';
import { Star } from 'lucide-react';

const StayInspired = () => {
    return (
        <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
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

            <div className="mx-auto max-w-4xl text-center">
                <h2 className="text-4xl font-semibold text-gray-900 sm:text-5xl">
                    Discover Your Next Getaway
                </h2>
                <p className="mt-6 text-lg text-gray-600">
                    Join our community of travelers and hosts. Get early access to exclusive properties,
                    seasonal deals, and personalized travel recommendations.
                </p>

                <form className="mt-8 flex justify-center">
                    <input
                        type="email"
                        placeholder="Your email address"
                        className="w-full max-w-sm rounded-l-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type="submit"
                        className="rounded-r-lg bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700 transition"
                    >
                        Join Now
                    </button>
                </form>

                <div className="mt-12 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-6 w-6 fill-indigo-500 text-indigo-500" />
                        ))}
                    </div>

                    <div className="flex justify-center gap-8">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">50K+</p>
                            <p className="text-sm text-gray-600">Happy Guests</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">1000+</p>
                            <p className="text-sm text-gray-600">Properties</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">4.9/5</p>
                            <p className="text-sm text-gray-600">Guest Rating</p>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center gap-6">
                        <img
                            src="/api/placeholder/120/40"
                            alt="Verified by Apprise"
                            className="h-10"
                        />
                        <img
                            src="/api/placeholder/120/40"
                            alt="Secure Booking"
                            className="h-10"
                        />
                        <img
                            src="/api/placeholder/120/40"
                            alt="Premium Service"
                            className="h-10"
                        />
                    </div>

                    <p className="mt-6 text-gray-500 text-sm">
                        Join thousands of satisfied travelers who found their perfect stay through Apprise Marketplace
                    </p>
                </div>
            </div>
        </section>
    );
};

export default StayInspired;