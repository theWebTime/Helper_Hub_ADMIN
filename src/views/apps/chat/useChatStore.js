import axios from "@axios";
import http from "../../../http-common";

export const useChatStore = defineStore("chat", {
  // ℹ️ arrow function recommended for full type inference
  state: () => ({
    contacts: [],
    chatsContacts: [],
    profileUser: undefined,
    activeChat: null,
  }),
  actions: {
    async fetchChatsAndContacts(q) {
      const { data } = await axios.get("/apps/chat/chats-and-contacts", {
        params: { q },
      });

      const personalContactList = await http.get("/message/contact-list", {
        params: { q },
      });

      const personalChatContactList = await http.get(
        "/message/message-contact-list",
        {
          params: { q },
        }
      );
      const { chatsContacts, contacts, profileUser } = data;

      this.chatsContacts = personalChatContactList.data.data;
      this.contacts = personalContactList.data.data;
      this.profileUser = profileUser;
    },
    async getChat(userId) {
      const { data } = await axios.get(`/apps/chat/chats/${userId}`);

      const personalChatList = await http.get(`/message/chat-list/${userId}`);
      this.activeChat = personalChatList.data.data;
    },
    async sendMsg(message) {
      // const senderId = this.profileUser?.id;
      const formData = new FormData();
      formData.append("message", message.message);
      formData.append("is_file", message.is_file);
      console.log(formData);
      const { data } = await http.post(
        `/message/send-message/${this.activeChat?.contact.id}`,
        formData
      );
      this.getChat(this.activeChat?.contact.id);
      this.fetchChatsAndContacts();
      // const { msg, chat } = data;

      // ? If it's not undefined => New chat is created (Contact is not in list of chats)
      // if (chat !== undefined) {
      //   const activeChat = this.activeChat;

      //   this.chatsContacts.push({
      //     ...activeChat.contact,
      //     chat: {
      //       id: chat.id,
      //       lastMessage: [],
      //       unseenMsgs: 0,
      //       messages: [msg],
      //     },
      //   });
      //   if (this.activeChat) {
      //     this.activeChat.chat = {
      //       id: chat.id,
      //       messages: [msg],
      //       unseenMsgs: 0,
      //       userId: this.activeChat?.contact.id,
      //     };
      //   }
      // } else {
      //   this.activeChat?.chat?.messages.push(msg);
      // }

      // // Set Last Message for active contact
      // const contact = this.chatsContacts.find((c) => {
      //   if (this.activeChat) return c.id === this.activeChat.contact.id;

      //   return false;
      // });

      // contact.chat.lastMessage = msg;
    },
  },
});
