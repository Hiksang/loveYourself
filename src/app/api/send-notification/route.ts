import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { walletAddress, title, message, path } = await req.json();

  if (!walletAddress || !title || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const res = await fetch(
      "https://developer.worldcoin.org/api/v2/minikit/send-notification",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEV_PORTAL_API_KEY}`,
        },
        body: JSON.stringify({
          app_id: process.env.APP_ID,
          wallet_addresses: [walletAddress],
          localisations: [
            {
              language: "ko",
              title,
              message,
            },
          ],
          mini_app_path: path || `worldapp://mini-app?app_id=${process.env.APP_ID}&path=/orders`,
        }),
      }
    );

    if (res.ok) {
      return NextResponse.json({ status: "success" });
    }
    const error = await res.text();
    return NextResponse.json({ status: "error", error }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ status: "error", message: String(err) }, { status: 500 });
  }
}
