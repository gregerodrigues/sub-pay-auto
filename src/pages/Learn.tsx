import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, TrendingUp, BarChart3, CheckCircle, Shield, ArrowRight, Download, Receipt, Building } from 'lucide-react';

const Learn = () => {
  const flowSteps = [
    {
      icon: CreditCard,
      title: 'Pay with PYUSD',
      caption: 'Use PayPal USD for subscriptions'
    },
    {
      icon: TrendingUp,
      title: 'Grow via Yield',
      caption: 'Earn returns on your savings'
    },
    {
      icon: BarChart3,
      title: 'Track Coverage',
      caption: 'Monitor your payment coverage'
    },
    {
      icon: CheckCircle,
      title: 'Auto-Pay',
      caption: 'Automated subscription payments'
    }
  ];

  const steps = [
    {
      step: 1,
      title: 'Save a Little',
      description: 'Add small amounts to your SubPay pot each month. Even $2-5 can make a difference over time.',
      icon: CreditCard
    },
    {
      step: 2,
      title: 'Grow It',
      description: 'Your savings earn yield through DeFi protocols. Watch your balance grow while you wait.',
      icon: TrendingUp
    },
    {
      step: 3,
      title: 'Track Coverage',
      description: 'See exactly how much of your subscription is covered by yield earnings in real-time.',
      icon: BarChart3
    },
    {
      step: 4,
      title: 'Auto-Pay',
      description: 'When your subscription is due, SubPay automatically uses your pot to cover the payment.',
      icon: CheckCircle
    }
  ];

  const trustBadges = [
    {
      icon: Shield,
      title: 'Non-custodial',
      description: 'You control your funds'
    },
    {
      icon: Download,
      title: 'Withdraw anytime',
      description: 'No lock-up periods'
    },
    {
      icon: Receipt,
      title: 'On-chain receipts',
      description: 'Transparent transactions'
    },
    {
      icon: Building,
      title: 'Works with any PayPal USD merchant',
      description: 'Universal compatibility'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Your subscriptions pay themselves
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A simple 4-step flow: Save a little → Grow it → Track coverage → Auto-pay.
        </p>
      </section>

      {/* Horizontal Flow Diagram */}
      <section className="py-16">
        <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8">
          {flowSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex items-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.caption}</p>
                </div>
                {index < flowSteps.length - 1 && (
                  <ArrowRight className="hidden md:block w-6 h-6 text-muted-foreground mx-6" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Step-by-step Cards */}
      <section className="py-16">
        <div className="space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="glass hover:bg-card/50 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <Badge variant="outline" className="text-primary border-primary/20">
                          Step {step.step}
                        </Badge>
                        <h3 className="text-2xl font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        {step.description}
                      </p>
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
          <h2 className="text-4xl font-bold mb-4">Why it's safe & easy</h2>
          <p className="text-xl text-muted-foreground">
            Built with security and transparency at its core
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <Card key={index} className="glass text-center hover:bg-card/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{badge.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {badge.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </Layout>
  );
};

export default Learn;