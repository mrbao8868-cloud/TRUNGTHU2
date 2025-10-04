export const generateMidAutumnImage = async (imageFile: File, prompt: string): Promise<string> => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('prompt', prompt);

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      body: formData,
    });

    // Phân tích cú pháp phản hồi JSON từ backend
    const result = await response.json();

    if (!response.ok) {
      // Nếu có lỗi, backend sẽ trả về một đối tượng JSON với key 'error'
      // Ném lỗi với thông báo từ backend để UI có thể hiển thị nó
      throw new Error(result.error || 'Đã xảy ra lỗi không xác định từ máy chủ.');
    }
    
    // Nếu thành công, backend sẽ trả về một đối tượng JSON với key 'imageUrl'
    return result.imageUrl;

  } catch (error) {
    console.error("Lỗi khi gọi API backend:", error);
    // Ném lại lỗi để component App có thể bắt và xử lý
    if (error instanceof Error) {
      throw error;
    }
    // Lỗi dự phòng
    throw new Error("Không thể kết nối đến máy chủ tạo ảnh. Vui lòng kiểm tra lại kết nối mạng.");
  }
};
