import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js"




export const getAllProducts = async(req,res) => {
    try {
        const product = await Product.find({});
        res.status(200).json({product});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
}

export const getFeaturedProducts = async(req,res) => {
    try {
        let featuredProducts = redis.get("featured_products");
        if(featuredProducts){
            return res.json(JSON.parse(featuredProducts));
        }
        featuredProducts = await Product.find({isFeatured:true}).lean();
        if(!featuredProducts){
            return res.status(404).json({message: "No products found"});
        }
        await redis.set("featured_products", JSON.stringify(featuredProducts));
        res.json(featuredProducts);
    } catch (error) {
        console.log("Error in featured products controller", error);
        return res.status(500).json({ message: "Server error" });
 
    }
}

export const createProduct = async(req,res) => 