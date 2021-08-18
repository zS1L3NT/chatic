package com.zectan.chatic

import android.os.Bundle
import android.util.DisplayMetrics
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.NavController
import androidx.navigation.fragment.NavHostFragment
import androidx.recyclerview.widget.LinearSmoothScroller
import androidx.recyclerview.widget.RecyclerView
import com.google.firebase.firestore.FirebaseFirestore
import com.zectan.chatic.classes.CrashDebugApplication
import com.zectan.chatic.databinding.ActivityMainBinding
import com.zectan.chatic.models.Status
import com.zectan.chatic.viewmodels.MainViewModel


class MainActivity : CrashDebugApplication() {
    private lateinit var binding: ActivityMainBinding
    private lateinit var mMainVM: MainViewModel
    private val mDb = FirebaseFirestore.getInstance()

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

        mMainVM.userId = intent.extras!!.getString("userId")

        // NavHostFragment
        val navHostFragment = supportFragmentManager.findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        navController = navHostFragment.navController

        // Set messages received
        mMainVM.myStatuses.observe(this, this::onStatusesChange)
    }

    override fun onResume() {
        super.onResume()
        mMainVM.watch(this)
    }

    private fun onStatusesChange(statuses: List<Status>) {
        statuses
            .filter { it.userId == mMainVM.userId }
            .filter { it.state == 1 }
            .forEach {
                mDb
                    .collection("statuses")
                    .document(it.id)
                    .update("state", 2)
            }
    }
}