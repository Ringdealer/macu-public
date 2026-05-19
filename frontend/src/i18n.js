import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "Welcome to MACU": "Welcome to MACU",
      "Please create an account to continue": "Please create an account to continue",
      "You are logged in and ready to use the platform.": "You are logged in and ready to use the platform.",
      "Home": "Home",
      "About": "About",
      "Products": "Products",
      "Orders": "Orders",
      "Hello": "Hello",
      "Login": "Login",
      "Logout": "Logout",
      "Sign Up": "Sign Up"
    }
  },
  es: {
    translation: {
      "Welcome to MACU": "Bienvenidos a MACU",
      "Please create an account to continue": "Por favor cree una cuenta para continuar",
      "You are logged in and ready to use the platform.": "Está conectado y listo para usar la plataforma.",
      "Home": "Inicio",
      "About": "Acerca de",
      "Products": "Productos",
      "Orders": "Pedidos",
      "Hello": "Hola",
      "Login": "Iniciar Sesión",
      "Logout": "Cerrar Sesión",
      "Sign Up": "Registrarse"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "es",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;