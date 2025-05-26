const dataProcessor = {
  handleDataProcessing: function(data) {
    // Validate input data
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data format');
    }
    
    // Process the data
    const result = {
      processed: true,
      timestamp: new Date().toISOString(),
      count: data.items ? data.items.length : 0
    };
    
    return result;
  }
};

module.exports = dataProcessor;
