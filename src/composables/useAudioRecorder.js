
import { ref } from "vue"

export function useAudioRecorder() {


  // Indique si un enregistrement est actuellement en cours.
  // Au départ, aucun enregistrement n'est lancé.
  const isRecording = ref(false)


  // Contiendra le fichier audio final.
  // Au départ, il n'existe pas encore.
  const audioFile = ref(null)



  // Variable qui contiendra l'objet MediaRecorder du navigateur.
  // Elle n'a pas besoin d'être réactive car elle n'est pas affichée dans l'interface.
  let mediaRecorder = null


  // Tableau qui va recevoir les morceaux audio pendant l'enregistrement.
  // Le navigateur découpe l'audio en plusieurs parties.
  let audioChunks = []



  // Fonction appelée pour démarrer l'enregistrement.
  async function startRecording() {


    // Demande au navigateur l'accès au microphone.
    // L'utilisateur devra accepter l'autorisation.
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    })


    // Création d'un enregistreur audio utilisant le microphone obtenu.
    mediaRecorder = new MediaRecorder(stream)



    // On vide les anciens morceaux audio.
    // Cela évite de mélanger plusieurs enregistrements.
    audioChunks = []



    // Démarre réellement l'enregistrement.
    mediaRecorder.start()



    // Mise à jour de l'état Vue.
    // L'interface saura que l'enregistrement est actif.
    isRecording.value = true



    // Cet événement est déclenché chaque fois qu'un morceau audio est disponible.
    mediaRecorder.ondataavailable = (event) => {


      // On ajoute le morceau reçu dans notre tableau.
      audioChunks.push(event.data)

    }



    // Cet événement est déclenché quand l'utilisateur arrête l'enregistrement.
    mediaRecorder.onstop = () => {

      // On rassemble tous les morceaux audio
      // pour créer un seul objet audio complet.
      const audioBlob = new Blob(audioChunks, {
        type: "audio/webm"
      })



      // On transforme le Blob en vrai fichier.
      // Le fichier possède un nom et un type.
      // Ce fichier pourra être envoyé avec FormData vers FastAPI.
      audioFile.value = new File(
        [audioBlob],
        "reclamation-audio.webm",
        {
          type: "audio/webm"
        }
      )



      // On ferme le microphone.
      // Cela libère les ressources du navigateur.
      stream.getTracks().forEach(track => track.stop())

    }

  }



  // Fonction appelée quand l'utilisateur clique sur "Arrêter".
  function stopRecording() {


    // Vérifie qu'un enregistreur existe avant de l'arrêter.
    if (mediaRecorder) {


      // Arrête l'enregistrement.
      // Cela déclenchera automatiquement l'événement onstop.
      mediaRecorder.stop()



      // Met à jour l'état de l'interface.
      isRecording.value = false

    }

  }



  // On retourne ce dont les composants Vue auront besoin.
  return {

    // Permet de savoir si l'enregistrement est actif.
    isRecording,


    // Permet de récupérer le fichier audio créé.
    audioFile,


    // Fonction pour démarrer l'enregistrement.
    startRecording,


    // Fonction pour arrêter l'enregistrement.
    stopRecording

  }

}