import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/layout/Layout';
import { useDemoStore } from '@/store/demo-store';
import { 
  ArrowLeft,
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Settings, 
  Wallet,
  ExternalLink,
  Target,
  Clock,
  Plus,
  Pause,
  Play
} from 'lucide-react';

const SubscriptionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getPlan, timeline } = useDemoStore();
  
  const plan = getPlan(id || '');
  
  if (!plan) {
    return (
      <Layout>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Subscription Not Found</h1>
          <p className="text-muted-foreground mb-6">This subscription plan doesn't exist.</p>
          <Link to="/app">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const daysUntilDue = Math.ceil((new Date(plan.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const planTimeline = timeline.filter(entry => 
    entry.description.toLowerCase().includes(plan.merchant.toLowerCase())
  );

  const monthlyYield = (plan.potBalance * plan.apr / 100) / 12;
  const projectedCoverageNext = Math.min(
    ((plan.potBalance + plan.addonUSD + monthlyYield) / plan.baseAmountUSD) * 100,
    100
  );

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link to="/app">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{plan.merchant}</h1>
            <p className="text-muted-foreground">
              ${plan.baseAmountUSD}/{plan.frequency} • Next due in {daysUntilDue} days
            </p>
          </div>
          <Badge variant={plan.status === 'active' ? 'outline' : 'secondary'}>
            {plan.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Coverage Ring */}
            <Card className="glass elevation-md p-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-6">Current Coverage</h3>
                
                {/* Coverage Ring Visual */}
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <div className="coverage-ring w-full h-full" style={{
                    '--coverage-degrees': `${(plan.coveragePct / 100) * 360}deg`
                  } as React.CSSProperties}>
                    <div className="absolute inset-8 bg-background rounded-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary">{plan.coveragePct}%</div>
                        <div className="text-sm text-muted-foreground">of next bill</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">SubPay Pot</p>
                    <p className="text-2xl font-bold text-primary">${plan.potBalance.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Next Bill</p>
                    <p className="text-2xl font-bold">${plan.baseAmountUSD}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Yield Performance */}
            <Card className="glass elevation-md p-6">
              <h3 className="text-xl font-semibold mb-6">Yield Performance</h3>
              
              {/* Mock Chart Area */}
              <div className="h-64 bg-gradient-to-r from-primary/5 to-success/5 rounded-xl mb-6 flex items-center justify-center border border-primary/10">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Contribution vs Earnings Over Time</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Your Contributions</p>
                  <p className="text-lg font-semibold">${plan.potBalance.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Yield Earned</p>
                  <p className="text-lg font-semibold text-success">$0.18</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly APR</p>
                  <p className="text-lg font-semibold">{plan.apr}%</p>
                </div>
              </div>
            </Card>

            {/* Timeline */}
            <Card className="glass elevation-md p-6">
              <h3 className="text-xl font-semibold mb-6">Activity Timeline</h3>
              
              <div className="space-y-4">
                {planTimeline.map((entry, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      entry.type === 'Pay' ? 'bg-success/10 text-success' :
                      entry.type === 'TopUp' ? 'bg-primary/10 text-primary' :
                      entry.type === 'Allocate' ? 'bg-info/10 text-info' :
                      'bg-muted/10 text-muted-foreground'
                    }`}>
                      {entry.type === 'Pay' ? <Wallet className="w-4 h-4" /> :
                       entry.type === 'TopUp' ? <Plus className="w-4 h-4" /> :
                       entry.type === 'Allocate' ? <TrendingUp className="w-4 h-4" /> :
                       <Clock className="w-4 h-4" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{entry.description}</p>
                        <span className="text-sm text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {entry.amount && (
                        <p className="text-sm text-muted-foreground">${entry.amount}</p>
                      )}
                      
                      {entry.explorerUrl && (
                        <a 
                          href={entry.explorerUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-xs text-primary hover:underline"
                        >
                          <span>View transaction</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="glass elevation-md p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Link to="/topup" className="w-full">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Top Up Pot
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Adjust Add-On
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause Automation
                </Button>
                
                {daysUntilDue <= 3 && (
                  <Link to="/pay" className="w-full">
                    <Button className="w-full justify-start">
                      <Wallet className="w-4 h-4 mr-2" />
                      Redeem & Pay
                    </Button>
                  </Link>
                )}
              </div>
            </Card>

            {/* Projections */}
            <Card className="glass elevation-md p-6">
              <h3 className="font-semibold mb-4">Growth Projections</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Next month</span>
                    <span className="font-semibold text-success">{projectedCoverageNext.toFixed(0)}%</span>
                  </div>
                  <Progress value={projectedCoverageNext} />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Month 6</span>
                    <span className="font-semibold text-success">35%</span>
                  </div>
                  <Progress value={35} />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Month 12</span>
                    <span className="font-semibold text-success">70%</span>
                  </div>
                  <Progress value={70} />
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-4">
                Projections based on current add-on rate and {plan.apr}% APR
              </p>
            </Card>

            {/* Plan Details */}
            <Card className="glass elevation-md p-6">
              <h3 className="font-semibold mb-4">Plan Details</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Add-On</span>
                  <span className="font-medium">${plan.addonUSD}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Strategy</span>
                  <span className="font-medium">Uniswap Stable LP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">APR</span>
                  <span className="font-medium">{plan.apr}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network</span>
                  <span className="font-medium">Flow EVM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next Due</span>
                  <span className="font-medium">{new Date(plan.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionDetail;