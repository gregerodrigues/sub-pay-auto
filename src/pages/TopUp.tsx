import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import { useDemoStore } from '@/store/demo-store';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, ArrowRight, TrendingUp, ExternalLink } from 'lucide-react';

const TopUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { plans, updatePlan, addTimelineEntry, demoMode } = useDemoStore();
  const [isProcessing, setIsProcessing] = useState(false);

  // Get the most recent plan (Netflix in demo)
  const currentPlan = plans.find(p => p.merchant === 'Netflix') || plans[0];

  const handleTopUp = async () => {
    if (!currentPlan) return;

    setIsProcessing(true);

    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, demoMode ? 1500 : 3000));

    const txHash = `0xmock_topup_${Date.now()}`;
    const newCoverage = Math.round((currentPlan.addonUSD / currentPlan.baseAmountUSD) * 8); // ~8-10%

    // Update plan
    updatePlan(currentPlan.id, {
      potBalance: currentPlan.potBalance + currentPlan.addonUSD,
      coveragePct: newCoverage
    });

    // Add timeline entry
    addTimelineEntry({
      type: 'TopUp',
      timestamp: new Date().toISOString(),
      amount: currentPlan.addonUSD,
      txHash,
      explorerUrl: `https://testnet.flowscan.io/tx/${txHash}`,
      description: `Added $${currentPlan.addonUSD} to SubPay pot`
    });

    toast({
      title: "Top-Up Successful",
      description: `Added $${currentPlan.addonUSD} to your SubPay pot`,
    });

    navigate('/allocate');
  };

  if (!currentPlan) {
    return (
      <Layout>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Plan Found</h1>
          <p className="text-muted-foreground">Please create a plan first.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">First Top-Up</h1>
          <p className="text-muted-foreground">
            Seed your savings pot to start building coverage
          </p>
        </div>

        <Card className="glass elevation-md p-8 mb-6">
          <div className="space-y-6">
            {/* Top-Up Summary */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Seed Your Savings
              </h3>
              
              <div className="bg-card/50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">SubPay Add-On</span>
                  <span className="font-semibold text-primary">+${currentPlan.addonUSD}</span>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  This goes into your yield-generating pot, not to {currentPlan.merchant}
                </div>
              </div>
            </div>

            {/* Payment Preview */}
            <div>
              <h3 className="font-semibold mb-4">Today's Outflow Preview</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{currentPlan.merchant} Bill</span>
                  <span>${currentPlan.baseAmountUSD}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SubPay Add-On</span>
                  <span>+${currentPlan.addonUSD}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${currentPlan.baseAmountUSD + currentPlan.addonUSD}</span>
                </div>
              </div>
            </div>

            {/* Expected Outcome */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="font-medium">Expected Coverage Growth</span>
              </div>
              <p className="text-sm text-muted-foreground">
                This ${currentPlan.addonUSD} will start earning yield immediately and help build toward 
                ~6-10% coverage of your next {currentPlan.merchant} bill
              </p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            className="w-full h-12 hover-lift press-scale"
            onClick={handleTopUp}
            disabled={isProcessing}
          >
            <DollarSign className="w-5 h-5 mr-2" />
            {isProcessing ? 'Processing...' : `Top Up $${currentPlan.addonUSD}`}
          </Button>

          {isProcessing && (
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span>Confirming transaction on Flow EVM...</span>
              </div>
            </div>
          )}
        </div>

        {/* Network Info */}
        <div className="mt-8 p-4 bg-muted/20 rounded-xl text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Transactions are processed on Flow EVM Testnet
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs">
            <Badge variant="outline">Gas-efficient</Badge>
            <Badge variant="outline">Fast finality</Badge>
            <Badge variant="outline">Low fees</Badge>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TopUp;