import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Filesystem, Directory } from '@capacitor/filesystem';

export const takePhoto = async () => {
  try {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      quality: 90,
    });

    const webPath = photo?.webPath;
    const readFile = await Filesystem.readFile({
      path: `${photo.path}`,
    });

    const byteCharacters = atob(readFile.data as string);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: `image/${photo.format}` });

    const file = new File([blob], `photo.${photo.format}`, { type: `image/${photo.format}` });

    return { path: file, format: photo.format };
  } catch (error) {
    console.error("Error al tomar la foto:", error);
    return null;
  }
};

