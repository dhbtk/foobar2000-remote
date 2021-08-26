import React from 'react'
import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    minHeight: 24,
    height: 24,
    borderTop: '1px solid #ddd',
    paddingLeft: theme.spacing(2)
  }
}))

export default function StatusBar (): React.ReactElement {
  const classes = useStyles()
  return (
    <Typography component="div" className={classes.root}>
      Idle
    </Typography>
  )
}
