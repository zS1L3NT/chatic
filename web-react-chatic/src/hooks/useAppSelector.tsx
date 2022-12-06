import equal from "fast-deep-equal/es6/react"
import { useSelector } from "react-redux"

import { RootState } from "../store"

export default <T,>(selector: (state: RootState) => T) => useSelector(selector, equal)
