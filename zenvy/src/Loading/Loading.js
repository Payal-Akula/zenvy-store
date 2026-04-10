import React from 'react'
import './loading.css'
function Loading() {
  return (
    <>
     <div className="loading-container d-flex flex-column justify-content-center align-items-center">
      {/* Spinner on top */}
      <div className="spinner-wrapper mb-4">
        <div className="double-spinner"></div>
      </div>
      
      {/* Text below */}
      <div className="text-center">
        <p className="loading-text mb-0">
          {/* <i className="bi bi-hourglass-top me-2"></i> */}
          Loading please wait...
        </p>
        
      </div>
    </div>
    </>
  )
}

export default Loading