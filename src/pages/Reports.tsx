import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Download, FileText, BarChart3, TrendingUp, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Reports() {
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

  const generatePDFReport = () => {
    if (!predictions || predictions.length === 0) {
      toast.error("No data available for report generation");
      return;
    }

    // Calculate statistics
    const totalAnimals = new Set(predictions.map(p => p.animalId)).size;
    const avgMilkYield = (predictions.reduce((sum, p) => sum + p.predictedMilkYield, 0) / predictions.length).toFixed(2);
    const healthyCount = predictions.filter(p => p.diseaseStatus === "healthy").length;
    const healthPercentage = ((healthyCount / predictions.length) * 100).toFixed(1);

    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Cattle Farm Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .stats { display: flex; justify-content: space-around; margin: 30px 0; }
          .stat-card { text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
          .stat-value { font-size: 24px; font-weight: bold; color: #2563eb; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .healthy { color: #16a34a; }
          .alert { color: #dc2626; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Cattle Farm Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
          <p>Farm Owner: ${user?.name || user?.email || 'Farm Owner'}</p>
        </div>
        
        <div class="stats">
          <div class="stat-card">
            <div class="stat-value">${totalAnimals}</div>
            <div>Total Animals</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${avgMilkYield}L</div>
            <div>Avg Milk Yield</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${healthPercentage}%</div>
            <div>Healthy Animals</div>
          </div>
        </div>

        <h2>Recent Predictions</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Animal ID</th>
              <th>Breed</th>
              <th>Milk Yield (L)</th>
              <th>Health Status</th>
              <th>Recommendations</th>
            </tr>
          </thead>
          <tbody>
            ${predictions.slice(0, 20).map(p => `
              <tr>
                <td>${new Date(p._creationTime).toLocaleDateString()}</td>
                <td>${p.animalId}</td>
                <td>${p.breed.replace('_', ' ')}</td>
                <td>${p.predictedMilkYield}</td>
                <td class="${p.diseaseStatus === 'healthy' ? 'healthy' : 'alert'}">${p.diseaseStatus.replace('_', ' ').toUpperCase()}</td>
                <td>${p.recommendations.substring(0, 100)}...</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Create and download PDF (simplified approach)
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cattle-farm-report-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Report generated successfully");
  };

  const exportDetailedCSV = () => {
    if (!predictions || predictions.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = [
      "Date", "Animal ID", "Breed", "Age", "Weight", "Lactation Stage", "Parity",
      "Previous Yield", "Feed Type", "Feed Quantity", "Walking Distance", "Rumination Hours",
      "Resting Hours", "Body Temperature", "Heart Rate", "Somatic Cell Count",
      "Ambient Temperature", "Humidity", "Housing Condition", "Activity Alerts",
      "Predicted Milk Yield", "Disease Status", "Disease Probability", "Recommendations"
    ];

    const csvContent = [
      headers.join(","),
      ...predictions.map(p => [
        new Date(p._creationTime).toLocaleDateString(),
        p.animalId, p.breed, p.age, p.weight, p.lactationStage, p.parity,
        p.prevYield, p.feedType, p.feedQty, p.walkingKm, p.ruminationHr,
        p.restingHr, p.bodyTemp, p.heartRate, p.somaticCellCount,
        p.ambientTemp, p.humidity, p.housingCondition, p.activityAlerts,
        p.predictedMilkYield, p.diseaseStatus, (p.diseaseProbability * 100).toFixed(1) + "%",
        `"${p.recommendations.replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `detailed-cattle-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Detailed data exported successfully");
  };

  // Calculate statistics
  const totalAnimals = predictions ? new Set(predictions.map(p => p.animalId)).size : 0;
  const avgMilkYield = predictions && predictions.length > 0 
    ? (predictions.reduce((sum, p) => sum + p.predictedMilkYield, 0) / predictions.length).toFixed(2)
    : "0";
  const healthyCount = predictions ? predictions.filter(p => p.diseaseStatus === "healthy").length : 0;
  const alertCount = predictions ? predictions.filter(p => p.diseaseStatus !== "healthy").length : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
              <FileText className="h-8 w-8" />
              Farm Reports
            </h1>
            <p className="text-muted-foreground">
              Generate comprehensive reports for your cattle farm
            </p>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAnimals}</div>
                <p className="text-xs text-muted-foreground">Monitored cattle</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Milk Yield</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgMilkYield}L</div>
                <p className="text-xs text-muted-foreground">Per day per animal</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Healthy Animals</CardTitle>
                <BarChart3 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{healthyCount}</div>
                <p className="text-xs text-muted-foreground">No health concerns</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Health Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{alertCount}</div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Report Generation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Farm Summary Report</CardTitle>
                <CardDescription>
                  Generate a comprehensive PDF report with farm statistics and recent predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={generatePDFReport} 
                  className="w-full"
                  disabled={!predictions || predictions.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Generate PDF Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Data Export</CardTitle>
                <CardDescription>
                  Export all prediction data with complete input parameters for analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={exportDetailedCSV} 
                  variant="outline" 
                  className="w-full"
                  disabled={!predictions || predictions.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Detailed CSV
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Report Information */}
          <Card>
            <CardHeader>
              <CardTitle>Report Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Farm Summary Report includes:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Farm statistics and key performance indicators</li>
                  <li>Recent prediction results and trends</li>
                  <li>Health status overview of all monitored animals</li>
                  <li>Recommendations summary</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Detailed Data Export includes:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Complete input parameters for each prediction</li>
                  <li>All prediction results and confidence scores</li>
                  <li>Timestamps and animal identification data</li>
                  <li>Suitable for further analysis and record keeping</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
