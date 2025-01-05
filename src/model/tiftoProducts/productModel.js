const mongoose = require("mongoose")
const { Schema } = mongoose

const customiseProduct = new Schema({
    variantName: { type: String, default: null },
    variantImage: { type: String, default: null },
    unit: { type: String, default: null },
    unitType: { type: String, enum:["gm","kg","ltr","ml","piece"], default: "gm" },
    cutPrice: { type: Number, default: 0.00 },
    customerPrice: { type: Number, default: 0.00 },
    discount: { type: Number, default: 0.00 },
    isDiscount: { type: Boolean, default: false },
    mrpPrice: { type: Number, default: 0.00 },
    deleted: { type: Boolean, default: false },
    status: { type: Boolean, default: true }
})
const productSchema = new Schema({
    productCateId:{type: Schema.Types.ObjectId,default: null},
    categoryId:{type: Schema.Types.ObjectId,default: null},
    subCategoryId:{type: Schema.Types.ObjectId,default: null},
    productName:{type:String,default:null},
    productTitle:{type:String,default:null},
    productDesc:{type:String,default:null},
    productImg:{type:String,default:null},
    productAdditionalImg:[{type:String,default:null}],
    productStatus:{type:Boolean,default:false},
    isCustomizable: { type: Boolean, default: false },
    customizedProduct: {
        addVariants: [{
            variantType: [customiseProduct]
        }],
    },
    product: {
        stock:{type:Number,default:0},
        maxQuantity:{type:Number,default:null},
        unit: { type: String, default: null },
        unitType: { type: String, enum:["gm","kg","ltr","ml","piece"], default: "gm" },
        cutPrice: { type: Number, default: 0.00 },
        customerPrice: { type: Number, default: 0.00 },
        packagingCharge: { type: Number, default: 0.00 },
        mrpPrice: { type: Number, default: 0.00 },
        discount: { type: Number, default: 0.00 },
        isDiscount: { type: Boolean, default:false },
        GST: { type: String, default: null },
        CGST: { type: String, default: null },
    },
    isCombo:{type:Boolean,default:false},
    isBestSeller: { type: Boolean, default: false },
    isRecommended: { type: Boolean, default: false },
    productId:{type:String,default:null},
    benefits:[{
        benefitName:{type:String,default:null},
        benefitDesc:{type:String,default:null},
        benefitImage:{type:String,default:null},
    }],
    howToUse:[{
        howToUseName:{type:String,default:null},
        howToUseDesc:{type:String,default:null},    
        howToUseImg:{type:String,default:null},    
    }],
    keyIngrediants:[{
        keyIngrediantName:{type:String,default:null},
        keyIngrediantDesc:{type:String,default:null},
        keyIngrediantImg:{type:String,default:null},
    }],
    suitableFor:[{
        suitableForName:{type:String,default:null},
        suitableForDesc:{type:String,default:null},
    }],
    additionalInfo:{
        bestBefore:{type:String,default:null},
        marketedBy:{type:String,default:null},
        countryAndOrgin:{type:String,default:null},
        manufacturer:{type:String,default:null},
        licenseNo:{type:String,default:null},
    },
    deleted:{type:Boolean,default:false}
},{timestamps:true})

const productModel = mongoose.model ("product",productSchema)

module.exports = productModel