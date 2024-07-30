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
    setPage: ["slug", "body"],
    searchProduct: ["query"],
  };
  constructor() {}

  async client() {
    //await mongoose.connect(process.env.DATABASE_URL);
  }
  async disconnect() {
    // await mongoose.disconnect();
  }
  async getSubCategory(category: string) {
    await this.client();
    const result = await SubCategory.findOne({ slug: category });
    await this.disconnect();
    return result;
  }
  async getProduct(id: string) {
    await this.client();
    const result = await Product.findOne({ _id: id });
    await this.disconnect();
    return result;
  }

  async getPage(slug: string) {
    await this.client();
    const result = await Page.findOne({ slug });
    await this.disconnect();
    return result;
  }
  async setPage(slug: string, body: any) {
    await this.client();
    const result = await Page.updateOne(
      { slug },
      { $set: body },
      { new: true, useFindAndModify: false }
    );
    await this.disconnect();
    return result;
  }
  async searchProduct(query: string) {
    await this.client();
    //const regex = new RegExp(query, 'i');
    const result = await Product.find({
      title: { $regex: query, $options: "i" },
    }).select("title _id");
    await this.disconnect();
    return result;
  }

  async getComponents() {
    await this.client();
    const result = await Component.find();
    await this.disconnect();
    return result;
  }
  async getVariants(ids: number[]) {
    await this.client();
    const result = await Product.find({ providerId: { $in: ids } });
    await this.disconnect();
    return result;
  }
  async getProductsById(ids: string[]) {
    await this.client();
    const result = await Product.find({ _id: { $in: ids } });
    await this.disconnect();
    return result;
  }
  async getCategory(category: string) {
    await this.client();
    const result = await Category.findOne({ slug: category });
    await this.disconnect();
    return result;
  }
  async getSubCategoryById(_id: mongoose.Types.ObjectId) {
    await this.client();
    const result = await SubCategory.findOne({ _id });
    await this.disconnect();
    return result;
  }
  async getProductFilters(sub_category_id: string) {
    try {
      await this.client();
      const result = await CategoryFilter.findOne({ sub_category_id });
      await this.disconnect();
      return result;
    } catch (err) {
      console.log(err);
    }
  }
}

export default Api;
