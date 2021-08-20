package com.zectan.chatic.fragments

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.text.Editable
import android.text.TextWatcher
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
import com.zectan.chatic.viewmodels.MessageBuilder
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
        ItemTouchHelper(MessagesItemTouchHelper {
            // Delay to let the view holder item animation finish
            Handler(Looper.getMainLooper()).postDelayed({
                mChatViewVM.setReplyId(mChatId, mAdapter.getMessage(it).id)
            }, 250)
        }).attachToRecyclerView(binding.recyclerView)

        mMainVM.myUser.observe(this, mAdapter::setMyUser)
        mMainVM.watchUsersFromChat(this, mChatId, mAdapter::setUsers)
        mMainVM.watchStatusesFromChat(this, mChatId, this::onStatusesChange)
        mMainVM.watchMessagesFromChat(this, mChatId, this::onMessagesChange)
        mChatViewVM.getMessageBuilder(mChatId).observe(this, { onMessageBuilderChange(it) })
        binding.typebox.fileImage.setOnClickListener { onFileImageClicked() }
        binding.typebox.sendImage.setOnClickListener { onSendImageClicked() }
        binding.typebox.replyCloseImage.setOnClickListener { onReplyCloseClicked() }
        binding.typebox.messageEditText.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
            }

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
            }

            override fun afterTextChanged(s: Editable?) {
                if (!mChatViewVM.editing) {
                    val text = s.toString()
                    mChatViewVM.setContent(mChatId, text)
                    binding.typebox.messageEditText.setSelection(text.length)
                }
            }
        })

        return binding.root
    }

    private fun onReplyCloseClicked() {
        mChatViewVM.setReplyId(mChatId, null)
    }

    private fun onFileImageClicked() {

    }

    private fun onSendImageClicked() {
        val messageBuilder = mChatViewVM.getMessageBuilder(mChatId).value
        val chat = mMainVM.myChats.value.find { it.id == mChatId }!!

        if (messageBuilder.content != "") {
            val messageDocument = mMainVM.newMessageDocument()
            val message = Message(
                messageDocument.id,
                messageBuilder.content,
                messageBuilder.media,
                Calendar.getInstance().timeInMillis,
                messageBuilder.replyId,
                mMainVM.userId,
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
                    if (it != mMainVM.userId) 1 else 0
                )
                statusDocument.set(status)
            }

            mChatViewVM.resetMessageBuilder(mChatId)
        }
    }

    private fun onMessageBuilderChange(messageBuilder: MessageBuilder) {
        // region Content
        if (binding.typebox.messageEditText.text.toString() == "") {
            mChatViewVM.editing = true
            binding.typebox.messageEditText.setText(messageBuilder.content)
            mChatViewVM.editing = false
        }

        if (messageBuilder.content == "") {
            mChatViewVM.editing = true
            binding.typebox.messageEditText.setText("")
            mChatViewVM.editing = false
        }
        // endregion

        // region Media
        // endregion

        // region Reply
        val replyId = messageBuilder.replyId
        val repliedMessage = mMainVM.myMessages.value.find { it.id == replyId }
        val repliedUser = mMainVM.myUsers.value.find { it.id == repliedMessage?.userId }

        if (replyId != null && repliedMessage != null && repliedUser != null) {
            binding.typebox.reply.usernameText.text = repliedUser.username
            binding.typebox.reply.contentText.text = repliedMessage.content
            binding.root.requestLayout()
            binding.typebox.motionLayout.transitionToEnd()
        } else {
            binding.typebox.motionLayout.transitionToStart()
        }
        // endregion
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