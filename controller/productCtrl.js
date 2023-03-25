const Product = require('../models/productModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (err) {
    throw new Error(err);
  }  
});

const updateProduct = asyncHandler(async(req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const product = await Product.findOneAndUpdate({_id: id}, 
      req.body, 
      {
        new: true,
        runValidators: true
      }
    );
    res.json(product);
  } catch (err) {
    throw new Error(err);
  }
});

const deleteProduct = asyncHandler(async(req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOneAndDelete({_id: id});
    res.json(product);
  } catch (err) {
    throw new Error(err);
  }
});

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (err) {
    throw new Error(err);
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {

    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach(el => delete queryObj[el]);

    console.log(queryObj);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => {`$${match}`});

    let query = Product.find(JSON.parse(queryStr));

    // Sorting
    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join('');
      query = query.sort(sortBy);
    } else {  
      query = query.sort('-createdAt');
    }

    // Limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page -1) * limit;
    query = query.skip(skip).limit(limit);
    if(req.query.page) {
      const productCount = await Product.countDocuments();
      if(skip >= productCount) throw new Error('This Page does not exists.');
    }

    const product = await query;            
    res.json(product);
  } catch (err) {
    throw new Error(err);
  }
}); 

const addToWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;

  try {
    const user = await User.findById(_id);

    const isAlreadyAdded = user.wishlist.includes(prodId);

    const update = isAlreadyAdded
      ? { $pull: { wishlist: prodId } }
      : { $push: { wishlist: prodId } };

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      update,
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// const addToWishList = asyncHandler(async(req, res) => {
//   const { _id } = req.user;
//   const { prodId } = req.body;

//   try {
//     const user = await User.findById(_id);
//     const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
//     if (alreadyAdded) {
//       let user = await User.findByIdAndUpdate(
//         _id, 
//         {
//           $pull: { wishlist: prodId },
//         }, 
//         {
//           new: true
//         }
//       );
//       res.json(user);
//     } else {
//       let user = await User.findByIdAndUpdate(
//         _id, 
//         {
//           $push: { wishlist: prodId },
//         }, 
//         {
//           new: true
//         }
//       );
//       res.json(user);
//     }
//   } catch (err) {
//     throw new Error(err);
//   }
// });

// const rating = asyncHandler(async(req, res) => {
//   const { _id } = req.user;
//   const { star, prodId } = req.body;

//   try {
//     const product = await Product.findById(prodId);
//     let alreadyRated = product.ratings.find(
//       (userId) => userId.postedBy.toString() === _id.toString()
//     );
//     if (alreadyRated) {
//       const updateRating = await Product.updateOne(
//         {
//           ratings: { $elemMatch: alreadyRated },
//         },
//         {
//           $set: { "ratings.$.star": star },
//         }, 
//         {
//           new: true,
//         }
//       );
//       res.json(updateRating);
//     } else {
//       const rateProduct = await Product.findByIdAndUpdate(prodId, {
//         $push: {
//           ratings: {
//             star,
//             postedBy: _id,
//           },
//         },
//       }, {
//         new: true,
//       });
//       res.json(rateProduct);
//     }
//   } catch (err) {
//     throw new Error(err);
//   }
// });

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId } = req.body;

  try {
    const product = await Product.findById(prodId);

    const ratingIndex = product.ratings.findIndex(
      (rating) => rating.postedBy.toString() === _id.toString()
    );

    if (ratingIndex > -1) {
      // Update existing rating
      product.ratings[ratingIndex].star = star;
      await product.save();
      res.json(product);
    } else {
      // Create new rating
      product.ratings.push({
        star,
        postedBy: _id,
      });
      await product.save();
      res.json(product);
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { 
  createProduct, 
  getProduct, 
  getAllProducts, 
  updateProduct, 
  deleteProduct,
  addToWishList,
  rating
};