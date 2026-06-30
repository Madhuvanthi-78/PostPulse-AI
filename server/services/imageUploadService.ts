import axios from "axios";
import FormData from "form-data";

export const uploadImageToImgBB = async (fileBuffer: Buffer): Promise<string> => {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) throw new Error("ImgBB API Key is missing");

  const form = new FormData();
  form.append("image", fileBuffer.toString("base64"));

  const response = await axios.post(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    form,
    { headers: form.getHeaders() }
  );

  return response.data.data.url;
};