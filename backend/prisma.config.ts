import { defineConfig } from "prisma/config";
import "dotenv/config";

if (!process.env.DIRECT_URL) {
  throw new Error("DIRECT_URL is not defined");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL,
  },
});