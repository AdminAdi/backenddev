import mongoose, { Schema } from 'mongoose';

const SubscriptionSchema = new Schema({
    suscriber:{
        type: Schema.Types.ObjectId,  //one who is subscribing
        ref: 'User'
    },
    channel:{
        type: Schema.Types.ObjectId, //one who is being subscribed
        ref: 'User'
    }
}, { timestamps: true });

export const Subscription =  mongoose.model('Subscription', SubscriptionSchema);