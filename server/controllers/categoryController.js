import Category from "../models/Category.js"



export const getAllCategories= async(req,res)=>{
    try {
    
        const categories =await Category.find()

        if(categories.length === 0)
        {
              return  res.status(400).json({
                message:"no category found",
                success:false
            })
        }
    
         

        
       return res.status(200).json({
            message:"category found",
            success:true,
            data:categories
        })


    } catch (error) {
         return res.status(500).json({
      message: error.message,
      success: false,
    });
    }
}





export const createCategory= async(req,res)=>{
    try {
        const {name,slug} = req.body

        if(!name||!slug)
        {
          return  res.status(400).json({
                message:"fields are missing",
                success:false
            })
        }

         const existingCategory = await Category.findOne({ slug });

    if (existingCategory) {
      return res.status(409).json({
        message: "category already exists",
        success: false,
      });
    }

        const category= await Category.create({name,slug})
       return res.status(201).json({
            message:"category created",
            success:true,
            data:category
        })


    } catch (error) {
         return res.status(500).json({
      message: error.message,
      success: false,
    });
    }
}



export const updateCategory = async(req,res)=>{
    try {
        
        const {categoryId}= req.params
        const {name,slug} =req.body

        const category = await Category.findByIdAndUpdate(categoryId,{name,slug},{new:true})

        if(!category)
        {
            
   return res.status(404).json({
      message:"category not found",
     
      success:false
    })
        }

        
  return res.status(200).json({
    message:"category updated successfully",
    success:true,
    data:category
  })


    } catch (error) {
        return res.status(500).json({
      message: error.message,
      success: false,
    });
    }
    }




    
export const deleteCategory=async(req,res)=>{
  try {
    
const {categoryId} = req.params
 

  const deletedCategory = await Category.findByIdAndDelete(categoryId)
  
if(!deletedCategory)
{
   return res.status(404).json({
      message:"category not found",
      success:false
    })
}


  return res.status(200).json({
    message:"category deleted successfully",
    success:true,
  })



  } catch (error) {
 return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
}
