module.exports = async (context, input) => {
  const tags = input.address.tags && {
    ...(input.address.tags.includes('default_shipping') && { is_default_shipping: 1 }),
    ...(input.address.tags.includes('default_billing') && { is_default_billing: 1 })
  }

  return { magentoAddress: { ...input.magentoAddress, ...tags || {} } }
}
