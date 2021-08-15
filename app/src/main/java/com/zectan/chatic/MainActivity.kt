package com.zectan.chatic

import android.os.Bundle
import com.zectan.chatic.classes.CrashDebugApplication
import com.zectan.chatic.databinding.ActivityMainBinding

class MainActivity : CrashDebugApplication() {
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }
}