import React from 'react';
import "./DownloadButtonStyle.css";

function DownloadButton() {
  return (
    <a className="downloadButton">
      <span>Download Our app</span>
      <svg width="43" height="23" viewBox="0 0 43 23" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M41.9453 12.5441C42.5311 11.9584 42.5313 11.0086 41.9456 10.4228L32.4009 0.875576C31.8152 0.289712 30.8654 0.289587 30.2796 0.875296C29.6937 1.46101 29.6936 2.41075 30.2793 2.99662L38.7634 11.483L30.277 19.9672C29.6912 20.5529 29.6911 21.5026 30.2768 22.0885C30.8625 22.6744 31.8122 22.6745 32.3981 22.0888L41.9453 12.5441ZM0.884568 12.978L40.8846 12.9833L40.885 9.98329L0.884963 9.97803L0.884568 12.978Z"
          fill="white" />
      </svg>
    </a>
  );
}

export default DownloadButton;
