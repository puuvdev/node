import * as axios from "axios";

class NotificationController {
  public sendTextNotification(
    notify: { message: string; title: string },
    externalId: string
  ): void {
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Basic ${process.env.ONESIGNALREST}`,
    };

    const body = {
      app_id: process.env.ONESIGNALID,
      contents: { en: notify.message },
      headings: { en: notify.title },
      data: notify,
      target_channel: "push",
      // 'included_segments': ['Bildirim'],
      include_aliases: { external_id: [externalId] },
    };

    axios.default
      .post("https://onesignal.com/api/v1/notifications", body, { headers })
      .then((response) => {
        return { success: true, data: response.data };
      })
      .catch((error) => {
        return { success: false, error: error.message };
      });
  }
}

export default NotificationController;
