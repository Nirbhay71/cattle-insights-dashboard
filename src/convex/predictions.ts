import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const createPrediction = mutation({
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
    predictedMilkYield: v.number(),
    diseaseStatus: v.string(),
    diseaseProbability: v.number(),
    recommendations: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User not authenticated");
    }

    return await ctx.db.insert("predictions", {
      userId: user._id,
      ...args,
    });
  },
});

export const getUserPredictions = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("predictions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const deletePrediction = mutation({
  args: { id: v.id("predictions") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User not authenticated");
    }

    const prediction = await ctx.db.get(args.id);
    if (!prediction || prediction.userId !== user._id) {
      throw new Error("Prediction not found or unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});

export const clearAllPredictions = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User not authenticated");
    }

    const predictions = await ctx.db
      .query("predictions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const prediction of predictions) {
      await ctx.db.delete(prediction._id);
    }
  },
});
