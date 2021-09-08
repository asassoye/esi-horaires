const logo = require('../../img/HE2B-Logo-ESI.png')

const Logo = (): JSX.Element => {
  return (
    <img id="logo" src={logo} alt={'logo ESI'} className={'img-fluid'}/>
  )
}

export default Logo

