import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { ArrowRight, Target, Shield, TrendingUp } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      <div className="text-center py-16">
        <h1 className="text-6xl font-bold mb-6">
          Your subscriptions 
          <span className="text-primary"> pay themselves</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          SubPay AI adds small savings to your bills that earn yield, 
          gradually covering more of your payments over time.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link to="/demo/netflix-checkout">
            <Button size="lg" className="hover-lift press-scale">
              Try Demo <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link to="/learn">
            <Button variant="outline" size="lg">
              Learn How It Works
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <Target className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Merchants Get Full Payment</h3>
            <p className="text-muted-foreground">Netflix always receives their complete $19. SubPay is purely additive.</p>
          </div>
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your Savings Earn Yield</h3>
            <p className="text-muted-foreground">Small add-ons grow through DeFi strategies, offsetting future bills.</p>
          </div>
          <div className="text-center">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Non-Custodial & Safe</h3>
            <p className="text-muted-foreground">You control your funds. Withdraw anytime. Low-risk strategies only.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
