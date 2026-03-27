import User from "../models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, contactNumber } = req.body;

    if (!firstName || !lastName || !email || !password || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: "Credentials are missing",
      });
    }

    const emailExist = await User.findOne({ email: email });
    if (emailExist) {
      return res.status(400).json({
        success: false,
        message: "email already exist",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      contactNumber,
    });

    return res.status(201).json({
      success: true,
      message: "successfully register",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Credentials are missing",
      });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "email does not exist",
      });
    }

    const hashedPassword = user.password;
    const validPassword = await bcrypt.compare(password, hashedPassword);

    if (!validPassword) {
      return res.status(400).json({
        message: "Password is wrong",
        success: false,
      });
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_ACCESSTOKEN_KEY,
      { expiresIn: "15m" },
    );
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_REFRESTOKEN_KEY,
      { expiresIn: "7d" },
    );

    res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      })
      .json({
        message: "Login Successfull",
        success: true,
        data: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    return res.status(500).json({
      message: "server error",
      success: false,
    });
  }
};

const logout = async (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };
  try {
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "server error",
      success: false,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        message: "No refresh token",
        success: false,
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_REFRESTOKEN_KEY);

    const accessToken = jwt.sign(
      {
        id: decode.id,
        role: decode.role,
      },
      process.env.SECRET_ACCESSTOKEN_KEY,
      { expiresIn: "15m" },
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      })
      .json({
        message: "Token refreshed",
        success: true,
      });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid refresh token",
      success: false,
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user =await User.findById(req.user.id).select("-password");
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


const updateProfile=async(req,res)=>{
try {

  const {firstName,lastName,gender,contactNumber}= req.body

  const updatedProfile= await User.findByIdAndUpdate(req.user.id,{firstName,lastName,gender,contactNumber},{new:true})

  
  if(!updatedProfile)
  {
   return res.status(404).json({
      message:"user not found",
     
      success:false
    })
  }
  res.status(200).json({
      message:"updated successfully",
      data:updatedProfile,
      success:true
    })
  
} catch (error) {
  return res.status(500).json({ success: false, message: "Server error" });
}
}


const resetPassword=async(req,res)=>{

try {

  const {oldPassword,newPassword} = req.body

  const user=await User.findById(req.user.id)
 
  const validPassword = await bcrypt.compare(oldPassword,user.password)

  if(!validPassword)
  {
  return  res.status(404).json({
      message:"invalid password",
      success:false
    })
  }

   const hashedPassword = await bcrypt.hash(newPassword, 10);

   await User.findByIdAndUpdate(user._id,{password:hashedPassword}, { new: true })

   return res.status(200).json({
    message:"password updated successfully",
    success:true,
   })


} catch (error) {

  
 
return res.status(500).json({ success: false, message: "Server error" })

}

}