
const routes = [
  {
    path: '/',
    redirect: '/assets'
  },
  {
    path: '/assets',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/stacking', component: () => import('pages/StackingPage.vue') },
      { path: '/transaction', component: () => import('pages/TransactionPage.vue') },
      { path: '/market', component: () => import('pages/MarketPage.vue') },
      { path: '/voting', component: () => import('pages/VotingPage.vue') },
      { path: '/wallet_management', component: () => import('pages/WalletManagementPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
