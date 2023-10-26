import { styled, Button as MUIButton } from '@mui/material'

const Button = styled(MUIButton)({
  textTransform: 'unset',
  borderRadius: '25px',
  borderColor: 'rgba(var(--md-palette-primary-darkChannel) / .5)',
  padding: '9px 23px',
  lineHeight: '20px',
  '> .MuiButton-startIcon': {
    marginRight: '.5rem',
    marginLeft: 'unset'
  }
})

export default Button