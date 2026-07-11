import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { getSchoolDocRef } from "./firestoreService";

export interface CloudinaryConfig {
  cloudinaryCloudName: string;
  cloudinaryApiKey: string;
  cloudinaryApiSecret: string;
  cloudinaryUploadPreset: string;
}

// Converts a File to persistent base64 if Cloudinary is not configured or fails
function fileToBase64(file: File | string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof file === "string") {
      resolve(file);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export async function uploadToCloudinary(
  file: File | string,
  tenantId: string,
  schoolId: string | number
): Promise<string | null> {
  // Fetch active school configuration from Firestore
  let config: CloudinaryConfig | null = null;
  try {
    if (db) {
      const schoolRef = getSchoolDocRef(tenantId, String(schoolId));
      const schoolSnap = await getDoc(schoolRef);
      if (schoolSnap.exists()) {
        const data = schoolSnap.data() as any;
        if (data && data.cloudinaryCloudName) {
          config = {
            cloudinaryCloudName: data.cloudinaryCloudName,
            cloudinaryApiKey: data.cloudinaryApiKey || "",
            cloudinaryApiSecret: data.cloudinaryApiSecret || "",
            cloudinaryUploadPreset: data.cloudinaryUploadPreset || ""
          };
        }
      }
    }
  } catch (e) {
    console.error("Error fetching Cloudinary config:", e);
  }

  // Fallback if Cloudinary settings are missing
  if (!config || !config.cloudinaryCloudName || !config.cloudinaryUploadPreset) {
    console.warn("Cloudinary not configured. Falling back to persistent base64.");
    try {
      return await fileToBase64(file);
    } catch (err) {
      return typeof file === "string" ? file : null;
    }
  }

  // Convert File object to base64 data URL for API posting
  let fileToUpload = file;
  try {
    fileToUpload = await fileToBase64(file);
  } catch (err) {
    return null;
  }

  const formData = new FormData();
  formData.append("file", fileToUpload);
  formData.append("upload_preset", config.cloudinaryUploadPreset);
  if (config.cloudinaryApiKey) {
    formData.append("api_key", config.cloudinaryApiKey);
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${config.cloudinaryCloudName}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) {
      throw new Error(`Upload failed`);
    }
    const result = await response.json();
    return result.secure_url || result.url || null;
  } catch (e) {
    console.error("Cloudinary upload error:", e);
    try {
      return await fileToBase64(file);
    } catch (err) {
      return typeof file === "string" ? file : null;
    }
  }
}
