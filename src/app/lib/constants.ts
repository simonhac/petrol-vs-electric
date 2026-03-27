export interface Car {
  name: string;
  consumption: number;
  sales: number;
  fuelType: "petrol" | "diesel" | "electric";
  sourceUrl: string;
}

export const VFACTS_2025_URL = "https://www.fcai.com.au/sales";

// Top 10 selling petrol & diesel cars in Australia (2025 VFACTS, excl. hybrids)
// Consumption from Green Vehicle Guide (GVG) — best-selling variant
export const ICE_CARS: Car[] = [
  { name: "Ford Ranger", consumption: 7.2, sales: 56_555, fuelType: "diesel", sourceUrl: "https://www.greenvehicleguide.gov.au/Vehicle/ViewVehicle?vehicleDisplayIdList=31898:31899:31900:31901:31902:31903:31904:31905:31906:31907:31908:31909:31910:31911:31912:31913:31914:31915:31916:31917:31918:31919:31920:31921:31922" },
  { name: "Toyota HiLux", consumption: 7.2, sales: 51_297, fuelType: "diesel", sourceUrl: "https://www.greenvehicleguide.gov.au/Vehicle/ViewVehicle?vehicleDisplayIdList=33637:33638:33639:33640" },
  { name: "Isuzu D-Max", consumption: 8.0, sales: 26_839, fuelType: "diesel", sourceUrl: "https://www.vesr.gov.au/vehicle/isuzu-d-max-rg-4x4-crew-cab-utility-auto-2020-2025-0" },
  { name: "Ford Everest", consumption: 7.1, sales: 26_161, fuelType: "diesel", sourceUrl: "https://www.greenvehicleguide.gov.au/Vehicle/ViewMatchingVariants?vehicleDisplayId=32344" },
  { name: "Toyota LC Prado", consumption: 7.6, sales: 26_106, fuelType: "diesel", sourceUrl: "https://www.toyota.com.au/landcruiser-prado/specifications" },
  { name: "Mazda CX-5", consumption: 7.5, sales: 22_742, fuelType: "petrol", sourceUrl: "https://www.vesr.gov.au/vehicle/mazda-cx-5-suv-auto-2017-2026-1" },
  { name: "Mitsubishi Outlander", consumption: 7.7, sales: 22_459, fuelType: "petrol", sourceUrl: "https://www.greenvehicleguide.gov.au/Vehicle/ViewVehicle?vehicleDisplayIdList=36891:36890:36889:36888:36887:36886" },
  { name: "Hyundai Tucson", consumption: 6.7, sales: 20_145, fuelType: "petrol", sourceUrl: "https://www.greenvehicleguide.gov.au/Vehicle/ViewMatchingVariants?vehicleDisplayId=34054" },
  { name: "Chery Tiggo 4", consumption: 7.4, sales: 20_149, fuelType: "petrol", sourceUrl: "https://www.greenvehicleguide.gov.au/Vehicle/ViewMatchingVariants?vehicleDisplayId=36959" },
  { name: "MG ZS", consumption: 7.1, sales: 20_000, fuelType: "petrol", sourceUrl: "https://www.greenvehicleguide.gov.au/Vehicle/ViewMatchingVariants?vehicleDisplayId=32490" },
];

export const DIESEL_NAMES = ICE_CARS
  .filter((c) => c.fuelType === "diesel")
  .map((c) => c.name);

// Top 10 selling EVs in Australia (2025 VFACTS) with kWh/100km from GVG
export const EVS: Car[] = [
  { name: "Tesla Model Y", consumption: 15.8, sales: 22_239, fuelType: "electric", sourceUrl: "https://www.greenvehicleguide.gov.au/Vehicle/ViewMatchingVariants?vehicleDisplayId=34411" },
  { name: "BYD Sealion 7", consumption: 17.0, sales: 13_410, fuelType: "electric", sourceUrl: "https://www.greenvehicleguide.gov.au/Vehicle/ViewVehicle?vehicleDisplayIdList=34397:34398" },
  { name: "Tesla Model 3", consumption: 13.6, sales: 6_617, fuelType: "electric", sourceUrl: "https://www.greenvehicleguide.gov.au/Vehicle/ViewMatchingVariants?vehicleDisplayId=32326" },
  { name: "Kia EV5", consumption: 18.0, sales: 4_787, fuelType: "electric", sourceUrl: "https://www.greenvehicleguide.gov.au/Vehicle/ViewVehicle?vehicleDisplayIdList=33990:33989:33987" },
  { name: "Geely EX5", consumption: 16.6, sales: 3_944, fuelType: "electric", sourceUrl: "https://www.vesr.gov.au/vehicle/geely-ex5-6022-kwh-suv-2025" },
  { name: "BYD Atto 3", consumption: 14.8, sales: 3_861, fuelType: "electric", sourceUrl: "https://www.greenvehicleguide.gov.au/Vehicle/ViewMatchingVariants?vehicleDisplayId=36847" },
  { name: "BYD Seal", consumption: 14.6, sales: 3_784, fuelType: "electric", sourceUrl: "https://www.greenvehicleguide.gov.au/Vehicle/ViewMatchingVariants?vehicleDisplayId=32516" },
  { name: "BYD Dolphin", consumption: 12.6, sales: 3_248, fuelType: "electric", sourceUrl: "https://www.greenvehicleguide.gov.au/Vehicle/ViewMatchingVariants?vehicleDisplayId=32514" },
  { name: "MG 4", consumption: 13.8, sales: 2_986, fuelType: "electric", sourceUrl: "https://www.greenvehicleguide.gov.au/Vehicle/ViewMatchingVariants?vehicleDisplayId=32483" },
  { name: "Kia EV3", consumption: 15.5, sales: 2_597, fuelType: "electric", sourceUrl: "https://www.kia.com/au/cars/ev3/features.html" },
];
