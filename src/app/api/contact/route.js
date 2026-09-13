import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { sendContactNotification, sendContactConfirmation } from '@/lib/ses';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await adminDb.collection('contact_submissions').add({
      name,
      email,
      phone: phone ?? '',
      subject: subject ?? '',
      message,
      status: 'new',
      createdAt: new Date().toISOString(),
    });

    const [notification, confirmation] = await Promise.allSettled([
      sendContactNotification({ name, email, phone, subject, message }),
      sendContactConfirmation({ name, email }),
    ]);
    if (notification.status === 'rejected') console.error('Contact notification email error:', notification.reason);
    if (confirmation.status === 'rejected') console.error('Contact confirmation email error:', confirmation.reason);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
