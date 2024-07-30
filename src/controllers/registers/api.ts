import Pos from "../models/Pos";

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
}

export default Api;
