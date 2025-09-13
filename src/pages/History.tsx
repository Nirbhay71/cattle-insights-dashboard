import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Trash2, Download, AlertTriangle, CheckCircle, History as HistoryIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function History() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const predictions = useQuery(api.predictions.getUserPredictions);
  const deletePrediction = useMutation(api.predictions.deletePrediction);
  const clearAllPredictions = useMutation(api.predictions.clearAllPredictions);

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

  const handleDelete = async (id: string) => {
    try {
      await deletePrediction({ id: id as any });
      toast.success("Prediction deleted successfully");
    } catch (error) {
      toast.error("Failed to delete prediction");
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllPredictions();
      toast.success("All predictions cleared successfully");
    } catch (error) {
      toast.error("Failed to clear predictions");
    }
  };

  const exportToCSV = () => {
    if (!predictions || predictions.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = [
      "Date",
      "Animal ID",
      "Breed",
      "Age",
      "Weight",
      "Predicted Milk Yield",
      "Disease Status",
      "Disease Probability",
      "Recommendations"
    ];

    const csvContent = [
      headers.join(","),
      ...predictions.map(p => [
        new Date(p._creationTime).toLocaleDateString(),
        p.animalId,
        p.breed,
        p.age,
        p.weight,
        p.predictedMilkYield,
        p.diseaseStatus,
        (p.diseaseProbability * 100).toFixed(1) + "%",
        `"${p.recommendations.replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cattle-predictions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Data exported successfully");
  };

  const getStatusBadge = (status: string) => {
    if (status === "healthy") {
      return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Healthy
      </Badge>;
    }
    return <Badge variant="destructive">
      <AlertTriangle className="h-3 w-3 mr-1" />
      {status.replace('_', ' ').toUpperCase()}
    </Badge>;
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
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <HistoryIcon className="h-8 w-8" />
                Prediction History
              </h1>
              <p className="text-muted-foreground">
                View and manage your cattle prediction records
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportToCSV} variant="outline" disabled={!predictions || predictions.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              {predictions && predictions.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear All Predictions</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all your prediction records.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>

          {/* Predictions Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Predictions</CardTitle>
              <CardDescription>
                {predictions ? `${predictions.length} prediction${predictions.length !== 1 ? 's' : ''} found` : 'Loading...'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {predictions && predictions.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Animal ID</TableHead>
                        <TableHead>Breed</TableHead>
                        <TableHead>Milk Yield</TableHead>
                        <TableHead>Health Status</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {predictions.map((prediction) => (
                        <TableRow key={prediction._id}>
                          <TableCell>
                            {new Date(prediction._creationTime).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-medium">
                            {prediction.animalId}
                          </TableCell>
                          <TableCell className="capitalize">
                            {prediction.breed.replace('_', ' ')}
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-primary">
                              {prediction.predictedMilkYield}L
                            </span>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(prediction.diseaseStatus)}
                          </TableCell>
                          <TableCell>
                            {(prediction.diseaseProbability * 100).toFixed(1)}%
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Prediction</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this prediction for {prediction.animalId}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(prediction._id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : predictions && predictions.length === 0 ? (
                <div className="text-center py-12">
                  <HistoryIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No predictions yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start making predictions to see your history here
                  </p>
                  <Button onClick={() => navigate("/predict")}>
                    Make First Prediction
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-4">Loading predictions...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
