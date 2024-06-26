export const solanaService = {
  getAddressByDomainName: async ({ domainName }: { domainName: string }) => {
    const response = await fetch(`https://sns-sdk-proxy.bonfida.workers.dev/resolve/${domainName}`);
    return response.json();
  },
};
