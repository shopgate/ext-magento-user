module.exports = async (context, input) => {
  const tags = input.tags && {
      ...(input.tags.includes('default_shipping') && { is_default_shipping: 1 }),
      ...(input.tags.includes('default_billing') && { is_default_billing: 1 })
    }

  return { magentoAddress: { ...input.magentoAddress, ...tags || {} } }
}
