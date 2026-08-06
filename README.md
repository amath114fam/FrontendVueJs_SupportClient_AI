# 🤖 Analyseur de Réclamations AI (Full-Stack)

Application full-stack d'analyse intelligente de réclamations client à l'aide de modèles d'IA multi-modaux (Texte, Audio, Image).

---

## 📌 Fonctionnalités

* **Multi-modalité** : Traitement combiné du texte, d'un fichier audio ou d'une image.
* **Transcription & Classification** : Intégration de modèles Transformer (BLIP, ViT, Sentence-Transformers).
* **Recherche Vectorielle** : Moteur de recherche de règles internes par similarité cosinus.
* **Interface Réactive** : Client Vue 3 interactif avec états de chargement, retours visuels et gestion dynamique des données.

---

## 🛠️ Stack Technique

* **Backend** : FastAPI (Python 3.10+), PyTorch, Hugging Face Transformers, Sentence-Transformers.
* **Frontend** : Vue 3 (Composition API / `<script setup>`), Axios.
* **Communication** : Rest API via `FormData` (`multipart/form-data`) avec middleware CORS activé.

---

## 📡 API & Services Frontend

### 1. Configuration Axios (`src/services/api.js`)

Instance Axios configurée pour pointer vers le serveur FastAPI local :

```javascript
import axios from "axios"

const api = axios.create({
  baseURL: "[http://127.0.0.1:8000](http://127.0.0.1:8000)",
})

export default api
2. Service Support (src/services/supportService.js)
Envoi des réclamations via requêtes HTTP POST multipart :

JavaScript
import api from "./api"

export function envoyerReclamation(formData) {
  return api.post("/support-ticket", formData)
}
⚙️ Modèle de Réponse API
Le backend retourne un résultat structuré après traitement :

JSON
{
  "transcription": null,
  "diagnostic_image": {
    "diagnostic": "Non conforme"
  },
  "regle_interne_trouvee": null,
  "statut_propose": "À vérifier"
}
🚀 Installation et Lancement
Backend (FastAPI)
Naviguer dans le dossier du backend et créer un environnement virtuel :

Bash
python -m venv venv
source venv/bin/activate  # Sur Linux/macOS
# ou venv\Scripts\activate  Sur Windows
Installer les dépendances :

Bash
pip install fastapi uvicorn torch transformers sentence-transformers pillow
Lancer le serveur d'API :

Bash
uvicorn main:app --reload --port 8000
Frontend (Vue.js)
Naviguer dans le dossier frontend et installer les dépendances :

Bash
npm install
Lancer le serveur de développement :

Bash
npm run dev
Accéder à l'application sur http://localhost:5173.

🔒 Sécurité & CORS (FastAPI)
Le backend inclut le middleware CORS pour autoriser la communication avec le client Vue.js :

Python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)