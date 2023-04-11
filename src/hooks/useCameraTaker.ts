import { useState } from "react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";


export interface GeneralPhoto {
  _id: string;
  base64str: string;
  title: string;
  mimetype: string;
}

export async function base64FromPath(path: string): Promise<string> {
  const response = await fetch(path);
  const blob = await response.blob();

  return new Promise( (resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.replace("data:image/jpeg;base64,", "") );
      } else {
        reject('method did not return a string');
      }
    };
    reader.readAsDataURL(blob);
  });
}

export function useCameraTaker() {
  
  const [pics, setPics] = useState<GeneralPhoto[]>([]);

  const takePhoto = async (quality: number) => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera, 
      quality
    });
  
    const base64Data = await base64FromPath(photo.webPath!);
    const photoIdNew = Date.now().toString();
    const itemImage:GeneralPhoto = { base64str: base64Data, title:'', _id: photoIdNew, mimetype: 'image/jpeg'  }
    
    const newPhotos = [...pics, itemImage];
    setPics(newPhotos);
  };
 

  return {
    takePhoto,
    pics,
    setPics
  };
}
