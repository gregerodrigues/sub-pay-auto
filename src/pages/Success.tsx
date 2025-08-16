import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import { useDemoStore } from '@/store/demo-store';
import { Check, Calendar, TrendingUp, Plus, BarChart3 } from 'lucide-react';

const Success = () => {
  const { plans } = useDemoStore();
  const currentPlan = plans.find(p => p.merchant === 'Netflix') || plans[0];

  const nextDueDate = currentPlan ? new Date(currentPlan.dueDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric'
  }) : '';

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Success Header with Celebration */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-success/10 border-2 border-success/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Check className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Complete! 🎉</h1>
          <p className="text-lg text-muted-foreground">
            Your SubPay savings plan is now active
          </p>
        </div>

        <Card className="glass elevation-md p-8 mb-8">
          <div className="space-y-6">
            {/* Summary */}
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">What Just Happened</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3 p-3 bg-success/5 border border-success/20 rounded-lg">
                  <Check className="w-5 h-5 text-success flex-shrink-0" />
                  <span>Paid ${currentPlan?.baseAmountUSD} to {currentPlan?.merchant}</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>Added ${currentPlan?.addonUSD} to your SubPay pot</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-info/5 border border-info/20 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-info flex-shrink-0" />
                  <span>Started earning {currentPlan?.apr}% APR on your savings</span>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-card/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Next Due</div>
                <div className="font-semibold">{nextDueDate}</div>
              </div>
              <div className="text-center p-4 bg-card/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Pot Balance</div>
                <div className="font-semibold text-primary">${currentPlan?.potBalance.toFixed(2)}</div>
              </div>
              <div className="text-center p-4 bg-card/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Coverage</div>
                <div className="font-semibold text-success">{currentPlan?.coveragePct}%</div>
              </div>
            </div>

            {/* Growth Projection */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <h4 className="font-medium mb-2">Growth Projection</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Your ${currentPlan?.addonUSD}/month + yield earnings will gradually increase coverage:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Month 3:</span>
                  <span className="text-success">~18% coverage</span>
                </div>
                <div className="flex justify-between">
                  <span>Month 6:</span>
                  <span className="text-success">~35% coverage</span>
                </div>
                <div className="flex justify-between">
                  <span>Month 12:</span>
                  <span className="text-success">~70% coverage</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link to="/app" className="w-full">
            <Button className="w-full h-12 hover-lift press-scale">
              <BarChart3 className="w-5 h-5 mr-2" />
              Go to Dashboard
            </Button>
          </Link>
          
          <Link to="/demo/netflix-checkout" className="w-full">
            <Button variant="outline" className="w-full h-12">
              <Plus className="w-5 h-5 mr-2" />
              Add Another Subscription
            </Button>
          </Link>
        </div>

        {/* Next Steps */}
        <Card className="glass p-6 mt-8">
          <h3 className="font-semibold mb-4">What's Next?</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Calendar className="w-3 h-3 text-primary" />
              </div>
              <div>
                <p className="font-medium">Monitor Your Growth</p>
                <p className="text-muted-foreground">Track your coverage percentage and yield earnings in the dashboard</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <TrendingUp className="w-3 h-3 text-primary" />
              </div>
              <div>
                <p className="font-medium">Automatic Payments</p>
                <p className="text-muted-foreground">When your next bill is due, SubPay will automatically use your pot to reduce your payment</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Plus className="w-3 h-3 text-primary" />
              </div>
              <div>
                <p className="font-medium">Add More Subscriptions</p>
                <p className="text-muted-foreground">Scale your savings across all your recurring payments</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Success;