
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Calendar, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const CallToActionSection: React.FC = () => {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Join a Club",
      description: "Connect with like-minded students and pursue your passions with university clubs",
      link: "/clubs"
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
      title: "Attend Events",
      description: "Discover workshops, competitions, and social gatherings happening on campus",
      link: "/events"
    },
    {
      icon: <Star className="h-8 w-8 text-primary" />,
      title: "Create Your Club",
      description: "Have a unique idea? Start your own club and build a community",
      link: "/club-admin-dashboard"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-8 md:p-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Enhance Your University Experience
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted-foreground text-lg"
        >
          Discover opportunities to learn, connect, and make a difference
        </motion.p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
          >
            <Card className="h-full border-none bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <Link to={feature.link} className="mt-auto">
                  <Button variant="ghost" className="group">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Link to="/signup">
          <Button size="lg" className="group">
            Get Started Today
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CallToActionSection;
