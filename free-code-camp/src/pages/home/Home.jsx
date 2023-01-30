import React from 'react'
import styles from "./Home.module.scss"
const Home = () => {
  return (
    <div className={` ${styles.HomeContainer} container`}>
        <div className={` ${styles.HomeHeadingContainer}  col-lg-8 col-lg-offset-2 col-sm-10 col-sm-offset-1 col-xs-12`}>
        <h1 className={` ${styles.HeadingStyle}`}>Learn to code — for free.</h1>
        <p className={` ${styles.HeadingStyle}`}>Build projects.</p>
        <p className={` ${styles.HeadingStyle}`}>Earn certifications.</p>
        <p>Since 2014, more than 40,000 freeCodeCamp.org graduates have gotten jobs at tech companies including:</p>
        <div></div>
        <div className={`${styles.icons}`}>
        <i class="fa-brands fa-apple"></i>
          <i className='fa-brands fa-google'></i>
        </div>
        <button className={` ${styles.getStartedBtn}`}>Get started (it's free)</button>
        </div>
    </div>
  )
}


export default Home