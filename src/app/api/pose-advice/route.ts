// src/app/api/pose-advice/route.ts

import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isHttpUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

async function downloadImageAsDataUrl(imageUrl: string): Promise<string> {
  if (!isHttpUrl(imageUrl)) {
    throw new Error('画像URLの形式が不正です。');
  }

  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`画像のダウンロードに失敗しました (${response.status})`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const contentType =
    response.headers.get('content-type') ?? 'image/jpeg';

  return `data:${contentType};base64,${buffer.toString('base64')}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('imageUrl');
  const title = searchParams.get('title') ?? '';

  if (!imageUrl) {
    return NextResponse.json({ error: '画像URLが必要です' }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'サーバー設定(OpenAI)が不完全です' }, { status: 500 });
  }

  const systemPrompt = `
    あなたは世界トップクラスのコスプレ撮影専門家であり、照明・カメラアングル・設定の専門家です。
    ユーザーが提供する「画像（イラスト）」を詳細に分析し、そのポーズをより魅力的、または効果的に撮影するための具体的なアドバイスを、初心者にも分かりやすい言葉で提供してください。
    [出力形式のルール]
    1. 出力はMarkdown形式にしてください。
    2. 以下の3つの見出し（★）を必ず含んでください。
        - ★推奨カメラアングル
        - ★カメラ設定の目安 (F値, シャッタースピード, ISO)
        - ★撮影時の構図・ポージングのヒント
    3. 各項目は画像から読み取れる特徴（例：腕の角度、体のひねり、表情）に基づいて具体的かつ実践的に解説してください。
    4. 全体の文字数は300〜500文字程度に収めてください。
  `;

  const userPrompt = title
    ? `次の画像を解析し、主に画像内容に基づいた撮影アドバイスを作成してください。参考タイトル: 「${title}」`
    : '次の画像を解析し、主に画像内容に基づいた撮影アドバイスを作成してください。';

  try {
    const imageDataUrl = await downloadImageAsDataUrl(imageUrl);

    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: [
          { type: 'text', text: userPrompt },
          {
            type: 'image_url',
            image_url: { url: imageDataUrl },
          },
        ],
      },
    ];

    const payload: OpenAI.ChatCompletionCreateParams = {
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages,
    };

    const completion = await openai.chat.completions.create(payload);

    const advice = completion.choices[0]?.message?.content?.trim();
    if (!advice) {
      throw new Error('OpenAI API から有効な応答が得られませんでした。');
    }

    return NextResponse.json({ advice });
  } catch (error) {
    console.error('OpenAI API 呼び出しエラー:', error);
    return NextResponse.json(
      { error: `OpenAI API 呼び出しエラー: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}