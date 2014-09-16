module.exports = {
  apiHost: 'becrtt01.china.nsn-net.net', // gitlab API host
  apiPrefix: '/api/v3', // gitlab API prefix
  apiToken: 'GYxF7Hzzp8jqjeRjovpr', // gitlab API token
  openStates: ['opened', 'reopened'],
  issueCategories: ['new', 'improvement', 'bug'],
  issuePriorities: ['A', 'B', 'C', 'high', 'medium', 'low'],
  devProjects: ['fss', 'coci', 'coci-runner', 'sad', 'sad-runner', 'TepProxy', 'hdfs-archiver', 'dlock'],
  maintainProjects: ['maintenence'],
  docProjects: ['document'],
  ldapServer: 'ldap://ed-qa-gl.emea.nsn-net.net:389',
  ldapBaseDN: 'ou=People,o=NSN',
  ldapSearchScope: 'sub',
  rpcLimit: 3, // concurrent rpc request limit
};
