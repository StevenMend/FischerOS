// supabase/functions/send-demo-request/index.ts
// Pure Gmail SMTP — no external services, no domain needed
// Sends: 1) confirmation to prospect 2) notification to business

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

// ── Disposable email domains ────────────────────────────────────────
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "tempmail.com", "throwaway.email",
  "yopmail.com", "sharklasers.com", "grr.la", "temp-mail.org",
  "fakeinbox.com", "trashmail.com", "maildrop.cc", "getnada.com",
  "10minutemail.com", "mohmal.com", "burnermail.io", "mailsac.com",
]);

// ── CORS ────────────────────────────────────────────────────────────
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ── Validation ──────────────────────────────────────────────────────
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return DISPOSABLE_DOMAINS.has(domain);
}

// ── Email HTML templates ────────────────────────────────────────────
function confirmationHtml(name: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px">
    <div style="background:#1a2744;border-radius:16px 16px 0 0;padding:32px;text-align:center">
      <div style="width:48px;height:48px;background:rgba(255,255,255,0.15);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px">
        <span style="color:#fff;font-weight:bold;font-size:20px">F</span>
      </div>
      <h1 style="color:#fff;margin:0;font-size:24px">Thanks for your interest!</h1>
    </div>
    <div style="background:#fff;border-radius:0 0 16px 16px;padding:32px;border:1px solid #e5e7eb;border-top:0">
      <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 20px">Hi ${name},</p>
      <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 20px">
        We received your demo request for <strong>FischerOS</strong>. Our team will reach out within 24 hours to schedule a personalized walkthrough.
      </p>
      <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 8px;font-weight:600">What to expect:</p>
      <ul style="color:#6b7280;font-size:14px;line-height:1.8;margin:0 0 24px;padding-left:20px">
        <li>A quick 30-minute live demo tailored to your property</li>
        <li>Q&A with our hospitality tech team</li>
        <li>Custom pricing based on your needs</li>
      </ul>
      <p style="color:#374151;font-size:16px;line-height:1.6;margin:0">
        Talk soon,<br><strong>The FischerOS Team</strong>
      </p>
    </div>
    <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:24px">FischerOS — Hotel operations, simplified.</p>
  </div>
</body>
</html>`;
}

function notificationHtml(data: {
  name: string; email: string; company: string;
  rooms?: number; message?: string; created_at: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px">
    <div style="background:#1a2744;border-radius:16px 16px 0 0;padding:24px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:20px">New Demo Request</h1>
    </div>
    <div style="background:#fff;border-radius:0 0 16px 16px;padding:24px;border:1px solid #e5e7eb;border-top:0">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px 12px;color:#6b7280;border-bottom:1px solid #f3f4f6;font-weight:600">Name</td><td style="padding:8px 12px;color:#111827;border-bottom:1px solid #f3f4f6">${data.name}</td></tr>
        <tr><td style="padding:8px 12px;color:#6b7280;border-bottom:1px solid #f3f4f6;font-weight:600">Email</td><td style="padding:8px 12px;color:#111827;border-bottom:1px solid #f3f4f6"><a href="mailto:${data.email}">${data.email}</a></td></tr>
        <tr><td style="padding:8px 12px;color:#6b7280;border-bottom:1px solid #f3f4f6;font-weight:600">Company</td><td style="padding:8px 12px;color:#111827;border-bottom:1px solid #f3f4f6">${data.company}</td></tr>
        <tr><td style="padding:8px 12px;color:#6b7280;border-bottom:1px solid #f3f4f6;font-weight:600">Rooms</td><td style="padding:8px 12px;color:#111827;border-bottom:1px solid #f3f4f6">${data.rooms ?? "—"}</td></tr>
        <tr><td style="padding:8px 12px;color:#6b7280;font-weight:600;vertical-align:top">Message</td><td style="padding:8px 12px;color:#111827">${data.message || "—"}</td></tr>
      </table>
      <p style="color:#9ca3af;font-size:12px;margin:16px 0 0;text-align:right">${data.created_at}</p>
    </div>
  </div>
</body>
</html>`;
}

// ── Main handler ────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, email, company, rooms, message } = await req.json();

    // ── Validate ──────────────────────────────────────────────────
    const errors: string[] = [];
    if (!name?.trim()) errors.push("Name is required");
    if (!email?.trim()) errors.push("Email is required");
    else if (!isValidEmail(email)) errors.push("Invalid email format");
    else if (isDisposableEmail(email)) errors.push("Please use a business or personal email");
    if (!company?.trim()) errors.push("Company name is required");

    if (errors.length > 0) {
      return new Response(JSON.stringify({ error: errors.join(", ") }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Insert into DB ────────────────────────────────────────────
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanCompany = company.trim();
    const cleanRooms = rooms ? parseInt(rooms, 10) : null;
    const cleanMessage = message?.trim() || null;

    const { error: dbError } = await supabase.from("demo_requests").insert({
      name: cleanName,
      email: cleanEmail,
      company: cleanCompany,
      rooms: cleanRooms,
      message: cleanMessage,
    });

    if (dbError) {
      console.error("DB insert error:", dbError);
      return new Response(JSON.stringify({ error: "Failed to save request" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Send emails via Gmail SMTP ────────────────────────────────
    const gmailUser = Deno.env.get("GMAIL_USER");
    const gmailPass = Deno.env.get("GMAIL_APP_PASSWORD");
    const notifyEmail = Deno.env.get("NOTIFY_EMAIL") || gmailUser;
    const now = new Date().toISOString();

    if (gmailUser && gmailPass) {
      const client = new SMTPClient({
        connection: {
          hostname: "smtp.gmail.com",
          port: 465,
          tls: true,
          auth: {
            username: gmailUser,
            password: gmailPass,
          },
        },
      });

      try {
        // Email 1: Confirmation to prospect
        await client.send({
          from: `FischerOS <${gmailUser}>`,
          to: cleanEmail,
          subject: "Thanks for requesting a FischerOS demo!",
          content: "auto",
          html: confirmationHtml(cleanName),
        });

        // Email 2: Notification to business
        await client.send({
          from: `FischerOS Leads <${gmailUser}>`,
          to: notifyEmail!,
          subject: `New Demo Request: ${cleanCompany}`,
          content: "auto",
          html: notificationHtml({
            name: cleanName,
            email: cleanEmail,
            company: cleanCompany,
            rooms: cleanRooms ?? undefined,
            message: cleanMessage ?? undefined,
            created_at: now,
          }),
        });
      } catch (emailErr) {
        console.error("Email send error:", emailErr);
        // Don't fail the request — DB insert succeeded
      } finally {
        await client.close();
      }
    } else {
      console.warn("GMAIL_USER or GMAIL_APP_PASSWORD not set — skipping emails");
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Unhandled error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
