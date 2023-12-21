import messagesModel from "../models/messages.model.js";

class ChatMongoManager {
    addMessage = async (messages) => {
        return await messagesModel.create(messages);
    };
}

export {ChatMongoManager};
