import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, Wallet, CreditCard } from 'lucide-react';

const PayIntent = () => {
  const [searchParams] = useSearchParams();
  const [addonAmount, setAddonAmount] = useState(2);
  
  const merchant = searchParams.get('merchant') || 'Netflix';
  const baseAmount = parseFloat(searchParams.get('amount') || '19');
  const currency = searchParams.get('currency') || 'USD';
  const frequency = searchParams.get('freq') || 'monthly';
  
  const totalAmount = baseAmount + addonAmount;
  const estimatedCoverage = Math.min(Math.round((addonAmount * 4.8 * 12 / 100) / baseAmount * 100), 25);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Confirm Your {merchant} Payment</h1>
          <p className="text-muted-foreground">
            Your merchant always receives the full bill. SubPay adds optional savings on top.
          </p>
        </div>

        <Card className="glass elevation-md p-8 mb-6">
          <div className="space-y-6">
            {/* Payment Summary */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Merchant Bill</span>
                  <span className="font-semibold">${baseAmount}</span>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Label htmlFor="addon-amount">SubPay Add-On (builds your savings pot)</Label>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">$</span>
                    <Input
                      id="addon-amount"
                      type="number"
                      min="1"
                      max="10"
                      value={addonAmount}
                      onChange={(e) => setAddonAmount(parseFloat(e.target.value) || 0)}
                      className="max-w-20"
                    />
                    <span className="text-sm text-muted-foreground">/ {frequency}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recommended: $1-5 for sustainable growth
                  </p>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Outflow This Cycle</span>
                  <span>${totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Projection */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="font-medium">Projected Coverage</span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                Estimated ~{estimatedCoverage}% coverage next month
              </p>
              <p className="text-xs text-muted-foreground">
                Based on 4.8% APR from Uniswap Stable LP
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link to="/connect" className="w-full">
                <Button className="w-full h-12 hover-lift press-scale">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Continue with PayPal
                </Button>
              </Link>
              
              <Link to="/connect" className="w-full">
                <Button variant="outline" className="w-full h-12">
                  <Wallet className="w-5 h-5 mr-2" />
                  Or connect wallet
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Your merchant receives 100% of their bill. SubPay is purely additive.</p>
        </div>
      </div>
    </Layout>
  );
};

export default PayIntent;