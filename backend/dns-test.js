const dns = require('dns');

dns.setDefaultResultOrder('ipv4first');

dns.promises
  .resolveSrv('_mongodb._tcp.cluster0.weroqxo.mongodb.net')
  .then(console.log)
  .catch(console.error);