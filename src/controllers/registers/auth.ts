import * as mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../../models/User";
import UserFavorite from "../../models/UserFavorite";
import Product from "../../models/Product";
import UserAlarm from "../../models/UserAlarm";

const SECRET_KEY = `Hw/WA."d}D@*ch4n`;

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  access_token: string;
}

class Auth {
  public methodParamsMap: { [key: string]: string[] } = {
    getUserFavorites: ["userId", "access_token"],
    addFavorite: ["userId", "productId", "access_token"],
    removeFavorite: ["userId", "productId", "access_token"],
    addAlarm: ["userId", "productId", "alarmDetails", "access_token"],
    getUserAlarms: ["userId", "access_token"],
    getUserAlarmsByProduct: ["userId", "productId", "access_token"],
    updateAlarm: ["userId", "alarmId", "updateDetails", "access_token"],
    removeAlarm: ["userId", "alarmId", "access_token"],
    isLogin: ["access_token"],
  };

  constructor() {}

  // Utility function to verify the token and get the user
  private async verifyToken(access_token: string) {
    try {
      const decoded = jwt.verify(access_token, SECRET_KEY) as { id: string };
      return decoded.id;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
  async isLogin(access_token: string) {
    try {
      const userId = await this.verifyToken(access_token);
      return { success: true, userId };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }
  // Function to add a favorite product
  async addFavorite(userId: string, productId: string, access_token: string) {
    const userIdFromToken = await this.verifyToken(access_token);

    if (userId !== userIdFromToken) {
      return { message: "Invalid user", success: false };
    }

    const user = await User.findById(userId);
    if (!user) {
      return { message: "User not found", success: false };
    }

    const product = await Product.findById(productId);
    if (!product) {
      return { message: "Product not found", success: false };
    }

    // Check if the favorite already exists
    const existingFavorite = await UserFavorite.findOne({
      user: userId,
      product: productId,
    });
    if (existingFavorite) {
      return { message: "Product already favorited", success: false };
    }

    const newFavorite = new UserFavorite({ user: userId, product: productId });
    await newFavorite.save();

    return { message: "Favorite added successfully", success: true };
  }

  // Function to retrieve all favorite products for a user
  async getUserFavorites(userId: string, access_token: string) {
    const userIdFromToken = await this.verifyToken(access_token);

    if (userId !== userIdFromToken) {
      return { message: "Invalid user", success: false };
    }

    const user = await User.findById(userId);
    if (!user) {
      return { message: "User not found", success: false };
    }

    const favorites = await UserFavorite.find({ user: userId }).populate(
      "product"
    );
    return {
      success: true,
      favorites: favorites.map((favorite) => favorite.product),
    };
  }

  // Function to remove a favorite product
  async removeFavorite(
    userId: string,
    productId: string,
    access_token: string
  ) {
    const userIdFromToken = await this.verifyToken(access_token);

    if (userId !== userIdFromToken) {
      return { message: "Invalid user", success: false };
    }

    const user = await User.findById(userId);
    if (!user) {
      return { message: "User not found", success: false };
    }

    const favorite = await UserFavorite.findOneAndDelete({
      user: userId,
      product: productId,
    });
    if (!favorite) {
      return { message: "Favorite not found", success: false };
    }

    return { message: "Favorite removed successfully", success: true };
  }

  // Function to add an alarm for a product
  async addAlarm(
    userId: string,
    productId: string,
    alarmDetails: { time: Date; message: string; isActive: boolean },
    access_token: string
  ) {
    const userIdFromToken = await this.verifyToken(access_token);

    if (userId !== userIdFromToken) {
      return { message: "Invalid user", success: false };
    }

    const user = await User.findById(userId);
    if (!user) {
      return { message: "User not found", success: false };
    }

    const product = await Product.findById(productId);
    if (!product) {
      return { message: "Product not found", success: false };
    }

    const newAlarm = new UserAlarm({
      user: userId,
      product: productId,
      alarm: alarmDetails,
    });
    await newAlarm.save();

    return { message: "Alarm added successfully", success: true };
  }

  // Function to retrieve all alarms for a user and specific product
  async getUserAlarmsByProduct(
    userId: string,
    productId: string,
    access_token: string
  ) {
    const userIdFromToken = await this.verifyToken(access_token);

    if (userId !== userIdFromToken) {
      return { message: "Invalid user", success: false };
    }

    const user = await User.findById(userId);
    if (!user) {
      return { message: "User not found", success: false };
    }

    const alarms = await UserAlarm.find({ user: userId, product: productId });
    return {
      success: true,
      alarms,
    };
  }

  async getUserAlarms(userId: string, access_token: string) {
    const userIdFromToken = await this.verifyToken(access_token);

    if (userId !== userIdFromToken) {
      return { message: "Invalid user", success: false };
    }

    const user = await User.findById(userId);
    if (!user) {
      return { message: "User not found", success: false };
    }

    const alarms = await UserAlarm.find({ user: userId }).populate("product");
    return {
      success: true,
      alarms,
    };
  }

  // Function to update an alarm for a product
  async updateAlarm(
    userId: string,
    alarmId: string,
    updateDetails: { time?: Date; message?: string; isActive?: boolean },
    access_token: string
  ) {
    const userIdFromToken = await this.verifyToken(access_token);

    if (userId !== userIdFromToken) {
      return { message: "Invalid user", success: false };
    }

    const user = await User.findById(userId);
    if (!user) {
      return { message: "User not found", success: false };
    }

    const updatedAlarm = await UserAlarm.findOneAndUpdate(
      { _id: alarmId, user: userId },
      { $set: updateDetails },
      { new: true }
    );

    if (!updatedAlarm) {
      return {
        message: "Alarm not found or does not belong to user",
        success: false,
      };
    }

    return {
      success: true,
      alarm: updatedAlarm,
    };
  }

  // Function to remove an alarm for a product
  async removeAlarm(userId: string, alarmId: string, access_token: string) {
    const userIdFromToken = await this.verifyToken(access_token);

    if (userId !== userIdFromToken) {
      return { message: "Invalid user", success: false };
    }

    const user = await User.findById(userId);
    if (!user) {
      return { message: "User not found", success: false };
    }

    const removedAlarm = await UserAlarm.findOneAndDelete({
      _id: alarmId,
      user: userId,
    });
    if (!removedAlarm) {
      return {
        message: "Alarm not found or does not belong to user",
        success: false,
      };
    }

    return { message: "Alarm removed successfully", success: true };
  }
}

export default Auth;
