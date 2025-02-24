export const formatPhoneNumber = (phone) => {
   
    if (typeof phone !== 'string') return '';
  
    let cleaned = phone.replace(/[\s\-().]/g, '');
  
    if (cleaned.startsWith('+62')) {
      return '62' + cleaned.slice(3);
    }
    if (cleaned.startsWith('0')) {
      return '62' + cleaned.slice(1);
    }
    if (cleaned.startsWith('8')) {
      return '62' + cleaned;
    }
  
    return cleaned;
  };
  