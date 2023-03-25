import React, { useRef, useEffect } from "react";
import * as pdfjs from "pdfjs-dist";
import "./PdfPage.css";

const PdfPage: React.FC<{ page:any, scale:any}> = React.memo(props => {
  const { page, scale } = props;

  const canvasRef = useRef<any>();

  const textLayerRef = useRef<any>();

  useEffect(() => {
    if (!page) {
      return;
    }
    const viewport = page.getViewport({ scale });

    // Prepare canvas using PDF page dimensions
    const canvas:any = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render PDF page into canvas context
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      const renderTask = page.render(renderContext);
      renderTask.promise.then(function() {
        // console.log("Page rendered");
      });

      page.getTextContent().then( (textContent:any) => {
        // console.log(textContent);
        if (!textLayerRef.current) {
          return;
        }

        // Pass the data to the method for rendering of text over the pdf canvas.
        pdfjs.renderTextLayer(({
          textContentSource: textContent,
          container: textLayerRef.current,
          viewport: viewport,
          textDivs: []
        } as any));
      });

    }
  }, [page, scale]);

  return (
    <div className="PdfPage">
      <canvas ref={canvasRef} />
      <div ref={textLayerRef} className="PdfPage__textLayer" />
    </div>
  );
});

export default PdfPage;
