//FUNCIONES QUE SANITIZAN DATOS DE ENTRADA Y RESPONDEN AL CLIENTE
//LA REQUEST Y EL RESPONSE SIEMPRE ESTARAN SOLO EN LOS CONTROLLERS

import { Request, Response } from "express"
import Product from "../model/ProductModel"
import { Types } from "mongoose"


class ProductController {
  static getAllProducts = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const products = await Product.find()
      res.json({ success: true, data: products })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ sucess: false, error: error.message })
    }
  }

  static getProduct = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { id } = req.params // es lo mismo que poner req.params.id

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ sucess: false, error: "ID Inválido" });
      }

      const product = await Product.findById(id)

      if (!product) {
        return res.status(404).json({ sucess: false, error: "Producto no encontrado" })
      }
      res.status(200).json({ sucess: true, data: product })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ sucess: false, error: error.message })
    }
  }

  static addProduct = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const body = req.body

      const { name, description, price, category, stock } = body

      if (!name || !description || !price || !category || !stock) {
        return res.status(400).json({ success: false, message: "Datos invalidos" })
      }

      const newProduct = new Product({ name, description, price, category, stock })

      await newProduct.save()
      res.status(201).json({ success: true, addedProduct: newProduct })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static updateProduct = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const id = req.params.id
      const body = req.body

      if (!Types.ObjectId.isValid(id)) res.status(400).json({ success: false, error: "ID Inválido" })

      const { name, description, price, category, stock } = body

      const updates = { name, description, price, category, stock }

      const product = await Product.findByIdAndUpdate(id, updates, { new: true })

      if (!product) {
        return res.status(404).json({ success: false, error: "Producto no encontrado" })
      }

      res.json({ success: true, updatedProduct: product })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static deleteProduct = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const id = req.params.id

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "ID Inválido" });
      }

      const deletedProduct = await Product.findByIdAndDelete(id)

      if (!deletedProduct) {
        return res.status(404).json({ success: false, error: "Producto no encontrado" })
      }

      res.json({ success: true, deletedProduct })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  }
}

export default ProductController