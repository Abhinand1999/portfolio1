import React from 'react'

const Scrolle = () => {
  return (
    <div className="inset-x-0 bottom-10 flex justify-center items-center z-50">
      <div className="w-6 h-12 md:w-8 md:h-16 mt-10 md:mt-16 border-2 border-lime-400 rounded-full flex flex-col items-center justify-start" style={{borderColor:'#481E14'}}>
        <span className="w-1 h-1  rounded-full animate-ping mt-8 md:mt-11" style={{backgroundColor:'#481E14'}}></span>
      </div>
    </div>
  )
}

export default Scrolle
