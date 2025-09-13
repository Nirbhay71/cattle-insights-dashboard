import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Loader2, Activity, Thermometer, Heart, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Predict() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const makePrediction = useAction(api.mlPredictions.makePrediction);
  const [predicting, setPredicting] = useState(false);
  const [result, setResult] = useState<any>(null);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPredicting(true);
    setResult(null);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        animalId: formData.get("animalId") as string,
        breed: formData.get("breed") as string,
        age: Number(formData.get("age")),
        weight: Number(formData.get("weight")),
        lactationStage: formData.get("lactationStage") as string,
        parity: Number(formData.get("parity")),
        prevYield: Number(formData.get("prevYield")),
        feedType: formData.get("feedType") as string,
        feedQty: Number(formData.get("feedQty")),
        walkingKm: Number(formData.get("walkingKm")),
        ruminationHr: Number(formData.get("ruminationHr")),
        restingHr: Number(formData.get("restingHr")),
        bodyTemp: Number(formData.get("bodyTemp")),
        heartRate: Number(formData.get("heartRate")),
        somaticCellCount: Number(formData.get("somaticCellCount")),
        ambientTemp: Number(formData.get("ambientTemp")),
        humidity: Number(formData.get("humidity")),
        housingCondition: formData.get("housingCondition") as string,
        activityAlerts: Number(formData.get("activityAlerts")),
      };

      const prediction = await makePrediction(data);
      setResult(prediction);
      toast.success("Prediction completed successfully!");
    } catch (error) {
      console.error("Prediction error:", error);
      toast.error("Failed to make prediction. Please try again.");
    } finally {
      setPredicting(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight">Prediction Results</h1>
              <p className="text-muted-foreground">AI-powered cattle health and yield analysis</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Milk Yield Prediction */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Milk Yield Prediction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {result.predictedMilkYield}L
                    </div>
                    <p className="text-muted-foreground">Expected daily milk yield</p>
                  </div>
                </CardContent>
              </Card>

              {/* Disease Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Health Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className={`text-2xl font-bold mb-2 ${
                      result.diseaseStatus === 'healthy' ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {result.diseaseStatus.replace('_', ' ').toUpperCase()}
                    </div>
                    <p className="text-muted-foreground">
                      {(result.diseaseProbability * 100).toFixed(1)}% confidence
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{result.recommendations}</p>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4">
              <Button onClick={() => setResult(null)} variant="outline">
                Make Another Prediction
              </Button>
              <Button onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Cattle Prediction</h1>
            <p className="text-muted-foreground">
              Enter cattle data to predict milk yield and health status
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Animal Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Animal Details
                </CardTitle>
                <CardDescription>Basic information about the cattle</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="animalId">Animal ID</Label>
                  <Input id="animalId" name="animalId" placeholder="e.g., COW001" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breed">Breed</Label>
                  <Select name="breed" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select breed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="holstein">Holstein</SelectItem>
                      <SelectItem value="jersey">Jersey</SelectItem>
                      <SelectItem value="guernsey">Guernsey</SelectItem>
                      <SelectItem value="brown_swiss">Brown Swiss</SelectItem>
                      <SelectItem value="ayrshire">Ayrshire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age (years)</Label>
                  <Input id="age" name="age" type="number" min="1" max="15" step="0.1" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" name="weight" type="number" min="300" max="800" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lactationStage">Lactation Stage</Label>
                  <Select name="lactationStage" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="early">Early (0-100 days)</SelectItem>
                      <SelectItem value="peak">Peak (100-200 days)</SelectItem>
                      <SelectItem value="mid">Mid (200-300 days)</SelectItem>
                      <SelectItem value="late">Late (300+ days)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parity">Parity (number of calvings)</Label>
                  <Input id="parity" name="parity" type="number" min="1" max="10" required />
                </div>
              </CardContent>
            </Card>

            {/* Feed and Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Feed & Activity Data
                </CardTitle>
                <CardDescription>Feeding and activity information</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prevYield">Previous Yield (L/day)</Label>
                  <Input id="prevYield" name="prevYield" type="number" min="0" max="50" step="0.1" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feedType">Feed Type</Label>
                  <Select name="feedType" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select feed type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high_quality">High Quality</SelectItem>
                      <SelectItem value="medium_quality">Medium Quality</SelectItem>
                      <SelectItem value="low_quality">Low Quality</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feedQty">Feed Quantity (kg/day)</Label>
                  <Input id="feedQty" name="feedQty" type="number" min="10" max="50" step="0.1" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="walkingKm">Walking Distance (km/day)</Label>
                  <Input id="walkingKm" name="walkingKm" type="number" min="0" max="20" step="0.1" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ruminationHr">Rumination Time (hours/day)</Label>
                  <Input id="ruminationHr" name="ruminationHr" type="number" min="4" max="12" step="0.1" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restingHr">Resting Time (hours/day)</Label>
                  <Input id="restingHr" name="restingHr" type="number" min="6" max="16" step="0.1" required />
                </div>
              </CardContent>
            </Card>

            {/* Health Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Health & Environmental Data
                </CardTitle>
                <CardDescription>Health indicators and environmental conditions</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bodyTemp">Body Temperature (°C)</Label>
                  <Input id="bodyTemp" name="bodyTemp" type="number" min="37" max="42" step="0.1" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                  <Input id="heartRate" name="heartRate" type="number" min="40" max="120" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="somaticCellCount">Somatic Cell Count</Label>
                  <Input id="somaticCellCount" name="somaticCellCount" type="number" min="50000" max="1000000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ambientTemp">Ambient Temperature (°C)</Label>
                  <Input id="ambientTemp" name="ambientTemp" type="number" min="-10" max="45" step="0.1" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="humidity">Humidity (%)</Label>
                  <Input id="humidity" name="humidity" type="number" min="20" max="100" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="housingCondition">Housing Condition</Label>
                  <Select name="housingCondition" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select housing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activityAlerts">Activity Alerts (count)</Label>
                  <Input id="activityAlerts" name="activityAlerts" type="number" min="0" max="10" required />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button type="submit" disabled={predicting} className="w-full md:w-auto">
                {predicting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Making Prediction...
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-4 w-4" />
                    Predict Health & Yield
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}