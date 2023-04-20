const automatedPaths = [
  "/apiServices/AddVisitByCode",
  "/apiAdmin/suburb/getSuburbAutomationInfo",
];

const getDeviceAddresses = () =>
  process.env.DEVICE_MAC_ADDRESSES?.split(",") || [];

const IsAutomatedPath = (path, macAddress) => {
  if (!macAddress) return false;
  const validDevices = getDeviceAddresses();
  const isValidDevice = validDevices.some((d) => d === macAddress);
  if (isValidDevice) {
    return automatedPaths.some((p) => path.startsWith(p));
  }
  return false;
};

module.exports = {
  IsAutomatedPath,
};
