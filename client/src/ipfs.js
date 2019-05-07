/* to connect to ipfs, we will create an instance
    of the api and connect to a remote node (via infura.io)
    instead of creating our own local node
*/

const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https'});

export default ipfs;