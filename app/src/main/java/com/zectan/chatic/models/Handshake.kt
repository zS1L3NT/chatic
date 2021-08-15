package com.zectan.chatic.models

data class Handshake(
    val id: String,
    val users: List<String>,
    val requestId: String,
    val targetId: String,
    val date: Long
) {
    constructor(): this("", ArrayList(), "", "", 0)
}