const dataProcessor = {
  handleDataProcessing: function(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data format');
    }
    
    // Enhanced processing with filtering
    const filtered = data.items ? data.items.filter(item => item.active) : [];
    const result = {
      processed: true,
      timestamp: new Date().toISOString(),
      count: filtered.length,
      activeItems: filtered
    };
    
    return result;
  }
};

module.exports = dataProcessor;
