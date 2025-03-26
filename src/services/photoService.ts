import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export const takePhoto = async () => {
  try {
    const isCameraAvailable = "Camera" in navigator;

    if (isCameraAvailable) {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
        quality: 90,
      });
      if (photo.webPath) {

        const response = await fetch(photo?.webPath);
        const blob = await response.blob();

        const formatImage = `image/${photo.format}`
        return {
          path: new File([blob], `photo.${photo.format}`, {
            type: blob.type || formatImage,
            lastModified: Date.now(),
          }), format: formatImage
        }
      }
      return null
    } else {
      return await selectFileFromInput();
    }
  } catch (error) {
    console.error("Error al tomar la foto:", error);
    return null;
  }
};

const selectFileFromInput = (): Promise<{ path: File; format: string } | null> => {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style.display = "none";

    input.addEventListener("change", (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        resolve({ path: file, format: file.type.split("/")[1] });
      } else {
        resolve(null);
      }
    });

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  });
};
