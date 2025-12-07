import { z } from "zod"

const schemaValidator = z.object({
  name: z.string().min(4),
  description: z.string().min(14),
  price: z.number().positive(),
  category: z.string().min(2),
  stock: z.number().positive()
})

export const createProductSchema = schemaValidator

export const updateProductSchema = schemaValidator.partial() // Para el updateProduct