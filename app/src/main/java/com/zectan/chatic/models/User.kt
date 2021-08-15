package com.zectan.chatic.models

data class User(
    val id: String,
    var username: String,
    val email: String,
    var photo: String
) {
    constructor(): this("", "", "", "")
}