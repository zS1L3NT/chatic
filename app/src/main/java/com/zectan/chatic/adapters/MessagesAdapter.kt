package com.zectan.chatic.adapters

import android.annotation.SuppressLint
import android.graphics.*
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ItemTouchHelper
import androidx.recyclerview.widget.ItemTouchHelper.ACTION_STATE_SWIPE
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.bumptech.glide.load.resource.drawable.DrawableTransitionOptions
import com.zectan.chatic.R
import com.zectan.chatic.databinding.ListItemMessageReceivedBinding
import com.zectan.chatic.databinding.ListItemMessageSentBinding
import com.zectan.chatic.models.Chat
import com.zectan.chatic.models.Message
import com.zectan.chatic.models.Status
import com.zectan.chatic.models.User
import com.zectan.chatic.toBitmap
import com.zectan.chatic.utils.Date

class MessagesAdapter(private val chatType: Int) : RecyclerView.Adapter<RecyclerView.ViewHolder>() {
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
                MessageReceivedViewHolder(itemView, chatType)
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

class MessageReceivedViewHolder(itemView: View, private val chatType: Int) :
    RecyclerView.ViewHolder(itemView) {
    private val binding = ListItemMessageReceivedBinding.bind(itemView)
    private val context = itemView.context

    fun bind(
        message: Message,
        users: List<User>,
        messages: List<Message>
    ) {
        // Username
        when (chatType) {
            Chat.DIRECT -> binding.usernameText.visibility = View.GONE
            Chat.GROUP -> {
                binding.usernameText.visibility = View.VISIBLE
                val user = users.find { it.id == message.userId }
                binding.usernameText.text = user?.username ?: ""
            }
        }

        // Reply
        if (message.replyId != null) {
            binding.replyLayout.visibility = View.VISIBLE
            val replyMessage = messages.find { it.id == message.replyId }

            if (replyMessage != null) {
                // Reply Username
                val replyUser = users.find { it.id == replyMessage.userId }
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
            val replyMessage = messages.find { it.id == message.replyId }

            if (replyMessage != null) {
                // Reply Username
                val replyUser = users.find { it.id == replyMessage.userId }
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
        val oldMessage = oldMessages[oldItemPosition]
        val newMessage = newMessages[newItemPosition]
        val messageId = oldMessage.id
        val userId = oldMessage.userId

        return oldMessage == newMessage &&
            oldUsers.find { it.id == userId } == newUsers.find { it.id == userId } &&
            oldStatuses.filter { it.messageId == messageId } == newStatuses.filter { it.messageId == messageId }
    }

}

class MessagesItemTouchHelper(private val callback: (position: Int) -> Unit) :
    ItemTouchHelper.Callback() {
    private var swipingBack: Boolean = false
    private var ranCallback: Boolean = false

    override fun getMovementFlags(
        recyclerView: RecyclerView,
        viewHolder: RecyclerView.ViewHolder
    ): Int {
        return makeMovementFlags(0, ItemTouchHelper.RIGHT)
    }

    override fun onMove(
        recyclerView: RecyclerView,
        viewHolder: RecyclerView.ViewHolder,
        target: RecyclerView.ViewHolder
    ): Boolean {
        return false
    }

    override fun onSwiped(viewHolder: RecyclerView.ViewHolder, direction: Int) {
    }

    override fun convertToAbsoluteDirection(flags: Int, layoutDirection: Int): Int {
        if (swipingBack) {
            ranCallback = false
            swipingBack = false
            return 0
        }
        return super.convertToAbsoluteDirection(flags, layoutDirection)
    }

    override fun onChildDraw(
        c: Canvas,
        recyclerView: RecyclerView,
        viewHolder: RecyclerView.ViewHolder,
        dX: Float,
        dY: Float,
        actionState: Int, isCurrentlyActive: Boolean
    ) {
        if (actionState == ACTION_STATE_SWIPE) {
            setTouchListener(
                recyclerView
            )
        }

        val myDx = if (dX > 200) (dX - 200) / 4 + 200 else dX
        super.onChildDraw(
            c,
            recyclerView,
            viewHolder,
            myDx,
            dY,
            actionState,
            isCurrentlyActive
        )
        drawReply(c, viewHolder, myDx)
    }

    @SuppressLint("ClickableViewAccessibility")
    private fun setTouchListener(recyclerView: RecyclerView) {
        recyclerView.setOnTouchListener { _, event ->
            swipingBack =
                event.action == MotionEvent.ACTION_CANCEL || event.action == MotionEvent.ACTION_UP
            false
        }
    }

    private fun drawReply(canvas: Canvas, viewHolder: RecyclerView.ViewHolder, dX: Float) {
        val view = viewHolder.itemView
        val paint = Paint()

        paint.color = Color.BLACK
        paint.alpha = 150
        val verticalMiddle = ((view.bottom - view.top) / 2) + view.top
        var horizontalStart = dX - 120
        if (horizontalStart > 80) {
            horizontalStart = 80f
            if (!ranCallback) {
                ranCallback = true
                callback(viewHolder.adapterPosition)
            }
        }

        val replyBackground = RectF(
            horizontalStart + 80,
            verticalMiddle - 40f,
            horizontalStart,
            verticalMiddle + 40f
        )
        canvas.drawRoundRect(replyBackground, 40f, 40f, paint)

        paint.color = Color.WHITE
        paint.alpha = 255
        var replyBitmap = ContextCompat.getDrawable(view.context, R.drawable.ic_reply)!!.toBitmap()
        replyBitmap = Bitmap.createScaledBitmap(replyBitmap, 70, 70, false)
        canvas.drawBitmap(replyBitmap, horizontalStart + 3, verticalMiddle - 38f, paint)
    }

}