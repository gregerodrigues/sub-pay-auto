import { Link, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useDemoStore } from '@/store/demo-store';
import { Wallet, Activity, CreditCard, TrendingUp, Settings, BookOpen, HelpCircle, Zap } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const { 
    demoMode, 
    networkEnv, 
    walletConnected, 
    paypalConnected,
    user,
    setDemoMode,
    setNetworkEnv 
  } = useDemoStore();

  const navLinks = [
    { href: '/demo', label: 'Demo', icon: Zap },
    { href: '/learn', label: 'How it works', icon: BookOpen },
    { href: '/app', label: 'Dashboard', icon: CreditCard },
  ];

  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">SubPay AI</span>
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href || 
              (link.href === '/app' && location.pathname.startsWith('/app') && location.pathname !== '/app/activity' && location.pathname !== '/app/funding' && location.pathname !== '/app/strategies' && location.pathname !== '/app/settings');
            
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-card/50 ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right: User Info & Controls */}
        <div className="flex items-center space-x-4">
          {/* User Badge */}
          {user && (
            <Badge variant="secondary" className="hidden sm:flex">
              {user.email}
            </Badge>
          )}

          {/* Wallet Badge */}
          {walletConnected && (
            <Badge variant="outline" className="hidden sm:flex">
              {user?.walletAddress ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : 'Connected'}
            </Badge>
          )}

          {/* Network Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">Testnet</span>
            <Switch 
              checked={networkEnv === 'mainnet'}
              onCheckedChange={(checked) => setNetworkEnv(checked ? 'mainnet' : 'testnet')}
            />
            <span className="text-xs text-muted-foreground">Mainnet</span>
          </div>

          {/* Demo Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Switch 
              checked={demoMode}
              onCheckedChange={setDemoMode}
            />
            <Badge variant={demoMode ? "outline" : "secondary"} className="text-xs">
              {demoMode ? 'Demo' : 'Live'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Testnet Banner */}
      {networkEnv === 'testnet' && (
        <div className="mt-2 p-2 bg-warning/10 border border-warning/20 rounded-xl text-center">
          <span className="text-xs text-warning">⚠️ You're on Flow Testnet - Transactions are free but not real</span>
        </div>
      )}
    </nav>
  );
};

export default Navigation;