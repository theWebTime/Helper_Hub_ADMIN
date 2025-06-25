<script setup>
import { useChatStore } from "@/views/apps/chat/useChatStore";
import { formatDate } from "@core/utils/formatters";

const store = useChatStore();

const extension = ["png", "jpg", "jpeg"];
const contact = computed(() => ({
  id: store.activeChat?.contact.id,
  avatar: store.activeChat?.contact.avatar,
}));

const msgGroups = computed(() => {
  let messages = [];
  const _msgGroups = [];
  if (store.activeChat.chat.length > 0) {
    messages = store.activeChat.chat;
    let msgSenderId = messages[0].senderId;
    let msgGroup = {
      senderId: msgSenderId,
      messages: [],
    };
    messages.forEach((msg, index) => {
      if (msgSenderId === msg.senderId) {
        msgGroup.messages.push({
          message: msg.message,
          is_file: msg.is_file,
          file: msg.file,
          time: msg.created_at,
          feedback: msg.feedback,
        });
      } else {
        msgSenderId = msg.senderId;
        _msgGroups.push(msgGroup);
        msgGroup = {
          senderId: msg.senderId,
          messages: [
            {
              message: msg.message,
              is_file: msg.is_file,
          file: msg.file,
              time: msg.created_at,
              feedback: msg.feedback,
            },
          ],
        };
      }
      if (index === messages.length - 1) _msgGroups.push(msgGroup);
    });
  }

  return _msgGroups;
});
</script>

<template>
  <div class="chat-log pa-5">
    <!-- {{ msgGroups }} -->
    <div
      v-for="(msgGrp, index) in msgGroups"
      :key="msgGrp.senderId + String(index)"
      class="chat-group d-flex align-start"
      :class="[
        {
          'flex-row-reverse': msgGrp.senderId !== contact.id,
          'mb-4': msgGroups.length - 1 !== index,
        },
      ]"
    >
      <div
        class="chat-avatar"
        :class="msgGrp.senderId !== contact.id ? 'ms-4' : 'me-4'"
      >
        <VAvatar size="32">
          <VImg
            :src="
              msgGrp.senderId === contact.id
                ? contact.avatar
                : store.profileUser?.avatar
            "
          />
        </VAvatar>
      </div>
      <div
        class="chat-body d-inline-flex flex-column"
        :class="msgGrp.senderId !== contact.id ? 'align-end' : 'align-start'"
      >
        <p
          v-for="(msgData, msgIndex) in msgGrp.messages"
          :key="msgData.time"
          class="chat-content py-2 px-4 elevation-1"
          style="background-color: rgb(var(--v-theme-surface))"
          :class="[
            msgGrp.senderId === contact.id
              ? 'chat-left'
              : 'bg-primary text-white chat-right',
            msgGrp.messages.length - 1 !== msgIndex ? 'mb-3' : 'mb-1',
          ]"
        >
        <!-- {{msgGrp}} -->
        <section v-if="msgData.is_file">
                                  <a :href="msgData.file" download="" target="_blank">
                                    <template v-if="extension.includes(msgData.file.split('.').pop())">
                                      <img :src="msgData.file" class="mb-0" height="100" width="100">
                                    </template>
                                    <template v-else>
                                      Attachment
                                    </template>
                                  
                                  </a>
                                </section>
                                <section v-else>
                                  <p class="mb-0">{{msgData.message}}</p>
                                </section>
        </p>
        <div :class="{ 'text-right': msgGrp.senderId !== contact.id }">
          <span class="text-sm ms-1 text-disabled">
            {{
              formatDate(msgGrp.messages[msgGrp.messages.length - 1].time, {
                hour: "numeric",
                minute: "numeric",
              })
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.chat-log {
  .chat-content {
    border-end-end-radius: 6px;
    border-end-start-radius: 6px;

    &.chat-left {
      border-start-end-radius: 6px;
    }

    &.chat-right {
      border-start-start-radius: 6px;
    }
  }
}
</style>
