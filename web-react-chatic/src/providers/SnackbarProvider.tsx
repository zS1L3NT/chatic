import { SnackbarKey, SnackbarProvider } from "notistack"
import { PropsWithChildren, useRef } from "react"

import { Close } from "@mui/icons-material"
import { IconButton } from "@mui/material"

const _SnackbarProvider = (props: PropsWithChildren<{}>) => {
	const notistackRef = useRef<SnackbarProvider>(null)

	const onClose = (key: SnackbarKey) => {
		notistackRef.current?.closeSnackbar(key)
	}

	return (
		<SnackbarProvider
			ref={notistackRef}
			maxSnack={5}
			action={key => (
				<IconButton onClick={() => onClose(key)}>
					<Close sx={{ color: "white" }} fontSize="small" />
				</IconButton>
			)}>
			{props.children}
		</SnackbarProvider>
	)
}

export default _SnackbarProvider
