package com.zectan.chatic.adapters

import android.annotation.SuppressLint
import android.graphics.*
import android.os.Handler
import android.os.Looper
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
import com.zectan.chatic.*
import com.zectan.chatic.databinding.ListItemMessageReceivedBinding
import com.zectan.chatic.databinding.ListItemMessageSentBinding
import com.zectan.chatic.models.Chat
import com.zectan.chatic.models.Message
import com.zectan.chatic.models.Status
import com.zectan.chatic.models.User
import com.zectan.chatic.utils.Date

class MessagesAdapter(private val chatType: Int, private val callback: Callback) :
    RecyclerView.Adapter<RecyclerView.ViewHolder>() {
    companion object {
        private const val SENT = 0
        private const val RECEIVED = 1
    }

    private var highlight: String? = null
    private var myUser: User = User()
    private var mUsers: List<User> = ArrayList()
    private var mStatuses: List<Status> = ArrayList()
    private var mMessages: List<Message> = ArrayList()

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        val inflater = LayoutInflater.from(parent.context)
        return when (viewType) {
            SENT -> {
                val itemView = inflater.inflate(R.layout.list_item_message_sent, parent, false)
                MessageSentViewHolder(callback, itemView)
            }
            RECEIVED -> {
                val itemView = inflater.inflate(R.layout.list_item_message_received, parent, false)
                MessageReceivedViewHolder(callback, itemView, chatType)
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
                (holder as MessageSentViewHolder).bind(
                    highlight,
                    message,
                    mUsers,
                    mStatuses,
                    mMessages
                )
            }
            RECEIVED -> {
                (holder as MessageReceivedViewHolder).bind(highlight, message, mUsers, mMessages)
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

    fun getMessage(position: Int): Message {
        return mMessages[position]
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

    fun highlightPosition(position: Int) {
        val message = mMessages.getOrNull(position)
        if (message != null) {
            highlight = message.id
            notifyItemChanged(position)
        }
    }

    interface Callback {
        fun onScrollToPosition(position: Int)
    }
}

class MessageReceivedViewHolder(
    private val callback: MessagesAdapter.Callback,
    itemView: View,
    private val chatType: Int
) :
    RecyclerView.ViewHolder(itemView) {
    private val binding = ListItemMessageReceivedBinding.bind(itemView)
    private val context = itemView.context

    fun bind(
        highlight: String?,
        message: Message,
        users: List<User>,
        messages: List<Message>
    ) {
        // region Highlight
        if (highlight == message.id) {
            binding.root.animateBackground(
                Color.parseColor("#FFFFFF"),
                Color.parseColor("#FF0000"),
                100
            )
            Handler(Looper.getMainLooper()).postDelayed({
                binding.root.animateBackground(
                    Color.parseColor("#FF0000"),
                    Color.parseColor("#FFFFFF"),
                    1000
                )
            }, 1000)
        }
        // endregion

        // region Username
        when (chatType) {
            Chat.DIRECT -> binding.usernameText.remove()
            Chat.GROUP -> {
                binding.usernameText.show()
                val user = users.find { it.id == message.userId }
                binding.usernameText.text = user?.username ?: ""
            }
        }
        // endregion

        // region Reply
        val replyMessage = messages.find { it.id == message.replyId }
        if (message.replyId != null && replyMessage != null) {
            binding.reply.root.show()

            // Reply Username
            val replyUser = users.find { it.id == replyMessage.userId }
            binding.reply.replyUsernameText.text = replyUser?.username ?: ""

            // Reply Content
            binding.reply.replyContentText.text = replyMessage.content

            // Reply reference
            binding.replyBackground.setOnClickListener {
                callback.onScrollToPosition(messages.indexOf(replyMessage))
            }
        } else {
            binding.reply.root.remove()
        }
        // endregion

        // region Media
        if (message.media != null) {
            binding.mediaImageWrapper.show()
            // TODO Glide error & placeholder
            Glide
                .with(context)
                .load(message.media)
                .transition(DrawableTransitionOptions().crossFade())
                .centerCrop()
                .into(binding.mediaImage)
        } else {
            binding.mediaImageWrapper.remove()
        }
        // endregion

        // region Message content
        binding.contentText.text = message.content
        // endregion

        // region Date
        binding.timeText.text = Date.getTime(message.date)
        // endregion
    }

}

class MessageSentViewHolder(
    private val callback: MessagesAdapter.Callback,
    itemView: View
) : RecyclerView.ViewHolder(itemView) {
    private val binding = ListItemMessageSentBinding.bind(itemView)
    private val context = itemView.context

    fun bind(
        highlight: String?,
        message: Message,
        users: List<User>,
        statuses: List<Status>,
        messages: List<Message>
    ) {
        // region Highlight
        if (highlight == message.id) {
            binding.root.animateBackground(
                Color.parseColor("#FFFFFF"),
                Color.parseColor("#FF0000"),
                100
            )
            Handler(Looper.getMainLooper()).postDelayed({
                binding.root.animateBackground(
                    Color.parseColor("#FF0000"),
                    Color.parseColor("#FFFFFF"),
                    1000
                )
            }, 1000)
        }
        // endregion

        // region Reply
        val replyMessage = messages.find { it.id == message.replyId }
        if (message.replyId != null && replyMessage != null) {
            binding.reply.root.show()

            // Reply Username
            val replyUser = users.find { it.id == replyMessage.userId }
            binding.reply.replyUsernameText.text = replyUser?.username ?: ""

            // Reply Content
            binding.reply.replyContentText.text = replyMessage.content

            // Reply reference
            binding.replyBackground.setOnClickListener {
                callback.onScrollToPosition(messages.indexOf(replyMessage))
            }
        } else {
            binding.reply.root.remove()
        }
        // endregion

        // region Media
        if (message.media != null) {
            binding.mediaImageWrapper.show()
            // TODO Glide error & placeholder
            Glide
                .with(context)
                .load(message.media)
                .transition(DrawableTransitionOptions().crossFade())
                .centerCrop()
                .into(binding.mediaImage)
        } else {
            binding.mediaImageWrapper.remove()
        }
        // endregion

        // region Message Content
        binding.contentText.text = message.content
        // endregion

        // region Date
        binding.timeText.text = Date.getTime(message.date)
        // endregion

        // region Status
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
        // endregion
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
    private var swipingBack: Boolean = true
    private var ranCallback: Boolean = true

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
        // Reset happened?
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
        drawReply(c, viewHolder, myDx, isCurrentlyActive)
    }

    @SuppressLint("ClickableViewAccessibility")
    private fun setTouchListener(recyclerView: RecyclerView) {
        recyclerView.setOnTouchListener { _, event ->
            swipingBack =
                event.action == MotionEvent.ACTION_CANCEL || event.action == MotionEvent.ACTION_UP
            false
        }
    }

    private fun drawReply(
        canvas: Canvas,
        viewHolder: RecyclerView.ViewHolder,
        dX: Float,
        isCurrentlyActive: Boolean
    ) {
        val view = viewHolder.itemView
        val paint = Paint()

        paint.color = Color.BLACK
        paint.alpha = 150
        val verticalMiddle = ((view.bottom - view.top) / 2) + view.top
        var horizontalStart = dX - 120
        if (horizontalStart > 80) {
            horizontalStart = 80f
            if (!ranCallback && !isCurrentlyActive) {
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