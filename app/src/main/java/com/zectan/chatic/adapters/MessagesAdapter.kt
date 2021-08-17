package com.zectan.chatic.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.bumptech.glide.load.resource.drawable.DrawableTransitionOptions
import com.zectan.chatic.R
import com.zectan.chatic.databinding.ListItemMessageReceivedBinding
import com.zectan.chatic.databinding.ListItemMessageSentBinding
import com.zectan.chatic.models.Message
import com.zectan.chatic.models.Status
import com.zectan.chatic.models.User
import com.zectan.chatic.utils.Date
import java.util.*
import kotlin.collections.ArrayList

class MessagesAdapter : RecyclerView.Adapter<RecyclerView.ViewHolder>() {
    companion object {
        private const val SENT = 0
        private const val RECEIVED = 1
    }

    private var myUser: User = User()
    private var mUsers: List<User> = ArrayList()
    private var mStatuses: List<Status> = ArrayList()
    private var mMessages: List<Message> = ArrayList()

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        val inflater = LayoutInflater.from(parent.context)
        return when (viewType) {
            SENT -> {
                val itemView = inflater.inflate(R.layout.list_item_message_sent, parent, false)
                MessageSentViewHolder(itemView)
            }
            RECEIVED -> {
                val itemView = inflater.inflate(R.layout.list_item_message_received, parent, false)
                MessageReceivedViewHolder(itemView)
            }
            else -> {
                throw RuntimeException("Unknown view type")
            }
        }
    }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        val message = mMessages[position]

        when (holder.itemViewType) {
            SENT -> {
                (holder as MessageSentViewHolder).bind(message, mUsers, mStatuses, mMessages)
            }
            RECEIVED -> {
                (holder as MessageReceivedViewHolder).bind(message, mUsers, mMessages)
            }
        }
    }

    override fun getItemCount(): Int {
        return mMessages.size
    }

    override fun getItemViewType(position: Int): Int {
        return when (mMessages[position].userId) {
            myUser.id -> SENT
            else -> RECEIVED
        }
    }

    private fun reload(users: List<User>?, statuses: List<Status>?, messages: List<Message>?) {
        DiffUtil.calculateDiff(
            MessagesDiffCallback(
                mUsers,
                mStatuses,
                mMessages,
                users ?: mUsers,
                statuses ?: mStatuses,
                messages ?: mMessages
            )
        ).dispatchUpdatesTo(this)
    }

    fun setMyUser(user: User) {
        reload(null, null, null)
        myUser = user
    }

    fun setUsers(users: List<User>) {
        reload(users, null, null)
        mUsers = users
    }

    fun setStatuses(statuses: List<Status>) {
        reload(null, statuses, null)
        mStatuses = statuses
    }

    fun setMessages(messages: List<Message>) {
        reload(null, null, messages)
        mMessages = messages
    }
}

class MessageReceivedViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
    private val binding = ListItemMessageReceivedBinding.bind(itemView)
    private val context = itemView.context

    fun bind(
        message: Message,
        users: List<User>,
        messages: List<Message>
    ) {
        // Username
        val user = users
            .filter { it.id == message.userId }
            .getOrNull(0)
        binding.usernameText.text = user?.username ?: ""

        // Reply
        if (message.replyId != null) {
            binding.replyLayout.visibility = View.VISIBLE
            val replyMessage = messages
                .filter { it.id == message.replyId }
                .getOrNull(0)

            if (replyMessage != null) {
                // Reply Username
                val replyUser = users
                    .filter { it.id == replyMessage.userId }
                    .getOrNull(0)
                binding.replyUsernameText.text = replyUser?.username ?: ""

                // Reply Content
                binding.replyContentText.text = replyMessage.content
            }
        } else {
            binding.replyLayout.visibility = View.GONE
        }

        // Media
        if (message.media != null) {
            binding.mediaImageWrapper.visibility = View.VISIBLE
            // TODO Glide error & placeholder
            Glide
                .with(context)
                .load(message.media)
                .transition(DrawableTransitionOptions().crossFade())
                .centerInside()
                .into(binding.mediaImage)
        } else {
            binding.mediaImageWrapper.visibility = View.GONE
        }

        // Message content
        binding.contentText.text = message.content

        // Date
        binding.timeText.text = Date.getTime(message.date)
    }

}

class MessageSentViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
    private val binding = ListItemMessageSentBinding.bind(itemView)
    private val context = itemView.context

    fun bind(
        message: Message,
        users: List<User>,
        statuses: List<Status>,
        messages: List<Message>
    ) {
        // Reply
        if (message.replyId != null) {
            binding.replyLayout.visibility = View.VISIBLE
            val replyMessage = messages
                .filter { it.id == message.replyId }
                .getOrNull(0)

            if (replyMessage != null) {
                // Reply Username
                val replyUser = users
                    .filter { it.id == replyMessage.userId }
                    .getOrNull(0)
                binding.replyUsernameText.text = replyUser?.username ?: ""

                // Reply Content
                binding.replyContentText.text = replyMessage.content
            }
        } else {
            binding.replyLayout.visibility = View.GONE
        }

        // Media
        if (message.media != null) {
            binding.mediaImageWrapper.visibility = View.VISIBLE
            // TODO Glide error & placeholder
            Glide
                .with(context)
                .load(message.media)
                .transition(DrawableTransitionOptions().crossFade())
                .centerInside()
                .into(binding.mediaImage)
        } else {
            binding.mediaImageWrapper.visibility = View.GONE
        }

        // Message Content
        binding.contentText.text = message.content

        // Date
        binding.timeText.text = Date.getTime(message.date)

        // Status
        val status = statuses
            .filter { it.messageId == message.id }
            .map { it.state }
            .minByOrNull { it } ?: 0

        binding.statusImage.setImageResource(
            when (status) {
                1 -> R.drawable.ic_status_1
                2 -> R.drawable.ic_status_2
                3 -> R.drawable.ic_status_3
                else -> R.drawable.ic_status_0
            }
        )
    }

}

class MessagesDiffCallback(
    private val oldUsers: List<User>,
    private val oldStatuses: List<Status>,
    private val oldMessages: List<Message>,
    private val newUsers: List<User>,
    private val newStatuses: List<Status>,
    private val newMessages: List<Message>
) : DiffUtil.Callback() {
    override fun getOldListSize(): Int {
        return oldMessages.size
    }

    override fun getNewListSize(): Int {
        return newMessages.size
    }

    override fun areItemsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
        return oldMessages[oldItemPosition].id == newMessages[newItemPosition].id
    }

    override fun areContentsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
        return oldMessages[oldItemPosition] == newMessages[newItemPosition] &&
            oldUsers == newUsers &&
            oldStatuses == newStatuses
    }

}