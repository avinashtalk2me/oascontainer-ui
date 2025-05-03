import { Package } from "../model/package";

const HWBReportPDF = (
  sailDesc: string,
  sailDate: string,
  uniqueHwbNos: any,
  hwbManifest: any
) => {

  const getPiecesCount = (palletsByHwbNo: any) => {
    return palletsByHwbNo.reduce(
      (sum: number, item: any) => (sum += item.packageCount),
      0
    )
  }

  const getTotalPkgCount = (hwbNo: string) => {
    return hwbManifest.data.find((pkg: Package) => pkg.hwbNo === hwbNo).totalPackages
  }

  const getHWBPalletDetails = (hwbNo: string) => {

    const palletsByHwbNo = hwbManifest.data.filter(
      (pkg: Package) => pkg.hwbNo === hwbNo
    );

    const count = getPiecesCount(palletsByHwbNo);
    const totalPkgCount = getTotalPkgCount(hwbNo);

    return palletsByHwbNo.length >= 1 ? (
      `
          <div class="report-header">
              <h2>HWB #: ${hwbNo}</h2>
          </div>
          <div class='container'>
        
        ${palletsByHwbNo.map((pallet: any, index: number) => {
        return `
            <div class='pallet-section-body'> 
                <div>
                  ${pallet.palletType === 'Loose' ? 'Loose' : `Pallet ${pallet.palletNo}`}
                </div>
                <div>
                  ${pallet.packageCount}  ${count === 1 ? 'Piece' : 'Pieces'}
                </div>
            </div>`
      }).join("")}
      </div>
      <div class='pallet-footer'>
        <div style='margin-top: 8px;'>
          <span style='font-weight:bold;'>Total: </span> <span>${count} of ${totalPkgCount} ${totalPkgCount === 1 ? 'piece' : 'pieces'}</span>
        </div>
      </div>
      `
    ) : (
      `<IonText color="medium">No details available</IonText>`
    );
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
            .container {
              margin-left: 20px;
              width: 185px;
            }
            .report-box {
              max-width: 800px;
              margin: auto;
              font-size:18px;
              font-family: "Roboto", "Helvetica Neue", sans-serif;
              color: #555;
            }
            .pallet-footer {
              border-top: 1px solid;
              width: 220px;
              font-size: 0.95em;
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
            .pallet-section-header{
              display: flex;
              margin: 10px 0px;
              border-bottom: 1px solid;
              font-size:1em;
            }
            .pallet-section-body{
              display: flex;
              font-size: 0.9em;
              margin-bottom: 10px;
            }

            .report-details-header {
              display: flex;
              // align-items: center;
               flex-direction: column;
               margin-bottom: 20px;
            }

            .report-header {
              display: flex;
              border-bottom: 1px solid;
              width: fit-content;
              margin-bottom: 10px;
            }

            .report-header span {
              font-size: 1em;
            }

            .report-details-header h2{
               margin-right: 5px;
               font-size: 1.2em;
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
            .pallet-section-body > div:nth-child(1) { 
               flex-basis: 50%;
            }

            .pallet-section-body > div:nth-child(2) {
                display: flex; 
                flex-basis: 50%;
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
                        <h2>HWB Details</h2>
                     </div>
                  </div>
                  <div class="report-top-details">
                        <span>${sailDesc}</span>
                        <span>${sailDate}</span>
                  </div>
               </div>
               ${uniqueHwbNos
      .map((hwbNo: string) => {
        return `
               <div class="report-details">
                  <div class="report-details-header">
                      ${getHWBPalletDetails(hwbNo)}                    
                  </div>
               </div>`
      }).join("")}
          </div>
       </body>
    </html>`;

  return pdf;
};

export { HWBReportPDF };
