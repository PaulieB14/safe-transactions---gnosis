import { ProxyCreation } from '../generated/GnosisSafeProxyFactory/GnosisSafeProxyFactory'
import { ProxyContract } from '../generated/schema'

export function handleProxyCreation(event: ProxyCreation): void {
  let id = event.params.proxy.toHex()
  let proxyContract = new ProxyContract(id)
  proxyContract.singleton = event.params.singleton.toHex()
  proxyContract.save()
}

transaction.safe = event.address
transaction.to = event.params.to
transaction.value = event.params.value
transaction.data = event.params.data
transaction.operation = event.params.operation.toI32()
transaction.submittedBy = event.transaction.from
transaction.approvedBy = [] // Initialize as empty; you'll need to update this based on your logic for approvals
transaction.executed = true
transaction.blockNumber = event.block.number
transaction.blockTimestamp = event.block.timestamp
transaction.save()

// UserActivity logic for the user who submitted the transaction
let userId = event.transaction.from.toHex()
let userActivity = UserActivity.load(userId)
if (userActivity == null) {
  userActivity = new UserActivity(userId)
  userActivity.user = event.transaction.from
  userActivity.safes = [event.address.toHex()]
  userActivity.transactionsSubmitted = [transaction.id] // Change transactionId to transaction.id
  userActivity.transactionsApproved = [] // Initialize as empty; this should be populated based on your approval logic
} else {
  // Ensure the safe is listed in the user's activity
  let safes = userActivity.safes
  if (safes.indexOf(event.address.toHex()) == -1) {
    safes.push(event.address.toHex())
  }
  userActivity.safes = safes

  // Ensure the transaction is listed in the user's submitted transactions
  let transactionsSubmitted = userActivity.transactionsSubmitted
  if (transactionsSubmitted.indexOf(transaction.id) == -1) {
    // Change transactionId to transaction.id
    transactionsSubmitted.push(transaction.id) // Change transactionId to transaction.id
  }
  userActivity.transactionsSubmitted = transactionsSubmitted
}
userActivity.save()
