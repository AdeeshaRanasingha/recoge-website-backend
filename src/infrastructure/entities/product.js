import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    variants: { 
      type: String, 
      required: false 
    },
    fit: { 
      type: String, 
      required: false 
    },
    price: { 
      type: String, 
      required: true 
    },
    priceValue: { 
      type: Number, 
      required: true 
    },
    image: { 
      type: String, 
      required: true 
    },
    bg: { 
      type: String, 
      default: 'bg-gray-100' 
    },
    inStock: { 
      type: Boolean, 
      default: true 
    },
    sizes: [
      { type: String } 
    ],
    colors: [
      { type: String }
    ],
    gender: { 
      type: String, 
      enum: ['Men', 'Women', 'Unisex'], 
      default: 'Men' 
    }
  },
  {
    timestamps: true 
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;