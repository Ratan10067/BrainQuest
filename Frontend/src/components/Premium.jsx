import React, { useState } from "react";
import {
  Check,
  Star,
  Zap,
  Brain,
  Shield,
  Clock,
  Users,
  Sparkles,
  ArrowRight,
  Crown,
} from "lucide-react";

const Premium = () => {
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [isAnnual, setIsAnnual] = useState(false);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Advanced AI Solutions",
      description:
        "Access to cutting-edge AI models for complex problem solving",
      premium: true,
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast Processing",
      description: "Priority queue with 10x faster response times",
      premium: true,
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enhanced Security",
      description: "Enterprise-grade encryption and data protection",
      premium: true,
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Priority Support",
      description: "Round-the-clock assistance from our expert team",
      premium: true,
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Advanced sharing and collaboration tools",
      premium: true,
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Custom AI Training",
      description: "Train AI models on your specific data and requirements",
      premium: true,
    },
  ];

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: { monthly: 9, annual: 7 },
      description: "Perfect for individuals getting started",
      features: [
        "100 AI queries per month",
        "Basic templates",
        "Email support",
        "Standard processing speed",
      ],
      popular: false,
    },
    {
      id: "pro",
      name: "Professional",
      price: { monthly: 29, annual: 24 },
      description: "Ideal for professionals and small teams",
      features: [
        "Unlimited AI queries",
        "Advanced AI models",
        "Priority support",
        "10x faster processing",
        "Custom integrations",
        "Advanced analytics",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: { monthly: 99, annual: 79 },
      description: "For large teams and organizations",
      features: [
        "Everything in Professional",
        "Custom AI model training",
        "Dedicated account manager",
        "SLA guarantee",
        "Advanced security",
        "API access",
        "White-label solutions",
      ],
      popular: false,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "TechCorp",
      content:
        "The AI solutions have transformed our workflow. We're 300% more efficient now.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Data Scientist",
      company: "InnovateLabs",
      content:
        "Custom AI training feature is a game-changer. It understands our domain perfectly.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-[#272a40]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#2e3148]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Crown className="w-16 h-16 text-yellow-400" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Go{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Premium
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Unlock the full potential of AI with our premium features designed
              for professionals who demand excellence
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                Start Free Trial
              </button>
              <button className="border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the next generation of AI-powered tools designed to
            supercharge your productivity
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-purple-400 mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
                {feature.premium && (
                  <div className="flex items-center mt-4">
                    <Star className="w-4 h-4 text-yellow-400 mr-2" />
                    <span className="text-yellow-400 text-sm font-medium">
                      Premium Feature
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Select the perfect plan for your needs
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span
              className={`text-lg ${
                !isAnnual ? "text-white" : "text-gray-400"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
                isAnnual ? "bg-purple-600" : "bg-gray-600"
              }`}
            >
              <div
                className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform duration-300 ${
                  isAnnual ? "translate-x-9" : "translate-x-1"
                }`}
              ></div>
            </button>
            <span
              className={`text-lg ${isAnnual ? "text-white" : "text-gray-400"}`}
            >
              Annual <span className="text-green-400 text-sm">(Save 20%)</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105 ${
                plan.popular
                  ? "bg-gradient-to-b from-purple-600/20 to-pink-600/20 border-2 border-purple-400"
                  : "bg-white/10 backdrop-blur-lg border border-white/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-300 mb-6">{plan.description}</p>
                <div className="text-white">
                  <span className="text-5xl font-bold">
                    ${isAnnual ? plan.price.annual : plan.price.monthly}
                  </span>
                  <span className="text-gray-300 ml-2">
                    /{isAnnual ? "month" : "month"}
                  </span>
                </div>
                {isAnnual && (
                  <div className="text-green-400 text-sm mt-2">
                    Save ${(plan.price.monthly - plan.price.annual) * 12}/year
                  </div>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg"
                    : "bg-white/10 text-white border border-white/30 hover:bg-white/20"
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.id === "enterprise" ? "Contact Sales" : "Get Started"}
                <ArrowRight className="w-5 h-5 inline ml-2" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What Our Users Say
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-300 text-lg mb-6">
                "{testimonial.content}"
              </p>
              <div>
                <div className="font-bold text-white">{testimonial.name}</div>
                <div className="text-gray-400">
                  {testimonial.role} at {testimonial.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center bg-[#343958] rounded-3xl p-12 border border-purple-400/30">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already transformed their
            workflow with our premium AI solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
              Start 14-Day Free Trial
            </button>
            <button className="border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
