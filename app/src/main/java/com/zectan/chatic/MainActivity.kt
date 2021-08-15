package com.zectan.chatic

import android.os.Bundle
import androidx.lifecycle.ViewModelProvider
import com.zectan.chatic.classes.CrashDebugApplication
import com.zectan.chatic.databinding.ActivityMainBinding
import com.zectan.chatic.viewmodels.MainViewModel
import android.util.Log
import java.lang.RuntimeException


class MainActivity : CrashDebugApplication() {
    private lateinit var binding: ActivityMainBinding
    private lateinit var mMainVM: MainViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Check for authentication
//        if (FirebaseAuth.getInstance().currentUser == null) {
//            val intent = Intent(this, AuthActivity::class.java)
//            startActivity(intent)
//            finish()
//            return
//        }

        val provider = ViewModelProvider(this)
        mMainVM = provider.get(MainViewModel::class.java)

        mMainVM.userId = "user-1"
    }

    override fun onResume() {
        super.onResume()
        mMainVM.watch(this)
    }
}