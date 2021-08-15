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
    constructor(): this("", "", null, 0, null, "", "")
}