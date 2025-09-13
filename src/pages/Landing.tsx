import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Brain, 
  Shield, 
  TrendingUp, 
  Zap, 
  ArrowRight,
  CheckCircle,
  Activity,
  Heart
} from "lucide-react";
import { Link } from "react-router";

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Predictions",
      description: "Advanced machine learning models predict milk yield and detect diseases with high accuracy."
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Monitor your cattle's health and productivity with comprehensive data visualization."
    },
    {
      icon: Shield,
      title: "Early Disease Detection",
      description: "Identify health issues before they become serious problems, saving time and money."
    },
    {
      icon: TrendingUp,
      title: "Yield Optimization",
      description: "Maximize milk production through data-driven insights and recommendations."
    }
  ];

  const benefits = [
    "Increase milk yield by up to 15%",
    "Reduce veterinary costs by early detection",
    "Improve animal welfare and health",
    "Make data-driven farm decisions",
    "Export detailed reports for analysis",
    "Monitor multiple cattle simultaneously"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="container mx-auto px-4 py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
                <Heart className="h-20 w-20 text-primary relative z-10" />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
            >
              CattleAI
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed"
            >
              AI-Powered Cattle Monitoring Platform for
              <br />
              <span className="text-primary font-semibold">Smart Farming & Health Management</span>
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <Link to="/dashboard">
                      <Button size="lg" className="text-lg px-8 py-6 rounded-xl">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/auth">
                      <Button size="lg" className="text-lg px-8 py-6 rounded-xl">
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  )}
                  <Link to="/auth">
                    <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-xl">
                      <Activity className="mr-2 h-5 w-5" />
                      Try Demo
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Revolutionize Your Farm with AI
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Harness the power of artificial intelligence to optimize cattle health,
              maximize milk production, and make smarter farming decisions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-xl w-fit">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold tracking-tight mb-6">
                Transform Your Farm Operations
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Our AI-powered platform helps farmers make informed decisions,
                improve animal welfare, and increase profitability through
                advanced predictive analytics.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
              <Card className="relative border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Live Health Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span>Cow #001 - Holstein</span>
                    <span className="text-green-600 font-semibold">Healthy</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span>Predicted Yield</span>
                    <span className="text-blue-600 font-semibold">18.5L</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <span>Cow #003 - Jersey</span>
                    <span className="text-orange-600 font-semibold">Monitor</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold tracking-tight mb-6">
              Ready to Optimize Your Farm?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of farmers who are already using AI to improve
              their cattle management and increase profitability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isLoading && !isAuthenticated && (
                <>
                  <Link to="/auth">
                    <Button size="lg" variant="secondary" className="text-lg px-8 py-6 rounded-xl">
                      <Zap className="mr-2 h-5 w-5" />
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                      Learn More
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">CattleAI</span>
          </div>
          <p className="text-muted-foreground">
            Powered by{" "}
            <a
              href="https://vly.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              vly.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}