package com.zectan.chatic.models

data class Presence(
    val id: String,
    val userId: String,
    val deviceId: String,
    var isOnline: Boolean,
    var typingTo: String?,
    var lastSeen: Long
) {
    constructor() : this("", "", "", false, null, 0)

    override fun equals(other: Any?): Boolean {
        return when (other) {
            is Presence -> this.id == other.id &&
                    this.userId == other.userId &&
                    this.deviceId == other.deviceId &&
                    this.isOnline == other.isOnline &&
                    this.typingTo == other.typingTo &&
                    this.lastSeen == other.lastSeen
            else -> false
        }
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + userId.hashCode()
        result = 31 * result + deviceId.hashCode()
        result = 31 * result + isOnline.hashCode()
        result = 31 * result + (typingTo?.hashCode() ?: 0)
        result = 31 * result + lastSeen.hashCode()
        return result
    }
}
