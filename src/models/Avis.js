import mongoose from 'mongoose'

const AvisSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Merci de préciser le message de votre avis.']
  },
  active: {
    type: Boolean,
    default: false
  }
},
  {
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated'
    },
    toObject: {
      versionKey: false
    }
  }
)

export default mongoose.models.Avis || mongoose.model('Avis', AvisSchema)