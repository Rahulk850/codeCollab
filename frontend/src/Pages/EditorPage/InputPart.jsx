import React, { useEffect, useRef, useState } from 'react'
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import ACTIONS from '../../Actions';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/css/css'
import toast from 'react-hot-toast';


const InputPart = ({
    socketRef, 
    roomId, 
    onHtmlCodeChange, 
    onCssCodeChange, 
    onJsCodeChange,
    handleHtml,
    handleCss,
    handleJs,
     }) => {

    const JsEditorRef = useRef(null);
    const  CssEditorRef = useRef(null);
    const  HtmlEditorRef=useRef(null);

   useEffect(()=>{        
         async function init(){
            HtmlEditorRef.current = Codemirror.fromTextArea(
                document.getElementById('codeEditor-html'),
                {
                    mode: { name: 'xml'},
                    theme: 'dracula',
                    autoCloseTags: true,
                    // theme: 'material',
                    autoCloseBrackets: true,
                    lineNumbers: true,
                }
            );

            CssEditorRef.current = Codemirror.fromTextArea(
                document.getElementById('codeEditor-css'),
                {
                    mode: { name: 'css', json: true },
                    theme: 'dracula',
                    autoCloseBrackets: true,
                    lineNumbers: true,
                }
            );
          
            JsEditorRef.current = Codemirror.fromTextArea(
                document.getElementById('codeEditor-js'),
                {
                    mode: { name: 'javascript', json: true },
                    theme: 'dracula',
                    autoCloseBrackets: true,
                    lineNumbers: true,
                }
            );


            HtmlEditorRef.current.on('change', (instance, changes)=>{
                // console.log('changes', changes);
                const {origin} = changes;
                const html_code = instance.getValue();
                // console.log(code);
                onHtmlCodeChange(html_code);
                handleHtml(html_code);
                // setHtml(html_code);                          //-----
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.HTML_CODE_CHANGE, {
                        roomId,
                        html_code,
                    });
                }
            })

            CssEditorRef.current.on('change', (instance, changes)=>{
                const {origin} = changes;
                const css_code = instance.getValue();
                onCssCodeChange(css_code);
                handleCss(css_code);
                // setCss(css_code)                      //-------
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CSS_CODE_CHANGE, {
                        roomId,
                        css_code,
                    });
                }
            })

            JsEditorRef.current.on('change', (instance, changes)=>{
                const {origin} = changes;
                const js_code = instance.getValue();
                onJsCodeChange(js_code);
                handleJs(js_code);
                // setJavascript(js_code);            //-----
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.JS_CODE_CHANGE, {
                        roomId,
                        js_code,
                    });
                }
            })

         }
         init();
   },[])

   useEffect(() => {
    if (socketRef.current) {
        socketRef.current.on(ACTIONS.HTML_CODE_CHANGE, ({ html_code }) => {
            if (html_code !== null) {
                HtmlEditorRef.current.setValue(html_code);
            }
        });

        socketRef.current.on(ACTIONS.CSS_CODE_CHANGE, ({ css_code }) => {
            if (css_code !== null) {
                CssEditorRef.current.setValue(css_code);
            }
        });

        socketRef.current.on(ACTIONS.JS_CODE_CHANGE, ({ js_code }) => {
            if (js_code !== null) {
                JsEditorRef.current.setValue(js_code);
            }
        });
    }

    return () => {
        socketRef.current.off(ACTIONS.HTML_CODE_CHANGE);
        socketRef.current.off(ACTIONS.CSS_CODE_CHANGE);
        socketRef.current.off(ACTIONS.JS_CODE_CHANGE);
    };
}, [socketRef.current]);
    

  return (
    <div className="editorpage-input-part">
        <div className='input-part'>  
          {/* <span>HTML</span> */}
          <p className='html-heading'><span className='html-logo' >/</span> HTML</p>
          <textarea id='codeEditor-html'></textarea>
        </div>
        <div className='input-part'>
        <p className='css-heading'><span className='css-logo' >*</span> CSS</p>
          <textarea id='codeEditor-css'></textarea>
        </div>
        <div className='input-part'>
        <p className='js-heading'> <span className='js-logo' >( )</span> JS</p>
          <textarea id='codeEditor-js'></textarea>
        </div>
    </div>
  )
}

export default InputPart