interface Document {
	id: string
}

declare interface iUser extends Document {
	username: string
	email: string
	photo: string
}

declare interface iFriendship extends Document {
	users: string[]
	date: number
}

declare interface iHandshake extends Document {
	users: string[]
	requestId: string
	targetId: string
	date: number
}

declare interface iPresence extends Document {
	userId: string
	deviceId: string
	isOnline: boolean
	typingTo: string | null
	lastSeen: number
}

declare interface iChat extends Document {
	users: string[]
}

declare interface iMessage extends Document {
	content: string
	media: string | null
	date: number
	replyId: string | null
	userId: string
	chatId: string
}

declare interface iStatus extends Document {
	userId: string
	messageId: string
	chatId: string
	state: 0 | 1 | 2 | 3
}