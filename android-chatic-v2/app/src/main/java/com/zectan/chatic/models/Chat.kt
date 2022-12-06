package com.zectan.chatic.models

data class Chat(
    val id: String,
    var admins: List<String>?,
    var users: List<String>,
    var photo: String?,
    var name: String?,
    val type: Int
) {
    companion object {
        const val DIRECT = 0
        const val GROUP = 1
    }

    constructor() : this("", null, ArrayList(), null, null, -1)

    override fun equals(other: Any?): Boolean {
        return when (other) {
            is Chat -> this.id == other.id &&
                this.admins == other.admins &&
                this.users == other.users &&
                this.photo == other.photo &&
                this.name == other.name &&
                this.type == other.type
            else -> false
        }
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + (admins?.hashCode() ?: 0)
        result = 31 * result + users.hashCode()
        result = 31 * result + (photo?.hashCode() ?: 0)
        result = 31 * result + (name?.hashCode() ?: 0)
        result = 31 * result + type.hashCode()
        return result
    }
}