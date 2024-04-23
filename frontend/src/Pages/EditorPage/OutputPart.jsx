import React, {useState, useEffect} from 'react'

const OutputPart = ({htmlcode, csscode, jscode}) => {
    const [src, setSrc] = useState('');
    const srcCode = `
        <html>
            <body>${htmlcode}</body>
            <style>${csscode} </style>
            <script>${jscode} </script>
        </html>
    `
    useEffect(() => {
        const timeout = setTimeout(() => {
            setSrc(srcCode);
        }, 250);

        return () => clearTimeout(timeout);
    }, [htmlcode, csscode, jscode])

  return (
    <div className="editorpage-output-part">
       <iframe 
        srcDoc={src}
        title='Output'
        sandbox='allow-scripts'
        frameBorder={0}
        width="100%"
        height="100%"
       />
    </div>
  )
}

export default OutputPart