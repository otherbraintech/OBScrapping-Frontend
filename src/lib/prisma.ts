import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const prismaClientSingleton = () => {
    const connectionString = process.env.DATABASE_URL;
    
    console.log("-----------------------------------------");
    console.log("Prisma: Inicializando cliente...");
    
    if (!connectionString) {
        console.warn("Prisma: DATABASE_URL no encontrada en el entorno.");
        // Durante el build estático de Next.js, esto puede ocurrir.
        // Prisma 7 requiere opciones no vacías o un adaptador.
        // Si no hay URL, creamos un pool 'falso' para que el constructor no falle por opciones vacías.
        return new PrismaClient();
    }

    try {
        const maskedUrl = connectionString.replace(/:([^@]+)@/, ":****@");
        console.log(`Prisma: Usando adapter para ${maskedUrl.split('@')[1]}`);
        
        const pool = new Pool({ connectionString });
        const adapter = new PrismaPg(pool);
        return new PrismaClient({ adapter });
    } catch (error) {
        console.error("Prisma: Error al configurar el adaptador:", error);
        return new PrismaClient();
    }
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Singleton pattern con Proxy para Lazy Loading (Next.js Build Safety)
const prismaProxy = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    if (typeof prop === 'symbol') return (target as any)[prop];
    
    if (!globalThis.prisma) {
      globalThis.prisma = prismaClientSingleton();
    }
    
    const value = (globalThis.prisma as any)[prop];
    if (typeof value === 'function') {
      return value.bind(globalThis.prisma);
    }
    return value;
  }
});

export default prismaProxy;
