import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  // Prisma 7 requiere una URL de datasource. Durante el build, si no hay DATABASE_URL
  // el cliente falla al inicializarse. Proporcionamos uno ficticio para el build.
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "postgres://postgres:277ff4e447ad5dc54c48@31.220.87.192:5333/obscrapping_db?sslmode=disable",
  },
});
