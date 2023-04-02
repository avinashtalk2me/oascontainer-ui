const SailingReportPDF = (
   sailDesc: string,
   sailDate: string,
   containerManifest: any,
   summary: any
) => {
   const palletTotal =
      summary.palletTotal > 0 &&
      `<tr>
  <td>
   ${summary.palletTotal}
  </td>
  <td>
     Pallets
  </td>
  <td>
  ${summary.palletPieces}
  </td>
  <td>
  </td>
</tr>`;

   const looseTotal =
      summary.looseTotal > 0 &&
      `<tr>
<td>
${summary.looseTotal}
</td>
<td>
   Loose
</td>
<td>
   // ${summary.loosePieces}
   -
</td>
<td>
</td>
</tr>`;

   const pdf = `<!doctype html>
  <html>
     <head>
        <meta charset="utf-8">
        <title>PDF Result Template</title>
        <style>
         * {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
         }
         .report-box {
            max-width: 800px;
            margin: auto;
            font-size: 18px;
            font-family: "Roboto", "Helvetica Neue", sans-serif;
            color: #555;
         }
         .report-top{
            padding: 15px 0px;
            display: flex;
            flex-direction: column;
         }
         .report-top-header{
            display: flex;
            justify-content: space-between;
            align-items: center;
         }
         .report-top-details {
            text-align: center;
            padding: 10px;
            font-size: 1.5em;
         }
         .column-header {
            display: flex;
            font-weight: bold;
            text-decoration: underline;
         }
         .column-title{
            font-size: 1.5rem;
         }
         .column-title, .column-text{
            flex-basis: 25%;
         }

         .column-header div:first-child, .column-details div:first-child {
            flex-basis: 20%;
         }

         .column-header div:nth-child(2), .column-details div:nth-child(2) {
            flex-basis: 30%;
         }
         .column-details{
            padding-top: 12px;
            display: flex;
         }
         .report-footer-header{
            padding: 10px 5px;
            background: #eee;
            font-weight: bold;
            font-size: 1.5em;
            margin: 1em 0 0.5em;
         }
         .report-footer-details{
            display: flex;
            font-weight: bold;
            border-bottom: 1px solid #eee;
            padding: 5px;
         }
         .lastrow {
            border-bottom: none;
         }
        </style>
     </head>
     <body>
        <div class="report-box">
           <div class="report-top">
              <div class="report-top-header">
                 <img src='http://oascomms.ddns.net:7102/api/oaslogo.png' style="width:100%; max-width:130px;">
                 <div>
                    <h1>Sailing Summary</h1>
                 </div>
              </div>
              <div class="report-top-details">
                 <span>${sailDesc}</span>
                 <span>${sailDate}</span>
              </div>
           </div>
           <div class="report-details">
               <div class="column-header">
                  <div class="column-title">
                     Pallet
                  </div>
                  <div class="column-title">
                     Type
                  </div>
                  <div class="column-title">
                     Pieces
                  </div>
                  <div class="column-title">
                     Weights
                  </div>
               </div>
               ${containerManifest?.data
         ?.map((pallet: any) => {
            return `
                  <div class="column-details">
                     <div class="column-text">
                     ${pallet.palletType === "Loose" ? "Loose" :pallet.palletNo}
                     </div>
                     <div class="column-text">
                     ${pallet.palletType}
                     ${pallet.palletType === "Loose"
                  ? `- (<span>${pallet.palletDesc}</span>)`
                  : ``
               }
                     </div>
                     <div class="column-text">
                       ${pallet.packageCount }
                     </div>
                     <div class="column-text">
                     ${pallet.palletWeights}
                     </div>
                  </div>`;
         })
         .join("")}
            </div>
            <div class="report-footer">
               <div class="report-footer-header">
                  <p>
                     Total
                  </p>
		         </div>
               ${summary.palletTotal !== 0
         ? `<div class="report-footer-details">
                  <div class="column-title">
                      ${summary.palletTotal > 0 && summary.palletTotal}
                  </div>
                  <div class="column-title">
                        Pallets
                  </div>
                  <div class="column-title">
                      ${summary.palletPieces}
                  </div>
                  <div class="column-title">
                      ${summary.palletPiecesWeight + ' ' + summary.unitType}
                  </div>
               </div>`
         : ""
      }
            ${summary.looseTotal !== 0
         ? `<div class="report-footer-details lastrow">
                  <div class="column-title">
                      ${summary.looseTotal > 0 && summary.looseTotal}
                  </div>
                  <div class="column-title">
                     Loose
                  </div>
                  <div class="column-title">
                      ${summary.loosePieces}
                  </div>
                  <div class="column-title">
                      ${summary.loosePiecesWeight + ' ' + summary.unitType}
                  </div>
               </div>`
         : ``
      } 
            </div>
        </div>
     </body>
  </html>`;

   return pdf;
};

export { SailingReportPDF };
