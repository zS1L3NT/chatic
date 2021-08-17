package com.zectan.chatic.fragments

import android.app.SearchManager
import android.os.Bundle
import android.view.*
import android.widget.SearchView
import androidx.recyclerview.widget.LinearLayoutManager
import com.zectan.chatic.R
import com.zectan.chatic.adapters.ChatsAdapter
import com.zectan.chatic.classes.Fragment
import com.zectan.chatic.databinding.FragmentChatsBinding
import com.zectan.chatic.models.Chat

class ChatsFragment : Fragment<FragmentChatsBinding>() {
    private val mTAG = "ChatsFragment"
    private lateinit var mAdapter: ChatsAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentChatsBinding.inflate(inflater, container, false)
        super.onCreateView(inflater, container, savedInstanceState)

        mAdapter = ChatsAdapter { onChatClicked(it) }
        binding.recyclerView.layoutManager = LinearLayoutManager(mActivity)
        binding.recyclerView.adapter = mAdapter

        mMainVM.myUser.observe(this, mAdapter::setMyUser)
        mMainVM.myChats.observe(this, mAdapter::setChats)
        mMainVM.myUsers.observe(this, mAdapter::setUsers)
        mMainVM.myStatuses.observe(this, mAdapter::setStatuses)
        mMainVM.myMessages.observe(this, mAdapter::setMessages)

        return binding.root
    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {
        mActivity.menuInflater.inflate(R.menu.chats_toolbar_menu, menu)
        val searchManager = mActivity.getSystemService(SearchManager::class.java)
        val searchItem = menu.findItem(R.id.action_search)
        if (searchItem != null) {
            val searchView = searchItem.actionView as SearchView
            searchView.setSearchableInfo(searchManager.getSearchableInfo(mActivity.componentName))
        }
        return super.onCreateOptionsMenu(menu, inflater)
    }

    private fun onChatClicked(chat: Chat) {
        mNavController.navigate(ChatsFragmentDirections.openChatView(chat.id))
    }

}