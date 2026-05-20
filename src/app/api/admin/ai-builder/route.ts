import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { prompt, page } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
  }

  const client = new Anthropic({ apiKey });

  const systemPrompt = `You are an expert web developer helping update the Vegas Born Roofing website.

BUSINESS DETAILS:
- Company: Vegas Born Roofing LLC
- Phone: (702) 876-2630
- Address: 4205 W Tompkins Ave, Suite 6, Las Vegas, NV 89103
- Hours: Mon-Fri 7:30 AM - 4:00 PM
- Services: Commercial roofing, residential roofing, sheet metal fabrication, property management services
- Licensed: NV #0084099, UT #12307984-5501, AZ #350069
- Service areas: Las Vegas, Henderson, Summerlin, North Las Vegas, Boulder City, Pahrump, Mesquite, Laughlin

COLOR SCHEME:
- Primary red: #b91c1c (hover: #991b1b)
- Gold accent: #d4a843
- Dark background: #111827
- Gray text: #374151

TECH STACK:
- Next.js 15 with App Router and TypeScript
- Tailwind CSS v4
- next/image for images, next/link for links

RULES:
- Output ONLY the JSX code for the page content (no imports, no metadata export, no default export wrapper)
- Use Tailwind CSS classes for all styling
- Use semantic HTML (section, article, nav, etc.)
- Include proper alt text on all images
- Make all content SEO-friendly with proper heading hierarchy
- Ensure mobile-responsive design
- Use the exact color values listed above`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Page: ${page || 'general'}\n\nRequest: ${prompt}`,
        },
      ],
    });

    const content = message.content[0];
    const text = content.type === 'text' ? content.text : '';

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error('AI Builder error:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
