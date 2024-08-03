import * as mongoose from "mongoose";
import CategoryFilter from "../../models/CategoryFilter";
import Category from "../../models/Category";
import SubCategory from "../../models/SubCategory";
import Product from "../../models/Product";
import Page from "../../models/Page";
import Component from "../../models/Component";

const asyncForeach = async (array: any, callback: any) => {
  for (const item of array) {
    await callback(item);
  }
};

class Api {
  public methodParamsMap: { [key: string]: string[] } = {
    getProductFilters: [],
    getCategory: ["category"],
    getSubCategory: ["category"],
    getProduct: ["id"],
    getVariants: ["ids"],
    getProductsById: ["ids"],
    getPage: ["slug"],
    getSubCategoryById: ["_id"],
    getComponents: [],
    getComponent: ["slug"],
    setPage: ["slug", "body"],
    searchProduct: ["query"],
  };
  constructor() {}

  async getSubCategory(category: string) {
    const result = await SubCategory.findOne({ slug: category });

    return result;
  }
  async getProduct(id: string) {
    const result = await Product.findOne({ _id: id });

    return result;
  }

  async getPage(slug: string) {
    const result = await Page.findOne({ slug });

    return result;
  }
  async setPage(slug: string, body: any) {
    const result = await Page.updateOne(
      { slug },
      { $set: body },
      { new: true, useFindAndModify: false }
    );

    return result;
  }
  async searchProduct(query: string) {
    //const regex = new RegExp(query, 'i');
    const result = await Product.find({
      title: { $regex: query, $options: "i" },
    }).select("title _id");

    return result;
  }

  async getComponents() {
    const result = await Component.find();

    return result;
  }
  async getComponent(slug: string) {
    const result = await Component.findOne({ slug });

    return result;
  }
  async getVariants(ids: number[]) {
    const result = await Product.find({ providerId: { $in: ids } });

    return result;
  }
  async getProductsById(ids: string[]) {
    const result = await Product.find({ _id: { $in: ids } });

    return result;
  }
  async getCategory(category: string) {
    const result = await Category.findOne({ slug: category });

    return result;
  }
  async getSubCategoryById(_id: mongoose.Types.ObjectId) {
    const result = await SubCategory.findOne({ _id });

    return result;
  }
  async getProductFilters(sub_category_id: string) {
    try {
      const result = await CategoryFilter.findOne({ sub_category_id });

      return result;
    } catch (err) {
      console.log(err);
    }
  }
}

export default Api;
