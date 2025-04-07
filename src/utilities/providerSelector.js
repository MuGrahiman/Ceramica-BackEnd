exports.providerSelector = ( provider,
  {
    local,
    google,
    facebook
  }
) => {
  const providerMap = {
    local,
    google,
    facebook,
  };

  return providerMap[ provider ] || null; // Return the appropriate value or null if unsupported
};
