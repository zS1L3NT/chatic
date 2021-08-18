package com.zectan.chatic.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.bumptech.glide.load.resource.drawable.DrawableTransitionOptions
import com.zectan.chatic.R
import com.zectan.chatic.databinding.ListItemChatBinding
import com.zectan.chatic.models.Chat
import com.zectan.chatic.models.Message
import com.zectan.chatic.models.Status
import com.zectan.chatic.models.User

class ChatsAdapter(private val callback: (chat: Chat) -> Unit) :
    RecyclerView.Adapter<ChatViewHolder>() {
    private var myUser: User = User()
    private var mChats: List<Chat> = ArrayList()
    private var mUsers: List<User> = ArrayList()
    private var mStatuses: List<Status> = ArrayList()
    private var mMessages: List<Message> = ArrayList()

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ChatViewHolder {
        val itemView = LayoutInflater
            .from(parent.context)
            .inflate(R.layout.list_item_chat, parent, false)

        return ChatViewHolder(itemView, callback)
    }

    override fun onBindViewHolder(holder: ChatViewHolder, position: Int) {
        holder.bind(mChats[position], myUser, mUsers, mStatuses, mMessages)
    }

    override fun getItemCount(): Int {
        return mChats.size
    }

    private fun reload(
        chats: List<Chat>?,
        users: List<User>?,
        statuses: List<Status>?,
        messages: List<Message>?
    ) {
        DiffUtil.calculateDiff(
            ChatsDiffCallback(
                myUser,
                mChats,
                mUsers,
                mStatuses,
                mMessages,
                chats ?: mChats,
                users ?: mUsers,
                statuses ?: mStatuses,
                messages ?: mMessages
            )
        ).dispatchUpdatesTo(this)
    }

    fun setMyUser(user: User) {
        reload(null, null, null, null)
        myUser = user
    }

    fun setChats(chats: List<Chat>) {
        reload(chats, null, null, null)
        mChats = chats
    }

    fun setUsers(users: List<User>) {
        reload(null, users, null, null)
        mUsers = users
    }

    fun setStatuses(statuses: List<Status>) {
        reload(null, null, statuses, null)
        mStatuses = statuses
    }

    fun setMessages(messages: List<Message>) {
        reload(null, null, null, messages)
        mMessages = messages
    }
}

class ChatViewHolder(itemView: View, private val callback: (chat: Chat) -> Unit) :
    RecyclerView.ViewHolder(itemView) {
    private val binding = ListItemChatBinding.bind(itemView)
    private val context = itemView.context

    fun bind(
        chat: Chat,
        myUser: User,
        users: List<User>,
        statuses: List<Status>,
        messages: List<Message>
    ) {
        binding.root.setOnClickListener { callback(chat) }

        binding.titleText.text = chat.name ?: ""
        val chatMessages = messages
            .filter { it.chatId == chat.id }
            .sortedByDescending { it.date }
        if (chatMessages.isEmpty()) {
            binding.recentMessageText.visibility = View.GONE
        } else {
            binding.recentMessageText.visibility = View.VISIBLE
            binding.recentMessageText.text = chatMessages[0].content
        }

        val unread = statuses
            .filter { it.chatId == chat.id }
            .filter { it.userId == myUser.id }
            .filter { it.state < 3 }
            .count()
        if (unread == 0) {
            binding.unreadText.visibility = View.INVISIBLE
        } else {
            binding.unreadText.visibility = View.VISIBLE
            binding.unreadText.text = unread.toString()
        }

        if (chat.type == Chat.GROUP) {
            binding.titleText.text = chat.name ?: ""
            // TODO Glide error & placeholder
            Glide
                .with(context)
                .load(chat.photo!!)
                .transition(DrawableTransitionOptions().crossFade())
                .centerCrop()
                .into(binding.photoImage)
        } else {
            val friendId = chat.users.find { it != myUser.id }!!
            val friend = users.find { it.id == friendId } ?: User()

            binding.titleText.text = friend.username
            // TODO Glide error & placeholder
            Glide
                .with(context)
                .load(friend.photo)
                .transition(DrawableTransitionOptions().crossFade())
                .centerCrop()
                .into(binding.photoImage)
        }
    }
}

class ChatsDiffCallback(
    private val myUser: User,
    private val oldChats: List<Chat>,
    private val oldUsers: List<User>,
    private val oldStatuses: List<Status>,
    private val oldMessages: List<Message>,
    private val newChats: List<Chat>,
    private val newUsers: List<User>,
    private val newStatuses: List<Status>,
    private val newMessages: List<Message>
) : DiffUtil.Callback() {

    override fun getOldListSize(): Int {
        return oldChats.size
    }

    override fun getNewListSize(): Int {
        return newChats.size
    }

    override fun areItemsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
        return oldChats[oldItemPosition].id == newChats[newItemPosition].id
    }

    override fun areContentsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
        val oldChat = oldChats[oldItemPosition]
        val newChat = newChats[newItemPosition]
        val chatId = oldChat.id

        var friendIsSame = true
        if (oldChat.type == Chat.DIRECT) {
            val friendId = oldChat.users.find { it != myUser.id }!!
            friendIsSame =
                oldUsers.find { it.id == friendId } == newUsers.find { it.id == friendId }
        }

        return oldChat == newChat
            && friendIsSame
            && oldStatuses.filter { it.chatId == chatId } == newStatuses.filter { it.chatId == chatId }
            && oldMessages.filter { it.chatId == chatId } == newMessages.filter { it.chatId == chatId }
    }

}