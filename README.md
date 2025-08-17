SubPay AI — Your Subscriptions Pay Themselves

SubPay AI is a consumer dApp that lets users pay subscriptions (Netflix, Spotify, etc.) in PayPal USD (PYUSD) while automatically micro-saving and investing small amounts to offset future bills.

The experience is simple:

Pay subscription in PYUSD.

Auto-allocate a micro-save ($2–$5).

Funds earn yield in a Uniswap strategy.

Dashboard shows “% of next bill covered” and auto-pays when due.


This project integrates three ETHGlobal New York 2025 bounties:

🔹 PayPal USD (PYUSD)

Primary payment & micro-saving unit.

Users pay subscriptions directly in PYUSD.

Demonstrates innovative programmable payments & consumer checkout.

🔹 Flow (EVM + Actions)

Smart contracts deployed on Flow EVM for plan registry, vault routing, and payouts.

Exposed as Flow Actions so any agent/app can compose: TopUp → Allocate → Redeem → Pay.

Fast, low-cost, composable rails for our automated subscription engine.

🔹 Uniswap

Used as the yield offset layer.

Micro-saves are allocated into a Uniswap liquidity pool strategy (low-vol stable LP).

Yield feeds the “coverage %” metric shown in the dashboard and auto-applied to future bills.

🛠️ Integration at a Glance

Frontend (Next.js + Tailwind): User dashboard, top-ups, yield tracking.

BFF Gateway (API routes): Normalizes UI calls → Plan Service, Yield Service, Payout Service.

Flow Contracts: PlanRegistry, VaultRouter, PayoutModule deployed on Flow EVM.

Flow Actions: JSON-defined, composable building blocks for automation.

Uniswap Strategy Adapter: Allocates PYUSD → LP → tracks yield.

PayPal USD: Token for micro-top-ups, payments, and merchant settlement.

⚡ SubPay AI = Seamless UX (PYUSD) + Composable Infra (Flow) + Real Yield (Uniswap)
- demo change Sun Aug 17 07:36:49 UTC 2025
