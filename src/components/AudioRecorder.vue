<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.3.0/css/all.min.css" integrity="sha512-ApSLB1Pd3/bZN8fWB/RG9YhN/7bd9Hkf3AGaE2mPfebjrxagjuBtx2GcgdqIlJkUzwylBo61r9Xa9NmgBI0swA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

  <div class="audio-recorder">
    <div class="recorder-card">

      <button
        v-if="!isRecording"
        @click="startRecording"
        class="btn btn-start"
      >
        <span class="icon"><i class="fa-solid fa-microphone"></i></span>
        Commencer l'enregistrement
      </button>

      <button
        v-else
        @click="stopRecording"
        class="btn btn-stop"
      >
        <span class="icon"><i class="fa-solid fa-pause"></i></span>
        Arrêter l'enregistrement
      </button>

      <div v-if="isRecording" class="status recording">
        <span class="dot"></span>
        Enregistrement en cours...
      </div>

      <div v-if="audioFile" class="status ready">
        <span class="icon"><i class="fa-solid fa-check"></i></span>
        Audio prêt : <strong>{{ audioFile.name }}</strong>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from "vue"


import { useAudioRecorder } from "@/composables/useAudioRecorder"


// On déclare un événement que ce composant peut envoyer au parent.
//
// Ici l'événement s'appelle "recorded".
// Il sera envoyé quand l'enregistrement audio sera terminé.
const emit = defineEmits([
  "recorded"
])



// On récupère les éléments nécessaires depuis notre composable.
//
// isRecording : indique si un enregistrement est en cours.
// audioFile : contient le fichier audio créé.
// startRecording : démarre l'enregistrement.
// stopRecording : arrête l'enregistrement.
const {
  isRecording,
  audioFile,
  startRecording,
  stopRecording

} = useAudioRecorder()



// On surveille la variable audioFile.
//
// Dès que sa valeur change (quand un fichier audio est créé),
// cette fonction sera exécutée.
watch(audioFile, (nouveauFichier) => {


  // On vérifie qu'un fichier existe bien.
  // Au début audioFile vaut null.
  if (nouveauFichier) {


    // On envoie le fichier audio au composant parent.
    //
    // "recorded" est le nom de l'événement.
    // nouveauFichier est la donnée envoyée.
    //
    // Le parent pourra récupérer ce fichier avec :
    // <AudioRecorder @recorded="fonction">
    emit(
      "recorded",
      nouveauFichier
    )

  }

})

</script>

<style scoped>
/* .audio-recorder {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
} */

/* .recorder-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 20px;
  padding: 28px 24px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  border: 1px solid #e2e8f0;
  text-align: center;
} */

.title {
  margin: 0 0 20px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn .icon {
  font-size: 1.2rem;
}

.btn-start {
  background: #64748b;
  color: #ffffff;
}

.btn-stop {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #ffffff;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.btn:active {
  transform: translateY(0);
}

.status {
  margin-top: 18px;
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.status.recording {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.status.ready {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ef4444;
  animation: pulse 1.2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
