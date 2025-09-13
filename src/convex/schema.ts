import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Cattle data table
    cattle: defineTable({
      userId: v.id("users"),
      animalId: v.string(),
      breed: v.string(),
      age: v.number(),
      weight: v.number(),
      lactationStage: v.string(),
      parity: v.number(),
    }).index("by_user", ["userId"]),

    // Predictions table
    predictions: defineTable({
      userId: v.id("users"),
      animalId: v.string(),
      // Input data
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
      // Predictions
      predictedMilkYield: v.number(),
      diseaseStatus: v.string(),
      diseaseProbability: v.number(),
      recommendations: v.string(),
    }).index("by_user", ["userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;