import Api from "./registers/api";
import Auth from "./registers/auth";
import Sitemap from "./registers/sitemap";

const classRegistry: { [key: string]: any } = {
  Api,
  Auth,
  Sitemap,
};

export default classRegistry;
