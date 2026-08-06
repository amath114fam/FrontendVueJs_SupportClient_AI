import api from "./api"

export function envoyerReclamation(formData) {
  return api.post("/support-ticket", formData)
}