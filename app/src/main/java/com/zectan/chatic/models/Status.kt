package com.zectan.chatic.models

data class Status(
    val id: String,
    val userId: String,
    val messageId: String,
    val chatId: String,
    var state: Int
) {
    constructor() : this("", "", "", "", 0)

    override fun equals(other: Any?): Boolean {
        return when (other) {
            is Status -> this.id == other.id &&
                    this.userId == other.userId &&
                    this.messageId == other.messageId &&
                    this.chatId == other.chatId &&
                    this.state == other.state
            else -> false
        }
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + userId.hashCode()
        result = 31 * result + messageId.hashCode()
        result = 31 * result + chatId.hashCode()
        result = 31 * result + state
        return result
    }
}
