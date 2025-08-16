import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Layout from '@/components/layout/Layout';
import { useDemoStore } from '@/store/demo-store';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Plus, 
  Settings, 
  Wallet,
  BarChart3,
  Target,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const { plans, networkEnv } = useDemoStore();

  const activePlans = plans.filter(p => p.status === 'active');
  const setupPlans = plans.filter(p => p.status === 'setup');
  
  const totalPotBalance = activePlans.reduce((sum, plan) => sum + plan.potBalance, 0);
  const totalMonthlyAddons = activePlans.reduce((sum, plan) => sum + plan.addonUSD, 0);
  const avgCoverage = activePlans.length > 0 
    ? activePlans.reduce((sum, plan) => sum + plan.coveragePct, 0) / activePlans.length 
    : 0;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Your subscriptions pay themselves with SubPay AI
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {networkEnv === 'testnet' && (
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                Testnet
              </Badge>
            )}
            <Link to="/demo/netflix-checkout">
              <Button className="hover-lift press-scale">
                <Plus className="w-4 h-4 mr-2" />
                Add Subscription
              </Button>
            </Link>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass elevation-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pot Balance</p>
                <p className="text-2xl font-bold">${totalPotBalance.toFixed(2)}</p>
              </div>
            </div>
          </Card>

          <Card className="glass elevation-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Coverage</p>
                <p className="text-2xl font-bold">{avgCoverage.toFixed(0)}%</p>
              </div>
            </div>
          </Card>

          <Card className="glass elevation-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Add-Ons</p>
                <p className="text-2xl font-bold">${totalMonthlyAddons}</p>
              </div>
            </div>
          </Card>

          <Card className="glass elevation-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">30-Day Yield</p>
                <p className="text-2xl font-bold">$0.38</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Active Subscriptions */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Active Subscriptions</h2>
          <div className="space-y-4">
            {activePlans.map((plan) => {
              const daysUntilDue = Math.ceil((new Date(plan.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              
              return (
                <Card key={plan.id} className="glass elevation-sm hover-lift">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Merchant Icon */}
                        <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold">
                            {plan.merchant.charAt(0)}
                          </span>
                        </div>

                        {/* Plan Details */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
                          <div className="md:col-span-2">
                            <h3 className="font-semibold text-lg">{plan.merchant}</h3>
                            <p className="text-sm text-muted-foreground">
                              Due in {daysUntilDue} days • ${plan.baseAmountUSD}/{plan.frequency}
                            </p>
                          </div>

                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Coverage</p>
                            <div className="flex items-center space-x-2">
                              <Progress value={plan.coveragePct} className="w-12 h-2" />
                              <span className="font-semibold text-success">{plan.coveragePct}%</span>
                            </div>
                          </div>

                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Pot Balance</p>
                            <p className="font-semibold text-primary">${plan.potBalance.toFixed(2)}</p>
                          </div>

                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">APR</p>
                            <p className="font-semibold">{plan.apr}%</p>
                          </div>

                          <div className="text-center">
                            <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                              {plan.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <Link to={`/app/sub/${plan.id}`}>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="w-4 h-4 mr-1" />
                            Details
                          </Button>
                        </Link>
                        
                        {daysUntilDue <= 3 && (
                          <Link to="/pay">
                            <Button size="sm" className="press-scale">
                              <Wallet className="w-4 h-4 mr-1" />
                              Pay Now
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Mini Sparkline Placeholder */}
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Last yield: $0.18</span>
                          <span>Next add-on: ${plan.addonUSD}</span>
                        </div>
                        <div className="sparkline bg-primary/10 rounded-sm w-24 h-6"></div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Setup Required */}
        {setupPlans.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Setup Required</h2>
            <div className="space-y-4">
              {setupPlans.map((plan) => (
                <Card key={plan.id} className="glass elevation-sm border-warning/30">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                          <span className="text-muted-foreground font-bold">
                            {plan.merchant.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{plan.merchant}</h3>
                          <p className="text-sm text-muted-foreground">
                            ${plan.baseAmountUSD}/{plan.frequency} • Setup incomplete
                          </p>
                        </div>
                      </div>
                      <Link to="/create-plan">
                        <Button className="press-scale">
                          <Settings className="w-4 h-4 mr-2" />
                          Complete Setup
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;