package com.zectan.chatic.models

data class Invite(
    val id: String,
    val chatId: String,
    val expires: Long
) {
    constructor(): this("", "", 0)
}