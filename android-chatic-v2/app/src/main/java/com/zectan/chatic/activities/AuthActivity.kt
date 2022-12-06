package com.zectan.chatic.activities

import android.os.Bundle
import com.zectan.chatic.R
import com.zectan.chatic.classes.CrashDebugApplication

class AuthActivity : CrashDebugApplication() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_auth)
    }
}