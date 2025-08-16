import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import { useDemoStore } from '@/store/demo-store';
import { useToast } from '@/hooks/use-toast';
import { Calendar, DollarSign, TrendingUp, Shield } from 'lucide-react';

const CreatePlan = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { addPlan, strategies, demoMode } = useDemoStore();
  
  const [formData, setFormData] = useState({
    merchant: searchParams.get('merchant') || 'Netflix',
    baseAmountUSD: parseFloat(searchParams.get('amount') || '19'),
    frequency: searchParams.get('freq') || 'monthly',
    dueDate: '2024-08-28',
    addonUSD: 2,
    strategyId: 'strategy_uniswap_stable'
  });

  const [isCreating, setIsCreating] = useState(false);

  const selectedStrategy = strategies.find(s => s.id === formData.strategyId);

  const handleCreatePlan = async () => {
    setIsCreating(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, demoMode ? 1000 : 2000));

    const newPlan = {
      id: `pln_${formData.merchant.toLowerCase()}_${Date.now()}`,
      merchant: formData.merchant,
      baseAmountUSD: formData.baseAmountUSD,
      frequency: formData.frequency,
      dueDate: formData.dueDate,
      recipient: `${formData.merchant.toLowerCase()}@example.com`,
      addonUSD: formData.addonUSD,
      status: 'active' as const,
      coveragePct: 0,
      potBalance: 0,
      apr: selectedStrategy?.apr || 0,
    };

    addPlan(newPlan);

    toast({
      title: "Plan Created Successfully",
      description: `Your ${formData.merchant} subscription plan is now active`,
    });

    navigate('/topup');
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Plan</h1>
          <p className="text-muted-foreground">
            Formalize your subscription + savings strategy
          </p>
        </div>

        <Card className="glass elevation-md p-8 mb-6">
          <div className="space-y-6">
            {/* Subscription Details */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Subscription Details
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="merchant">Merchant</Label>
                  <Input
                    id="merchant"
                    value={formData.merchant}
                    onChange={(e) => setFormData(prev => ({ ...prev, merchant: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="base-amount">Base Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="base-amount"
                      type="number"
                      className="pl-10"
                      value={formData.baseAmountUSD}
                      onChange={(e) => setFormData(prev => ({ ...prev, baseAmountUSD: parseFloat(e.target.value) }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="due-date">Next Due Date</Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Add-on Amount */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                SubPay Add-On
              </h3>
              
              <div className="space-y-3">
                <Label htmlFor="addon-amount">Monthly Add-On Amount</Label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={formData.addonUSD}
                    onChange={(e) => setFormData(prev => ({ ...prev, addonUSD: parseFloat(e.target.value) }))}
                    className="flex-1"
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold">${formData.addonUSD}</span>
                    <span className="text-sm text-muted-foreground">/ month</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  This builds your yield-generating pot to offset future bills
                </p>
              </div>
            </div>

            {/* Strategy Selection */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Yield Strategy
              </h3>
              
              {selectedStrategy && (
                <Card className="bg-primary/5 border-primary/20 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{selectedStrategy.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Est APR {selectedStrategy.apr}% • {selectedStrategy.venue}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {selectedStrategy.riskLevel} volatility
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {selectedStrategy.chain}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-success">
                      <Shield className="w-4 h-4" />
                      <span className="text-xs">Non-custodial</span>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </Card>

        {/* Create Button */}
        <Button 
          className="w-full h-12 hover-lift press-scale"
          onClick={handleCreatePlan}
          disabled={isCreating}
        >
          {isCreating ? 'Creating Plan...' : 'Create Plan'}
        </Button>
      </div>
    </Layout>
  );
};

export default CreatePlan;