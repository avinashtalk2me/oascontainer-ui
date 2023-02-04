import { IPallet } from "../model/pallet";

const PalletReportPDF = (
  sailDesc: string,
  sailDate: string,
  uniquePallets: any,
  palletManifest: any
) => {
  const getPalletTotalDetails = (palletNo: number) => {
    const { quantity, total } = palletManifest.data
      .filter((item: IPallet) => item.palletNo === palletNo)
      .reduce(
        ({ quantity, total }: any, item: IPallet, index: number) => ({
          quantity: index + 1,
          total: total + item.packageCount,
        }),
        { quantity: 0, total: 0 }
      );
    if (total !== 0) {
      return `<div>(Total HWB#: ${quantity}, Pieces: ${total})</div>`;
    } else {
      return ``;
    }
  };

  const getPalletDetails = (palletNo: number) => {
    let filteredPallets: any[] = palletManifest.data.filter(
      (item: IPallet) => item.palletNo === palletNo
    );

    filteredPallets =
      filteredPallets.length === 1
        ? filteredPallets.filter((item) => +item.packageCount !== 0)
        : filteredPallets;

    if (filteredPallets.length > 0) {
      return `<div class="report-details-body">
                  <div class="details-header-title">
                     <div>HWB # </div>
                     <div>Pieces </div>
                  </div>
                  ${filteredPallets
                    .map((pallet: any) => {
                      return `<div class="details-header-body">
                                 <div>  ${pallet.hwbNo}</div>
                                 <div> ${pallet.packageCount}</div>
                              </div>`;
                    })
                    .join("")} </div>`;
    } else {
      return `<p>No details available<p>`;
    }
  };

  const pdf = `<!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>PDF Result Template</title>
          <style>
            *{
               padding: 0;
               margin: 0;
               box-sizing: border-box;
            }
            .report-box {
            max-width: 800px;
            margin: auto;
            font-size:18px;
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
            .report-details-header {
            display: flex;
            align-items: center;
            }
            
            .report-details-header h2{
               text-decoration: underline;
               margin-right: 5px;
               font-size: 1.3em;
            }

            .report-details p {
                margin: 15px 0px;
               font-weight: bold;
            }
           
            
            .report-details-body{
               width: 90%;
               margin: 15px auto;
            }
            
            .details-header-title{
               display: flex;
               text-decoration: underline;
               font-weight: bold;
            }
            
            .details-header-body {
               display: flex;
               margin-top:5px;
            }
            
            .details-header-title div, .details-header-body div{
               flex-basis: 50%;
            }
          </style>       
       </head>
       <body>
            <div class="report-box">
               <div class="report-top">
                  <div class="report-top-header">
                     <img src='http://oascomms.ddns.net:7102/api/oaslogo.png' style="width:100%; max-width:130px;">
                     <div>
                        <h2>Pallet Details</h2>
                     </div>
                  </div>
                  <div class="report-top-details">
                        <span>${sailDesc}</span>
                        <span>${sailDate}</span>
                  </div>
               </div>
               ${uniquePallets
                 .map((palletNo: number) => {
                   return `
               <div class="report-details">
                  <div class="report-details-header">
                     <h2>Pallet# ${palletNo}</h2>
                     ${getPalletTotalDetails(palletNo)}                    
                  </div>
                     ${getPalletDetails(palletNo)}
               </div>`;
                 })
                 .join("")}
          </div>
       </body>
    </html>`;

  return pdf;
};

export { PalletReportPDF };
