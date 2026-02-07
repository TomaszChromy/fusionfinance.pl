import { Resend } from "resend";

const FROM_EMAIL = "FusionFinance <noreply@fusionfinance.pl>";

// Lazy initialization - only create client when API key is available
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
}

// Price alert notification
export async function sendPriceAlertEmail(
  email: string,
  symbol: string,
  condition: string,
  targetPrice: number,
  currentPrice: number
) {
  const resend = getResendClient();
  if (!resend) {
    console.log("Resend not configured, skipping price alert email");
    return { success: false, error: "Email not configured" };
  }

  try {
    const isAbove = condition === "above";
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `🔔 Alert cenowy: ${symbol} ${isAbove ? "powyżej" : "poniżej"} ${targetPrice}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #08090c; color: #f4f4f5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .content { background: #0c0d10; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 30px; text-align: center; }
            .alert-icon { font-size: 48px; margin-bottom: 20px; }
            h1 { color: #f4f4f5; font-size: 24px; margin-bottom: 10px; }
            .symbol { color: #c9a962; font-size: 32px; font-weight: bold; }
            .price { font-size: 28px; color: ${isAbove ? "#4ade80" : "#f87171"}; font-weight: bold; margin: 20px 0; }
            .condition { color: #a1a1aa; font-size: 14px; }
            .button { display: inline-block; background: linear-gradient(135deg, #c9a962 0%, #9a7b3c 100%); color: #08090c; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <div class="alert-icon">🔔</div>
              <h1>Alert cenowy!</h1>
              <div class="symbol">${symbol}</div>
              <div class="price">${currentPrice.toLocaleString("pl-PL")} PLN</div>
              <p class="condition">Cena ${isAbove ? "wzrosła powyżej" : "spadła poniżej"} ${targetPrice.toLocaleString("pl-PL")} PLN</p>
              <a href="https://fusionfinance.pl/alerty" class="button">Zarządzaj alertami</a>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Alert email error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Alert email send failed:", error);
    return { success: false, error };
  }
}

// Weekly digest email
// Newsletter-related emails usunięte – jedyny kanał kontaktu to email bezpośredni.
