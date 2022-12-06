package com.zectan.chatic.utils

import java.util.*

class Date(private val ms: Long) {
    fun getDateTime(): String {
        val calendar = Calendar.Builder().setInstant(ms).build()

        val hour = "${calendar.get(Calendar.HOUR)}".padStart(2, '0')
        val minute = "${calendar.get(Calendar.MINUTE)}".padStart(2, '0')
        val meridiem = when (calendar.get(Calendar.AM_PM)) {
            Calendar.AM -> "am"
            Calendar.PM -> "pm"
            else -> ""
        }

        return "$hour:$minute$meridiem"
    }

    fun getLastSeen(): String {
        val diff = Calendar.getInstance().timeInMillis - ms

        val seconds = diff / 1000
        if (seconds < 60) {
            // Less than 60 seconds
            return "Just went offline"
        }

        val minutes = seconds / 60
        if (minutes < 60) {
            return "Last seen $minutes minutes ago"
        }

        val hours = minutes / 60
        if (hours < 24) {
            return "Last seen $hours hours ago"
        }

        val days = hours / 24
        if (days < 30) {
            return "Last seen $days days ago"
        }

        return "Not online in a while"
    }
}