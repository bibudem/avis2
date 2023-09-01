import mongoose from 'mongoose'

const AvisSchema = new mongoose.Schema({
  message: {
    type: String,
    // required: [true, 'Merci de préciser le message de votre avis.']
  },
  active: {
    type: Boolean,
    default: false,
    index: -1,
    validate: {
      validator: function (v) {
        return v ? !!this.message : true
      },
      message: 'Impossible d\'activer cet avis: il n\'a pas de message.'
    }
  }
},
  {
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated'
    },
    toObject: {
      versionKey: false,
      // flattenObjectIds: true
    },
    statics: {
      getList() {
        return this.find().sort({ active: -1, updated: -1 }).limit(15)
      },
      async setActive(id) {

        const doc = await this.findById(id)

        if (!doc) {
          return {
            success: false,
            message: 'Cet avis n\'existe pas.'
          }
        }

        try {
          doc.active = true

          await doc.save()

        } catch (error) {
          return {
            success: false,
            message: error.message
          }
        }

        await this.findManyAndUpdate({ active: true }, { active: false })

        return {
          success: true
        }

      }
    }
  }
)

export default mongoose.models.Avis || mongoose.model('Avis', AvisSchema)