import dbConnect from '@/lib/dbConnect'
import Avis from '@/models/Avis'
import { respondWithError } from '@/lib/respondWithError'
import { respond } from '@/lib/respond'
import mongoose from 'mongoose' // déjà présent via Mongoose, pas une nouvelle lib

// --- Utilitaires locaux ---

/** Retourne true si c'est un ObjectId valide. */
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id)
}

/** Filtre le payload pour ne conserver que les champs explicitement autorisés. */
function pickUpdatableFields(obj, allowed) {
  if (!obj || typeof obj !== 'object') return {}
  const out = {}
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      out[key] = obj[key]
    }
  }
  return out
}

/** Lecture sûre du JSON; renvoie {ok:true, data} ou {ok:false, error}. */
async function safeJson(request) {
  try {
    // Optionnel : vérifier le Content-Type
    const ct = request.headers.get('content-type') || ''
    if (!ct.includes('application/json')) {
      return { ok: false, error: respond({ error: { message: 'Content-Type attendu: application/json' } }, 415) }
    }
    // (facultatif) limite simple de taille : lit en texte si tu veux plafonner la longueur
    const data = await request.json()
    return { ok: true, data }
  } catch {
    return { ok: false, error: respond({ error: { message: 'Corps de requête JSON invalide' } }, 400) }
  }
}

/** Log minimal non sensible */
function logInfo(event, details = {}) {
  try {
    console.info(event, { at: new Date().toISOString(), ...details })
  } catch {}
}

function logError(event, err) {
  try {
    console.error(event, {
      at: new Date().toISOString(),
      message: err?.message,
      name: err?.name
    })
  } catch {}
}

// ===================== PUT =====================
export async function PUT(request, { params }) {
  try {
    await dbConnect()

    const id = params?.id
    if (!isValidObjectId(id)) {
      return respond({ error: { message: "Identifiant d'avis invalide" } }, 400)
    }

    const body = await safeJson(request)
    if (!body.ok) return body.error

    // --- Whitelist stricte des champs modifiables ---
    const allowed = ['message', 'statut'] // <--- adapte à ton schéma
    const update = pickUpdatableFields(body.data, allowed)

    if (Object.keys(update).length === 0) {
      return respond({ error: { message: 'Aucun champ de mise à jour fourni' } }, 400)
    }

    // Optionnel : normaliser/trim
    if (typeof update.message === 'string') {
      update.message = update.message.trim()
    }

    // Sécurité Mongoose : applique validateurs & renvoie le doc mis à jour
    const updated = await Avis.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
      context: 'query'
    }).lean()

    if (!updated) {
      return respond({ error: { message: "L'avis est introuvable" } }, 404)
    }

    logInfo('Avis mis à jour', { avisId: id, fields: Object.keys(update) })

    return respond({ message: 'Avis mis à jour', avis: updated }, 200)
  } catch (error) {
    // Cartographie basique des erreurs fréquentes
    if (error?.name === 'ValidationError') {
      return respond({ error: { message: 'Validation Mongoose échouée' } }, 400)
    }
    if (error?.name === 'CastError') {
      return respond({ error: { message: 'Type de donnée invalide' } }, 400)
    }
    logError('PUT /api/avis/[id] - erreur interne', error)
    return respondWithError(error)
  }
}

// ===================== DELETE =====================
export async function DELETE(_request, { params }) {
  try {
    await dbConnect()

    const id = params?.id
    if (!isValidObjectId(id)) {
      return respond({ error: { message: "Identifiant d'avis invalide" } }, 400)
    }

    // Suppression atomique + retour du doc supprimé (lean pour un objet simple)
    const deleted = await Avis.findOneAndDelete({ _id: id }).lean()

    if (!deleted) {
      return respond(
        { message: "L'avis n'existe pas dans la base de données." },
        404
      )
    }

    // Log non sensible (pas de message en clair)
    logInfo('Avis supprimé', { avisId: id })

    return respond({ message: 'Avis supprimé avec succès.' }, 200)
  } catch (error) {
    if (error?.name === 'CastError') {
      return respond({ error: { message: 'Type de donnée invalide' } }, 400)
    }
    logError('DELETE /api/avis/[id] - erreur interne', error)
    return respondWithError(error)
  }
}