package com.zectan.chatic.models

data class Chat(
    val id: String,
    var admins: List<String>?,
    var users: List<String>,
    var photo: String?,
    var name: String?,
    val group: Boolean
) {
    constructor(): this("", null, ArrayList(), null, null, false)
}