# Multi-Signature Wallet Activity Subgraph

## Overview

This subgraph is designed to track and index account activities on multi-signature (multi-sig) wallets on the Gnosis network. The primary goal is to provide insights into the actions performed by authorized users, including but not limited to, transaction submissions, approvals, and executions within these highly secure wallet contracts.

### Development Status

This subgraph is currently **in progress**. I am actively working on enhancing its capabilities, accuracy, and the breadth of activities it can track. The current version focuses on the foundational events related to proxy creation through the `GnosisSafeProxyFactory` and aims to expand to cover more nuanced and detailed aspects of multi-sig transactions and user interactions.

### Features and Data Tracked

- **Proxy Creation**: Tracks the creation of new proxy contracts (Gnosis Safe instances), serving as the foundational event for multi-sig wallets on the network.
- **User Activities** *(Planned)*: Aims to include detailed tracking of each authorized user's actions, such as submitting, approving, and executing transactions.
- **Multi-Sig Transactions** *(Planned)*: Future iterations will provide insights into the transactions managed by these wallets, including transaction details, execution status, and involved parties.


