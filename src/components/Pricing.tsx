import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const pricingPlans = [
  {
    name: "Free Rider",
    price: "0",
    description: "Perfect for occasional commuters",
    features: [
      "Real-time bus tracking",
      "Basic route information",
      "Earn up to 100 points/month",
      "Standard support",
      "Ad-supported",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Daily Commuter",
    price: "4.99",
    description: "Best for regular travelers",
    features: [
      "Everything in Free",
      "Ad-free experience",
      "Unlimited points earning",
      "Priority notifications",
      "Custom route favorites",
      "Offline map access",
      "Premium badges",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "City Champion",
    price: "9.99",
    description: "For power users and contributors",
    features: [
      "Everything in Daily Commuter",
      "Exclusive champion badge",
      "Leaderboard highlights",
      "Early access to features",
      "Priority support",
      "Community moderator tools",
      "Monthly rewards",
    ],
    cta: "Become Champion",
    popular: false,
  },
];

const Pricing = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section id="pricing" className="py-20 md:py-32 bg-secondary/30" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Choose Your
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Journey Plan
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From casual riders to city champions, we have a plan that fits your commute style.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-card hover:-translate-y-2 group ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              } ${plan.popular ? 'border-primary/50 shadow-card scale-105' : ''}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                  Most Popular
                </div>
              )}
              
              <CardHeader className="p-8 pb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    ${plan.price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>

              <CardContent className="p-8 pt-0 space-y-6">
                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary to-accent hover:shadow-hover'
                      : 'bg-primary hover:bg-primary/90'
                  } hover:scale-105 transition-all duration-300`}
                  size="lg"
                >
                  {plan.cta}
                </Button>

                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start gap-3 text-sm group-hover:translate-x-1 transition-transform duration-300"
                      style={{ transitionDelay: `${featureIndex * 50}ms` }}
                    >
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            All plans include a 14-day free trial. Cancel anytime, no questions asked.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
