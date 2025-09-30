
import { GoogleGenAI, Modality } from "@google/genai";

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Không thể đọc tệp hình ảnh."));
      }
    };
    reader.onerror = () => {
        reject(new Error("Đã xảy ra lỗi khi đọc tệp."));
    };
    reader.readAsDataURL(file);
  });
  const data = await base64EncodedDataPromise;
  return {
    inlineData: {
      data,
      mimeType: file.type,
    },
  };
};

export const generateMidAutumnImage = async (imageFile: File, prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    const errorMessage = "Lỗi Cấu Hình Máy Chủ: Khóa API chưa được thiết lập. Vui lòng kiểm tra lại cấu hình trên Vercel.";
    console.error("API_KEY environment variable is not set. Ensure it's configured in your Vercel project settings. For security, API keys should be handled on a server, not exposed to the browser. Consider using a serverless function as a proxy for the Gemini API call in production.");
    throw new Error(errorMessage);
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
        const blockReason = response.promptFeedback?.blockReason;
        if (blockReason) {
             throw new Error(`Yêu cầu của bạn đã bị chặn vì lý do: ${blockReason}. Vui lòng thử lại với ảnh hoặc chủ đề khác.`);
        }
        throw new Error("AI không trả về kết quả. Vui lòng thử lại.");
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
        return generatedImageUrl;
    }

    if (textResponse) {
        throw new Error(`AI không thể tạo ảnh và đã phản hồi: "${textResponse}"`);
    }

    throw new Error("Không nhận được ảnh từ AI. Phản hồi không chứa dữ liệu hình ảnh.");

  } catch (error) {
    console.error("Lỗi khi gọi Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Đã xảy ra lỗi: ${error.message}`);
    }
    throw new Error("Không thể tạo ảnh. Vui lòng thử lại sau.");
  }
};
