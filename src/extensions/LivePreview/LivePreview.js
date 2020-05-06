import React from 'react';

function LivePreview() {
  return (
    <>
      <iframe title="live-preview"
        width="100%"
        height="1000px"
        src="http://localhost:3000/module-preview?contentType=moduleHero&id=5Hy71DzB4jMPIMzXg2PFmC" />
    </>
  );
}

export default LivePreview;
