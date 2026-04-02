"use client"

import { motion } from "framer-motion"
import { AlertCircle, Plus, Store, Zap } from "lucide-react"

export default function ConnectStore() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Connect Store</h1>
          <p className="text-zinc-400 text-sm mt-1">Link your Shopify or WooCommerce store to enable AI.</p>
        </div>
        <button className="bg-brand hover:bg-brand/90 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Store
        </button>
      </div>

      {/* Connection Wizard Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-2xl border border-zinc-800/50"
      >
        <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                <Store className="w-6 h-6 text-brand" />
            </div>
            <div className="flex-1">
                <h2 className="text-lg font-semibold text-white mb-2">Configure API Keys</h2>
                <p className="text-zinc-400 text-sm mb-6">
                    Enter your store's admin API credentials. We use these to read product data, track orders, and sync inventory in real-time.
                </p>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-300">Platform</label>
                            <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none focus:border-brand">
                                <option>Shopify</option>
                                <option>WooCommerce</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-300">Store URL</label>
                            <input 
                                type="text" 
                                placeholder="my-store.myshopify.com" 
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none focus:border-brand"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-300">Admin API Access Token</label>
                        <input 
                            type="password" 
                            placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxx" 
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none focus:border-brand"
                        />
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex gap-3 text-amber-500/90 items-start">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p className="text-xs leading-relaxed">Ensure the token has read permissions for <strong>Orders</strong>, <strong>Products</strong>, and <strong>Inventory</strong>.</p>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
                        <button className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                            Cancel
                        </button>
                        <button className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-brand/90 transition-all">
                            <Zap className="w-4 h-4" />
                            Connect Integration
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  )
}
