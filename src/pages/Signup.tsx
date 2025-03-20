
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Layout from '@/components/Layout';
import { UserRole } from '@/types/auth';
import { Mail, KeyRound, User, UserPlus, GraduationCap, Users, Shield } from 'lucide-react';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !role) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      const user = await signup(email, password, name, role);
      toast({
        title: "Success",
        description: "Your account has been created successfully",
      });
      
      // Redirect based on user role
      const dashboardPath = `/${user.role.replace('_', '-')}-dashboard`;
      navigate(dashboardPath);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    { id: 'student', label: 'Student', icon: GraduationCap },
    { id: 'club_admin', label: 'Club Administrator', icon: Users },
    { id: 'admin', label: 'System Administrator', icon: Shield },
  ];

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Create an Account</h1>
            <p className="text-muted-foreground">Join the university events platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Account Type</Label>
              <RadioGroup 
                value={role} 
                onValueChange={(value) => setRole(value as UserRole)}
                className="grid grid-cols-1 gap-2 mt-2"
              >
                {roleOptions.map((option) => (
                  <div 
                    key={option.id}
                    className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer transition-colors ${
                      role === option.id ? "border-primary bg-primary/5" : "border-input"
                    }`}
                    onClick={() => setRole(option.id as UserRole)}
                  >
                    <RadioGroupItem value={option.id} id={option.id} className="sr-only" />
                    <option.icon className={`h-4 w-4 ${role === option.id ? "text-primary" : "text-muted-foreground"}`} />
                    <Label 
                      htmlFor={option.id} 
                      className={`flex-grow cursor-pointer ${
                        role === option.id ? "text-primary font-medium" : "text-foreground"
                      }`}
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Signup;
