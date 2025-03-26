import { Route, Redirect } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Importa los estilos de Ionic */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';

/* Importa los componentes */
import PhotoGallery from './components/PhotoGallery';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { useAuth } from './context/AuthContext';
import AlbumGallery from './components/Album';

setupIonicReact();

const App: React.FC = () => {
  const { isAuthenticated } = useAuth(); // 🔐 Verifica si el usuario está autenticado

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Redirigir a /signin si no está autenticado */}
          <Route
            exact
            path='/'
            render={() =>
              isAuthenticated ? <AlbumGallery /> : <Redirect to='/signin' />
            }
          />
          <Route
            exact
            path='/:userId/gallery'
            render={() =>
              isAuthenticated ? <PhotoGallery /> : <Redirect to='/signin' />
            }
          />

          <Route exact path='/signin'>
            <SignIn />
          </Route>

          <Route exact path='/signup'>
            <SignUp />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
