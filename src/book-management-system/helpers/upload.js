const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dp1s19mxg/upload";
const UPLOAD_PRESET = "ml_default";

async function getSignature() {
  const response = await fetch("http://localhost:3000/generate-signature");
  if (!response.ok) {
    throw new Error("Failed to get signature.");
  }
  return response.json();
}
window.uploadImageWithSignature = async function (file) {
  try {
    const { signature, timestamp } = await getSignature();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("api_key", "813724476411169");

    for (let [key, value] of formData.entries()) {
    }

    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cloudinary error:", errorData);
      throw new Error(errorData.error?.message || "Failed to upload image.");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
