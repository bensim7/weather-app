export function getLocalTimeEachCity(timezoneOffsetSecs: number): string {
    const now = new Date();
  
    // This gets the current UTC time in milliseconds
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  
    // This increases utcTime by the city's timezone offset
    const cityTime = new Date(utcTime + timezoneOffsetSecs * 1000);
  
    return cityTime.toLocaleString('en-US', {
      year: 'numeric',       
      month: '2-digit',      
      day: '2-digit',        
      hour: '2-digit',      
      minute: '2-digit',     
      hour12: true,    
    }).replace(/\//g, '-');
  }
