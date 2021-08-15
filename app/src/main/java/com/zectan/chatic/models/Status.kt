package com.zectan.chatic.models

data class Status(
    val id: String,
    val userId: String,
    val messageId: String,
    val chatId: String,
    var state: Long
) {
    constructor(): this("", "", "", "", 0)
}
