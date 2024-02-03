import { ProxyCreation } from '../generated/GnosisSafeProxyFactory/GnosisSafeProxyFactory'
import { ProxyContract } from '../generated/schema'

export function handleProxyCreation(event: ProxyCreation): void {
  let id = event.params.proxy.toHexString()
  let proxyContract = ProxyContract.load(id)
  if (!proxyContract) {
    proxyContract = new ProxyContract(id)
    proxyContract.singleton = event.params.singleton.toHexString()
    proxyContract.blockNumber = event.block.number
    proxyContract.blockTimestamp = event.block.timestamp
    proxyContract.transactionHash = event.transaction.hash.toHexString()
    proxyContract.save()
  }
}

// Assuming ExecutionSuccess is a valid event you want to handle
export function handleExecutionSuccess(event: ExecutionSuccess): void {
  let transactionId = event.transaction.hash.toHexString()
  let transaction = MultisigTransaction.load(transactionId)
  if (transaction === null) {
    transaction = new MultisigTransaction(transactionId)
    transaction.safe = event.address.toHexString()
    transaction.to = event.params.to.toHexString()
    transaction.value = event.params.value
    transaction.data = event.params.data
    transaction.operation = event.params.operation.toI32()
    transaction.submittedBy = event.transaction.from.toHexString()
    transaction.executed = true
    transaction.blockNumber = event.block.number.toI32()
    transaction.blockTimestamp = event.block.timestamp.toI32()
    transaction.save()
  }

  let userId = event.transaction.from.toHexString()
  let userActivity = UserActivity.load(userId)
  if (userActivity === null) {
    userActivity = new UserActivity(userId)
    userActivity.user = userId
    userActivity.safes = [event.address.toHexString()]
    userActivity.transactionsSubmitted = [transactionId]
    userActivity.transactionsApproved = []
    userActivity.save()
  } else {
    // Update existing user activity
    let safes = userActivity.safes
    if (!safes.includes(event.address.toHexString())) {
      safes.push(event.address.toHexString())
    }
    userActivity.safes = safes

    let transactionsSubmitted = userActivity.transactionsSubmitted
    if (!transactionsSubmitted.includes(transactionId)) {
      transactionsSubmitted.push(transactionId)
    }
    userActivity.transactionsSubmitted = transactionsSubmitted
    userActivity.save()
  }
}
