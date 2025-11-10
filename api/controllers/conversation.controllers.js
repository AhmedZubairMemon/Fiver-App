import Conversation from "../models/conversation.model.js"
import createError from "../utils/createError.js";

export const createConversation = async (req, res, next)=>{
    
    

    const conversationId = req.isSeller 
  ? req.userId + req.body.to 
  : req.body.to + req.userId;
    try {
        const existingConv = await Conversation.findOne({ id: conversationId });
        if (existingConv) return res.status(200).send(existingConv);
        const newConversation = new Conversation({
            id: conversationId,
            sellerId: req.isSeller ? req.userId : req.body.to,
            buyerId: req.isSeller ? req.body.to : req.userId,
            readBySeller: req.isSeller,
            readByBuyer: !req.isSeller
        })
    
        const savedConversation = await newConversation.save();
        res.status(201).send(savedConversation);
    } catch (error) {
        next(error)
    }
}

export const updateConversation = async(req, res, next)=>{
    try {
        const updateConversation = await Conversation.findOneAndUpdate(
            {_id: req.params.id},
            {
                $set:{
                    // readBySeller:true,
                    // readByBuyer: true,

                    ...(req.isSeller ? {readBySeller:true} : {readByBuyer: true})
                }
            },
            {new:true}
        )
    res.status(200).send(updateConversation);
    } catch (error) {
        next(error)
    }
}

export const getSingleConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      $or: [
        { sellerId: req.params.firstId, buyerId: req.params.secondId },
        { sellerId: req.params.secondId, buyerId: req.params.firstId }
      ]
    });
    if (!conversation) return next(createError(404, "Conversation not found"));
    res.status(200).json(conversation);
  } catch (err) {
    next(err);
  }
};
export const getConversations = async (req, res, next)=>{
    try {
        const conversations = await Conversation.find(
            req.isSeller ? {sellerId: req.userId} : {buyerId: req.userId}
        ).sort({updatedAt:-1})
        res.status(200).send(conversations)
    } catch (error) {
        next(error)
    }
}