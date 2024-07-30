import Api from "./registers/api";
import Pavo from "./registers/pavo";

const classRegistry: { [key: string]: any } = {
  Api,
  Pavo,
};

export default classRegistry;
