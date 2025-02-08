import savedPostsModel from '../models/savedPosts.model.js';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        console.log("Getting users:", users.length);
        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to get users"
        });
    }
}

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to get user"
        });
    }
}

export const updateUser = async (req, res) => {
    try {
       
        if (req.user.id !== req.params.id) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own profile"
            });
        }

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    profilePicture: req.body.profilePicture,
                    isAgent: req.body.isAgent
                }
            },
            { new: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to update user"
        });
    }
}

export const deleteUser = async (req, res) => {
    try {
       
        if (req.user.id !== req.params.id) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own account"
            });
        }

        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete user"
        });
    }
}

export const savePost = async (req, res) => {
    try {
        const { propertyId } = req.body;
        const userId = req.user.id || req.user._id;

        const savePost = new savedPostsModel({user: userId, property: propertyId});
        await savePost.save();

        const existingSavedPost = await savedPostsModel.findOne({ user: userId, property: propertyId });

        if (existingSavedPost) {
            await savedPostsModel.findByIdAndDelete(existingSavedPost._id);
            return res.status(200).json({
                success: true,
                message: "Property removed from saved posts"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Property saved successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Property not saved"
        });
    }
}