const dataTypeService = {};

dataTypeService.covertBool = async (value) => {
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'string') {
        return value.toLowerCase() === 'true';
    }
    return !!value; // Converts truthy/falsy values to true/false
};
dataTypeService.currentTime = async()=>{
    const now = new Date(); // Current time in UTC
    // Add 5 hours and 30 minutes to UTC time
    const istOffset = 5 * 60 + 30; // 5 hours and 30 minutes in minutes
    const istTime = new Date(now.getTime() + istOffset * 60 * 1000); // Convert minutes to milliseconds
    // Format IST time to 'HH:mm'
    const hours = istTime.getUTCHours().toString().padStart(2, '0');
    const minutes = istTime.getUTCMinutes().toString().padStart(2, '0');
    const istFormattedTime = `${hours}:${minutes}`;
    console.log("Current UTC Time:", now.toISOString().slice(11, 16)); // 'HH:mm' format
    console.log("IST Time (UTC + 5:30):", istFormattedTime)
      
      return istFormattedTime;
}
module.exports = dataTypeService;
