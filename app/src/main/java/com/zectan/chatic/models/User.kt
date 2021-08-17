package com.zectan.chatic.models

data class User(
    val id: String,
    var username: String,
    val email: String,
    var photo: String
) {
    constructor(): this("", "", "", "")

    override fun equals(other: Any?): Boolean {
        return when (other) {
            is User -> this.id == other.id &&
                    this.username == other.username &&
                    this.email == other.email &&
                    this.photo == other.photo
            else -> false
        }
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + username.hashCode()
        result = 31 * result + email.hashCode()
        result = 31 * result + photo.hashCode()
        return result
    }
}