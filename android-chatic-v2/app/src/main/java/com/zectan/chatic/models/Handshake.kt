package com.zectan.chatic.models

data class Handshake(
    val id: String,
    val users: List<String>,
    val requestId: String,
    val targetId: String,
    val date: Long
) {
    constructor() : this("", ArrayList(), "", "", 0)

    override fun equals(other: Any?): Boolean {
        return when (other) {
            is Handshake -> this.id == other.id &&
                    this.users == other.users &&
                    this.requestId == other.requestId &&
                    this.targetId == other.targetId &&
                    this.date == other.date
            else -> false
        }
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + users.hashCode()
        result = 31 * result + requestId.hashCode()
        result = 31 * result + targetId.hashCode()
        result = 31 * result + date.hashCode()
        return result
    }
}