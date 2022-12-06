package com.zectan.chatic.activities

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.zectan.chatic.MainActivity
import com.zectan.chatic.classes.CrashDebugApplication

class SplashActivity : CrashDebugApplication() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // TODO Change this back to MainActivity
        val intent = Intent(this, DebugActivity::class.java)
        startActivity(intent)
        finish()
    }

}