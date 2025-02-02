import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['rent', 'buy'],
        required: true
    },
    propertyType: {
        type: String,
        enum: ['Apartment', 'House', 'Land'],
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        address: String,
        city: String,
        state: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    features: {
        bedrooms: Number,
        bathrooms: Number,
        area: Number, 
        parking: Boolean,
    },
    images: [{
        type: String
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Property", propertySchema); 