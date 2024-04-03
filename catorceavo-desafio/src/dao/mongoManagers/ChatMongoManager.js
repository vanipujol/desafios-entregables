import messagesModel from "../models/messages.model.js";
class ChatMongoManager {

    /**
     * Adds a new message or messages to the database.
     * @param {Object|Array} messages - The message or array of messages to be added.
     * @returns {Promise<Object>} The newly added message or array of messages.
     */
    addMessage = async (messages) => {
        return await messagesModel.create(messages);
    };
}

export {ChatMongoManager};
