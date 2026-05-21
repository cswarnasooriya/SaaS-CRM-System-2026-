import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight, LayoutDashboard, Users, FileText, Check,
    Kanban, CheckSquare, ShieldCheck, Zap, Building2, HelpCircle, Menu, X as CloseIcon
} from 'lucide-react';

const LandingPage = () => {
    const [activeFaq, setActiveFaq] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    const features = [
        {
            icon: Kanban,
            title: 'Visual Sales Pipeline',
            description: 'Drag and drop leads through your customized sales process. Never let a potential client slip through the cracks.',
            color: 'bg-blue-600 text-white shadow-blue-500/20'
        },
        {
            icon: Users,
            title: '360° Customer Profiles',
            description: 'Get a complete view of every client. Access their past invoices, ongoing tasks, and internal team notes in one place.',
            color: 'bg-purple-600 text-white shadow-purple-500/20'
        },
        {
            icon: FileText,
            title: 'Smart Invoicing',
            description: 'Generate professional A4 PDF invoices in seconds. Track statuses from Draft to Paid with automatic revenue calculations.',
            color: 'bg-green-600 text-white shadow-green-500/20'
        },
        {
            icon: CheckSquare,
            title: 'Task Management',
            description: 'Assign tasks to team members, set due dates, and manage follow-ups efficiently right from the customer dashboard.',
            color: 'bg-orange-600 text-white shadow-orange-500/20'
        },
        {
            icon: LayoutDashboard,
            title: 'Real-time Analytics',
            description: 'Make data-driven decisions with real-time charts, conversion rates, and revenue tracking on your main dashboard.',
            color: 'bg-indigo-600 text-white shadow-indigo-500/20'
        },
        {
            icon: ShieldCheck,
            title: 'Team Collaboration',
            description: 'Invite your entire sales team. Manage access roles (Admin/User) and track who is communicating with which client.',
            color: 'bg-pink-600 text-white shadow-pink-500/20'
        }
    ];

    const pricingPlans = [
        {
            name: 'Starter',
            price: '$29',
            description: 'Perfect for freelancers and solo entrepreneurs.',
            features: ['Up to 100 Customers', 'Basic Kanban Pipeline', 'Unlimited Invoices', '1 Team Member Workspace'],
            buttonStyle: 'bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-50',
            isPopular: false
        },
        {
            name: 'Professional',
            price: '$79',
            description: 'Best for growing sales teams and digital agencies.',
            features: ['Unlimited Customers', 'Advanced Pipeline Filtering', 'Smart 360° Profiles & Notes', 'Up to 10 Team Members', 'Priority Email Support'],
            buttonStyle: 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30',
            isPopular: true
        },
        {
            name: 'Enterprise',
            price: '$149',
            description: 'Built for large organizations needing high control.',
            features: ['Everything in Professional', 'Unlimited Team Workspaces', 'Custom Audit Security Logs', 'Dedicated Account Manager', '24/7 Phone Support'],
            buttonStyle: 'bg-gray-900 text-white hover:bg-gray-800 shadow-md shadow-gray-900/10',
            isPopular: false
        }
    ];

    const faqs = [
        {
            q: "Can I manage multiple team members in one workspace?",
            a: "Yes! With our Professional and Enterprise plans, you can invite your entire sales team, assign tasks to specific members, and control access roles seamlessly."
        },
        {
            q: "How does the PDF invoice generation work?",
            a: "NexusCRM dynamically pulls your customer data and financial numbers into an industry-standard A4 layout. You can instantly download it or print it directly."
        },
        {
            q: "Is my data secure with NexusCRM?",
            a: "Absolutely. We utilize isolated multi-tenant database architectures and industry-standard encryption protocols to ensure your company and customer data remain 100% private."
        }
    ];

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden w-full">

            {/* Responsive Premium Header Navigation */}
            <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-2 cursor-pointer group">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 transition-transform duration-300 group-hover:rotate-6">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-extrabold text-gray-900 tracking-tight">NextCRM</span>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/login" className="text-gray-600 hover:text-gray-900 font-semibold cursor-pointer transition-colors duration-200">
                            Log in
                        </Link>
                        <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold cursor-pointer transition-all duration-200 hover:scale-105 active:scale-98 shadow-md shadow-blue-600/10">
                            Get Started Free
                        </Link>
                    </div>

                    {/* Mobile Menu Action Toggle */}
                    <div className="flex md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none cursor-pointer"
                        >
                            {isMobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Floating Mobile Panel Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-b border-gray-100 bg-white px-4 pt-2 pb-6 space-y-4 shadow-lg animate-fadeIn">
                        <Link
                            to="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block w-full text-center py-3 text-gray-700 font-bold hover:bg-gray-50 rounded-xl transition-colors"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/register"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-md shadow-blue-600/10"
                        >
                            Get Started Free
                        </Link>
                    </div>
                )}
            </nav>

            {/* Hero Display Showcase */}
            <div className="relative pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-28 bg-gradient-to-b from-blue-50/50 to-white overflow-hidden w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[11px] sm:text-xs uppercase tracking-wider mb-6 sm:mb-8 border border-blue-200 transition-transform duration-300 hover:scale-105 cursor-default">
                        <Zap className="w-3.5 h-3.5 mr-2 text-blue-600 animate-pulse" />
                        Next Generation CRM Platform
                    </div>
                    <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 sm:mb-8 leading-tight max-w-4xl mx-auto">
                        The Central Operating System <br className="hidden sm:inline" />
                        <span className="text-blue-600">For Your Entire Business.</span>
                    </h1>
                    <p className="text-base sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
                        Stop losing leads in spreadsheets. NexusCRM unifies your pipeline, 360° customer metrics, daily tasks, and automated billing into one powerful premium workspace.
                    </p>

                    {/* Main Fluid Responsive Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-12 sm:mb-16 max-w-xs sm:max-w-none mx-auto px-4 sm:px-0">
                        <Link
                            to="/register"
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg cursor-pointer transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-0.5 active:scale-98 active:translate-y-0 shadow-xl shadow-blue-600/30 flex items-center justify-center group"
                        >
                            Start Free Workspace
                            <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                        <Link
                            to="/login"
                            className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white px-8 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg cursor-pointer transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-0.5 active:scale-98 active:translate-y-0 flex items-center justify-center shadow-md shadow-gray-900/10"
                        >
                            Explore Live Demo
                        </Link>
                    </div>

                    {/* Premium Trust Responsive Badges */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto border-t border-gray-200/80 pt-8 sm:pt-10 mt-6 sm:mt-10 px-2 sm:px-0">
                        <div className="text-center p-3 sm:p-4 rounded-xl transition-all duration-300 hover:bg-gray-50/80 cursor-default group">
                            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 transition-transform duration-300 group-hover:scale-110">99.9%</p>
                            <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Platform Uptime</p>
                        </div>
                        <div className="text-center p-3 sm:p-4 rounded-xl transition-all duration-300 hover:bg-blue-50/50 cursor-default group">
                            <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 transition-transform duration-300 group-hover:scale-110">$10M+</p>
                            <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Invoices Processed</p>
                        </div>
                        <div className="text-center p-3 sm:p-4 rounded-xl transition-all duration-300 hover:bg-gray-50/80 cursor-default group">
                            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 transition-transform duration-300 group-hover:scale-110">14 Days</p>
                            <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Avg Deal Cycle</p>
                        </div>
                        <div className="text-center p-3 sm:p-4 rounded-xl transition-all duration-300 hover:bg-blue-50/50 cursor-default group">
                            <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 transition-transform duration-300 group-hover:scale-110">2x Fast</p>
                            <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Lead Conversion</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Capabilities Adaptive Grid */}
            <div className="py-16 sm:py-24 bg-gray-50 border-y border-gray-100 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 px-2">Engineered For High Performance</h2>
                        <p className="text-sm sm:text-lg text-gray-600 max-w-xl mx-auto px-4">
                            Everything you need to close clients, organize follow-ups, and track financial growth out of the box.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/60 shadow-sm cursor-pointer transition-all duration-300 ease-out transform sm:hover:scale-[1.03] sm:hover:-translate-y-1 hover:shadow-xl hover:border-blue-500/30 group"
                                >
                                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-5 sm:mb-6 ${feature.color} shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2.5 sm:mb-3 transition-colors duration-200 group-hover:text-blue-600">{feature.title}</h3>
                                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Premium Adaptive Pricing Grid */}
            <div className="py-16 sm:py-24 bg-white w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">Transparent, Predictable Pricing</h2>
                        <p className="text-sm sm:text-lg text-gray-600">Choose the perfect tier for your current business scale.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-sm lg:max-w-6xl mx-auto px-2 sm:px-0">
                        {pricingPlans.map((plan, index) => (
                            <div
                                key={index}
                                className={`rounded-2xl p-6 sm:p-8 border cursor-default relative flex flex-col justify-between transition-all duration-300 ease-out transform sm:hover:scale-[1.02] hover:shadow-xl ${plan.isPopular
                                        ? 'border-blue-600 bg-white ring-4 ring-blue-50 lg:scale-105 lg:hover:scale-[1.07] z-10 hover:shadow-blue-500/10 mt-4 lg:mt-0'
                                        : 'border-gray-200 bg-gray-50/50 hover:bg-white hover:border-gray-300'
                                    }`}
                            >
                                {plan.isPopular && (
                                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                                        Most Popular
                                    </span>
                                )}
                                <div className="mb-6 sm:mb-8">
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5">{plan.name}</h3>
                                    <p className="text-xs sm:text-sm text-gray-500 mb-5">{plan.description}</p>
                                    <div className="flex items-baseline mb-5">
                                        <span className="text-3xl sm:text-4xl font-black text-gray-900">{plan.price}</span>
                                        <span className="text-gray-500 text-xs sm:text-sm ml-1.5">/ month</span>
                                    </div>
                                    <ul className="space-y-3 border-t border-gray-100 pt-5">
                                        {plan.features.map((f, i) => (
                                            <li key={i} className="flex items-center text-xs sm:text-sm text-gray-600">
                                                <Check className="w-4 h-4 text-blue-600 mr-2 shrink-0" />
                                                <span className="truncate">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Link
                                    to="/register"
                                    className={`w-full text-center py-3 rounded-xl font-bold text-sm sm:text-base cursor-pointer transition-all duration-200 transform active:scale-98 ${plan.buttonStyle}`}
                                >
                                    Get Started
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Interactive Mobile Responsive FAQ Accordion */}
            <div className="py-16 sm:py-24 bg-gray-50 border-t border-gray-100 w-full">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center justify-center">
                            <HelpCircle className="w-6 h-6 text-blue-600 mr-2 shrink-0" /> FAQ
                        </h2>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        {faqs.map((faq, index) => {
                            const isOpen = activeFaq === index;
                            return (
                                <div
                                    key={index}
                                    className={`bg-white rounded-xl border cursor-pointer transition-all duration-300 shadow-sm select-none ${isOpen ? 'border-blue-500 ring-2 ring-blue-50' : 'border-gray-200/60 hover:border-gray-300'
                                        }`}
                                    onClick={() => toggleFaq(index)}
                                >
                                    <div className="p-4 sm:p-5 flex justify-between items-center font-bold text-sm sm:text-base text-gray-800 gap-2">
                                        <span className={isOpen ? 'text-blue-600' : 'text-gray-800'}>{faq.q}</span>
                                        <span className={`text-lg font-bold transition-transform duration-300 transform ${isOpen ? 'text-blue-600 rotate-180' : 'text-gray-400'}`}>
                                            {isOpen ? '−' : '+'}
                                        </span>
                                    </div>
                                    {isOpen && (
                                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-2.5 bg-gradient-to-b from-white to-gray-50/30">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Fluid Corporate CTA Footer Cover */}
            <div className="bg-gray-900 py-16 sm:py-24 relative overflow-hidden w-full">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
                    <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 sm:mb-6">Upgrade Your Sales Execution Today</h2>
                    <p className="text-sm sm:text-lg text-gray-300 mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed px-2">
                        Join growing agencies and consulting teams who trust NexusCRM to drive efficiency and optimize pipelines.
                    </p>
                    <Link
                        to="/register"
                        className="w-full sm:w-auto inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-bold text-base sm:text-lg cursor-pointer transition-all duration-300 transform sm:hover:scale-105 active:scale-98 shadow-lg shadow-blue-500/20"
                    >
                        Create Free Corporate Account
                    </Link>
                </div>
            </div>

            {/* Fluid Adaptive Corporate Footer */}
            <footer className="bg-white border-t border-gray-100 py-8 sm:py-10 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center space-x-2 cursor-pointer group">
                        <Building2 className="w-5 h-5 text-blue-600 transition-transform duration-300 group-hover:-rotate-12" />
                        <span className="font-extrabold text-gray-900 tracking-tight">NexusCRM</span>
                    </div>
                    <p className="text-gray-500 text-xs sm:text-sm font-medium text-center">
                        © {new Date().getFullYear()} Sandaruwan Warnasooriya Software Systems. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;