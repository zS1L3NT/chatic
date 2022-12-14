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
			light: "#4b92bb",
			dark: "#003a5e",
			contrastText: "#EEEEEE"
		},
		secondary: {
			main: "#5BD0A4",
			light: "#90ffd5",
			dark: "#1c9e75",
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
				whiteSpace: "nowrap",
				fontFamily: "Roboto"
			}
		}
	}
})
