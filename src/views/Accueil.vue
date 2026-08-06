<template>
  <div class="container">
    <div class="content-wrapper">
      <!-- Carte Formulaire -->
      <div class="card">
        <h1>Analyse de réclamation</h1>
        <p class="subtitle">
          Déposez un texte, un audio ou une image pour lancer l’analyse.
        </p>

        <form class="form" @submit.prevent="envoyer">
          <div class="field">
            <label for="texte">Texte</label>
            <textarea
              id="texte"
              v-model="texte"
              placeholder="Saisissez la réclamation ici..."
              rows="5"
              :disabled="loading"
            ></textarea>
          </div>

          <div class="field">
            <label for="audio">Audio</label>

            <input
              id="audio"
              type="file"
              accept="audio/*"
              @change="onAudioChange"
              :disabled="loading"
              ref="audioInput"
            >
            <small v-if="audio" class="file-info">
              Fichier sélectionné : {{ audio.name }}
            </small>
          </div>

          <div class="field">
            <label for="image">Image</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              @change="onImageChange"
              :disabled="loading"
              ref="imageInput"
            >
            <small v-if="image" class="file-info">
              Fichier sélectionné : {{ image.name }}
            </small>
          </div>
          <div class="field">

            <label>Enregistrer un audio</label>

            <AudioRecorder
              @recorded="recevoirAudio"
            />
            
          </div>

          <!-- Message d'erreur -->
          <div v-if="erreur" class="error-banner">
            {{ erreur }}
          </div>

          <button type="submit" class="btn" :disabled="loading || isFormEmpty">
            <span v-if="loading" class="spinner"></span>
            <span>{{ loading ? 'Analyse en cours...' : 'Envoyer' }}</span>
          </button>
        </form>
      </div>

      <!-- Carte Résultat -->
      <div v-if="resultat" class="card result-card">
        <div class="result-header">
          <h2>Résultat de l'analyse</h2>
          <span v-if="resultat.statut_propose" class="badge">
            {{ resultat.statut_propose }}
          </span>
        </div>

        <div class="result-body">
          <!-- 1. Diagnostic Image (Accès à l'objet imbriqué diagnostic_image.diagnostic) -->
          <div v-if="resultat.diagnostic_image" class="result-item">
            <span class="label">Diagnostic Image :</span>
            <p class="value highlight">
              {{ resultat.diagnostic_image.diagnostic }}
            </p>
          </div>

          <!-- 2. Transcription Audio (si disponible) -->
          <div v-if="resultat.transcription" class="result-item">
            <span class="label">Transcription Audio :</span>
            <p class="value">{{ resultat.transcription }}</p>
          </div>

          <!-- 3. Règle interne (si disponible) -->
          <div v-if="resultat.regle_interne_trouvee" class="result-item">
            <span class="label">Règle Interne Trouvée :</span>
            <p class="value">{{ resultat.regle_interne_trouvee }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { envoyerReclamation } from "@/services/supportService"
import AudioRecorder from "@/components/AudioRecorder.vue"

const texte = ref("")
const audio = ref(null)
const image = ref(null)

const loading = ref(false)
const resultat = ref(null)
const erreur = ref(null)

const audioInput = ref(null)
const imageInput = ref(null)

const isFormEmpty = computed(() => {
  return !texte.value.trim() && !audio.value && !image.value
})

// Fonction pour recevoir le fichier audio depuis le composant AudioRecorder
function recevoirAudio(fichier) {
  audio.value = fichier

}

function onAudioChange(event) {
  audio.value = event.target.files[0] || null    
}

function onImageChange(event) {
  image.value = event.target.files[0] || null  
  console.log(event.target.files[0]);
}

function reinitialiserFormulaire() {
  texte.value = ""
  audio.value = null
  image.value = null
  if (audioInput.value) audioInput.value.value = ""
  if (imageInput.value) imageInput.value.value = ""
}

async function envoyer() {
  if (isFormEmpty.value) return

  loading.value = true
  erreur.value = null
  resultat.value = null

  const formData = new FormData()

  if (texte.value.trim()) {
    formData.append("texte", texte.value.trim())
  }

  if (audio.value) {
    formData.append("audio", audio.value)
  }

  if (image.value) {
    formData.append("image", image.value)
  }

  try {
    const response = await envoyerReclamation(formData)
    resultat.value = response.data
    console.log(resultat.value);
    
    reinitialiserFormulaire()
  } catch (error) {
    console.error(error)
    erreur.value = error.response?.data?.detail || "Une erreur est survenue lors de l'analyse."
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%);
}

.content-wrapper {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card {
  width: 100%;
  background: #ffffff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  border: 1px solid #e2e8f0;
}

h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
}

.subtitle {
  margin-top: 8px;
  margin-bottom: 24px;
  color: #64748b;
  font-size: 0.95rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 600;
  color: #334155;
}

textarea,
input[type="file"] {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 1rem;
  background: #fff;
  transition: all 0.2s ease;
}

textarea:disabled,
input[type="file"]:disabled {
  background-color: #f1f5f9;
  cursor: not-allowed;
}

textarea {
  resize: vertical;
  min-height: 140px;
}

textarea:focus,
input[type="file"]:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
}

.file-info {
  color: #475569;
  font-size: 0.875rem;
}

.btn {
  margin-top: 8px;
  padding: 14px 18px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.25);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Spinner CSS */
.spinner {
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Erreur */
.error-banner {
  padding: 12px 16px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  border-radius: 10px;
  font-size: 0.9rem;
}

/* Style de la carte résultat */
.result-card {
  animation: slideUp 0.3s ease-out;
  border-left: 5px solid #6366f1;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 12px;
}

.result-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #0f172a;
}

.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  background-color: #e2e8f0;
  color: #475569;
}

.badge.conforme, .badge.traite, .badge.ok {
  background-color: #dcfce7;
  color: #15803d;
}

.badge.non_conforme, .badge.urgent, .badge.erreur {
  background-color: #fee2e2;
  color: #b91c1c;
}

.result-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-item .label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.result-item .value {
  margin: 4px 0 0 0;
  font-size: 1.05rem;
  color: #1e293b;
  font-weight: 500;
}

.raw-response pre {
  background: #f8fafc;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  overflow-x: auto;
}
</style>