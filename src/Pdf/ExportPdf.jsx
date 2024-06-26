// src/ProductTable.js
import React, { useRef, useState } from 'react';
import { savePDF } from '@progress/kendo-react-pdf';
import products from './products.json';
import "./Pdf.scss"
const ProductTable = () => {
  const tableRef = useRef(null);
  const [repeatHeaders, setRepeatHeaders] = useState(true);

  const generateRows = () => {
    return products.map((product, index) => (
      <tr key={index}>
        <td>{product.ProductName}</td>
        <td>{product.UnitPrice}</td>
        <td>{product.QuantityPerUnit}</td>
      </tr>
    ));
  };
  const exportPDF = () => {
    const element = tableRef.current;
    if (element) {
      savePDF(element, {
        repeatHeaders: repeatHeaders,
        paperSize: 'A4',
        margin: '2cm',
        header: () => (
          <div style={{ textAlign: 'center', marginBottom: '1cm' }}>
            <h1>Product List</h1>
            <p>Generated by My Company</p>
            <p>Your Company Name</p> {/* Add your company name here */}
          </div>
        ),
        
        footer: () => (
          <div style={{ textAlign: 'center', marginTop: '1cm',color: 'black' }}>
            <p>Page {savePDF.currentPageNum()} of {savePDF.totalPages()}</p>
          </div>
        ),
      });
    }
  };
  
  
  return (
    <div>
      <div className="example-config">
        <div>
          <input
            className="k-checkbox k-checkbox-md k-rounded-md"
            type="checkbox"
            id="repeatHeaders"
            checked={repeatHeaders}
            onChange={() => setRepeatHeaders(!repeatHeaders)}
          />
          <label className="k-checkbox-label mb-2" htmlFor="repeatHeaders">
            Repeat headers
          </label>
        </div>
        <button
          className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
          onClick={exportPDF}
        >
          Export PDF
        </button>
      </div>

      <table className="table" ref={tableRef}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Unit Price</th>
            <th>Qty</th>
          </tr>
        </thead>
        <tbody>{generateRows()}</tbody>
      </table>
    </div>
  );
};

export default ProductTable;
