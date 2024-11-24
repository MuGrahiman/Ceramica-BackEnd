exports.providerSelector = (provider, { password, guId, fbId }) => {
    const providerMap = {
      mail: password,
      google: guId,
      facebook: fbId,
    };
  
    return providerMap[provider] || null; // Return the appropriate value or null if unsupported
  };
  