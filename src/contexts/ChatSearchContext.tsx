import { createContext, Dispatch, SetStateAction } from "react"

interface iChatSearchData {
	search: string
	setSearch: Dispatch<SetStateAction<string>>
}

const ChatSearchContext = createContext<iChatSearchData>({
	search: "",
	setSearch: () => {}
})

export default ChatSearchContext
