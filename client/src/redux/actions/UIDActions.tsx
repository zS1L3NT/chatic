import { ISetUID } from "../ReduxTypes";

export const SetUID = (uid: string): ISetUID => ({
	type: "Your UID was set",
	uid
})