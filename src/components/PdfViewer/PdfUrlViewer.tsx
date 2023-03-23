import React, { useEffect, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import * as pdfjs from "pdfjs-dist";
import pdfWorker from 'pdfjs-dist/build/pdf.worker.entry';
import PdfViewer from "./PdfViewer";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const PdfUrlViewer:React.FC<{url:string, scale:number, windowRef:any}> = (props) => {

  const pdfRef = useRef<any>();
  const [itemCount, setItemCount] = useState<number>(0);

  useEffect(() => {
      var loadingTask = pdfjs.getDocument({ data: atob(props.url)});
      loadingTask.promise.then(
        pdf => {
          pdfRef.current = pdf;
          setItemCount(pdf._pdfInfo.numPages);
          // Fetch the first page
          var pageNumber = 1;
          pdf.getPage(pageNumber).then(function(page) {
            console.log("Page loaded");
          });
        },
        reason => {
          // PDF loading error
          console.error(reason);
        }
      );

  }, [props.url]);

  const handleGetPdfPage = useCallback((index:number) => {
    return pdfRef.current.getPage(index + 1);
  }, []);

  return (
    <PdfViewer
      {...props}
      itemCount={itemCount}
      getPdfPage={handleGetPdfPage}
    />
  );
};

PdfUrlViewer.propTypes = {
  url: PropTypes.string.isRequired
};

export default PdfUrlViewer;