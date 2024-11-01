import { auth } from '@/auth';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { isValidUrl } from '@/lib/utils';

export async function GET(req: NextRequest) {
  const failRes = { success: 0 };
  const session = await auth();
  if (!session) {
    console.log('/parse/link failed: no session', session);
    return NextResponse.json(failRes);
  }
  const userId = session?.user?.id;
  if (!userId) {
    console.log('/parse/link failed: no userId');
    return NextResponse.json(failRes);
  }
  const url = req.nextUrl.searchParams.get('url');
  if (!isValidUrl(url || '')) {
    console.log('/parse/link failed: not valid url: ', url);
    return NextResponse.json(failRes);
  }

  try {
    const res = await axios.get(url!);
    const hostname = new URL(url!).hostname;
    console.log('res is: ', res.data);
    const $ = cheerio.load(res.data);
    let title: string | null = $('head > title').text();
    let description: string | undefined = $('meta[name="description"]').attr(
      'content'
    );
    let image: string | undefined = $('meta[property="og:image"]').attr(
      'content'
    );
    return NextResponse.json({
      success: 1,
      meta: {
        title: title || hostname,
        description: description || url,
        image: image ? { url: image } : 'No Image',
      },
    });
  } catch (e) {
    console.log(`parese link ${url} failed: `, e);
    return NextResponse.json(failRes);
  }
}
