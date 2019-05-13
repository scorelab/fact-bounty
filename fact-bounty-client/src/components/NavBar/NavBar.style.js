export default theme => ({
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  linkButtonsContainer: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  }
})
