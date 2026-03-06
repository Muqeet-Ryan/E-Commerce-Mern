import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const product = await Product.find({});
    res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }
    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts) {
      return res.status(404).json({ message: "No products found" });
    }
    await redis.set("featured_products", JSON.stringify(featuredProducts));
    res.json(featuredProducts);
  } catch (error) {
    console.log("Error in featured products controller", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }
    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
    });
    return res.status(201).json(product);
  } catch (error) {
    console.log("Error in featured Createproducts controller", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "No products found" });
    }
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
      } catch (error) {
        console.log("Error in deleting image", error);
      }
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    console.log("Error in featured deleteProducts controller", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getRecomendations = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error in recommendations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error in getProductsByCategory:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isFeatured = !product.isFeatured;

    const updatedProduct = await product.save();

    await updateFeaturedProductsCache();

    return res.status(200).json(updatedProduct);

  } catch (error) {
    console.error("Error in toggleFeaturedProduct:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateFeaturedProductsCache = async () => {
   try {
    const featuredProducts = await Product.find({isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
   } catch (error) {
    console.error("Error in toggleFeaturedProduct:", error);
    return res.status(500).json({ message: "Server error" });
  }
    
};