type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<{ id: string } | null> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Kanavto <noreply@kanavto.com>";

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.log(`📧 [DEV-MODE EMAIL] To: ${to}\nSubject: ${subject}\n${text || stripHtml(html)}`);
      return { id: "dev-mock" };
    }
    return null;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ from, to, subject, html, text: text || stripHtml(html) }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Resend error:", response.status, error);
    return null;
  }

  return (await response.json()) as { id: string };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}
