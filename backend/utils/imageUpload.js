import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "..", "uploads");

const allowedTypes = new Map([
    ["image/jpeg", "jpg"],
    ["image/png", "png"],
    ["image/webp", "webp"]
]);

export const saveImageData = async (imageData) => {
    if (!imageData) return null;

    const match = imageData.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
    if (!match) {
        throw new Error("Please upload a JPG, PNG, or WEBP image");
    }

    const [, mimeType, base64Data] = match;
    const extension = allowedTypes.get(mimeType);
    const buffer = Buffer.from(base64Data, "base64");
    const maxSize = 5 * 1024 * 1024;

    if (buffer.length > maxSize) {
        throw new Error("Image must be smaller than 5MB");
    }

    await mkdir(uploadsDir, { recursive: true });
    const filename = `car-${Date.now()}-${Math.round(Math.random() * 1e9)}.${extension}`;
    await writeFile(path.join(uploadsDir, filename), buffer);

    return `/uploads/${filename}`;
};
