import {
	createMuiTheme
} from '@material-ui/core/styles'

const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#424242'
		}
	},
	typography: {
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
		useNextVariants: true,
	},
})

export default theme