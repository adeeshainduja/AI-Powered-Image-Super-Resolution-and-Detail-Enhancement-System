const API_BASE_URL = "http://localhost:5000/api/images";

export async function enhanceImage({
  image,
  scale,
  applyDenoise = false,
  applySharpen = false,
}) {
  const formData = new FormData();

  formData.append("image", image);
  formData.append("scale", scale);
  formData.append("applyDenoise", applyDenoise);
  formData.append("applySharpen", applySharpen);

  const response = await fetch(`${API_BASE_URL}/enhance`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Image enhancement failed.");
  }

  return data;
}

export async function getHistory() {
  const response = await fetch(`${API_BASE_URL}/history`);

  if (!response.ok) {
    throw new Error("Failed to fetch history.");
  }

  return response.json();
}