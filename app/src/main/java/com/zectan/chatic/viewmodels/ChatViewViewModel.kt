package com.zectan.chatic.viewmodels

import androidx.lifecycle.ViewModel
import com.zectan.chatic.classes.StrictLiveData
import java.util.*

class ChatViewViewModel : ViewModel() {
    private var messages: MutableMap<String, StrictLiveData<MessageBuilder>> = HashMap()
    var editing = false

    fun getMessageBuilder(chatId: String): StrictLiveData<MessageBuilder> {
        if (messages[chatId] == null) {
            messages[chatId] = StrictLiveData(MessageBuilder("", null, null))
        }
        return messages[chatId]!!
    }

    fun resetMessageBuilder(chatId: String) {
        if (messages[chatId] == null) {
            messages[chatId] = StrictLiveData(MessageBuilder("", null, null))
        } else {
            messages[chatId]!!.value = MessageBuilder("", null, null)
        }
    }

    fun setContent(chatId: String, content: String) {
        val messageBuilder = getMessageBuilder(chatId).value
        messageBuilder.content = content
        messages[chatId]!!.value = messageBuilder
    }

    fun setMedia(chatId: String, media: String?) {
        val messageBuilder = getMessageBuilder(chatId).value
        messageBuilder.media = media
        messages[chatId]!!.value = messageBuilder
    }

    fun setReplyId(chatId: String, replyId: String?) {
        val messageBuilder = getMessageBuilder(chatId).value
        messageBuilder.replyId = replyId
        messages[chatId]!!.value = messageBuilder
    }
}

data class MessageBuilder(var content: String, var media: String?, var replyId: String?)