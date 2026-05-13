const API_BASE_URL = "/api/images";

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

  const contentType = response.headers.get("content-type");

  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    console.error("Backend returned non-JSON response:", text);

    throw new Error(
      "Backend returned HTML instead of JSON. Check API URL and backend server."
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Image enhancement failed.");
  }

  return data;
}

export async function getHistory() {
  const response = await fetch(`${API_BASE_URL}/history`);

  const contentType = response.headers.get("content-type");

  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Backend returned HTML instead of JSON.");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Failed to fetch history.");
  }

  return data;
}
