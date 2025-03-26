import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export const takePhoto = async () => {
  try {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      quality: 90,
    });
    return photo || null;
  } catch (error) {
    console.error("Error al tomar la foto:", error);
    return null;
  }
};
