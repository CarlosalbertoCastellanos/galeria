import { useState, useEffect } from "react";
import {
  IonButton,
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonFab,
  IonFabButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonModal,
  IonCheckbox,
} from "@ionic/react";
import { add, trash, close } from "ionicons/icons";
import Footer from "./Footer";
import axios from "axios";
import { server } from "../contants";
import { useHistory } from "react-router";

const AlbumGallery = () => {
  const getUser = localStorage.getItem("userId");
  const history = useHistory();

  const [albums, setAlbums] = useState<
    { id: number; name: string; user_id: number; isPublic: boolean }[]
  >([]);
  const [newAlbum, setNewAlbum] = useState({ name: "", isPublic: false });
  const [showModal, setShowModal] = useState(false);

  // Obtener álbumes del usuario
  useEffect(() => {
    if (!getUser) return; // Evita la solicitud si no hay usuario

    const fetchAlbums = async () => {
      try {
        const response = await axios.get(`${server}user/${getUser}/album`);
        setAlbums(response.data);
      } catch (error) {
        console.error("Error obteniendo los álbumes:", error);
      }
    };

    fetchAlbums();
  }, [getUser]); // Se vuelve a ejecutar si `getUser` cambia

  // Guardar álbumes en localStorage cuando cambian
  useEffect(() => {
    if (albums.length > 0) {
      localStorage.setItem("albums", JSON.stringify(albums));
    }
  }, [albums]);

  // Crear un nuevo álbum
  const handleCreateAlbum = async () => {
    if (newAlbum.name.trim() === "") return;
    if (!getUser) return; // Verificación adicional por seguridad

    try {
      const response = await axios.post(
        `${server}user/${getUser}/album`,
        newAlbum
      );
      setAlbums((prev) => [...prev, response.data]);
      setNewAlbum({ name: "", isPublic: false });
      setShowModal(false);
    } catch (error) {
      console.error("Error al crear el álbum:", error);
    }
  };

  // Eliminar álbum
  const handleDeleteAlbum = async (albumId: number) => {
    if (!getUser) return;

    try {
      await axios.delete(`${server}user/${getUser}/album/${albumId}`);
      setAlbums((prev) => prev.filter((album) => album.id !== albumId));
    } catch (error) {
      console.error("Error al eliminar el álbum:", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Álbumes</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          {albums.length === 0 ? (
            <p style={{ textAlign: "center", color: "gray" }}>
              No hay álbumes. ¡Crea uno!
            </p>
          ) : (
            albums.map((album) => (
              <IonItem
                key={album.id}
                button
                onClick={() => history.push(`/${album.id}/gallery`)}
              >
                <IonLabel>{album.name}</IonLabel>
                <IonButton
                  fill="clear"
                  color="danger"
                  onClick={(e) => {
                    e.stopPropagation(); // Evita abrir el álbum al borrar
                    handleDeleteAlbum(album.id);
                  }}
                >
                  <IonIcon icon={trash} />
                </IonButton>
              </IonItem>
            ))
          )}
        </IonList>

        {/* Botón flotante para agregar álbum */}
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        {/* Modal para crear un nuevo álbum */}
        <IonModal
          isOpen={showModal}
          onDidDismiss={() => setShowModal(false)}
          animated
        >
          <IonContent className="ion-padding">
            <IonHeader>
              <IonToolbar>
                <IonTitle>Nuevo Álbum</IonTitle>
                <IonButton
                  slot="end"
                  fill="clear"
                  onClick={() => setShowModal(false)}
                >
                  <IonIcon icon={close} />
                </IonButton>
              </IonToolbar>
            </IonHeader>

            <IonItem>
              <IonLabel position="stacked">Nombre del álbum</IonLabel>
              <IonInput
                value={newAlbum.name}
                onIonChange={(e) =>
                  setNewAlbum((prev) => ({ ...prev, name: e.detail.value! }))
                }
              />
            </IonItem>

            <IonItem>
              <IonLabel>Es público</IonLabel>
              <IonCheckbox
                checked={newAlbum.isPublic}
                onIonChange={(e) =>
                  setNewAlbum((prev) => ({
                    ...prev,
                    isPublic: e.detail.checked,
                  }))
                }
              />
            </IonItem>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
              }}
            >
              <IonButton color="medium" onClick={() => setShowModal(false)}>
                Cancelar
              </IonButton>
              <IonButton onClick={handleCreateAlbum}>Crear álbum</IonButton>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>

      <Footer />
    </IonPage>
  );
};

export default AlbumGallery;
