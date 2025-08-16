import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import { useDemoStore } from '@/store/demo-store';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, Shield, Zap, ExternalLink, Check } from 'lucide-react';

const Allocate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { plans, strategies, updatePlan, addTimelineEntry, demoMode } = useDemoStore();
  const [isAllocating, setIsAllocating] = useState(false);

  const currentPlan = plans.find(p => p.merchant === 'Netflix') || plans[0];
  const strategy = strategies[0]; // Default strategy

  const handleAllocate = async () => {
    if (!currentPlan || !strategy) return;

    setIsAllocating(true);

    // Simulate allocation
    await new Promise(resolve => setTimeout(resolve, demoMode ? 1500 : 3000));

    const positionId = `uni_pos_${Date.now()}`;
    const newCoverage = Math.round((currentPlan.potBalance / currentPlan.baseAmountUSD) * 12);

    // Update plan with allocation
    updatePlan(currentPlan.id, {
      coveragePct: newCoverage,
      apr: strategy.apr
    });

    // Add timeline entry
    addTimelineEntry({
      type: 'Allocate',
      timestamp: new Date().toISOString(),
      amount: currentPlan.potBalance,
      description: `Allocated $${currentPlan.potBalance} to ${strategy.name}`
    });

    toast({
      title: "Allocation Successful",
      description: `$${currentPlan.potBalance} allocated to ${strategy.name}`,
    });

    navigate('/success');
  };

  if (!currentPlan || !strategy) {
    return (
      <Layout>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Configuration Error</h1>
          <p className="text-muted-foreground">Missing plan or strategy data.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Allocate to Yield</h1>
          <p className="text-muted-foreground">
            Put your ${currentPlan.potBalance} to work earning yield
          </p>
        </div>

        <Card className="glass elevation-md p-8 mb-6">
          <div className="space-y-6">
            {/* Strategy Card */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Selected Strategy
              </h3>
              
              <Card className="bg-primary/5 border-primary/20 p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xl font-semibold mb-2">{strategy.name}</h4>
                      <p className="text-muted-foreground mb-3">
                        Stable yield generation through liquidity provision
                      </p>
                      
                      <div className="flex items-center space-x-3 mb-4">
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          {strategy.apr}% APR
                        </Badge>
                        <Badge variant="outline">
                          {strategy.riskLevel} volatility
                        </Badge>
                        <Badge variant="outline">
                          {strategy.chain}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-success" />
                      <span className="text-sm">Non-custodial</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-success" />
                      <span className="text-sm">Withdraw anytime</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-success" />
                      <span className="text-sm">Auto-compounding</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span className="text-sm">Stable returns</span>
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div className="bg-background/50 rounded-lg p-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-foreground">Protocol:</span>
                        <span className="ml-2">Uniswap V3</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pair:</span>
                        <span className="ml-2">PYUSD/USDC</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Network:</span>
                        <span className="ml-2">Flow EVM</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Fees:</span>
                        <span className="ml-2">0.05%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Allocation Details */}
            <div>
              <h3 className="font-semibold mb-4">Allocation Details</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Amount to Allocate</span>
                  <span className="font-semibold">${currentPlan.potBalance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Expected Monthly Yield</span>
                  <span className="text-success">~${((currentPlan.potBalance * strategy.apr / 100) / 12).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Coverage Growth</span>
                  <span className="text-primary">+{Math.round((currentPlan.potBalance / currentPlan.baseAmountUSD) * 12)}%</span>
                </div>
              </div>
            </div>

            {/* Risk Disclosure */}
            <div className="bg-warning/5 border border-warning/20 rounded-xl p-4">
              <h4 className="font-medium text-warning mb-2">Risk Disclosure</h4>
              <p className="text-sm text-muted-foreground">
                DeFi strategies carry smart contract and impermanent loss risks. While we've selected 
                low-risk stable strategies, past performance doesn't guarantee future results.
              </p>
            </div>
          </div>
        </Card>

        {/* Action Button */}
        <Button 
          className="w-full h-12 hover-lift press-scale"
          onClick={handleAllocate}
          disabled={isAllocating}
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          {isAllocating ? 'Allocating...' : `Allocate $${currentPlan.potBalance} to LP`}
        </Button>

        {isAllocating && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span>Creating liquidity position...</span>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Allocate;