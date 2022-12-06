package com.zectan.chatic.activities

import android.content.Intent
import android.os.Bundle
import com.google.firebase.auth.FirebaseAuth
import com.zectan.chatic.R
import com.zectan.chatic.classes.CrashDebugApplication
import com.zectan.chatic.databinding.ActivityErrorBinding
import com.zectan.chatic.models.ErrorHandler

class ErrorActivity : CrashDebugApplication() {
    private val mAuth: FirebaseAuth = FirebaseAuth.getInstance()
    private lateinit var binding: ActivityErrorBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityErrorBinding.inflate(layoutInflater)
        setContentView(binding.root)
        window.statusBarColor = getColor(R.color.red)

        binding.reloadImage.setOnClickListener { onReloadImageClicked() }
        binding.arrowImage.setOnClickListener { onArrowImageClicked() }

        val errorHandler =
            ErrorHandler.fromBundle(intent.extras?.getBundle("errorHandler") ?: Bundle())
        binding.errorText.maxLines = Int.MAX_VALUE
        binding.stackText.maxLines = Int.MAX_VALUE
        binding.errorText.text = errorHandler.getErrorText()
        binding.stackText.text = errorHandler.getStackText()

        errorHandler.report(mAuth.uid ?: "unknown", false)
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