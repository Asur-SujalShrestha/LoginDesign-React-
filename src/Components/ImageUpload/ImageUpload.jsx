import React from 'react'

function ImageUpload() {
  return (
    <>
      <form action="#" style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
        <input type="file" style={{marginBottom:"7px"}}/>
        <button type='submit' style={{color:"white", backgroundColor:"blueviolet"}}>Send</button>
      </form>
      </>
  )
}

export default ImageUpload
