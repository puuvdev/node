import * as mongoose from "mongoose";

import Product from "../../models/Product";

const asyncForeach = async (array: any, callback: any) => {
  for (const item of array) {
    await callback(item);
  }
};

class Sitemap {
  public methodParamsMap: { [key: string]: string[] } = {
    getProducts: ["skip", "limit"],
    getProductCount: [],
  };
  constructor() {}
  async getProductCount(): Promise<number> {
    return await Product.countDocuments();
  }
  async getProducts(skip: number, limit: number) {
    const result = await Product.find()
      .select("url updated_at")
      .limit(limit)
      .skip(skip);

    return result;
  }
}

export default Sitemap;
