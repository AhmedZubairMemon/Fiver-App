import Message from "../models/message.model.js"
import Conversation from "../models/conversation.model.js"

export const createMessage = async (req, res, next)=>{
    const newMessage = await new Message({
        conversationId: req.body.conversationId,
        userId: req.userId,
        desc: req.body.desc
    })
    try {
        const savedMessage = await newMessage.save()
        await Conversation.findOneAndUpdate(
            {id: req.body.conversationId},
            {
                $set:{
                    readBySeller: req.isSeller,
                    readByBuyer:! req.isSeller,
                    lastMessage: req.body.desc,
                }
            },
            {new:true}
        )
        res.status(201).send(savedMessage)
    } catch (error) {
        next(error)
    }
}

export const getMessage = async (req, res, next)=>{
    try {
        const message = await  Message.find({conversationId: req.params.id});
        res.status(200).send(message);
    } catch (error) {
        next(error)
    }
}