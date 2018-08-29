module.exports = (context, input, cb) => {

  const tags = {
      ...(input.address.tags.includes('default_shipping') && {is_default_shipping: 1}),
      ...(input.address.tags.includes('default_billing') && {is_default_billing: 1})
    }

  cb(null, {magentoAddress: {...input.magentoAddress, ...tags}})
}
