import { NextRequest, NextResponse } from 'next/server';
import { messageService } from '@/lib/database';
import { resendService } from '@/lib/resendService';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, subject } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Save message to database
    const savedMessage = await messageService.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      subject: subject?.trim() || undefined,
    });

    // Send email notifications
    try {
      // Send notification to admin
      await resendService.sendContactNotification({
        name: savedMessage.name,
        email: savedMessage.email,
        message: savedMessage.message,
        subject: savedMessage.subject,
      });

      // Send auto-reply to user
      await resendService.sendAutoReply({
        name: savedMessage.name,
        email: savedMessage.email,
        message: savedMessage.message,
        subject: savedMessage.subject,
      });
    } catch (emailError) {
      console.error('Email service error:', emailError);
      // Don't fail the request if email fails
    }
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully! I\'ll get back to you soon.',
        id: savedMessage.id 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
