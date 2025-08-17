import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, TrendingUp, BarChart3, CheckCircle, Shield, Coins, Receipt, Globe } from 'lucide-react';

const Learn = () => {
  const steps = [
    {
      title: "Step 1: Pay with PYUSD",
      description: "Use PayPal USD for your subscription payments. A small add-on amount gets automatically saved to your SubPay pot.",
      icon: CreditCard,
    },
    {
      title: "Step 2: Grow via Yield",
      description: "Your saved funds earn yield through DeFi protocols. Watch your pot grow while you sleep.",
      icon: TrendingUp,
    },
    {
      title: "Step 3: Track Coverage",
      description: "Monitor how much of your subscription cost is covered by yield. See your progress in real-time.",
      icon: BarChart3,
    },
    {
      title: "Step 4: Auto-Pay",
      description: "When yield coverage is enough, your subscriptions pay themselves automatically. Set it and forget it.",
      icon: CheckCircle,
    },
  ];

  const trustBadges = [
    {
      title: "Non-custodial",
      description: "You always control your funds",
      icon: Shield,
    },
    {
      title: "Withdraw anytime",
      description: "Access your money 24/7",
      icon: Coins,
    },
    {
      title: "On-chain receipts",
      description: "Transparent transaction history",
      icon: Receipt,
    },
    {
      title: "Works everywhere",
      description: "Any PayPal USD merchant",
      icon: Globe,
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="text-center py-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
            Your subscriptions pay themselves
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A simple 4-step flow: Save a little → Grow it → Track coverage → Auto-pay.
          </p>
        </section>

        {/* Flow Diagram */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <CreditCard className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Pay with PYUSD</p>
              </div>
              
              <div className="hidden md:block text-primary">→</div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-success" />
                </div>
                <p className="text-sm text-muted-foreground">Grow via Yield</p>
              </div>
              
              <div className="hidden md:block text-primary">→</div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-info/20 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="w-8 h-8 text-info" />
                </div>
                <p className="text-sm text-muted-foreground">Track Coverage</p>
              </div>
              
              <div className="hidden md:block text-primary">→</div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Auto-Pay</p>
              </div>
            </div>
          </div>
        </section>

        {/* Step-by-step Cards */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={index} className="glass p-6 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-6">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why it's safe & easy</h2>
            <p className="text-muted-foreground">Built with security and transparency at its core</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {trustBadges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <Card key={index} className="glass text-center p-6 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{badge.title}</h3>
                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Learn;