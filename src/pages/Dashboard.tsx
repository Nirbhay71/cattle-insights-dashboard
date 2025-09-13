import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { BarChart3, AlertTriangle, TrendingUp, Plus, History } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useEffect } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const predictions = useQuery(api.predictions.getUserPredictions);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const recentPredictions = predictions?.slice(0, 5) || [];
  const totalAnimals = new Set(predictions?.map(p => p.animalId) || []).size;
  const avgMilkYield = predictions?.length 
    ? (predictions.reduce((sum, p) => sum + p.predictedMilkYield, 0) / predictions.length).toFixed(1)
    : "0";
  const healthyAnimals = predictions?.filter(p => p.diseaseStatus === "healthy").length || 0;
  const alertCount = predictions?.filter(p => p.diseaseStatus !== "healthy").length || 0;

  // Chart data for milk yield over time
  const chartData = recentPredictions.map((prediction, index) => ({
    day: `Day ${index + 1}`,
    milkYield: prediction.predictedMilkYield,
    date: new Date(prediction._creationTime).toLocaleDateString(),
  })).reverse();

  const chartConfig = {
    milkYield: {
      label: "Milk Yield (L)",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.name || 'Farmer'}! Here's your farm overview.
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/predict">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Prediction
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAnimals}</div>
                  <p className="text-xs text-muted-foreground">
                    Monitored cattle
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Milk Yield</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgMilkYield}L</div>
                  <p className="text-xs text-muted-foreground">
                    Per day per animal
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Healthy Animals</CardTitle>
                  <BarChart3 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{healthyAnimals}</div>
                  <p className="text-xs text-muted-foreground">
                    No health concerns
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Health Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{alertCount}</div>
                  <p className="text-xs text-muted-foreground">
                    Require attention
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Milk Yield Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Milk Yield Trend</CardTitle>
                  <CardDescription>
                    Recent milk production predictions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {chartData.length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <XAxis dataKey="day" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line 
                            type="monotone" 
                            dataKey="milkYield" 
                            stroke="var(--color-milkYield)" 
                            strokeWidth={2}
                            dot={{ fill: "var(--color-milkYield)" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                      No data available. Make your first prediction to see trends.
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Predictions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Predictions</CardTitle>
                    <CardDescription>
                      Latest cattle health and yield predictions
                    </CardDescription>
                  </div>
                  <Link to="/history">
                    <Button variant="outline" size="sm">
                      <History className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {recentPredictions.length > 0 ? (
                    <div className="space-y-4">
                      {recentPredictions.map((prediction) => (
                        <div key={prediction._id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Animal {prediction.animalId}</p>
                            <p className="text-sm text-muted-foreground">
                              {prediction.predictedMilkYield}L • {prediction.diseaseStatus}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              {new Date(prediction._creationTime).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No predictions yet</p>
                      <p className="text-sm">Start by making your first prediction</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}