//FUNCIONES QUE SANITIZAN DATOS DE ENTRADA Y RESPONDEN AL CLIENTE
//LA REQUEST Y EL RESPONSE SIEMPRE ESTARAN SOLO EN LOS CONTROLLERS

import { Request, Response } from "express"
import Product from "../model/ProductModel"
import { Types } from "mongoose"
import { createProductSchema } from "../validators/productValidator"

class ProductController {
  static getAllProducts = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const queyParams = req.query

      const { name, stock, category, minPrice, maxPrice } = queyParams

      const filter: any = {}

      if (name) filter.name = new RegExp(String(name), "i ")
      if (stock) filter.stock = Number(stock)
      if (category) filter.category = new RegExp(String(category), "i ")
      if (minPrice || maxPrice) {
        filter.price = {}
        //masPrice -> si tengo precio maximo quiero un objeto con precio menor
        if (minPrice) filter.price.$gt = minPrice
        //minPrice -> si tengo precio minimo quiero un objeto con precio mayor
        if (maxPrice) filter.price.$lt = maxPrice
      }

      const products = await Product.find(queyParams)
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
      const { body } = req // Aca guardo los datos que me ingresa el usuario

      const { name, description, price, category, stock } = body // Los destructuro para luego poder usarlos mejor

      // Primer validacion de que todos los datos que necesito estan si o si, de no ser asi, dara error 
      if (!name || !description || !price || !category || !stock) {
        return res.status(400).json({ success: false, message: "Todos los campos son requeridos" })
      }

      //SI LO DESEO PUEDO DEJAR EL ZOD HAGA LA VALIDACION POR MI, son dos opciones viables, reeplazo el contenido de new Product({}) por validation.data, y elimino el primer if
      // Valido que esten todas las propiedades del producto, en tal caso que no esten, muestro todos los errores que existen
      const validator = createProductSchema.safeParse(body)

      if (!validator.success) {
        return res.status(400).json({ success: false, error: validator.error.flatten().fieldErrors })
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

      const validator = createProductSchema.safeParse(body)

      if (!validator.success) {
        return res.status(400).json({ success: false, error: validator.error.flatten().fieldErrors })
      }

      const product = await Product.findByIdAndUpdate(id, validator.data, { new: true })

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