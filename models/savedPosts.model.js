import mongoose from "mongoose"

const savedPostSchema = new mongoose.Schema({
    property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property',
            required: true
    },
    owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
    }
}, {timestamps: true})

savedPostSchema.index({ user: 1, property: 1 }, { unique: true });

export default mongoose.model("SavedPost", savedPostSchema)