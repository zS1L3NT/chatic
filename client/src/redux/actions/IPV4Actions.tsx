import { ISetIPV4 } from "../ReduxTypes";

export const SetIPV4 = (ipv4: string): ISetIPV4 => ({
	type: "Your IPV4 was set",
	ipv4
})