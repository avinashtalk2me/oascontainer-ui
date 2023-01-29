const envDetails: any = {
    dev: {
        APP_VERSION : "getAppVersion",
        REGISTER: "register",
        LOGIN: "login",
        VALIDATE_EMAIL: "validateEmail",
        UPDATE_PASSWORD: "updatePassword",
        DELETE_USER: "deleteUser/{userId}",
        GET_SAILINGS: "sailing",
        ADD_SAILING: "sailing",
        GET_SAILING: "sailing/{sailId}",
        UPDATE_SAILING: "sailing/{sailId}",
        DELETE_SAILING: "sailing/{sailId}",
        GET_PALLETS: "pallet/{sailId}",
        GET_NEXT_PALLETNO: "pallet/nextPalletNo/{sailId}",
        ADD_PALLET: "pallet/{sailId}",
        GET_PALLET: "pallet/{sailId}/{palletId}",
        UPDATE_PALLET: "pallet/{palletId}",
        DELETE_PALLET: "pallet/{palletId}",
        GET_PACKAGES: "package/{palletId}",
        ADD_PACKAGE: "package/{palletId}",
        GET_PACKAGE: "package/{palletId}/{packageId}",
        UPDATE_PACKAGE: "package/{packageId}",
        DELETE_PACKAGE: "package/{packageId}",
        GET_CONTAINER_MANIFEST: "sailing/containermanifest/{sailId}",
        GET_PALLET_MANIFEST: "sailing/palletmanifest/{sailId}",
        GET_PACKAGE_PKG_NO: "package/getPkgNo/{palletId}",
        GET_HWBNO_INFO: "package/getHWBInfo/{hwbNo}/{palletId}"
    }
}

const enviorment = process.env.REACT_APP_ENV ? process.env.REACT_APP_ENV : "dev"

export default envDetails[enviorment]