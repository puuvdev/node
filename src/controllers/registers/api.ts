import * as mongoose from "mongoose";
import CategoryFilter from "../../models/CategoryFilter";
import Category from "../../models/Category";
import SubCategory from "../../models/SubCategory";
import Product from "../../models/Product";
import Page from "../../models/Page";
import Component from "../../models/Component";
import MenuItem, { MenuItemInterface } from "../../models/MenuItem";
import { Types } from "mongoose";

export const stringToObjectId = (id: string): Types.ObjectId => {
  console.log(id, "id");
  if (Types.ObjectId.isValid(id)) {
    return new Types.ObjectId(id);
  } else {
    throw new Error("Invalid ObjectId");
  }
};
const asyncForeach = async (array: any, callback: any) => {
  for (const item of array) {
    await callback(item);
  }
};
interface NestedMenuItem extends MenuItemInterface {
  subItems?: NestedMenuItem[];
}

class Api {
  public methodParamsMap: { [key: string]: string[] } = {
    getProductFilters: [],
    getCategoryById: ["_id"],
    getCategory: ["category"],
    getParentCategory: ["parent_id"],
    getSubCategory: ["category"],
    getBreadcrumb: ["subcategoryId"],
    getProduct: ["id"],
    getVariants: ["ids"],
    getProductsById: ["ids"],
    getPage: ["slug"],
    getPageMenu: ["slug"],
    getSubCategoryById: ["_id"],
    getComponents: [],
    getComponent: ["slug"],
    deleteComponent: ["slug", "componentName"],
    setPage: ["slug", "body"],
    searchProduct: ["query"],
  };
  constructor() {}
  async getBreadcrumb(
    subcategoryId: string
  ): Promise<{ name: string; slug: string }[]> {
    const buildBreadcrumb = async (
      currentId: string,
      breadcrumb: { name: string; slug: string }[] = []
    ): Promise<{ name: string; slug: string }[]> => {
      const subCategory = await SubCategory.findOne({ _id: currentId });

      if (subCategory) {
        breadcrumb.unshift({ name: subCategory.name, slug: subCategory.slug });

        if (subCategory.parent_id) {
          return buildBreadcrumb(subCategory.parent_id, breadcrumb);
        }
      } else {
        const category = await Category.findOne({ _id: currentId });

        if (category) {
          breadcrumb.unshift({ name: category.name, slug: category.slug });
        }
      }

      return breadcrumb;
    };

    // Build the breadcrumb
    const breadcrumb = await buildBreadcrumb(subcategoryId);

    // Slice off the last element (remove the current subcategory)
    return breadcrumb.slice(0, breadcrumb.length - 1);
  }

  async getSubCategory(category: string) {
    const result = await SubCategory.findOne({ slug: category });

    return result;
  }
  async getProduct(id: string) {
    const result = await Product.findOne({ new_id: parseFloat(id) });

    return result;
  }

  async getPage(slug: string) {
    const result = await Page.findOne({ slug });

    return result;
  }
  async getSubItems(parentId: any): Promise<NestedMenuItem[]> {
    const subItems = await MenuItem.find({ ebeveyn: parentId }).limit(5).exec();

    const nestedSubItems: NestedMenuItem[] = await Promise.all(
      subItems.map(async (subItem: mongoose.Document & MenuItemInterface) => {
        const children = await this.getSubItems(subItem._id);
        return {
          ...subItem.toObject(),
          subItems: children,
        } as NestedMenuItem;
      })
    );

    return nestedSubItems;
  }
  async getPageMenu(slug: string) {
    try {
      const parentMenus = await MenuItem.find({ ebeveyn: null }).exec();

      // Step 2: For each parent menu, fetch its nested sub-items
      const menusWithSubItems = await Promise.all(
        parentMenus.map(async (parent) => {
          const subItems = await this.getSubItems(parent._id); // Get sub-items with nesting
          return {
            ...parent.toObject(),
            subItems, // Attach the nested sub-items to the parent menu
          };
        })
      );

      return menusWithSubItems;
    } catch (error) {
      console.error("Error fetching menus with sub-items:", error);
      throw error;
    }
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
  async deleteComponent(slug: string, componentName: string) {
    try {
      await Page.findOneAndUpdate(
        { slug },
        { $pull: { components: componentName } }, // Remove the specified component
        { new: true }
      );
      const result = await Page.findOneAndUpdate(
        { slug }, // Filter by slug
        {
          $unset: {
            [`components_props.${componentName}`]: "",
          },
        }, // Remove the specified component
        { new: true } // Return the updated document
      );

      if (!result) {
        console.log(`No component found with slug: ${slug}`);
        return null;
      }

      return result;
    } catch (error) {
      console.log(error);
    }
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
  async getCategoryById(_id: mongoose.Types.ObjectId) {
    const result = await Category.findOne({ _id });

    return result;
  }

  async getParentCategory(parent_id: string) {
    const result = await SubCategory.find({ parent_id }).select(
      "name slug total"
    );

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
