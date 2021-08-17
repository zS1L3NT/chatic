package com.zectan.chatic.models

data class Friendship(
    val id: String,
    val users: List<String>,
    val date: Long
) {
    constructor() : this("", ArrayList(), 0)

    override fun equals(other: Any?): Boolean {
        return when (other) {
            is Friendship -> this.id == other.id &&
                    this.users == other.users &&
                    this.date == other.date
            else -> false
        }
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + users.hashCode()
        result = 31 * result + date.hashCode()
        return result
    }
}