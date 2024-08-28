import Api from "./registers/api";
import Auth from "./registers/auth";

const classRegistry: { [key: string]: any } = {
  Api,
  Auth,
};

export default classRegistry;
