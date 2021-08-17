package com.zectan.chatic.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import com.zectan.chatic.adapters.MessagesAdapter
import com.zectan.chatic.classes.Fragment
import com.zectan.chatic.databinding.FragmentChatViewBinding

class ChatViewFragment : Fragment<FragmentChatViewBinding>() {
    private lateinit var mAdapter: MessagesAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentChatViewBinding.inflate(inflater, container, false)
        super.onCreateView(inflater, container, savedInstanceState)
        val chatId = navArgs<ChatViewFragmentArgs>().value.chatId

        mAdapter = MessagesAdapter()
        binding.recyclerView.layoutManager = LinearLayoutManager(mActivity)
        binding.recyclerView.adapter = mAdapter

        mMainVM.myUser.observe(this, mAdapter::setMyUser)
        mMainVM.watchUsersFromChat(this, chatId, mAdapter::setUsers)
        mMainVM.watchStatusesFromChat(this, chatId, mAdapter::setStatuses)
        mMainVM.watchMessagesFromChat(this, chatId, mAdapter::setMessages)

        return binding.root
    }

}