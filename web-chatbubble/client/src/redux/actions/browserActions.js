import { IS_DESKTOP, IS_MOBILE } from "./types"

export const setMobile = _ => ({
	type: IS_MOBILE
})

export const setDesktop = _ => ({
	type: IS_DESKTOP
})
