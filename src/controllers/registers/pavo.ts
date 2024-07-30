import Pos from "../../models/Pos";
import UserDevice from "../../models/UserDevice";
import User from "../../models/User";
interface Result {
  Id: number;
  SaleNumber: string;
  IsOffline: boolean;
  TypeId: number;
  StatusId: number;
  GrossPrice: number;
  TotalPrice: number;
  TotalVATAmount: number;
  MerchantId: number;
  TerminalId: number;
  TerminalSerialNo: string;
  ApplicationId: number;
  MultiPayment: boolean;
  MultiDocument: boolean;
  GMUVersion: string;
  RefererApp: string;
  RefererAppVersion: string;
  NotificationPhone: string;
  SendPhoneNotification: boolean;
  NotificationEMail: string;
  SendEMailNotification: boolean;
  AddedSaleItems: SaleItem[];
  AddedPriceEffects: any[]; // Assuming this is an empty array, replace `any` with the appropriate type if needed
  AddedPayments: Payment[];
  FinancialDocuments: FinancialDocument[];
  SaleUid: string;
  IsInFlightSale: boolean;
  CancelRequested: boolean;
  Taxes: Tax[];
}

interface SaleItem {
  Id: number;
  StatusId: number;
  Name: string;
  ItemQuantity: number;
  UnitPriceAmount: number;
  GrossPriceAmount: number;
  TotalPriceAmount: number;
  VATAmount: number;
  VATRate: number;
  UnitName: string;
  TaxGroupId: number;
  IsGeneric: boolean;
  ConvertedTotal: number;
}

interface Payment {
  Id: number;
  SaleId: number;
  StatusId: number;
  MerchantId: number;
  PaymentAmount: number;
  PaymentTypeId: number;
  PaymentMediatorId: number;
  OperationTypeId: number;
  IsExternal: boolean;
  CashPayment: CashPayment;
  ConvertedTotal: number;
  MediatorPaymentReference: string;
}

interface CashPayment {
  Id: number;
  PaymentId: number;
  SaleId: number;
  GivenAmount: number;
  ChangeAmount: number;
}

interface FinancialDocument {
  Id: number;
  InvoiceNo: string;
  DocumentNo: string;
  Type: DocumentType;
}

interface DocumentType {
  Id: number;
  Name: string;
  Cancellable: boolean;
}

interface Tax {
  TaxRate: number;
  TotalTaxAmount: number;
  TotalAmount: number;
}
interface TicketEntity {
  name: string;
}
interface TicketOrder {
  id: number;
  uid: string;
  name: string;
  portion: string;
  priceTag: string;
  productId: string;
  quantity: number;
  price: number;
  user: string;
  calculatePrice: boolean;
  decreaseInventory: boolean;
  increaseInventory: boolean;
  states: [any];
  tags: [any];
}

interface TicketTag {
  tagName: string;
  tag: string;
}
interface Calculation {
  name: string;
  calculationAmount: number;
}

interface Ticket {
  id: string;
  type: string;
  remainingAmount: number;
  totalAmount: number;
  entities: TicketEntity[];
  orders: TicketOrder[];
  tags: TicketTag[];
  calculations: Calculation[];
}
interface PaymentMethod {
  id: string;
  name: string;
}
interface AddedSaleItems {
  Name: string;
  IsGeneric: boolean;
  UnitCode: string;
  TaxGroupCode: string;
  ItemQuantity: number;
  UnitPriceAmount: number;
  GrossPriceAmount: number;
  TotalPriceAmount: number;
  ReservedText?: string;
}
interface Sale {
  SelectedSlots: any[];
  AllowDismissCardRead: boolean;
  CardReadTimeout: number;
  SendResponseBeforePrint: boolean;
  ReceiptInformation: {
    ReceiptImageEnabled: boolean;
    ReceiptWidth: string;
    PrintCustomerReceipt: boolean;
    PrintMerchantReceipt: boolean;
  };
  PriceEffect?: any;
  RefererApp: string;
  RefererAppVersion: string;
  MainDocumentType: number;
  GrossPrice: number;
  TotalPrice: number;
  SendPhoneNotification: boolean;
  SendEMailNotification: boolean;
  NotificationPhone: string;
  NotificationEMail: string;
  ShowCreditCardMenu: boolean;
  CurrencyCode: string;
  ExchangeRate: number;
  AddedSaleItems: AddedSaleItems[];
  PaymentInformations: {
    Mediator: number;
    Amount: number;
    CurrencyCode: string;
    ExchangeRate: number;
  }[];
  AdditionalInfo: {
    Key: string;
    Value: string;
    Print: boolean;
  }[];
}

interface CustomerParty {
  CustomerType: number;
  FirstName: string;
  MiddleName: string | null;
  FamilyName: string | null;
  CompanyName: string;
  TaxOfficeCode: string;
  TaxNumber: string;
  Phone: string | null;
  EMail: string | null;
  Country: string;
  City: string;
  District: string;
  Neighborhood: string | null;
  Address: string | null;
}

interface RootObject {
  Sale: Sale;
  CustomerParty?: CustomerParty | {};
}
interface User {
  name: string;
  email: string;
  terminal: {
    name: string;
  };
  token: string;
  _id: string;
}
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

interface Calculation {
  name: string;
  calculationAmount: number;
}

class Pavo {
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

  methodParamsMap: { [key: string]: string[] } = {
    getSaleInfo: ["ticket", "amount", "user", "paymentMethod"],
    setSale: ["sale", "user"],
    checkDevice: ["deviceId"],
    saveDevice: ["deviceId", "user"],
  };

  async checkDevice(deviceId: string) {
    const device = await UserDevice.findOne({ deviceId });
    let user = null;
    if (device !== null) {
      user = await User.findOne({ _id: device.user_id });
      if (user) {
        user.deviceId = deviceId;
      }
    }
    return { success: device !== null, user };
  }

  async saveDevice(deviceId: string, user_id: string) {
    try {
      await UserDevice.updateOne(
        { deviceId },
        { user_id, deviceId },
        { upsert: true }
      );
      const getUser = await User.findOne({ _id: user_id });
      if (getUser) {
        getUser.deviceId = deviceId;
      }

      return { success: true, user: getUser };
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  areAllInArray(array: any, values: []): boolean {
    return values.every((value) => array.includes(value));
  }
  async setHandleSale(sale: any, user: User) {
    await Pos.updateOne({ user }, { $set: { transactions: sale } });
  }
  async setSale(sale: any, user: User) {
    console.log(sale, user, "setSale");

    await Pos.updateOne({ user }, { $set: { transactions: sale } });

    let allStatues: { [key: number]: string } = {
      1: "Satış askıya alındı",
      2: "Ödeme bekliyor",
      3: "Döküman oluşturuluyor",
      4: "Döküman bekleniyor",
      5: "Döküman oluşturuldu",
      6: "Tamamlandı",
      7: "Satıştan vazgeçildi",
      9: "Döküman oluştırulamadı",
      10: "İmzalanıyor",
      11: "İmzalama işlemi başarısız",
      12: "İptal edildi",
      13: "Ödemeler iptal ediliyor",
      14: "Ödemeler iptal edildi",
      15: "Ödeme iptali geerçekleştirilemedi",
      16: "Döküman iptal ediliyor",
      17: "Döküman iptlai gerçekleştirilemedi",
      18: "Döküman iptali bekleniyor",
      19: "İmzalandı",
      20: "ERP operasyonlarında",
      21: "Döküman onaylandı",
      22: "Döküman onaylanmadı",
      23: "Inspection bekleniyor",
      24: "Tamamlanmamış satış",
    };
    let successStatues = [4, 6, 21];
    return {
      success: successStatues.includes(sale.sale.StatusId),
      error: allStatues[sale.StatusId],
    };
  }
  installmentPayment(
    amount: string | number,
    calculationAmount: number
  ): AddedSaleItems[] {
    let price = typeof amount != "number" ? parseFloat(amount) : amount;
    return [
      {
        Name: "Yemek",
        IsGeneric: false,
        UnitCode: "C62",
        TaxGroupCode: "KDV10",
        ItemQuantity: 1,
        UnitPriceAmount: price + calculationAmount,
        GrossPriceAmount: price + calculationAmount,
        TotalPriceAmount: price + calculationAmount,
      },
    ];
  }
  allPayment(ticket: Ticket): AddedSaleItems[] {
    return ticket.orders.map((order: TicketOrder) => {
      return {
        Name: order.name,
        IsGeneric: false,
        UnitCode: "C62",
        TaxGroupCode: "KDV10",
        ItemQuantity: order.quantity,
        UnitPriceAmount: order.price,
        GrossPriceAmount: order.price * order.quantity,
        TotalPriceAmount: order.price * order.quantity,
      };
    });
  }
  paymentInformation(
    ticket: Ticket,
    amount: number,
    paymentMethod: PaymentMethod
  ) {
    let payments: { [key: string]: number } = {};
    payments["Nakit"] = 1;
    payments["Kredi Kartı"] = 2;

    let info = {
      Mediator: payments[paymentMethod["name"]],
      Amount:
        ticket.remainingAmount == ticket.totalAmount &&
        amount == ticket.totalAmount
          ? ticket.totalAmount
          : amount,
      CurrencyCode: "TRY",
      ExchangeRate: 1.0,
    };

    return info;
  }

  findGrossPrice(ticket: Ticket, price: number, calculations: Calculation[]) {
    let calculationAmount = 0;

    if (
      calculations.length > 0 &&
      ticket.remainingAmount === ticket.totalAmount
    ) {
      calculationAmount = calculations.reduce(
        (sum, item) => sum + Math.abs(item.calculationAmount),
        0
      );
    }

    if (
      ticket.remainingAmount === ticket.totalAmount &&
      price == ticket.totalAmount
    ) {
      if (calculations.length > 0) {
        const calculationAmount: number = calculations.reduce(
          (sum, item) => sum + Math.abs(item.calculationAmount),
          0
        );

        return ticket.totalAmount + calculationAmount;
      } else {
        return ticket.totalAmount;
      }
    } else {
      return price + calculationAmount;
    }
  }

  findTotalPrice(ticket: Ticket, price: number) {
    return ticket.remainingAmount == ticket.totalAmount &&
      price == ticket.totalAmount
      ? ticket.totalAmount
      : price;
  }
  async getSaleInfo(
    ticket: Ticket,
    amount: string | number,
    user: User,
    paymentMethod: PaymentMethod
  ) {
    try {
      const price = typeof amount === "string" ? parseFloat(amount) : amount;
      let content: RootObject = {
        Sale: {
          SelectedSlots: [],
          AllowDismissCardRead: true,
          CardReadTimeout: 60,
          SendResponseBeforePrint: false,
          ReceiptInformation: {
            ReceiptImageEnabled: true,
            ReceiptWidth: "58mm",
            PrintCustomerReceipt: true,
            PrintMerchantReceipt: true,
          },

          RefererApp: "PosEntegra",
          RefererAppVersion: "1",
          MainDocumentType: 1,
          GrossPrice: this.findGrossPrice(ticket, price, ticket.calculations),
          TotalPrice: this.findTotalPrice(ticket, price),
          SendPhoneNotification: false,
          SendEMailNotification: true,
          NotificationPhone: "",
          NotificationEMail: "meinfo@myinfo.dev",
          ShowCreditCardMenu: false,

          CurrencyCode: "TRY",
          ExchangeRate: 1.0,

          AddedSaleItems: [],

          PaymentInformations: [],

          AdditionalInfo: [],
        },
        CustomerParty: {},
      };
      let calculationAmount = 0;
      if (
        ticket.calculations.length > 0 &&
        ticket.remainingAmount === ticket.totalAmount
      ) {
        calculationAmount = ticket.calculations.reduce(
          (sum, item) => sum + Math.abs(item.calculationAmount),
          0
        );
        content.Sale.PriceEffect = {
          Type: 2,
          Amount: calculationAmount,
          rate: null,
        };
      }
      const orders =
        ticket.remainingAmount == ticket.totalAmount &&
        price == ticket.totalAmount
          ? await this.allPayment(ticket)
          : await this.installmentPayment(amount, calculationAmount);

      const information = this.paymentInformation(ticket, price, paymentMethod);
      content.Sale.PaymentInformations.push(information);
      content.Sale.AddedSaleItems = orders;

      /*content.Sale.AdditionalInfo.push({
        Key: "type remaining",
        Value: `${typeof ticket.remainingAmount}`,
        Print: false,
      });*/
      await this.setHandleSale(content, user);
      return content;
    } catch (error) {
      return error;
    }
  }
}

export default Pavo;
