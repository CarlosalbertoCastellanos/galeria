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
  IonSpinner
} from '@ionic/react';
import { camera, trash } from 'ionicons/icons';
import { takePhoto } from '../services/photoService';
import Footer from './Footer';
import axios from 'axios';
import { server } from '../contants';
import { useParams } from 'react-router';

interface Photo {
  id: number;
  isPublic: boolean;
  userId: number;
  img: string;
}

const PhotoGallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const params = useParams<{ albumId: string }>();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const user = localStorage.getItem('userId');
        if (!user) return;
        const { data } = await axios.get(`${server}images/user/${user}/`);
        setPhotos(data);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };
    fetchPhotos();
  }, []);

  const handleTakePhoto = async () => {
    try {
      setLoading(true);
      const photo = await takePhoto();
      if (!photo || !photo.path) return;

      const user = localStorage.getItem('userId');
      if (!user) return;

      const file = photo.path;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('isPublic', 'true');

      const { data } = await axios.post(
        `${server}images/user/${user}/album/${params.albumId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setPhotos((prevPhotos) => [
        ...prevPhotos,
        {
          img: data.imageUrl,
          isPublic: true,
          userId: Number(user),
          id: data.id
        }
      ]);
    } catch (error) {
      console.error('Error taking photo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    try {
      await axios.delete(`${server}images/image/${photoId}`);
      setPhotos((prevPhotos) =>
        prevPhotos.filter((photo) => photo.id !== photoId)
      );
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Galería de Fotos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className='ion-padding'>
        <p style={{ textAlign: 'center', color: 'gray' }}>
          {photos.length === 0
            ? 'No hay fotos aún. ¡Toma una!'
            : `📸 Fotos tomadas: ${photos.length}/10`}
        </p>

        {loading && (
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <IonSpinner name='crescent' />
            <p>Procesando...</p>
          </div>
        )}

        <IonGrid>
          <IonRow>
            {photos.map((photo) => (
              <IonCol
                size='6'
                size-md='4'
                key={photo.id}
                style={{ position: 'relative' }}
              >
                <IonImg
                  src={photo.img}
                  alt='Foto'
                  style={{ borderRadius: '10px', cursor: 'pointer' }}
                  onClick={() => setSelectedPhoto(photo.img)}
                />
                <IonButton
                  fill='clear'
                  color='danger'
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    backgroundColor: 'rgba(255, 0, 0, 0.7)',
                    borderRadius: '50%',
                    padding: '5px'
                  }}
                  onClick={() => handleDeletePhoto(photo.id)}
                >
                  <IonIcon icon={trash} />
                </IonButton>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonFab vertical='bottom' horizontal='center' slot='fixed'>
          <IonFabButton onClick={handleTakePhoto} disabled={loading}>
            <IonIcon icon={camera} />
          </IonFabButton>
        </IonFab>

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
