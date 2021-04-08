import { ISetActive } from "../ReduxTypes"

export const SetActive = (active: boolean): ISetActive => ({
	type: 'Set activity',
	active
})