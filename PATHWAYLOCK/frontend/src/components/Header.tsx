import { Link } from 'react-router-dom';

interface HeaderProps {
  isOnline: boolean;
}

export default function Header({ isOnline }: HeaderProps) {
  return (
    <header className="bg-white border-b-2 border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Link to="/" className="block">
              <h1 className="text-2xl font-bold text-primary">PATHWAYLOCK</h1>
              <p className="text-sm text-body">AI-Assisted, Voice-First Livelihood Pathway Validation</p>
            </Link>
          </div>

          <nav className="flex items-center gap-6">
            <Link to="/assessment" className="text-primary hover:text-secondary font-medium">
              Assessment
            </Link>
            <Link to="/opportunities" className="text-primary hover:text-secondary font-medium">
              Opportunities
            </Link>
            <Link to="/counsellor" className="text-primary hover:text-secondary font-medium">
              Counsellor
            </Link>

            <div className="ml-4 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success' : 'bg-danger'}`} />
              <span className="text-xs text-body">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
