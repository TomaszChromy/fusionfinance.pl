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

// Welcome email after newsletter subscription
export async function sendWelcomeEmail(email: string) {
  const resend = getResendClient();
  if (!resend) {
    console.log("Resend not configured, skipping welcome email");
    return { success: false, error: "Email not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Witamy w FusionFinance! 📈",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #08090c; color: #f4f4f5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .logo { text-align: center; margin-bottom: 30px; }
            .logo span { font-size: 28px; color: #c9a962; font-weight: bold; }
            .content { background: #0c0d10; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 30px; }
            h1 { color: #f4f4f5; font-size: 24px; margin-bottom: 20px; }
            p { color: #a1a1aa; line-height: 1.6; margin-bottom: 16px; }
            .highlight { color: #c9a962; }
            .button { display: inline-block; background: linear-gradient(135deg, #c9a962 0%, #9a7b3c 100%); color: #08090c; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #52525b; font-size: 12px; }
            .divider { height: 1px; background: linear-gradient(to right, transparent, rgba(201, 169, 98, 0.3), transparent); margin: 24px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <span>Fusion</span><span class="highlight">Finance</span>
            </div>
            <div class="content">
              <h1>Dziękujemy za subskrypcję! 🎉</h1>
              <p>Witamy w społeczności <span class="highlight">FusionFinance</span> - Twojego źródła najważniejszych wiadomości finansowych.</p>
              <div class="divider"></div>
              <p>Od teraz będziesz otrzymywać:</p>
              <ul style="color: #a1a1aa; line-height: 2;">
                <li>📰 Cotygodniowy przegląd najważniejszych wydarzeń</li>
                <li>📈 Analizy rynkowe i trendy</li>
                <li>💡 Ekskluzywne porady inwestycyjne</li>
                <li>🔔 Alerty o ważnych zmianach na rynku</li>
              </ul>
              <div class="divider"></div>
              <p style="text-align: center;">
                <a href="https://fusionfinance.pl" class="button">Odwiedź portal</a>
              </p>
            </div>
            <div class="footer">
              <p>© 2025 FusionFinance.pl - Wszystkie prawa zastrzeżone</p>
              <p>Otrzymujesz tę wiadomość, ponieważ zapisałeś się do naszego newslettera.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Email error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email send failed:", error);
    return { success: false, error };
  }
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
export async function sendWeeklyDigest(email: string, articles: { title: string; url: string }[]) {
  const resend = getResendClient();
  if (!resend) {
    console.log("Resend not configured, skipping weekly digest");
    return { success: false, error: "Email not configured" };
  }

  const articlesList = articles
    .slice(0, 10)
    .map((a) => `<li style="margin-bottom: 12px;"><a href="${a.url}" style="color: #c9a962; text-decoration: none;">${a.title}</a></li>`)
    .join("");

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `📊 Twój tygodniowy przegląd FusionFinance`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', sans-serif; background: #08090c; color: #f4f4f5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .content { background: #0c0d10; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 30px; }
            h1 { color: #f4f4f5; font-size: 24px; }
            ul { padding-left: 20px; color: #a1a1aa; line-height: 1.8; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <h1>📰 Top artykuły tego tygodnia</h1>
              <ul>${articlesList}</ul>
              <p style="text-align: center; margin-top: 30px;">
                <a href="https://fusionfinance.pl" style="display: inline-block; background: #c9a962; color: #08090c; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Zobacz więcej</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) return { success: false, error };
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

