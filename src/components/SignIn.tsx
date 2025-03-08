import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonTitle,
} from "@ionic/react";
import { useAuth } from "../context/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const history = useHistory();

  const handleSignIn = () => {
    if (email === "carlos" && password === "123456") {
      login();
      history.push("/");
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonTitle className="ion-text-center">Iniciar Sesión</IonTitle>
        <IonInput
          placeholder="Correo electrónico"
          onIonChange={(e) => setEmail(e.detail.value!)}
        />
        <IonInput
          type="password"
          placeholder="Contraseña"
          onIonChange={(e) => setPassword(e.detail.value!)}
        />
        <IonButton expand="full" onClick={handleSignIn}>
          Iniciar Sesión
        </IonButton>

        {/* Contenedor centrado */}
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <IonButton fill="clear" onClick={() => history.push("/signup")}>
            ¿No tienes cuenta?
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignIn;
