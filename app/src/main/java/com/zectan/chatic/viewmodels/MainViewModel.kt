package com.zectan.chatic.viewmodels

import android.util.Log
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.ViewModel
import com.google.firebase.firestore.DocumentReference
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ListenerRegistration
import com.zectan.chatic.MainActivity
import com.zectan.chatic.classes.StrictLiveData
import com.zectan.chatic.models.*

class MainViewModel : ViewModel() {
    private val mDb: FirebaseFirestore = FirebaseFirestore.getInstance()

    private var mUsersListener: ListenerRegistration? = null
    private var mInvitesListener: ListenerRegistration? = null
    private var mStatusesListener: ListenerRegistration? = null
    private var mMessagesListener: ListenerRegistration? = null
    private var mPresencesListener: ListenerRegistration? = null

    val myUser: StrictLiveData<User> = StrictLiveData(User())
    val myUsers: StrictLiveData<List<User>> = StrictLiveData(ArrayList())
    val myChats: StrictLiveData<List<Chat>> = StrictLiveData(ArrayList())
    val myInvites: StrictLiveData<List<Invite>> = StrictLiveData(ArrayList())
    val myStatuses: StrictLiveData<List<Status>> = StrictLiveData(ArrayList())
    val myMessages: StrictLiveData<List<Message>> = StrictLiveData(ArrayList())
    val myPresences: StrictLiveData<List<Presence>> = StrictLiveData(ArrayList())
    val myHandshakes: StrictLiveData<List<Handshake>> = StrictLiveData(ArrayList())
    val myFriendships: StrictLiveData<List<Friendship>> = StrictLiveData(ArrayList())

    var userId: String = ""

    fun watch(activity: MainActivity) {
        mDb.collection("users")
            .document(userId)
            .addSnapshotListener(activity) { snap, error ->
                if (error != null) {
                    Log.d(MainActivity.TAG, "Error: ${error.message}")
                    return@addSnapshotListener
                }
                myUser.postValue(snap!!.toObject(User::class.java) ?: User())
            }

        mDb.collection("friendships")
            .whereArrayContains("users", userId)
            .addSnapshotListener { snaps, error ->
                if (error != null) {
                    Log.d(MainActivity.TAG, "Error: ${error.message}")
                    return@addSnapshotListener
                }
                myFriendships.postValue(snaps!!.toObjects(Friendship::class.java))
            }

        mDb.collection("handshakes")
            .whereArrayContains("users", userId)
            .addSnapshotListener { snaps, error ->
                if (error != null) {
                    Log.d(MainActivity.TAG, "Error: ${error.message}")
                    return@addSnapshotListener
                }
                myHandshakes.postValue(snaps!!.toObjects(Handshake::class.java))
            }

        mDb.collection("chats")
            .whereArrayContains("users", userId)
            .addSnapshotListener { snaps_, error_ ->
                if (error_ != null) {
                    Log.d(MainActivity.TAG, "Error: ${error_.message}")
                    return@addSnapshotListener
                }
                myChats.postValue(snaps_!!.toObjects(Chat::class.java))

                mUsersListener?.remove()
                mInvitesListener?.remove()
                mStatusesListener?.remove()
                mMessagesListener?.remove()
                mPresencesListener?.remove()

                mUsersListener = mDb.collection("users")
                    .addSnapshotListener Users@{ snaps, error ->
                        if (error != null) {
                            Log.d(MainActivity.TAG, "Error: ${error.message}")
                            return@Users
                        }
                        myUsers.postValue(snaps!!.toObjects(User::class.java))
                    }
                mInvitesListener = mDb.collection("invites")
                    .addSnapshotListener Invites@{ snaps, error ->
                        if (error != null) {
                            Log.d(MainActivity.TAG, "Error: ${error.message}")
                            return@Invites
                        }
                        myInvites.postValue(snaps!!.toObjects(Invite::class.java))
                    }
                mStatusesListener = mDb.collection("statuses")
                    .addSnapshotListener Status@{ snaps, error ->
                        if (error != null) {
                            Log.d(MainActivity.TAG, "Error: ${error.message}")
                            return@Status
                        }
                        myStatuses.postValue(snaps!!.toObjects(Status::class.java))
                    }
                mMessagesListener = mDb.collection("messages")
                    .addSnapshotListener Message@{ snaps, error ->
                        if (error != null) {
                            Log.d(MainActivity.TAG, "Error: ${error.message}")
                            return@Message
                        }
                        myMessages.postValue(snaps!!.toObjects(Message::class.java))
                    }
                mPresencesListener = mDb.collection("presences")
                    .addSnapshotListener Presence@{ snaps, error ->
                        if (error != null) {
                            Log.d(MainActivity.TAG, "Error: ${error.message}")
                            return@Presence
                        }
                        myPresences.postValue(snaps!!.toObjects(Presence::class.java))
                    }
            }
    }

    fun watchMessagesFromChat(
        owner: LifecycleOwner,
        chatId: String,
        callback: (messages: List<Message>) -> Unit
    ) {
        return myMessages.observe(owner, {
            callback(it.filter { message -> message.chatId == chatId })
        })
    }

    fun watchUsersFromChat(
        owner: LifecycleOwner,
        chatId: String,
        callback: (users: List<User>) -> Unit
    ) {
        return myUsers.observe(owner, {
            val chat = myChats.value.find { chat -> chat.id == chatId }
            if (chat != null) {
                callback(it.filter { user -> chat.users.contains(user.id) })
            }
        })
    }

    fun watchStatusesFromChat(
        owner: LifecycleOwner,
        chatId: String,
        callback: (messages: List<Status>) -> Unit
    ) {
        return myStatuses.observe(owner, {
            callback(it.filter { status -> status.chatId == chatId })
        })
    }

    fun newMessageDocument(): DocumentReference {
        return mDb.collection("messages").document()
    }

    fun newStatusDocument(): DocumentReference {
        return mDb.collection("statuses").document()
    }
}