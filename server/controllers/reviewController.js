import Review from "../models/Review.js";

export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;
    if (!rating || !comment) {
      return res.status(401).json({
        message: "missing reviews",
        success: false,
      });
    }

    const reviews = await Review.create({
      rating,
      comment,
      user: req.user.id,
      product: productId,
    });

    return res.status(201).json({
      message: "reviews created",
      success: true,
      data: reviews,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};


export const getReviewsByProduct= async(req,res)=>{
try {
    
    const {productId} = req.params

    const reviews = await Review.find({product:productId}).populate({
      path: "product",
      select: "name price images",
    }).populate({path:'user', select:'firstName lastName'})

    if(reviews.length===0)
    {
        return res.status(404).json({
        message: "review not found",
        success: false,
      });
    }


     return res.status(200).json({
        message: "reviews",
        success: true,
        data:reviews
      });
        
} catch (error) {

   return res.status(500).json({
      message: error.message,
      success: false,
    });  
}
}


export const getMyReviews= async(req,res)=>{
try {
    const reviews = await Review.find({user:req.user.id}).populate({
      path: "product",
      select: "name price images",
    }).populate({path:'user', select:'firstName lastName'})

    if(reviews.length===0)
    {
        return res.status(404).json({
        message: "review not found",
        success: false,
      });
    }


     return res.status(200).json({
        message: "reviews",
        success: true,
        data:reviews
      });
        



} catch (error) {

   return res.status(500).json({
      message: error.message,
      success: false,
    });  
}
}
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params

    // 1. pehle find karo
    const review = await Review.findById(reviewId)

    // 2. na mile toh 404
    if (!review) {
      return res.status(404).json({
        message: "review not found",
        success: false,
      })
    }

    // 3. owner check karo
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        message: "not authorized",
        success: false,
      })
    }

    // 4. delete karo
    await review.deleteOne()

    return res.status(200).json({
      message: "review deleted successfully",
      success: true,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    })
  }
}