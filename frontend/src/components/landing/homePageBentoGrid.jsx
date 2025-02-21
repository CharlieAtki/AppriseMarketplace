const HomePageBentoGrid = () => {
    return (
        <div className="bg-gray-50 py-24 sm:py-32">
            <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                <p className="mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-balance text-gray-950 sm:text-5xl">
                    Built for Modern Travelers & Hosts
                </p>
                <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
                    <div className="relative lg:row-span-2">
                        <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
                        <div
                            className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                            <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                                    Explore & Book on the Go
                                </p>
                                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                                    Discover unique stays and experiences right from your phone.
                                    Whether you're planning a weekend getaway or a month-long adventure, our
                                    mobile-friendly interface makes booking effortless—anytime, anywhere.
                                </p>
                            </div>
                            <div
                                className="@container relative min-h-[30rem] w-full grow max-lg:mx-auto max-lg:max-w-sm">
                                <div
                                    className="absolute inset-x-10 top-12 bottom-0 overflow-hidden rounded-t-[2cqw] border-x-[0.5cqw] border-t-[0.5cqw] border-gray-700 bg-gray-900 shadow-2xl">
                                    <img
                                        className="scale-100"
                                        src="https://res.cloudinary.com/dtjcj2krm/image/upload/t_PhoneSize/v1740043803/Screenshot_2025-02-20_at_09.27.58_hlfhke.png"
                                        alt="Phone Image"
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            className="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 lg:rounded-l-[2rem]"></div>
                    </div>
                    <div className="relative max-lg:row-start-1">
                        <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
                        <div
                            className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                            <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Blazing
                                    Fast Performance</p>
                                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                                    Experience ultra-fast load times and optimized performance, so you never have to
                                    wait.
                                </p>
                            </div>
                            <div
                                className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                                <img
                                    className="w-full max-lg:max-w-xs"
                                    src="https://tailwindui.com/plus-assets/img/component-images/bento-03-performance.png"
                                    alt=""
                                />
                            </div>
                        </div>
                        <div
                            className="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 max-lg:rounded-t-[2rem]"></div>
                    </div>
                    <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
                        <div className="absolute inset-px rounded-lg bg-white"></div>
                        <div
                            className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                            <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Enterprise-Grade
                                    Security</p>
                                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                                    Built with cutting-edge encryption and security protocols to keep your data safe.
                                </p>
                            </div>
                            <div className="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
                                <img
                                    className="h-[min(152px,40cqw)] object-cover"
                                    src="https://tailwindui.com/plus-assets/img/component-images/bento-03-security.png"
                                    alt=""
                                />
                            </div>
                        </div>
                        <div
                            className="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5"></div>
                    </div>
                    <div className="relative lg:row-span-2">
                        <div
                            className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
                        <div
                            className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                            <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                                    Smart Suggestions, Just for You
                                </p>
                                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                                    Discover stays and experiences tailored to your preferences. Our AI-driven
                                    recommendations help you find the perfect getaway,
                                    hidden gems, and must-visit spots—all based on your past searches and interests.
                                </p>
                            </div>
                            <div className="relative min-h-[30rem] w-full grow">
                                <div
                                    className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl shadow-2xl">
                                    <div className="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
                                        <img
                                            className="w-full h-full object-cover"
                                            src="https://res.cloudinary.com/dtjcj2krm/image/upload/t_PhoneSize/v1740045191/Screenshot_2025-02-20_at_09.52.57_s3wutj.png"
                                            alt=""
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePageBentoGrid;