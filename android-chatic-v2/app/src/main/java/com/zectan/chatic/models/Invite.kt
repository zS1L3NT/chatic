package com.zectan.chatic.models

data class Invite(
    val id: String,
    val chatId: String,
    val expires: Long
) {
    constructor() : this("", "", 0)

    override fun equals(other: Any?): Boolean {
        return when (other) {
            is Invite -> this.id == other.id &&
                    this.chatId == other.chatId &&
                    this.expires == other.expires
            else -> false
        }
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + chatId.hashCode()
        result = 31 * result + expires.hashCode()
        return result
    }
}