import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/utils/schema.js",
  out:"./drizzle",
  dbCredentials:{
    url:"postgresql://neondb_owner:S0AuhXP1cVOJ@ep-misty-mud-a5vk2r5p.us-east-2.aws.neon.tech/interview.ai?sslmode=require"
  }
}); 