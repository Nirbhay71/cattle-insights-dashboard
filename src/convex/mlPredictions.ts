"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

// Mock ML models - in production, these would be actual trained models
function predictMilkYield(features: any): number {
  // Simplified milk yield prediction based on key factors
  const baseYield = 12; // Base yield in liters
  
  // Age factor (peak at 3-5 years)
  const ageFactor = features.age >= 3 && features.age <= 5 ? 1.2 : 
                   features.age < 3 ? 0.8 : 0.9;
  
  // Weight factor
  const weightFactor = features.weight > 500 ? 1.1 : 0.9;
  
  // Lactation stage factor
  const lactationFactor = features.lactationStage === "peak" ? 1.3 :
                         features.lactationStage === "early" ? 1.1 :
                         features.lactationStage === "mid" ? 1.0 : 0.7;
  
  // Feed quality factor
  const feedFactor = features.feedType === "high_quality" ? 1.2 :
                    features.feedType === "medium_quality" ? 1.0 : 0.8;
  
  // Health factor (based on body temp and heart rate)
  const healthFactor = (features.bodyTemp >= 38.5 && features.bodyTemp <= 39.5) &&
                      (features.heartRate >= 60 && features.heartRate <= 80) ? 1.0 : 0.8;
  
  const prediction = baseYield * ageFactor * weightFactor * lactationFactor * feedFactor * healthFactor;
  return Math.round(prediction * 100) / 100;
}

function predictDisease(features: any): { status: string; probability: number; recommendations: string } {
  let diseaseScore = 0;
  let diseaseType = "healthy";
  let recommendations = "Continue regular monitoring and maintain good hygiene.";
  
  // Temperature check
  if (features.bodyTemp > 39.5) {
    diseaseScore += 0.3;
  }
  
  // Heart rate check
  if (features.heartRate > 80 || features.heartRate < 60) {
    diseaseScore += 0.2;
  }
  
  // Somatic cell count (mastitis indicator)
  if (features.somaticCellCount > 200000) {
    diseaseScore += 0.4;
    diseaseType = "mastitis";
    recommendations = "High somatic cell count detected. Consult veterinarian for mastitis treatment. Improve udder hygiene and milking procedures.";
  }
  
  // Activity and resting patterns
  if (features.restingHr < 8 || features.walkingKm < 2) {
    diseaseScore += 0.2;
    if (diseaseType === "healthy") {
      diseaseType = "digestive_disorder";
      recommendations = "Reduced activity detected. Monitor feed intake and consider digestive health supplements. Consult veterinarian if symptoms persist.";
    }
  }
  
  // Environmental stress
  if (features.ambientTemp > 30 || features.humidity > 80) {
    diseaseScore += 0.1;
    if (diseaseType === "healthy") {
      diseaseType = "heat_stress";
      recommendations = "Environmental stress detected. Provide adequate shade, ventilation, and fresh water. Consider cooling systems.";
    }
  }
  
  const probability = Math.min(diseaseScore, 0.95);
  
  if (probability < 0.3) {
    return { status: "healthy", probability: 1 - probability, recommendations: "Animal appears healthy. Continue regular monitoring." };
  }
  
  return { status: diseaseType, probability, recommendations };
}

type PredictionResult = {
  id: Id<"predictions">;
  predictedMilkYield: number;
  diseaseStatus: string;
  diseaseProbability: number;
  recommendations: string;
};

export const makePrediction = action({
  args: {
    animalId: v.string(),
    breed: v.string(),
    age: v.number(),
    weight: v.number(),
    lactationStage: v.string(),
    parity: v.number(),
    prevYield: v.number(),
    feedType: v.string(),
    feedQty: v.number(),
    walkingKm: v.number(),
    ruminationHr: v.number(),
    restingHr: v.number(),
    bodyTemp: v.number(),
    heartRate: v.number(),
    somaticCellCount: v.number(),
    ambientTemp: v.number(),
    humidity: v.number(),
    housingCondition: v.string(),
    activityAlerts: v.number(),
  },
  handler: async (ctx, args): Promise<PredictionResult> => {
    // Make predictions using mock ML models
    const milkYield = predictMilkYield(args);
    const disease = predictDisease(args);
    
    // Save prediction to database
    const predictionId: Id<"predictions"> = await ctx.runMutation(api.predictions.createPrediction, {
      ...args,
      predictedMilkYield: milkYield,
      diseaseStatus: disease.status,
      diseaseProbability: disease.probability,
      recommendations: disease.recommendations,
    });
    
    return {
      id: predictionId,
      predictedMilkYield: milkYield,
      diseaseStatus: disease.status,
      diseaseProbability: disease.probability,
      recommendations: disease.recommendations,
    };
  },
});