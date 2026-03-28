import Wishlist from "../models/Wishlist.js";

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (!wishlist) {
      const newWishlist = await Wishlist.create({
        user: req.user.id,
        products: [{ product: productId }],
      });
      return res.status(201).json({
        message: "product added successfully",
        success: true,
        data: newWishlist,
      });
    }

    const productExist = wishlist.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productExist > -1) {
      return res.status(400).json({
        message: "product already in the wishlist",
        success: false,
      });
    }

    wishlist.products.push({ product: productId });
    await wishlist.save();

    return res.status(200).json({
      message: "product added successfully",
      success: true,
      data: wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};



export const getWishlist  = async (req,res)=>{
    try {
        
        const wishlist = await Wishlist.findOne({user:req.user.id})
        if(!wishlist)
        {
     return res.status(404).json({
        message: "No wishlist found",
        success: false,
      });
         }


       return res.status(200).json({
        message: "wishlist found",
        success: true,
        data:wishlist
      });

        }

     catch (error) {
        return res.status(500).json({
      message: error.message,
      success: false,
    }); 
    }
}


export const removefromWishlist= async(req,res)=>{
try {

 const {productId} = req.body
 
 let wishlist = await Wishlist.findOne({user:req.user.id})

 if(!wishlist)
 {
     return res.status(404).json({
        message: "No wishlist found",
        success: false,
      });
 }

wishlist.products= wishlist.products.filter((item)=>item.product.toString()!==productId)

await wishlist.save()

return res.status(200).json({
        message: "wishlist updated",
        success: true,
        data:wishlist
      });

} catch (error) {
    
     return res.status(500).json({
      message: error.message,
      success: false,
    }); 
}

}