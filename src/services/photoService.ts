import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export const takePhoto = async () => {
  try {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      quality: 90,
    });
    const webPath = photo?.webPath;
    const blob = await (await fetch(`${webPath}`)).blob();
    const fileName = `photo.${photo.format || "jpg"}`;
    const file = new File([blob], fileName)

    return { path: file, format: photo.format };
  } catch (error) {
    console.error("Error al tomar la foto:", error);
    return null;
  }
};

