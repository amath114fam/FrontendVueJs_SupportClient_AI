<template>

  <div>

    <h2>Test enregistrement audio</h2>


    <!-- Bouton pour démarrer -->
    <button
      @click="startRecording"
      :disabled="isRecording"
    >
      🎙 Commencer
    </button>



    <!-- Bouton pour arrêter -->
    <button
      @click="stopRecording"
      :disabled="!isRecording"
    >
      ⏹ Arrêter
    </button>



    <!-- Affichage de l'état -->
    <p v-if="isRecording">
      🔴 Enregistrement en cours...
    </p>


    <!-- Affichage du fichier créé -->
    <p v-if="audioFile">
      Fichier créé : {{ audioFile.name }}
    </p>


  </div>

</template>



<script setup>

import { useAudioRecorder } from "@/composables/useAudioRecorder"


// On récupère les fonctionnalités du composable
const {
  isRecording,
  audioFile,
  startRecording,
  stopRecording

} = useAudioRecorder()


</script>