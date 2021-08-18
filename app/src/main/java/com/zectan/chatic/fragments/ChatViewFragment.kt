package com.zectan.chatic.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.ItemTouchHelper
import androidx.recyclerview.widget.LinearLayoutManager
import com.zectan.chatic.adapters.MessagesAdapter
import com.zectan.chatic.adapters.MessagesItemTouchHelper
import com.zectan.chatic.classes.Fragment
import com.zectan.chatic.databinding.FragmentChatViewBinding
import com.zectan.chatic.models.Message
import com.zectan.chatic.models.Status
import java.util.*

class ChatViewFragment : Fragment<FragmentChatViewBinding>() {
    private lateinit var mAdapter: MessagesAdapter
    private lateinit var mChatId: String

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentChatViewBinding.inflate(inflater, container, false)
        super.onCreateView(inflater, container, savedInstanceState)
        mChatId = navArgs<ChatViewFragmentArgs>().value.chatId

        mAdapter = MessagesAdapter(mMainVM.myChats.value.find { it.id == mChatId }!!.type)
        val linearLayoutManager = LinearLayoutManager(mActivity)
        linearLayoutManager.stackFromEnd = true
        binding.recyclerView.layoutManager = linearLayoutManager
        binding.recyclerView.adapter = mAdapter
        ItemTouchHelper(MessagesItemTouchHelper({})).attachToRecyclerView(binding.recyclerView)

        mMainVM.myUser.observe(this, mAdapter::setMyUser)
        mMainVM.watchUsersFromChat(this, mChatId, mAdapter::setUsers)
        mMainVM.watchStatusesFromChat(this, mChatId, this::onStatusesChange)
        mMainVM.watchMessagesFromChat(this, mChatId, this::onMessagesChange)
        binding.fileImage.setOnClickListener { onFileImageClicked() }
        binding.sendImage.setOnClickListener { onSendImageClicked() }

        return binding.root
    }

    private fun onFileImageClicked() {

    }

    private fun onSendImageClicked() {
        val text = binding.messageEditText.text.toString()
        val chat = mMainVM.myChats.value.find { it.id == mChatId }!!

        if (text != "") {
            val messageDocument = mMainVM.newMessageDocument()
            val message = Message(
                messageDocument.id,
                text,
                null,
                Calendar.getInstance().timeInMillis,
                null,
                mMainVM.userId!!,
                mChatId
            )
            messageDocument.set(message)

            chat.users.forEach {
                val statusDocument = mMainVM.newStatusDocument()
                val status = Status(
                    statusDocument.id,
                    it,
                    message.id,
                    mChatId,
                    if (it != mMainVM.userId!!) 1 else 0
                )
                statusDocument.set(status)
            }

            binding.messageEditText.text.clear()

            val messages = mMainVM.myMessages.value.toMutableList()
            messages.add(message)
            mMainVM.myMessages.value = messages
        }
    }

    private fun onStatusesChange(statuses: List<Status>) {
        mAdapter.setStatuses(statuses)

        // Set messages read
        statuses
            .filter { it.userId == mMainVM.userId }
            .filter { it.state in 1..2 }
            .forEach {
                mDb
                    .collection("statuses")
                    .document(it.id)
                    .update("state", 3)
            }
    }

    private fun onMessagesChange(messages: List<Message>) {
        mAdapter.setMessages(messages.sortedBy { it.date })
        binding.recyclerView.scrollToPosition(mAdapter.itemCount - 1)
    }

}