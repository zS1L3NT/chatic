package com.zectan.chatic.utils

import java.util.*

class Date {
    companion object {
        fun getTime(date: Long): String {
            val calendar = Calendar.Builder().setInstant(date).build()

            val hour = "${calendar.get(Calendar.HOUR)}".padStart(2, '0')
            val minute = "${calendar.get(Calendar.MINUTE)}".padStart(2, '0')
            val meridiem = when (calendar.get(Calendar.AM_PM)) {
                Calendar.AM -> "am"
                Calendar.PM -> "pm"
                else -> ""
            }

            return "$hour:$minute$meridiem"
        }
    }
}