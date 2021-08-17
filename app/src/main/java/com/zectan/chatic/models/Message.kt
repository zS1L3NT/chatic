package com.zectan.chatic.models

data class Message(
    val id: String,
    var content: String,
    val media: String?,
    val date: Long,
    var replyId: String?,
    val userId: String,
    val chatId: String
) {
    constructor() : this("", "", null, 0, null, "", "")

    override fun equals(other: Any?): Boolean {
        return when (other) {
            is Message -> this.id == other.id &&
                    this.content == other.content &&
                    this.media == other.media &&
                    this.date == other.date &&
                    this.replyId == other.replyId &&
                    this.userId == other.userId &&
                    this.chatId == other.chatId
            else -> false
        }
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + content.hashCode()
        result = 31 * result + (media?.hashCode() ?: 0)
        result = 31 * result + date.hashCode()
        result = 31 * result + (replyId?.hashCode() ?: 0)
        result = 31 * result + userId.hashCode()
        result = 31 * result + chatId.hashCode()
        return result
    }
}