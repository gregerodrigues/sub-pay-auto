import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Links */}
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="/docs" className="hover:text-foreground transition-colors">
              Docs
            </Link>
          </div>

          {/* Built for ETHGlobal */}
          <div className="text-sm text-muted-foreground">
            Built for{' '}
            <span className="text-primary font-medium">ETHGlobal New York 2025</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;