import { useState, useEffect } from 'react';
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
  IonSpinner
} from '@ionic/react';
import { camera, trash } from 'ionicons/icons';
import { takePhoto } from '../services/photoService';
import Footer from './Footer';
import axios from 'axios';
import { server } from '../contants';
import { useHistory, useParams } from 'react-router';
import { decode } from 'base64-arraybuffer';
import dayjs from 'dayjs';

interface Photos {
  id: number;
  isPublic: true;
  userId: number;
  img: string;
}
const PhotoGallery = () => {
  const [photos, setPhotos] = useState<Photos[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const params = useParams<{ albumId: string }>();

  useEffect(() => {
    const storedPhotos = JSON.parse(localStorage.getItem('photos') || '[]');
    const user = localStorage.getItem('userId');
    (async () => {
      const { data } = await axios.get(server + `images/user/${user}/`);
      setPhotos(data);
    })();

    setPhotos(storedPhotos);
  }, []);

  useEffect(() => {
    localStorage.setItem('photos', JSON.stringify(photos));
  }, [photos]);

  const handleTakePhoto = async () => {
    setLoading(true);
    const photoUrl = await takePhoto();
    if (photoUrl) {
      setLoading(false);
      if (photoUrl) {
        const user = localStorage.getItem('userId');
        const formData = new FormData();
        formData.append('file', photoUrl.path);
        formData.append('isPublic', 'true');
        const newPhoto = await axios.post(
          server + `images/user/${user}/album/${params.albumId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        const newImg = URL.createObjectURL(photoUrl.path as File);
        const updatedPhotos: Photos[] = [
          ...photos,
          {
            img: newImg,
            isPublic: true,
            userId: 0,
            id: 0
          }
        ];
        setPhotos(updatedPhotos);
      }
    }
  };

  const handleDeletePhotos = () => {
    setShowAlert(true);
  };

  const confirmDeletePhotos = () => {
    setPhotos([]);
    localStorage.removeItem('photos');
  };
  const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Galería de Fotos</IonTitle>
          <IonButton slot='end' fill='clear' onClick={handleDeletePhotos}>
            <IonIcon icon={trash} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className='ion-padding'>
        <div
          style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
          onClick={() => history.push('/')}
        >
          <IonImg
            src='resources/regresar.svg'
            alt='back view'
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: 'white',
              borderRadius: '20px'
            }}
          />
          <p>regresar</p>
        </div>
        {photos.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            No hay fotos aún. ¡Toma una!
          </p>
        ) : (
          <p style={{ textAlign: 'center', color: 'gray' }}>
            📸 Fotos tomadas: {photos.length}/10
          </p>
        )}

        {loading && (
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <IonSpinner name='crescent' />
            <p>Procesando...</p>
          </div>
        )}

        <IonGrid>
          <IonRow>
            {photos.map((photo, index) => (
              <IonCol size='6' size-md='4' key={index}>
                <IonImg
                  src={photo.img}
                  alt={`Foto ${index + 1}`}
                  style={{
                    borderRadius: '10px',
                    boxShadow: '2px 2px 10px rgba(0,0,0,0.2)',
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedPhoto(photo.img)}
                />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonFab vertical='bottom' horizontal='center' slot='fixed'>
          <IonFabButton onClick={handleTakePhoto}>
            <IonIcon icon={camera} />
          </IonFabButton>
        </IonFab>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header='Eliminar Fotos'
          message='¿Seguro que quieres borrar todas las fotos?'
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Eliminar',
              handler: confirmDeletePhotos
            }
          ]}
        />

        {selectedPhoto && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
            onClick={() => setSelectedPhoto(null)}
          >
            <IonImg
              src={selectedPhoto}
              style={{
                maxWidth: '90%',
                maxHeight: '90%',
                borderRadius: '10px'
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
