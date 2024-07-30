import * as mongoose from "mongoose";
import Pos from "../../../models/Pos";

interface Terminal {
  user: string;
  ticketType: string;
  terminal: string;
  department: string;
}

const asyncForeach = async (array: any, callback: any) => {
  for (const item of array) {
    await callback(item);
  }
};

interface Environment {
  _id?: mongoose.Types.ObjectId;
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
interface Message {
  data?: any;
  [key: string]: string;
}
interface Error {
  [key: string]: string | string;
}

class Samba {
  public env: Environment;
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
  private errorResult(e: Error, q?: string) {
    return false;
  }
  getMessage(message: Message, key?: string): any {
    const result =
      key && message.data && message.data[key] ? message.data[key] : message;
    return key ? result : message;
  }

  isTokenExpired(expiredAt: number, expiresIn: number): boolean {
    const currentDate = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds
    const expired = expiredAt + expiresIn; // Expiration timestamp in seconds
    console.log(currentDate, expired, expiredAt);
    return currentDate >= expired;
  }
  async getUser(user: string) {
    const pos = Pos.findOne({ user });
    return pos;
  }

  async refreshToken() {
    const url = `${this.env.host}/Token`;
    const formBody: string = Object.entries({
      grant_type: "refresh_token",
      username: this.env.username,
      password: this.env.password,
      refresh_token: this.env.refresh_token,
      client_id: this.env.client_id,
      client_secret:
        this.env.client_secret == ""
          ? this.env.password
          : this.env.client_secret,
    })
      .map(
        ([key, value]) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(value)
      )
      .join("&");
    console.log("refresh refresg");
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody,
      });

      const responseData = await response.json();
      if (responseData.error) {
        let login = await this.login();
        return login;
      }
      responseData.expired_at = Date.now();
      this.env = responseData;

      return responseData;
    } catch (e) {
      async () => {
        console.log("login catch");
        await this.login();
      };

      //return this.errorResult(e);
    }
  }

  async login() {
    const url = `${this.env.host}/Token`;
    console.log(
      url,
      {
        grant_type: "password",
        username: this.env.username,
        password: this.env.password,
        client_id: this.env.client_id,
        client_secret: this.env.client_secret,
      },
      "login"
    );
    const formBody: string = Object.entries({
      grant_type: "password",
      username: this.env.username,
      password: this.env.password,
      client_id: this.env.client_id,
      client_secret: this.env.client_secret,
    })
      .map(
        ([key, value]) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(value)
      )
      .join("&");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody,
      });

      const responseData = await response.json();
      responseData.expired_at = Date.now();
      if (responseData.error) {
        return `ERROR SAMBA LOGIN: ${responseData.error}`;
      } else {
        console.log(responseData, this.env, "logins");
        this.env["access_token"] = responseData["access_token"];
        this.env["refresh_token"] = responseData["refresh_token"];
        this.env["expires_in"] = responseData["expires_in"];
        this.env["expired_at"] = responseData["expired_at"];
        console.log({ user: this.env.user }, "user");
        await Pos.updateOne(
          { user: this.env.user },
          {
            $set: {
              access_token: responseData["access_token"],
              refresh_token: responseData["refresh_token"],
              expires_in: responseData["expires_in"],
              expired_at: responseData["expired_at"],
            },
          }
        );
        return responseData;
      }
    } catch (e: any) {
      console.log(e, "error");
      return this.errorResult(e);
    }
  }

  async query(q: string) {
    q = q.replace(/\\/g, "").trim();

    try {
      const response = await fetch(`${this.env.host}/api/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.env.access_token}`,
        },
        body: JSON.stringify({
          query: q,
          variables: null,
          operationName: "m",
        }),
      });

      const responseData = await response.json();
      if (responseData["message"]) {
        if (
          responseData["message"] ==
          "Authorization has been denied for this request."
        ) {
          await this.login();
          console.log("login olamadi");
          return false;
        }
      }
      return responseData;
    } catch (e: any) {
      return this.errorResult(e, q);
    }
  }
  async queryWithText(q: string): Promise<any> {
    try {
      const response = await fetch(`${this.env.host}/api/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.env.access_token}`,
        },
        body: JSON.stringify({
          query: q,
          variables: null,
          operationName: "",
        }),
      });
      console.log(q, "qq");
      const responseData = await response.json();
      if (responseData["message"]) {
        if (
          responseData["message"] ==
          "Authorization has been denied for this request."
        ) {
          await this.login();
          console.log("login olamadi");
          return false;
        }
      }
      return responseData;
    } catch (e: any) {
      const login = await this.login();
      if (login === false) {
        return [];
      }
      return this.queryWithText(q);
    }
  }
  async loadTerminalTicket(terminalId: string, ticketId: string) {
    const query = `mutation m {
        loadTerminalTicket(terminalId: "${terminalId}", ticketId: "${ticketId}") {
            id
            totalAmount
            remainingAmount
            type
            payments{
              name
              amount
            }
            note
            states {
                state
                stateName
              }
            tags{
              tag
              tagName
            }
            calculations {
                name
                calculationAmount
              }
            orders {
              uid
              productId
              name
              quantity
              portion
              price
              priceTag
              calculatePrice
              increaseInventory
              decreaseInventory
              
              tags {
                tag
                tagName
                price
                quantity
                rate
                userId
              }
              states {
                stateName
                state
                stateValue
              }
          }
        }
      }`;
    console.log(query);
    const result = await this.query(query);
    return this.getMessage(result, "loadTerminalTicket");
  }
  async registerTerminal({ user, ticketType, terminal, department }: Terminal) {
    const query = `mutation m {registerTerminal(user: "${user}", ticketType: "${ticketType}", terminal: "${terminal}", department: "${department}")}`;
    console.log(query);
    const result = await this.query(query);
    return await this.getMessage(result, "registerTerminal");
  }
  async closeTerminalTicket(terminalId: string) {
    const query = `mutation m {closeTerminalTicket(terminalId:"${terminalId}")}`;
    console.log(query);
    const result = await this.query(query);
    return await this.getMessage(result, "closeTerminalTicket");
  }

  async payTerminalTicket(
    ticketId: string,
    registerTerminal: Terminal,
    paymentTypeName: string,
    description: string,
    amount: number
  ) {
    const terminalId = await this.registerTerminal(registerTerminal);
    await this.loadTerminalTicket(terminalId, ticketId);

    const query = `mutation m {
            payTerminalTicket(terminalId: "${terminalId}", 
            paymentTypeName: "${paymentTypeName}", 
            description: "${description}", 
            executePaymentProcessors: false, 
            amount: ${amount}) {
            remainingAmount
            errorMessage
          }
      }`;
    console.log(query);
    const result = await this.query(query);
    let close = await this.closeTerminalTicket(terminalId);
    console.log(close, terminalId);
    return await this.getMessage(result, "payTerminalTicket");
  }

  async unregisterTerminal(terminalId: string): Promise<string> {
    const query = `mutation m {unregisterTerminal(terminalId:"${terminalId}")}`;
    const result = await this.query(query);
    return await this.getMessage(result, "unregisterTerminal");
  }

  async getCustomReportWithName(name: string) {
    const query = `{
            getCustomReport(name:"${name}") {
              name
              header
              tables {
                columns {
                  header
                }
                name
                rows {
                  cells
                }
              }
              startDate
              endDate
            }
        
          }`;

    const result = await this.queryWithText(query);
    return await this.getMessage(result, "getCustomReport");
  }
  async getUserByPin(pin: string) {
    const query = `{
            getUser(pin: "${pin}") {
                name
                terminal {
                 name
                }
                userRole {
                  name
                }
              }
            
          }`;

    const result = await this.queryWithText(query);
    return await this.getMessage(result, "getUser");
  }
  async getTicket(ticketId: string | number) {
    const query = `{
            getTicket(id: ${
              typeof ticketId == "string" ? parseFloat(ticketId) : ticketId
            }) {
              id
              type
              remainingAmount
              totalAmount
              calculations {
                name
                calculationAmount
              }
              entities {
                name
              }
              orders {
                productId
                name
                portion
                quantity
                price
                user
                calculatePrice
                states {
                  stateName
                  state
                }
            }
              tags {
                tagName
                tag
              }
              
            }
        }`;

    const result = await this.queryWithText(query);
    return await this.getMessage(result, "getTicket");
  }
  async getTickets() {
    const query = `{
            getTickets(isClosed: false) {
              id
              type
              remainingAmount
              entities {
                name
              }
            }
          }`;

    const result = await this.queryWithText(query);
    return await this.getMessage(result, "getTickets");
  }
}
export default Samba;
