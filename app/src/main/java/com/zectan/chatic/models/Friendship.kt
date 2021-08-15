package com.zectan.chatic.models

data class Friendship(
    val id: String,
    val users: List<String>,
    val date: Long
) {
    constructor(): this("", ArrayList(), 0)
}