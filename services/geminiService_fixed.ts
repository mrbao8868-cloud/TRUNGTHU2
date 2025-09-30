
// services/geminiService.ts

// Lấy API Key từ biến môi trường (Vercel + Vite)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Hàm gọi Gemini API
export async function callGemini(prompt: string) {
  if (!GEMINI_API_KEY) {
    throw new Error("❌ Missing Gemini API Key! Hãy kiểm tra biến VITE_GEMINI_API_KEY trên Vercel.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API error: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    // Trả về text từ Gemini
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ Không có kết quả từ Gemini.";
  } catch (err) {
    console.error("Gemini API error:", err);
    throw err;
  }
}

// Hàm test nhanh
export async function testGemini() {
  const result = await callGemini("Xin chào, Gemini! Bạn có khỏe không?");
  console.log("Gemini response:", result);
}
