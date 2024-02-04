// Import necessary types from the graph-ts library
import { BigInt, Bytes } from '@graphprotocol/graph-ts'
// Import event types from the generated folder based on your ABIs
import { ProxyCreation } from '../generated/GnosisSafeProxyFactory/GnosisSafeProxyFactory'
// Import entity types from the generated schema
import { ProxyContract } from '../generated/schema'

// Handles the ProxyCreation event
export function handleProxyCreation(event: ProxyCreation): void {
  let id = event.params.proxy.toHexString()
  let proxyContract = ProxyContract.load(id)
  if (!proxyContract) {
    proxyContract = new ProxyContract(id)
    // No need to convert to Bytes as the event params should already be in the correct format.
    proxyContract.singleton = event.params.singleton
    proxyContract.blockNumber = event.block.number
    proxyContract.blockTimestamp = event.block.timestamp
    proxyContract.transactionHash = event.transaction.hash
    proxyContract.save()
  }
}

export function handleExecutionSuccess(event: ExecutionSuccess): void {
  let transactionId = event.transaction.hash.toHexString()
  let transaction = MultisigTransaction.load(transactionId)
  if (!transaction) {
    transaction = new MultisigTransaction(transactionId)
    transaction.safe = Bytes.fromHexString(event.address.toHexString())
    transaction.to = Bytes.fromHexString(event.params.to.toHexString())
    transaction.value = event.params.value
    transaction.data = event.params.data
    transaction.operation = event.params.operation.toI32()
    transaction.submittedBy = Bytes.fromHexString(
      event.transaction.from.toHexString(),
    )
    transaction.executed = true
    transaction.blockNumber = event.block.number
    transaction.blockTimestamp = event.block.timestamp
    transaction.save()
  }

  let userId = event.transaction.from.toHexString()
  let userActivity = UserActivity.load(userId)
  if (!userActivity) {
    userActivity = new UserActivity(userId)
    userActivity.user = Bytes.fromHexString(userId)
    let safes = new Array<Bytes>()
    safes.push(Bytes.fromHexString(event.address.toHexString()))
    userActivity.safes = safes
    let transactionsSubmitted = new Array<string>()
    transactionsSubmitted.push(transactionId)
    userActivity.transactionsSubmitted = transactionsSubmitted
    userActivity.save()
  } else {
    // Update existing user activity
    if (
      !userActivity.safes.includes(
        Bytes.fromHexString(event.address.toHexString()),
      )
    ) {
      let safes = userActivity.safes
      safes.push(Bytes.fromHexString(event.address.toHexString()))
      userActivity.safes = safes
    }

    if (!userActivity.transactionsSubmitted.includes(transactionId)) {
      let transactionsSubmitted = userActivity.transactionsSubmitted
      transactionsSubmitted.push(transactionId)
      userActivity.transactionsSubmitted = transactionsSubmitted
    }
    userActivity.save()
  }
}
