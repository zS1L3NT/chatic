import { createTheme } from "@mui/material"

const palette = {
	success: {
		main: "#1db954"
	},
	error: {
		main: "#e22134"
	},
	warning: {
		main: "#ff5722"
	}
}

export default createTheme({
	palette: {
		...palette,
		mode: "dark",
		primary: {
			main: "#01648B",
			contrastText: "#EEEEEE"
		},
		secondary: {
			main: "#5BD0A4",
			contrastText: "#111111"
		},
		background: {
			default: "#222222"
		}
	},
	components: {
		MuiTypography: {
			defaultProps: {
				textOverflow: "ellipsis",
				overflow: "hidden",
				whiteSpace: "nowrap"
			}
		}
	}
})
