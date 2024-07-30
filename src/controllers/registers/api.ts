import Samba from "./libs/samba";
import QueryFilter from "./libs/queryFilter";

function toCamelCase(str: string): string {
  let newStr = str
    .replace(/-./g, (match) => match.charAt(1).toUpperCase()) // Capitalize letter after dash
    .replace(/\s./g, (match) => match.charAt(1).toUpperCase()) // Capitalize letter after space
    .replace(/[^a-zA-Z0-9]/g, ""); // Remove non-alphanumeric characters

  return newStr.charAt(0).toLowerCase() + newStr.slice(1);
}

function convertText(input: string): string {
  const [prefix, ...rest] = input.split("-");
  const camelCasedRest = toCamelCase(rest.join(" "));
  return camelCasedRest;
}

const asyncForeach = async (array: any, callback: any) => {
  for (const item of array) {
    await callback(item);
  }
};

interface Environment {
  id?: string;
  host: string;
  user: string;
  grant_type: string;
  username: string;
  password: string;
  client_id: string;
  client_secret: string;
  refresh_token: string;
  access_token: string;
  expires_in: number;
  expired_at: number;
}
interface Terminal {
  user: string;
  ticketType: string;
  terminal: string;
  department: string;
}

class Api {
  public env: Environment;
  public methodParamsMap: { [key: string]: string[] } = {
    getCustomReportWithName: ["name"],
    getUserByPin: ["pin"],
    getTicket: ["ticketId"],
    getTickets: [],
    payTerminalTicket: [
      "ticketId",
      "registerTerminal",
      "paymentTypeName",
      "description",
      "amount",
    ],
    refreshTicket: ["ticketId", "registerTerminal"],
    saveTransaction: ["transactions"],
  };
  constructor() {
    this.env = {
      host: "YOUR_HOST",
      id: "",
      user: "",
      grant_type: "password",
      username: "YOUR_USERNAME",
      password: "YOUR_PASSWORD",
      client_id: "YOUR_CLIENT_ID",
      client_secret: "YOUR_CLIENT_SECRET",
      refresh_token: "",
      access_token: "",
      expires_in: 0,
      expired_at: Date.now(),
    };
  }

  async saveTransaction(transactions: any, user: string) {
    // await Pos.updateOne({ user }, { $set: { transactions } });
  }

  async getCustomReportWithName(name: string) {
    const samba = new Samba();
    samba.env = this.env;
    const data = await samba.getCustomReportWithName(name);
    const queryFilter = new QueryFilter();
    return await queryFilter.paymentTypes(data);
  }
  async getUserByPin(pin: string) {
    const samba = new Samba();
    samba.env = this.env;
    const data = await samba.getUserByPin(pin);
    return data;
  }
  async getTicket(ticketId: string) {
    const samba = new Samba();
    samba.env = this.env;
    const data = await samba.getTicket(ticketId);
    return { result: data };
  }
  async getTickets() {
    const samba = new Samba();
    samba.env = this.env;
    const data = await samba.getTickets();
    return { result: data };
  }

  async payTerminalTicket(
    ticketId: string,
    registerTerminal: Terminal,
    paymentTypeName: string,
    description: string,
    amount: number
  ) {
    const samba = new Samba();
    samba.env = this.env;
    const data = await samba.payTerminalTicket(
      ticketId,
      registerTerminal,
      paymentTypeName,
      description,
      amount
    );
    return data;
  }

  async refreshTicket(ticketId: string, registerTerminal: Terminal) {
    const samba = new Samba();
    samba.env = this.env;
    const terminalId = await samba.registerTerminal(registerTerminal);
    const data = await samba.loadTerminalTicket(terminalId, ticketId);

    return data;
  }
}

export default Api;
