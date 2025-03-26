import { useState, useEffect } from "react";
import {
  IonButton,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonFab,
  IonFabButton,
  IonIcon,
  IonAlert,
  IonSpinner,
} from "@ionic/react";
import { camera, trash } from "ionicons/icons";
import { takePhoto } from "../services/photoService";
import Footer from "./Footer";
import axios from "axios";
import { server } from "../contants";
import { useHistory, useParams } from "react-router";

interface Photo {
  id: number;
  isPublic: boolean;
  userId: number;
  img: string;
}

const PhotoGallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const history = useHistory();
  const params = useParams<{ albumId: string }>();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const user = localStorage.getItem("userId");
        if (!user) return;
        const { data } = await axios.get(`${server}images/user/${user}/`);
        setPhotos(data);
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };
    fetchPhotos();
  }, []);

  const handleTakePhoto = async () => {
    try {
      setLoading(true);
      const photo = await takePhoto(); // Ahora recibe un objeto con { path: File, format: string }
      if (!photo || !photo.path) return;

      const user = localStorage.getItem("userId");
      if (!user) return;

      // El archivo ya está en photo.path
      const file = photo.path;

      // Crear FormData y adjuntar el archivo
      const formData = new FormData();
      formData.append("file", file);
      formData.append("isPublic", "true");

      await axios.post(
        `${server}images/user/${user}/album/${params.albumId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Crear una URL para previsualización
      const newImg = URL.createObjectURL(file);
      setPhotos((prevPhotos) => [
        ...prevPhotos,
        { img: newImg, isPublic: true, userId: Number(user), id: Date.now() },
      ]);
    } catch (error) {
      console.error("Error taking photo:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeletePhotos = () => {
    setPhotos([]);
    localStorage.removeItem("photos");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Galería de Fotos</IonTitle>
          <IonButton slot="end" fill="clear" onClick={() => setShowAlert(true)}>
            <IonIcon icon={trash} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div
          style={{ display: "flex", gap: "8px", alignItems: "center" }}
          onClick={() => history.push("/")}
        >
          <IonImg
            src="resources/regresar.svg"
            alt="back"
            style={{ width: "20px", height: "20px" }}
          />
          <p>Regresar</p>
        </div>

        <p style={{ textAlign: "center", color: "gray" }}>
          {photos.length === 0
            ? "No hay fotos aún. ¡Toma una!"
            : `📸 Fotos tomadas: ${photos.length}/10`}
        </p>

        {loading && (
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <IonSpinner name="crescent" />
            <p>Procesando...</p>
          </div>
        )}

        <IonGrid>
          <IonRow>
            {photos.map((photo) => (
              <IonCol size="6" size-md="4" key={photo.id}>
                <IonImg
                  src={photo.img}
                  alt="Foto"
                  style={{ borderRadius: "10px", cursor: "pointer" }}
                  onClick={() => setSelectedPhoto(photo.img)}
                />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={handleTakePhoto} disabled={loading}>
            <IonIcon icon={camera} />
          </IonFabButton>
        </IonFab>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Eliminar Fotos"
          message="¿Seguro que quieres borrar todas las fotos?"
          buttons={[
            { text: "Cancelar", role: "cancel" },
            { text: "Eliminar", handler: confirmDeletePhotos },
          ]}
        />

        {selectedPhoto && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={() => setSelectedPhoto(null)}
          >
            <IonImg
              src={selectedPhoto}
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                borderRadius: "10px",
              }}
            />
          </div>
        )}
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default PhotoGallery;
