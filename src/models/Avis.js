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
      transform
    },
    toJSON: {
      transform
    },
    statics: {
      getCurrent() {
        return this.findOne({ active: true }).exec()
      },
      getList() {
        return this.find({ active: false }).sort({ created: -1 }).limit(15)
      },
      async toggleActive(id, active) {

        const doc = await this.findById(id)

        if (!doc) {
          return {
            success: false,
            message: 'Cet avis n\'existe pas.'
          }
        }

        try {

          doc.active = active

          await doc.save()

        } catch (error) {

          return {
            success: false,
            message: error.errors['active'].message
          }
        }

        await this.updateMany({ active: true, _id: { $ne: id } }, { active: false })

        return {
          success: true
        }

      }
    }
  }
)

function transform(doc, { _id, message, active }) {
  return {
    id: _id.toString(),
    message,
    active
  }
}

export default mongoose.models.Avis || mongoose.model('Avis', AvisSchema)