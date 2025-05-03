export interface Package {
    packageId:number;
    palletId: number;
    packageType:string;
    hwbId?:number;
    hwbNo:string;
    palletNo?: string;
    totalPackages?: string;
}