import React from 'react'
import styles from "./Navbar.module.scss"
import logo from "../../Images/fcclogo.png"
const Navbar = () => {
  return (
    <div className={` ${styles.navbarContainer} `}>
        <div className={` ${styles.leftSideNavbar} `}>
            <input type="text" placeholder='Search 9,000+ tutorials' />
            <i className="fa fa-search" aria-hidden="true"></i>
        </div>
        <div className={ ` ${styles.centerNavbar} ` }><img src={logo}/></div>
        <div className={` ${styles.rightSideNavbar} `}>
            <button className={` ${styles.navMenu}`}>Menu</button>
            <button className={` ${styles.navSignIn}`}>Sign In</button>
        </div>
    </div>
    
  )                
}
 
export default Navbar