interface NFTMinterABI  {
    inputs: { internalType: string; name: string; type: string }[];
    name: string;
    outputs: { internalType: string; name: string; type: string }[];
    type: string;
}
declare module './nftMinter_abi' {
    const nftMinterABI: NFTMinterABI[];
    export default nftMinterABI;
  }