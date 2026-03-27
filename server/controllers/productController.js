import Product from "../models/Product.js";

export const getAllProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page, limit } =
      req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (category) {
      filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {
        ...(minPrice && { $gte: Number(minPrice) }),
        ...(maxPrice && { $lte: Number(maxPrice) }),
      };
    }

    let sortOptions = {};
    if (sort === "price_asc") {
      sortOptions = { price: 1 };
    }
    if (sort === "price_desc") {
      sortOptions = { price: -1 };
    }

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const products = await Product.find(filter)
      .populate("category")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber);

    if (products.length === 0) {
      return res.status(400).json({
        message: "no products found",
        status: false,
      });
    }

    const total = await Product.countDocuments(filter);

    return res.status(200).json({
      message: "products found successfully",
      success: true,
      data: products,
      page: pageNumber,
      limit: limitNumber,
      total,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getAllProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId).populate("category");

    if (!product) {
      return res.status(400).json({
        message: "no products found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "products retrieved successfully",
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

//Admin

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, discountPrice, stock, images, category } =
      req.body;

    if (
      !name ||
      !description ||
      !price ||
      !discountPrice ||
      !stock ||
      !images ||
      !category
    ) {
      return res.status(400).json({
        message: "missing details of the products",
        success: false,
      });
    }

 const existingProduct = await Category.findOne({ name });

    if (existingProduct) {
      return res.status(409).json({
        message: "Product already exists",
        success: false,
      });
    }


    const product = await Product.create({
      name,
      description,
      discountPrice,
      stock,
      images,
      category,
      price,
    });

    return res.status(201).json({
      message: "product created successfully",
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};


export const updateProduct=async(req,res)=>{
  try {
    
const {productId} = req.params
  const { name, description, price, discountPrice, stock, images, category } = req.body;

  const updatedProduct = await Product.findByIdAndUpdate(productId,{name,description,price,discountPrice,stock,images,category},{new:true})
  
if(!updatedProduct)
{
   return res.status(404).json({
      message:"product not found",
     
      success:false
    })
}


  return res.status(200).json({
    message:"product updated successfully",
    success:true,
    data:updatedProduct
  })



  } catch (error) {
 return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
}




export const deleteProduct=async(req,res)=>{
  try {
    
const {productId} = req.params
 

  const deletedProduct = await Product.findByIdAndDelete(productId)
  
if(!deletedProduct)
{
   return res.status(404).json({
      message:"product not found",

      success:false
    })
}


  return res.status(200).json({
    message:"product deleted successfully",
    success:true,
  })



  } catch (error) {
 return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
}
