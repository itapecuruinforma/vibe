import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDUWwDL8FOiHl_MMssGwkimoI-i-7C7Rrg",
  authDomain: "controle-de-gasto-fc4e0.firebaseapp.com",
  projectId: "controle-de-gasto-fc4e0",
  storageBucket: "controle-de-gasto-fc4e0.appspot.com",
  messagingSenderId: "1035761573543",
  appId: "1:1035761573543:web:1af30d370cd4815bd14582",
  databaseURL: "https://controle-de-gasto-fc4e0-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

export { app, auth, db, storage };
