import React from "react";
import { Link } from "react-router-dom";

// --- SVG Icons ---
const LogoIcon = ({ className = "" }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
);

const TicketIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const DocumentIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const TrendingIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
    </svg>
);

const TwitterIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
);

const LinkedInIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

// --- Sections ---

const Navbar = () => (
    <nav className="w-full relative z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 flex items-center justify-center bg-indigo-50 text-indigo-500 rounded-full">
                    <LogoIcon className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">SmartHelp AI</span>
            </div>

            {/* Center Links (Desktop) */}
            <div className="hidden md:flex items-center gap-10">
                <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Features</a>
                <a href="#pricing" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
                <a href="#about" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">About</a>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <Link to="/login" className="hidden sm:block text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors px-4 py-2 border border-slate-200 rounded-full hover:bg-slate-50">
                    Login
                </Link>
                <a href="/register" className="text-sm font-semibold bg-indigo-500 text-white px-5 py-2.5 rounded-full hover:bg-indigo-600 transition-colors shadow-sm shadow-indigo-500/20 active:scale-95">
                    Get Started
                </a>
            </div>
        </div>
    </nav>
);

const HeroSection = () => (
    <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Abstract Background Glow */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-indigo-400/20 blur-[100px] rounded-full pointer-events-none mix-blend-multiply" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-start text-left sm:items-start">

            {/* Badge */}
            <div className="inline-flex items-center p-1 pr-3 mb-8 bg-indigo-50/80 backdrop-blur-sm border border-indigo-100 rounded-full">
                <span className="bg-white text-indigo-600 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm mr-3">
                    New
                </span>
                <span className="text-[13px] font-medium text-slate-600">v2.0 Beta is now live</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.05] mb-6 max-w-3xl">
                Revolutionize <br className="hidden sm:block" />
                Your Support <br className="hidden lg:block" />
                with <span className="text-indigo-500">AI</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-slate-500 mb-10 max-w-xl leading-relaxed">
                Empower your support team with cutting-edge AI that automates ticketing and predicts customer needs instantly. Reduce resolution times by up to 60%.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
                <a href="#signup" className="px-8 py-3.5 bg-indigo-500 text-white rounded-full font-semibold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/25 active:scale-95">
                    Get Started for Free
                </a>
                <a href="#demo" className="px-8 py-3.5 bg-white text-slate-700 rounded-full font-semibold border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95">
                    View Demo
                </a>
            </div>
        </div>
    </section>
);

const FeaturesSection = () => {
    const features = [
        {
            icon: <TicketIcon />,
            title: "AI-Driven Ticketing",
            description: "Automatically categorize, prioritize, and route tickets to the right agents based on sentiment and expertise."
        },
        {
            icon: <DocumentIcon />,
            title: "Instant Summaries",
            description: "Get the gist of long customer threads in seconds. Our AI highlights key pain points and previous attempts at resolution."
        },
        {
            icon: <TrendingIcon />,
            title: "Priority Prediction",
            description: "Identify urgent issues and churn risks before they escalate using predictive analytics and customer history."
        }
    ];

    return (
        <section id="features" className="py-24 bg-white relative z-10 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-6">

                {/* Section Header */}
                <div className="max-w-2xl mb-16">
                    <h2 className="text-indigo-500 font-bold text-[11px] tracking-widest uppercase mb-3">Features</h2>
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Powerful Features for Modern Teams</h3>
                    <p className="text-[17px] text-slate-500 leading-relaxed">
                        Our suite of AI tools is designed to streamline your workflow and boost customer satisfaction through intelligent automation.
                    </p>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-[#fafbfc] rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/40 transition-shadow duration-300 flex flex-col items-start group">
                            <div className="w-12 h-12 bg-[#f0f3ff] text-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-100 transition-all">
                                {feature.icon}
                            </div>
                            <h4 className="text-[19px] font-bold text-slate-900 mb-3 tracking-tight">{feature.title}</h4>
                            <p className="text-[15px] text-slate-500 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CTASection = () => (
    <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
            <div className="bg-[#0b101e] rounded-[2.5rem] py-20 px-6 sm:px-16 text-center relative overflow-hidden shadow-2xl">

                {/* Decorative elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 tracking-tight">
                        Ready to transform your support?
                    </h2>
                    <p className="text-[17px] text-slate-300 mb-10 leading-relaxed">
                        Join hundreds of forward-thinking companies using SmartHelp AI to scale their operations and delight their customers.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <a href="#signup" className="px-8 py-3.5 bg-indigo-500 text-white rounded-full font-semibold hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-500/25 active:scale-95">
                            Get Started for Free
                        </a>
                        <a href="#sales" className="px-8 py-3.5 bg-[#172033] text-white rounded-full font-semibold hover:bg-[#1e293b] transition-colors border border-slate-700/50 active:scale-95">
                            Talk to Sales
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="bg-white pt-16 pb-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">

            {/* Top Footer Area */}
            <div className="grid grid-cols-2 md:grid-cols-12 gap-10 lg:gap-12 mb-16">

                {/* Brand Column */}
                <div className="col-span-2 md:col-span-5">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-7 h-7 flex items-center justify-center bg-indigo-50 text-indigo-500 rounded-full">
                            <LogoIcon className="w-4 h-4" />
                        </div>
                        <span className="text-lg font-bold text-slate-900 tracking-tight">SmartHelp AI</span>
                    </div>
                    <p className="text-[14px] text-slate-500 leading-relaxed max-w-sm">
                        The world's most advanced AI-powered customer support platform. Built for modern teams who value speed and quality.
                    </p>
                </div>

                {/* Link Columns */}
                <div className="col-span-1 md:col-span-2 space-y-5">
                    <h5 className="font-bold text-slate-900 text-[12px] uppercase tracking-widest">Product</h5>
                    <ul className="space-y-4 text-[14px] text-slate-500 font-medium">
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Features</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Integrations</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Changelog</a></li>
                    </ul>
                </div>

                <div className="col-span-1 md:col-span-2 space-y-5">
                    <h5 className="font-bold text-slate-900 text-[12px] uppercase tracking-widest">Support</h5>
                    <ul className="space-y-4 text-[14px] text-slate-500 font-medium">
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Help Center</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">API Docs</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Community</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Status</a></li>
                    </ul>
                </div>

                <div className="col-span-1 md:col-span-2 space-y-5">
                    <h5 className="font-bold text-slate-900 text-[12px] uppercase tracking-widest">Legal</h5>
                    <ul className="space-y-4 text-[14px] text-slate-500 font-medium">
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Cookie Policy</a></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Footer Area */}
            <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-[13px] text-slate-400 font-medium text-center md:text-left">
                    &copy; 2024 SmartHelp AI. All rights reserved.
                </p>
                <div className="flex items-center gap-5 text-slate-400">
                    <a href="#" className="hover:text-slate-600 transition-colors" aria-label="Twitter">
                        <TwitterIcon />
                    </a>
                    <a href="#" className="hover:text-slate-600 transition-colors" aria-label="LinkedIn">
                        <LinkedInIcon />
                    </a>
                </div>
            </div>
        </div>
    </footer>
);


export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#fcfdff] font-sans antialiased text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            <Navbar />
            <main>
                <HeroSection />
                <FeaturesSection />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
}
