package com.zectan.chatic.classes

import android.os.Bundle
import android.view.*
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.NavController
import androidx.viewbinding.ViewBinding
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.storage.FirebaseStorage
import com.zectan.chatic.MainActivity
import com.zectan.chatic.R
import com.zectan.chatic.viewmodels.ChatViewViewModel
import com.zectan.chatic.viewmodels.MainViewModel
import android.view.MenuInflater

import android.view.ContextMenu.ContextMenuInfo

import android.view.ContextMenu

abstract class Fragment<T : ViewBinding>(private val menuId: Int) : androidx.fragment.app.Fragment() {
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

        mActivity.setSupportActionBar(binding.root.findViewById(R.id.toolbar))
        setHasOptionsMenu(true)

        val provider = ViewModelProvider(mActivity)
        mMainVM = provider.get(MainViewModel::class.java)
        mChatViewVM = provider.get(ChatViewViewModel::class.java)

        mActivity.hideKeyboard(binding.root)

        return binding.root
    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {
        super.onCreateOptionsMenu(menu, inflater)
        inflater.inflate(menuId, menu)
    }

}