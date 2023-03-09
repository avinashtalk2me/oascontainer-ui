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
      //  GET_PACKAGE: "package/{palletId}/{packageId}",
        UPDATE_PACKAGE: "package/{packageId}",
        DELETE_PACKAGE: "package/{packageId}",
        GET_CONTAINER_MANIFEST: "sailing/containermanifest/{sailId}",
        GET_PALLET_MANIFEST: "sailing/palletmanifest/{sailId}",
        GET_PACKAGE_PKG_NO: "package/getPkgNo/{palletId}",
        GET_HWBNO_INFO: "package/getHWBInfo/{hwbNo}/{palletId}",
        GET_DELIVERIES: "delivery",
        ADD_DELIVERY: "delivery",
        GET_DELIVERY: "delivery/{deliveryId}",
        UPDATE_DELIVERY: "delivery/{deliveryId}",
        DELETE_DELIVERY: "delivery/{deliveryId}",
        GET_LOCATIONS: "location/{deliveryId}",
        ADD_LOCATION: "location/{deliveryId}",
        GET_LOCATION: "location/{deliveryId}/{locationId}",
        UPDATE_LOCATION: "location/{locationId}",
        DELETE_LOCATION: "location/{locationId}",
        SEND_EMAIL_FOR_LOCATION: "email/location/{locationId}",
        GET_DROPOFFS: "dropOff/{locationId}",
        ADD_DROPOFF: "dropOff/{locationId}/{deliveryId}",
        // GET_DROPOFF: "dropoff/{locationId}/{dropoffId}",
        UPDATE_DROPOFF: "dropOff/{packageId}",
        DELETE_DROPOFF: "dropOff/{packageId}",
        GET_DROPOFF_PKG_NO: "package/getPkgNo/{palletId}",
        GET_DROPOFF_HWBNO_INFO: "dropOff/getSelectedHWBInfoForDropOff/{locationId}/{hwbNo}",
        GET_ROPOFF_PACKAGE_PKG_NO: "dropOff/getSelectedPackagePkgNosForDropOff/{locationId}",
    }
}

const enviorment = process.env.REACT_APP_ENV ? process.env.REACT_APP_ENV : "dev"

export default envDetails[enviorment]