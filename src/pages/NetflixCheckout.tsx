import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { CreditCard, Smartphone, DollarSign } from 'lucide-react';

const NetflixCheckout = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Complete Your Netflix Payment</h1>
          <p className="text-muted-foreground">Choose your payment method below</p>
        </div>

        <Card className="glass elevation-md p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Netflix Premium</h2>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Monthly subscription</span>
              <span className="text-2xl font-bold">$19.00</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium mb-4">Payment Methods</h3>
            
            {/* Traditional Payment Methods */}
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start h-auto p-4 opacity-50 cursor-not-allowed"
                disabled
              >
                <CreditCard className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Credit/Debit Card</div>
                  <div className="text-sm text-muted-foreground">**** **** **** 4532</div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start h-auto p-4 opacity-50 cursor-not-allowed"
                disabled
              >
                <Smartphone className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">PayPal</div>
                  <div className="text-sm text-muted-foreground">user@example.com</div>
                </div>
              </Button>

              {/* SubPay Option */}
              <Link to="/pay-intent?merchant=Netflix&amount=19&currency=USD&freq=monthly">
                <Button className="w-full justify-start h-auto p-4 hover-lift press-scale">
                  <DollarSign className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Pay with PayPal USD (SubPay AI)</div>
                    <div className="text-sm text-primary-foreground/80">
                      Add $2/mo into a SubPay savings pot—let yield offset your next bill
                    </div>
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Your subscription will auto-renew monthly. Cancel anytime.</p>
        </div>
      </div>
    </Layout>
  );
};

export default NetflixCheckout;