import type { PublicClient, Transport } from '../../clients/index.js'
import type { Address, BlockTag, Chain } from '../../types/index.js'
import { numberToHex } from '../../utils/index.js'

export type GetBalanceParameters = {
  /** The address of the account. */
  address: Address
} & (
  | {
      /** The balance of the account at a block number. */
      blockNumber?: bigint | undefined
      blockTag?: never | undefined
    }
  | {
      blockNumber?: never | undefined
      /** The balance of the account at a block tag. */
      blockTag?: BlockTag | undefined
    }
)

export type GetBalanceReturnType = bigint

/**
 * Returns the balance of an address in wei.
 *
 * - Docs: https://viem.sh/docs/actions/public/getBalance.html
 * - JSON-RPC Methods: [`eth_getBalance`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getbalance)
 *
 * @remarks
 * You can convert the balance to ether units with [`formatEther`](https://viem.sh/docs/utilities/formatEther.html).
 *
 * ```ts
 * const balance = await getBalance(client, {
 *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   blockTag: 'safe'
 * })
 * const balanceAsEther = formatEther(balance)
 * // "6.942"
 * ```
 *
 * @param client - Client to use
 * @param parameters - {@link GetBalanceParameters}
 * @returns The balance of the address in wei. {@link GetBalanceReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getBalance } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const balance = await getBalance(client, {
 *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 * })
 * // 10000000000000000000000n (wei)
 */
export async function getBalance<TChain extends Chain | undefined>(
  client: PublicClient<Transport, TChain>,
  { address, blockNumber, blockTag = 'latest' }: GetBalanceParameters,
): Promise<GetBalanceReturnType> {
  const blockNumberHex = blockNumber ? numberToHex(blockNumber) : undefined

  const balance = await client.request({
    method: 'eth_getBalance',
    params: [address, blockNumberHex || blockTag],
  })
  return BigInt(balance)
}
