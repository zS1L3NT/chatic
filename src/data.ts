const mybd = 1101916800000

export const userData: iUser[] = [
	{
		id: "mQg4fp1624MxgkIkWpnOVmSfZ7a2",
		username: "User 1",
		email: "zechariahtan144@gmail.com",
		photo: "https://i.scdn.co/image/ab6761610000e5eb006ff3c0136a71bfb9928d34"
	},
	{
		id: "user-2",
		username: "User 2",
		email: "yismurf1@gmail.com",
		photo: "https://hashtaglegend.com/wp-content/uploads/2021/01/IU-1-1024x1024.jpeg"
	},
	{
		id: "user-3",
		username: "User 3",
		email: "yisilent1@gmail.com",
		photo: "https://img.i-scmp.com/cdn-cgi/image/fit=contain,width=425,format=auto/sites/default/files/styles/768x768/public/d8/images/canvas/2021/05/25/d3d5b6fe-f0ae-44d3-b368-6ce41ebe4892_8414e116.png?itok=Y93c9H1a&v=1621931609"
	}
]

export const friendshipData: iFriendship[] = [
	{
		id: "friendship-1",
		users: ["mQg4fp1624MxgkIkWpnOVmSfZ7a2", "user-2"],
		date: mybd
	},
	{
		id: "friendship-2",
		users: ["mQg4fp1624MxgkIkWpnOVmSfZ7a2", "user-3"],
		date: mybd
	}
]

export const handshakeData: iHandshake[] = [
	{
		id: "handshake-1",
		users: ["user-2", "user-3"],
		requestId: "user-2",
		targetId: "user-3",
		date: mybd
	}
]

export const presenceData: iPresence[] = [
	{
		id: "presence-1",
		userId: "mQg4fp1624MxgkIkWpnOVmSfZ7a2",
		deviceId: "device-1",
		isOnline: true,
		typingTo: "user-2",
		lastSeen: mybd
	},
	{
		id: "presence-2",
		userId: "user-2",
		deviceId: "device-2",
		isOnline: true,
		typingTo: null,
		lastSeen: mybd
	},
	{
		id: "presence-3",
		userId: "user-3",
		deviceId: "device-3",
		isOnline: false,
		typingTo: null,
		lastSeen: mybd - 1000
	}
]

export const chatData: iChat[] = [
	{
		id: "chat-1",
		users: ["mQg4fp1624MxgkIkWpnOVmSfZ7a2", "user-2"],
		lastUpdated: 1649175583648
	},
	{
		id: "chat-2",
		users: ["mQg4fp1624MxgkIkWpnOVmSfZ7a2", "user-2", "user-3"],
		lastUpdated: 1649175583648
	}
]

export const messageData: iMessage[] = [
	{
		id: "message-1",
		content: "Hello!",
		media: null,
		date: mybd - 3200000,
		replyId: null,
		userId: "mQg4fp1624MxgkIkWpnOVmSfZ7a2",
		chatId: "chat-1"
	},
	{
		id: "message-2",
		content: "Hi!!!",
		media: null,
		date: mybd - 2800000,
		replyId: "message-1",
		userId: "user-2",
		chatId: "chat-1"
	},
	{
		id: "message-3",
		content: "Have a landscape picture of IU :D",
		media: "https://6.vikiplatform.com/image/a11230e2d98d4a73825a4c10c8c6feb0.jpg?x=b&a=0x0&s=460x268&e=t&f=t&cb=1",
		date: mybd - 2400000,
		replyId: null,
		userId: "mQg4fp1624MxgkIkWpnOVmSfZ7a2",
		chatId: "chat-1"
	},
	{
		id: "message-4",
		content: "Thanks, have a portait picture of IU back :)",
		media: "https://popslider.com/wp-content/uploads/2020/08/IU.jpg",
		date: mybd - 2000000,
		replyId: "message-3",
		userId: "user-2",
		chatId: "chat-1"
	},
	{
		id: "message-5",
		content: "Hi, my user id is mQg4fp1624MxgkIkWpnOVmSfZ7a2!",
		media: null,
		date: mybd - 1600000,
		replyId: null,
		userId: "mQg4fp1624MxgkIkWpnOVmSfZ7a2",
		chatId: "chat-2"
	},
	{
		id: "message-6",
		content: "Hi, my user id is user-2!",
		media: null,
		date: mybd - 1200000,
		replyId: "message-5",
		userId: "user-2",
		chatId: "chat-2"
	},
	{
		id: "message-7",
		content: "Hi, my user id is user-3!",
		media: null,
		date: mybd - 800000,
		replyId: "message-6",
		userId: "user-3",
		chatId: "chat-2"
	}
]

export const statusData: iStatus[] = [
	{
		id: "status-1",
		messageId: "message-1",
		userId: "mQg4fp1624MxgkIkWpnOVmSfZ7a2",
		chatId: "chat-1",
		state: 3
	},
	{
		id: "status-2",
		messageId: "message-1",
		userId: "user-2",
		chatId: "chat-1",
		state: 3
	},
	{
		id: "status-3",
		messageId: "message-2",
		userId: "mQg4fp1624MxgkIkWpnOVmSfZ7a2",
		chatId: "chat-1",
		state: 3
	},
	{
		id: "status-4",
		messageId: "message-2",
		userId: "user-2",
		chatId: "chat-1",
		state: 3
	},
	{
		id: "status-5",
		messageId: "message-3",
		userId: "mQg4fp1624MxgkIkWpnOVmSfZ7a2",
		chatId: "chat-1",
		state: 3
	},
	{
		id: "status-6",
		messageId: "message-3",
		userId: "user-2",
		chatId: "chat-1",
		state: 3
	},
	{
		id: "status-7",
		messageId: "message-4",
		userId: "mQg4fp1624MxgkIkWpnOVmSfZ7a2",
		chatId: "chat-1",
		state: 1
	},
	{
		id: "status-8",
		messageId: "message-4",
		userId: "user-2",
		chatId: "chat-1",
		state: 3
	},
	{
		id: "status-9",
		messageId: "message-5",
		userId: "mQg4fp1624MxgkIkWpnOVmSfZ7a2",
		chatId: "chat-2",
		state: 3
	},
	{
		id: "status-10",
		messageId: "message-5",
		userId: "user-2",
		chatId: "chat-2",
		state: 3
	},
	{
		id: "status-11",
		messageId: "message-5",
		userId: "user-3",
		chatId: "chat-2",
		state: 3
	},
	{
		id: "status-12",
		messageId: "message-6",
		userId: "mQg4fp1624MxgkIkWpnOVmSfZ7a2",
		chatId: "chat-2",
		state: 2
	},
	{
		id: "status-13",
		messageId: "message-6",
		userId: "user-2",
		chatId: "chat-2",
		state: 3
	},
	{
		id: "status-14",
		messageId: "message-6",
		userId: "user-3",
		chatId: "chat-2",
		state: 3
	},
	{
		id: "status-15",
		messageId: "message-7",
		userId: "mQg4fp1624MxgkIkWpnOVmSfZ7a2",
		chatId: "chat-2",
		state: 1
	},
	{
		id: "status-16",
		messageId: "message-7",
		userId: "user-2",
		chatId: "chat-2",
		state: 1
	},
	{
		id: "status-17",
		messageId: "message-7",
		userId: "user-3",
		chatId: "chat-2",
		state: 1
	}
]
