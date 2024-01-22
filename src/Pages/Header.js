import React from 'react'
import { Images } from '../helpers/Images'
import {isMobile} from 'react-device-detect';

export default function Header() {
  return (
    <div className='headerImage'>
      {isMobile ? <img src={Images.mobileHeaderImage} alt='MobileHeaderImg' className='img-fluid'/> : <img src={Images.headerImage} alt='headerImg' className='img-fluid'/>}
    </div>
  )
}
