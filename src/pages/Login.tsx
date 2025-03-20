
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import AuthCard from '@/components/auth/AuthCard';
import LoginForm from '@/components/auth/LoginForm';

const Login: React.FC = () => {
  const footerContent = (
    <p className="text-sm text-muted-foreground">
      Don't have an account?{" "}
      <Link to="/signup" className="text-primary font-medium hover:underline">
        Sign up
      </Link>
    </p>
  );

  return (
    <Layout>
      <AuthCard 
        title="Welcome Back" 
        subtitle="Sign in to your account"
        footerContent={footerContent}
      >
        <LoginForm />
      </AuthCard>
    </Layout>
  );
};

export default Login;
