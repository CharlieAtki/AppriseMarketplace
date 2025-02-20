import React from 'react';
import {
    HelpCircle,
    Home,
    CreditCard,
    Shield,
    CalendarCheck,
    MessageSquare
} from 'lucide-react';

const FAQPage = () => {
    const faqs = [
        {
            question: "How does Apprise Marketplace ensure property quality?",
            answer: "Every property on Apprise Marketplace undergoes a thorough verification process. Our team personally reviews each listing, checks host credentials, and ensures properties meet our quality standards for comfort, cleanliness, and amenities.",
            icon: Home
        },
        {
            question: "What is your cancellation policy?",
            answer: "We offer flexible, moderate, and strict cancellation policies. Most properties offer full refunds up to 48 hours before check-in. Specific policies are clearly displayed on each property listing before booking.",
            icon: CalendarCheck
        },
        {
            question: "How are payments handled securely?",
            answer: "All payments are processed through our secure platform using bank-level encryption. Funds are held safely until 24 hours after check-in, ensuring both guests and hosts are protected throughout the transaction.",
            icon: CreditCard
        },
        {
            question: "What kind of support do you offer during my stay?",
            answer: "Our 24/7 customer support team is always available to assist with any issues. We provide instant messaging with hosts, emergency support, and local area assistance to ensure you have a smooth, enjoyable stay.",
            icon: MessageSquare
        },
        {
            question: "How do you verify hosts and guests?",
            answer: "We use a comprehensive verification system including ID verification, background checks, and review history. Hosts must meet strict criteria including property documentation and insurance requirements.",
            icon: Shield
        },
        {
            question: "What makes Apprise different from other platforms?",
            answer: "Apprise Marketplace focuses on curated, high-quality properties with verified hosts. We offer personalized matching, local expertise, and a guarantee on every stay, ensuring you find your perfect holiday accommodation.",
            icon: HelpCircle
        }
    ];

    return (
        <div className="relative isolate overflow-hidden bg-gray-50 px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
            <div className="mx-auto max-w-7xl px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <p className="text-base font-semibold text-indigo-600">
                        Common Questions
                    </p>
                    <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                        Frequently Asked Questions
                    </h1>
                    <p className="mt-6 text-xl text-gray-700">
                        Find answers to common questions about booking with Apprise Marketplace.
                    </p>
                </div>

                <div className="mx-auto mt-16 max-w-2xl lg:max-w-none">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
                        {faqs.map((faq, index) => (
                            <div key={index} className="relative flex flex-col gap-10">
                                <div className="flex items-start gap-x-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                        <faq.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {faq.question}
                                        </h3>
                                        <p className="mt-2 text-base text-gray-700">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;