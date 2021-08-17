package com.zectan.chatic

import android.os.Bundle
import androidx.lifecycle.ViewModelProvider
import com.zectan.chatic.classes.CrashDebugApplication
import com.zectan.chatic.databinding.ActivityMainBinding
import com.zectan.chatic.viewmodels.MainViewModel
import androidx.navigation.NavController
import androidx.navigation.fragment.NavHostFragment


class MainActivity : CrashDebugApplication() {
    private lateinit var binding: ActivityMainBinding
    private lateinit var mMainVM: MainViewModel

    lateinit var navController: NavController

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

        // NavHostFragment
        val navHostFragment = supportFragmentManager.findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        navController = navHostFragment.navController
    }

    override fun onResume() {
        super.onResume()
        mMainVM.watch(this)
    }
}