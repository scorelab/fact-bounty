import {
	createMuiTheme
} from '@material-ui/core/styles'
// import lightBlue        from '@material-ui/core/es/colors/lightBlue'
import brown from '@material-ui/core/colors/brown';

const theme = createMuiTheme({
	palette: {
		primary: brown,
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