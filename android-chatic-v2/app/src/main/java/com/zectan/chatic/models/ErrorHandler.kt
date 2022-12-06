package com.zectan.chatic.models

import android.os.Bundle
import android.text.Html
import android.text.Spanned
import com.google.firebase.firestore.FirebaseFirestore
import java.util.regex.Matcher
import java.util.regex.Pattern
import java.util.stream.Collectors

class ErrorHandler {
    companion object {
        fun fromBundle(bundle: Bundle): ErrorHandler {
            val stack = bundle.getStringArrayList("stack") ?: ArrayList()
            val className = bundle.getString("className") ?: "class.not.Defined"
            val message = bundle.getString("message") ?: "Error message not provided"
            return ErrorHandler(stack, className, message)
        }
    }

    private val mDb = FirebaseFirestore.getInstance()
    private val stack: ArrayList<String>
    val className: String
    val message: String

    constructor(e: Throwable) {
        stack = ArrayList(e.stackTrace.map { line -> line.toString() })
        className = e.javaClass.name
        message = e.message ?: ""
    }

    private constructor(stack: ArrayList<String>, className: String, message: String) {
        this.stack = stack
        this.className = className
        this.message = message
    }

    fun toBundle(): Bundle {
        val bundle = Bundle()
        bundle.putStringArrayList("stack", stack)
        bundle.putString("className", className)
        bundle.putString("message", message)
        return bundle
    }

    fun report(userId: String, safe: Boolean) {
        val map = HashMap<String, Any>()
        map["stack"] = stack
        map["className"] = className
        map["message"] = message
        map["userId"] = userId
        map["safe"] = safe
        mDb.collection("errors").add(map)
    }

    fun getErrorText(): Spanned {
        return Html.fromHtml(
            String.format(
                "<h1>%s</h1><br /><h5>%s</h5>",
                message,
                className
            ), Html.FROM_HTML_MODE_COMPACT
        )
    }

    fun getStackText(): Spanned {
        return Html.fromHtml(
            stack
                .stream()
                .map {
                    // Use Regex to print the stack with HTML
                    val pattern: Pattern = Pattern.compile("(.*)\\((.*)\\)")
                    val matcher: Matcher = pattern.matcher(it)
                    if (matcher.find()) {
                        // If the line matches the Regex
                        val path: String = matcher.group(1) ?: ""
                        val file: String = matcher.group(2) ?: ""
                        return@map String.format(
                            "%s<br /> <b>%s</b>",
                            path.replace(".", "<br />"),
                            file
                        )
                    } else {
                        return@map it
                    }
                }
                .collect(Collectors.joining("<br /><br />")),
            Html.FROM_HTML_MODE_COMPACT
        )
    }
}