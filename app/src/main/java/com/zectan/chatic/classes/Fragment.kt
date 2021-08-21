package com.zectan.chatic.classes

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.NavController
import androidx.viewbinding.ViewBinding
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.storage.FirebaseStorage
import com.zectan.chatic.MainActivity
import com.zectan.chatic.viewmodels.ChatViewViewModel
import com.zectan.chatic.viewmodels.MainViewModel

abstract class Fragment<T : ViewBinding> : androidx.fragment.app.Fragment() {
    protected val mAuth = FirebaseAuth.getInstance()
    protected val mDb = FirebaseFirestore.getInstance()
    protected val mStorage = FirebaseStorage.getInstance()
    protected lateinit var binding: T
    protected lateinit var mActivity: MainActivity
    protected lateinit var mNavController: NavController

    protected lateinit var mMainVM: MainViewModel
    protected lateinit var mChatViewVM: ChatViewViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        mActivity = activity as MainActivity
        mNavController = mActivity.navController

        val provider = ViewModelProvider(mActivity)
        mMainVM = provider.get(MainViewModel::class.java)
        mChatViewVM = provider.get(ChatViewViewModel::class.java)

        mActivity.hideKeyboard(binding.root)

        return binding.root
    }

}