package com.zectan.chatic.classes

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.zectan.chatic.activities.ErrorActivity
import com.zectan.chatic.models.ErrorHandler

open class CrashDebugApplication : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        Thread.setDefaultUncaughtExceptionHandler { _, e ->
            run {
                val intent = Intent(this@CrashDebugApplication, ErrorActivity::class.java)
                intent.putExtra("errorHandler", ErrorHandler(e).toBundle())

                e.printStackTrace()
                startActivity(intent)
                Runtime.getRuntime().exit(1)
            }
        }
    }

}