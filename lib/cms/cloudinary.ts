/* eslint-disable @typescript-eslint/no-explicit-any */

interface CloudinaryResponse {
  secure_url?: string;
  duration?: number;
  public_id?: string;
}

interface ImageUploadResult {
  url?: string;
}

interface VideoUploadResult {
  url?: string;
  duration?: number;
  publicId?: string;
}

interface DocumentUploadResult {
  url?: string;
  publicId?: string;
}

let cloudinaryInstance: any = null;

function initCloudinary() {
  if (!cloudinaryInstance) {
    try {
      // Try to import cloudinary dynamically
      const cloudinaryModule = require("cloudinary");
      cloudinaryInstance = cloudinaryModule.v2 || cloudinaryModule;
    } catch (error) {
      console.warn("Cloudinary module not installed. Install with: npm install cloudinary");
      return null;
    }
  }

  if (cloudinaryInstance) {
    cloudinaryInstance.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  return cloudinaryInstance;
}

// Image upload to Cloudinary
export async function uploadImage(
  file: Buffer,
  filename: string,
  folder: string = "yascon_cms/images"
): Promise<ImageUploadResult> {
  const instance = initCloudinary();

  if (!instance) {
    throw new Error("Cloudinary not configured. Install cloudinary package.");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = instance.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        public_id: filename,
        overwrite: true,
      },
      (error: Error | null, result: CloudinaryResponse) => {
        if (error) reject(error);
        else resolve({ url: result?.secure_url });
      }
    );

    uploadStream.end(file);
  });
}

// Video upload to Cloudinary
export async function uploadVideo(
  file: Buffer,
  filename: string,
  folder: string = "yascon_cms/videos"
): Promise<VideoUploadResult> {
  const instance = initCloudinary();

  if (!instance) {
    throw new Error("Cloudinary not configured. Install cloudinary package.");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = instance.uploader.upload_stream(
      {
        folder,
        resource_type: "video",
        public_id: filename,
        overwrite: true,
        eager: [
          { width: 300, height: 300, crop: "fill", quality: "auto" },
        ],
      },
      (error: Error | null, result: CloudinaryResponse) => {
        if (error) reject(error);
        else
          resolve({
            url: result?.secure_url,
            duration: result?.duration,
            publicId: result?.public_id,
          });
      }
    );

    uploadStream.end(file);
  });
}

// Delete resource from Cloudinary
export async function deleteCloudinaryResource(publicId: string): Promise<boolean> {
  const instance = initCloudinary();

  if (!instance) {
    throw new Error("Cloudinary not configured. Install cloudinary package.");
  }

  const result = await instance.uploader.destroy(publicId);
  return result.result === "ok";
}

// Document upload to Cloudinary
export async function uploadDocument(
  file: Buffer,
  filename: string,
  folder: string = "yascon_cms/documents"
): Promise<DocumentUploadResult> {
  const instance = initCloudinary();

  if (!instance) {
    throw new Error("Cloudinary not configured. Install cloudinary package.");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = instance.uploader.upload_stream(
      {
        folder, // Use the desired folder for documents
        resource_type: "auto",
        public_id: filename,
        overwrite: true,
      },
      (error: Error | null, result: CloudinaryResponse) => {
        if (error) reject(error);
        else resolve({ url: result?.secure_url, publicId: result?.public_id });
      }
    );

    uploadStream.end(file);
  })  
};