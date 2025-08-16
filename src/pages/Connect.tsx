import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Layout from '@/components/layout/Layout';
import { useDemoStore } from '@/store/demo-store';
import { useToast } from '@/hooks/use-toast';
import { Smartphone, Wallet, Shield, Check } from 'lucide-react';

const Connect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    paypalConnected, 
    walletConnected,
    setPaypalConnected, 
    setWalletConnected,
    setUser 
  } = useDemoStore();
  
  const [consentGiven, setConsentGiven] = useState(false);

  const handlePayPalConnect = () => {
    // Simulate PayPal connection
    setTimeout(() => {
      setPaypalConnected(true);
      setUser({
        email: 'demo@subpay.ai',
        walletAddress: ''
      });
      toast({
        title: "PayPal Connected",
        description: "Successfully connected your PayPal account with PYUSD support",
      });
    }, 1000);
  };

  const handleWalletConnect = () => {
    // Simulate wallet connection
    setTimeout(() => {
      setWalletConnected(true);
      setUser({
        email: 'demo@subpay.ai',
        walletAddress: '0x742d35cc6ccAaFa5aC8EB2f8C3b4e6d70C8f83'
      });
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to Flow EVM network",
      });
    }, 1000);
  };

  const canContinue = paypalConnected && walletConnected && consentGiven;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Connect & Consent</h1>
          <p className="text-muted-foreground">
            Connect your payment rails and authorize SubPay for seamless transactions
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          {/* PayPal Connection */}
          <Card className="glass elevation-md p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Connect PayPal</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Enable PYUSD payments for Netflix subscription
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Shield className="w-3 h-3" />
                    <span>Secure OAuth • No stored credentials</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                {paypalConnected ? (
                  <div className="flex items-center space-x-2 text-success">
                    <Check className="w-5 h-5" />
                    <span className="text-sm font-medium">Connected</span>
                  </div>
                ) : (
                  <Button onClick={handlePayPalConnect} className="press-scale">
                    Authorize PayPal
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Wallet Connection */}
          <Card className="glass elevation-md p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Connect Wallet</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Connect to Flow EVM for yield strategies
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Shield className="w-3 h-3" />
                    <span>Non-custodial • Withdraw anytime</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                {walletConnected ? (
                  <div className="flex items-center space-x-2 text-success">
                    <Check className="w-5 h-5" />
                    <span className="text-sm font-medium">Connected</span>
                  </div>
                ) : (
                  <Button variant="outline" onClick={handleWalletConnect} className="press-scale">
                    Connect Wallet
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Consent */}
        <Card className="glass elevation-md p-6 mb-6">
          <h3 className="font-semibold mb-4">Explicit Consent</h3>
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="consent"
              checked={consentGiven}
              onCheckedChange={(checked) => setConsentGiven(checked as boolean)}
            />
            <label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed">
              I understand that SubPay never reduces my $19 Netflix payment. SubPay is an 
              extra savings add-on that I can stop anytime. My merchant always receives 
              their full amount.
            </label>
          </div>
        </Card>

        {/* Continue Button */}
        <Button 
          className="w-full h-12 hover-lift press-scale"
          disabled={!canContinue}
          onClick={() => navigate('/create-plan')}
        >
          Continue to Create Plan
        </Button>
      </div>
    </Layout>
  );
};

export default Connect;