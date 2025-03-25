
import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="font-bold text-xl bg-primary text-primary-foreground px-2 py-1 rounded">
        UC
      </div>
      <span className="font-bold text-lg hidden sm:inline-block">
        UniConnect
      </span>
    </Link>
  );
};

export default Logo;
