import { GoogleGenAI, Modality } from "@google/genai";

// Hàm này được định nghĩa cho môi trường Vercel Edge Function
// Bạn có thể điều chỉnh nó cho phù hợp với môi trường serverless của mình
export const config = {
  runtime: 'edge',
};

// Hàm trợ giúp để chuyển đổi File thành định dạng mà Gemini API yêu cầu
const fileToGenerativePart = async (file: File) => {
    const buffer = await file.arrayBuffer();
    // Fix: `Buffer` is a Node.js API and is not available in the Vercel Edge runtime.
    // This replaces `Buffer.from(buffer).toString('base64')` with a web-compatible implementation.
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    const base64EncodedData = btoa(binary);

    return {
        inlineData: {
            data: base64EncodedData,
            mimeType: file.type,
        },
    };
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Chỉ hỗ trợ phương thức POST' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;
    const prompt = formData.get('prompt') as string | null;

    if (!imageFile || !prompt) {
      return new Response(JSON.stringify({ error: 'Thiếu ảnh hoặc chủ đề' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API_KEY environment variable is not set.");
        return new Response(JSON.stringify({ error: 'Lỗi Cấu Hình Máy Chủ: Khóa API chưa được thiết lập.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const ai = new GoogleGenAI({ apiKey });

    const imagePart = await fileToGenerativePart(imageFile);
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [imagePart, textPart],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    if (!response.candidates || response.candidates.length === 0) {
        const blockReason = response.promptFeedback?.blockReason;
        const errorMessage = blockReason
            ? `Yêu cầu của bạn đã bị chặn vì lý do: ${blockReason}. Vui lòng thử lại với ảnh hoặc chủ đề khác.`
            : "AI không trả về kết quả. Vui lòng thử lại.";
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    let generatedImageUrl: string | null = null;
    let textResponse: string | null = null;

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes = part.inlineData.data;
            const mimeType = part.inlineData.mimeType;
            generatedImageUrl = `data:${mimeType};base64,${base64ImageBytes}`;
        } else if (part.text) {
            textResponse = part.text;
        }
    }

    if (generatedImageUrl) {
        return new Response(JSON.stringify({ imageUrl: generatedImageUrl }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const errorMessage = textResponse
        ? `AI không thể tạo ảnh và đã phản hồi: "${textResponse}"`
        : "Không nhận được ảnh từ AI. Phản hồi không chứa dữ liệu hình ảnh.";
        
    return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Lỗi khi gọi Gemini API từ backend:", error);
    let errorMessage = "Đã xảy ra lỗi trong quá trình tạo ảnh. Vui lòng thử lại.";
    if (error.message && (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('quota exceeded'))) {
        errorMessage = "Rất tiếc, bạn đã đạt giới hạn sử dụng trong ngày. Dịch vụ AI cung cấp một lượng sử dụng miễn phí nhất định mỗi ngày. Vui lòng quay lại vào ngày mai để tiếp tục sáng tạo nhé!";
    }
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
