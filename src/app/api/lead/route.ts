export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.firstName || !body.phone || !body.consent) {
      return Response.json(
        { ok: false, error: 'Missing required fields or consent' },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.RETELL_WEBHOOK_URL || 'https://services.leadconnectorhq.com/hooks/8G7oorGsCPDIlU76HPkb/webhook-trigger/adb4ce69-59d4-4d82-aca0-6f1989c9b9b0';
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { ok: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
