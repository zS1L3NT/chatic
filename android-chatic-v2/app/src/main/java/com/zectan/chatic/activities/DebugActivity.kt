package com.zectan.chatic.activities

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.zectan.chatic.MainActivity
import com.zectan.chatic.classes.CrashDebugApplication
import com.zectan.chatic.databinding.ActivityDebugBinding

class DebugActivity : CrashDebugApplication() {
    private lateinit var mainIntent: Intent

    override fun onCreate(savedInstanceState: Bundle?) {
        val binding = ActivityDebugBinding.inflate(layoutInflater)
        super.onCreate(savedInstanceState)
        setContentView(binding.root)

        mainIntent = Intent(this, MainActivity::class.java)

        binding.user1.setOnClickListener {
            mainIntent.putExtra("userId", "user-1")
            startActivity(mainIntent)
            finish()
        }

        binding.user2.setOnClickListener {
            mainIntent.putExtra("userId", "user-2")
            startActivity(mainIntent)
            finish()
        }

        binding.user3.setOnClickListener {
            mainIntent.putExtra("userId", "user-3")
            startActivity(mainIntent)
            finish()
        }
    }
}