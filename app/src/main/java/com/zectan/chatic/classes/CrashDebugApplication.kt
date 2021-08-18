package com.zectan.chatic.classes

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.auth.FirebaseAuth
import com.zectan.chatic.activities.ErrorActivity

open class CrashDebugApplication : AppCompatActivity() {
    private val mAuth: FirebaseAuth = FirebaseAuth.getInstance()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        Thread.setDefaultUncaughtExceptionHandler { _, e ->
            run {
                val stack: ArrayList<String> = ArrayList()
                for (el in e.stackTrace) stack.add(el.toString())

                val message: String = e.message ?: ""
                val classname: String = e.javaClass.name
                val userId: String = mAuth.uid ?: "undefined"

                val intent = Intent(this@CrashDebugApplication, ErrorActivity::class.java)
                intent.putExtra("stack", stack)
                intent.putExtra("message", message)
                intent.putExtra("className", classname)
                intent.putExtra("userId", userId)

                e.printStackTrace()
                startActivity(intent)
                Runtime.getRuntime().exit(1)
            }
        }
    }

}