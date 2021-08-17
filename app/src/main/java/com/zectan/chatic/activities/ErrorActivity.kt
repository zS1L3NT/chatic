package com.zectan.chatic.activities

import android.content.Intent
import android.graphics.drawable.ColorDrawable
import android.os.Bundle
import android.text.Html
import androidx.appcompat.app.AppCompatActivity
import com.zectan.chatic.R
import com.zectan.chatic.databinding.ActivityErrorBinding
import java.util.regex.Matcher
import java.util.regex.Pattern
import java.util.stream.Collectors

class ErrorActivity : AppCompatActivity() {
    private lateinit var binding: ActivityErrorBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityErrorBinding.inflate(layoutInflater)
        setContentView(binding.root)
        window.statusBarColor = getColor(R.color.red)

        binding.reloadImage.setOnClickListener { onReloadImageClicked() }
        binding.arrowImage.setOnClickListener { onArrowImageClicked() }

        try {
            val extras = intent.extras ?: Bundle()
            val stack = extras.getStringArrayList("stack") ?: ArrayList()
            val message = extras.getString("message", "Error message not provided")
            val className = extras.getString("className", "class.not.Defined")
            // val userId = extras.getString("userId", "undefined")

            binding.errorText.text = Html.fromHtml(
                java.lang.String.format(
                    "<h1>%s</h1><br /><h5>%s</h5>",
                    message,
                    className
                ), Html.FROM_HTML_MODE_COMPACT
            )
            binding.stackText.text = Html.fromHtml(
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
        } catch (err: Exception) {

        }
    }

    private fun onReloadImageClicked() {
        val intent = Intent(this, SplashActivity::class.java)
        startActivity(intent)
        finish()
    }

    private fun onArrowImageClicked() {
        if (binding.root.progress >= 0.5) {
            binding.root.transitionToStart()
        } else {
            binding.root.transitionToEnd()
        }
    }
}