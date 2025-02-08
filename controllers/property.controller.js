import Property from '../models/property.model.js';
import jwt from "jsonwebtoken"


export const addProperty = async (req, res) => {
    try {
        const property = new Property({
            ...req.body,
            owner: req.user.id || req.user._id
        });
        
        await property.save();
        
        res.status(201).json({
            success: true,
            message: "Property created successfully",
            propertyId: property._id,
            property
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating property",
            error: error.message
        });
    }
};


export const getProperties = async (req, res) => {
    const query = req.query
    // console.log(query)
    try {
        let propertiesQuery  =  Property.find().populate('owner', 'username email')
        if(query.city){
            propertiesQuery  = propertiesQuery .where('location.city').equals(query.city)
        }
        if(query.type){
            propertiesQuery = propertiesQuery.where('type').equals(query.type)
        }
        if (query.minPrice && query.maxPrice) {
            propertiesQuery = propertiesQuery.where('price')
                .gte(Number(query.minPrice)) 
                .lte(Number(query.maxPrice));
        }
        if (query.bedrooms) {
            propertiesQuery = propertiesQuery.where('features.bedrooms').equals(Number(query.bedrooms));
        }

        const properties = await propertiesQuery.sort({ createdAt: -1 });
            
        res.status(200).json({
            success: true,
            count: properties.length,
            properties
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching properties",
            error: error.message
        });
    }
};

export const getProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
            .populate("owner", "username profilePicture");

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        let isSaved = false;
        const token = req.cookies?.token; 

        if (token) {
            try {
                
                const payload = jwt.verify(token, process.env.JWT_SECRET);
                const saved = await SavedPost.findOne({
                    user: payload.id,
                    property: req.params.id,
                });
                isSaved = !!saved; 
            } catch (err) {
                console.log("JWT Verification Error:", err.message);
            }
        }

        res.status(200).json({
            success: true,
            property,
            isSaved,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching property",
            error: error.message
        });
    }
};

export const updateProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }
        
        if (property.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own properties"
            });
        }
        
        const updatedProperty = await Property.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        
        res.status(200).json({
            success: true,
            message: "Property updated successfully",
            property: updatedProperty
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating property",
            error: error.message
        });
    }
};

export const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }
        
        
        if (property.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own properties"
            });
        }
        
        await Property.findByIdAndDelete(req.params.id);
        
        res.status(200).json({
            success: true,
            message: "Property deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting property",
            error: error.message
        });
    }
};

export const searchProperties = async (req, res) => {
    try {
        const { type, city, minPrice, maxPrice, bedrooms } = req.query;
        
        const query = {};
        
        if (type) query.type = type;
        if (city) query['location.city'] = { $regex: city, $options: 'i' };
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (bedrooms) query['features.bedrooms'] = Number(bedrooms);
        
        const properties = await Property.find(query)
            .populate('owner', 'username email')
            .sort({ createdAt: -1 });
            
        res.status(200).json({
            success: true,
            count: properties.length,
            properties
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error searching properties",
            error: error.message
        });
    }
}; 