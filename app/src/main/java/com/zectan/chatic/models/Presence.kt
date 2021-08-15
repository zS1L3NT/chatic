package com.zectan.chatic.models

data class Presence(
    val id: String,
    val userId: String,
    val deviceId: String,
    var isOnline: Boolean,
    var typingTo: String?,
    var lastSeen: Long
) {
    constructor(): this("", "", "", false, null, 0)
}
