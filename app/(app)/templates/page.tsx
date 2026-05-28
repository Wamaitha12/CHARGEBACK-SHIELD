'use client'

import { useState } from 'react'
import {
  Copy, Check, Edit2, Save, X, Plus, FileText,
  Package, CreditCard, RefreshCcw, Monitor, ShoppingBag, Lock,
} from 'lucide-react'

interface Template {
  id: string
  title: string
  category: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  body: string
  isCustom?: boolean
}

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'not-received',
    title: 'Product Not Received',
    category: 'Shipping',
    icon: Package,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    body: `Dear [Bank/Card Network],

We are responding to chargeback case #[CASE_ID] filed by [CUSTOMER_NAME] on [DATE].

The customer claims they did not receive the product. We respectfully dispute this claim and provide the following evidence:

1. ORDER CONFIRMATION: The order (#[ORDER_ID]) was placed on [ORDER_DATE] and confirmed via email to [CUSTOMER_EMAIL].

2. SHIPPING CONFIRMATION: The item was shipped via [CARRIER] on [SHIP_DATE] with tracking number [TRACKING_NUMBER].

3. DELIVERY CONFIRMATION: Our records show the package was delivered to [DELIVERY_ADDRESS] on [DELIVERY_DATE] at [DELIVERY_TIME]. Proof of delivery is attached.

4. CUSTOMER COMMUNICATION: The customer did not contact us prior to filing this chargeback. Our support team is available 24/7 and we have no record of a complaint regarding this order.

Given the above evidence, we respectfully request that this chargeback be reversed in our favor.

Sincerely,
[YOUR_BUSINESS_NAME]`,
  },
  {
    id: 'unauthorized',
    title: 'Unauthorized Transaction',
    category: 'Fraud',
    icon: CreditCard,
    iconBg: 'bg-danger-50',
    iconColor: 'text-danger-600',
    body: `Dear [Bank/Card Network],

We are responding to chargeback case #[CASE_ID] for an alleged unauthorized transaction by [CUSTOMER_NAME].

We believe this transaction was fully authorized and provide the following evidence:

1. TRANSACTION DETAILS: The purchase of [PRODUCT_NAME] for [AMOUNT] was made on [DATE] from IP address [IP_ADDRESS].

2. ACCOUNT VERIFICATION: The customer is a registered account holder. The order was placed using the account email [CUSTOMER_EMAIL], which has been active since [ACCOUNT_CREATED].

3. BILLING ADDRESS MATCH: The billing address provided matched the card's registered address (AVS match confirmed).

4. DEVICE FINGERPRINT: The order was placed from a recognized device previously used by this account.

5. PRIOR PURCHASES: This customer has made [N] previous purchases with us without dispute (order history attached).

Given the above, we believe this is a case of friendly fraud. We respectfully request reversal of this chargeback.

Sincerely,
[YOUR_BUSINESS_NAME]`,
  },
  {
    id: 'defective',
    title: 'Defective Product Claim',
    category: 'Product Quality',
    icon: ShoppingBag,
    iconBg: 'bg-warning-50',
    iconColor: 'text-warning-600',
    body: `Dear [Bank/Card Network],

We are responding to chargeback case #[CASE_ID] where [CUSTOMER_NAME] claims the product was defective or not as described.

We take product quality seriously and respond as follows:

1. PRODUCT DESCRIPTION: The item ([PRODUCT_NAME]) was accurately described on our website. Screenshots of the product listing at time of purchase are attached.

2. RETURN POLICY: Our return policy allows returns within [X] days of delivery for any reason. The customer did not contact us or initiate a return.

3. CUSTOMER COMMUNICATION LOG: We have no record of the customer reporting a defect or requesting a refund/replacement. Our support inbox is monitored daily.

4. QUALITY ASSURANCE: This product model has a [X]% satisfaction rate across [N] orders with zero other defect reports.

We would have been happy to resolve this issue directly. We respectfully request reversal of this chargeback.

Sincerely,
[YOUR_BUSINESS_NAME]`,
  },
  {
    id: 'subscription',
    title: 'Subscription Dispute',
    category: 'Recurring Billing',
    icon: RefreshCcw,
    iconBg: 'bg-brand-50',
    iconColor: 'text-brand-600',
    body: `Dear [Bank/Card Network],

We are responding to chargeback case #[CASE_ID] filed by [CUSTOMER_NAME] regarding a subscription charge.

The customer disputes the charge of [AMOUNT] on [DATE]. We provide the following evidence:

1. SUBSCRIPTION AGREEMENT: The customer subscribed to [PLAN_NAME] on [START_DATE] and agreed to recurring billing of [AMOUNT] per [billing period]. The signed terms of service are attached.

2. CANCELLATION POLICY: Our cancellation policy was clearly presented at signup. Customers can cancel anytime via their account dashboard or by contacting support.

3. NO CANCELLATION RECEIVED: We have no record of a cancellation request from this customer prior to this charge. Our cancellation system logs every request with a timestamp.

4. SERVICE DELIVERED: The customer actively used the service during the billing period. Usage logs are attached showing [X] logins and [Y] actions taken.

5. RENEWAL NOTICE: A renewal reminder email was sent to [CUSTOMER_EMAIL] on [REMINDER_DATE], [X] days before the charge.

We respectfully request reversal of this chargeback.

Sincerely,
[YOUR_BUSINESS_NAME]`,
  },
  {
    id: 'digital',
    title: 'Digital Product Dispute',
    category: 'Digital Goods',
    icon: Monitor,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    body: `Dear [Bank/Card Network],

We are responding to chargeback case #[CASE_ID] for a digital product purchased by [CUSTOMER_NAME].

Digital goods are non-refundable once delivered. We provide the following:

1. PRODUCT DELIVERED: The digital product ([PRODUCT_NAME]) was delivered to [CUSTOMER_EMAIL] on [DELIVERY_DATE] at [DELIVERY_TIME]. Delivery confirmation logs are attached.

2. DOWNLOAD/ACCESS CONFIRMED: Our server logs show the product was [downloaded/accessed] [N] times from IP address [IP_ADDRESS] starting on [ACCESS_DATE].

3. TERMS ACKNOWLEDGED: At checkout, the customer acknowledged our no-refund policy for digital goods (screenshot of checkout flow attached).

4. NO PRIOR COMPLAINT: The customer did not contact our support team prior to filing this chargeback. We would have been happy to assist.

Under Visa/Mastercard rules for digital goods (Card-Not-Present transactions), a chargeback is not warranted when the digital goods were successfully delivered and accessed by the cardholder.

We respectfully request reversal of this chargeback.

Sincerely,
[YOUR_BUSINESS_NAME]`,
  },
]

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(DEFAULT_TEMPLATES)
  const [selected, setSelected] = useState<Template | null>(null)
  const [editing, setEditing] = useState(false)
  const [editBody, setEditBody] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showNewForm, setShowNewForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')

  const handleSelect = (t: Template) => {
    setSelected(t)
    setEditing(false)
    setCopied(false)
  }

  const handleCopy = () => {
    if (!selected) return
    navigator.clipboard.writeText(editing ? editBody : selected.body)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEdit = () => {
    if (!selected) return
    setEditBody(selected.body)
    setEditTitle(selected.title)
    setEditing(true)
  }

  const handleSaveEdit = () => {
    if (!selected) return
    setTemplates(prev =>
      prev.map(t => t.id === selected.id ? { ...t, body: editBody, title: editTitle } : t)
    )
    setSelected(prev => prev ? { ...prev, body: editBody, title: editTitle } : null)
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleAddCustom = () => {
    if (!newTitle.trim() || !newBody.trim()) return
    const t: Template = {
      id: `custom-${Date.now()}`,
      title: newTitle,
      category: 'Custom',
      icon: FileText,
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
      body: newBody,
      isCustom: true,
    }
    setTemplates(prev => [...prev, t])
    setNewTitle('')
    setNewBody('')
    setShowNewForm(false)
    setSelected(t)
  }

  const handleDelete = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Response Templates</h1>
          <p className="text-sm text-ink-secondary mt-0.5">Pre-built dispute responses — copy, customize, and submit</p>
        </div>
        <button onClick={() => setShowNewForm(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          New Template
        </button>
      </div>

      {/* Trust badge */}
      <div className="flex items-center gap-2 mb-6 px-4 py-3 rounded-xl bg-success-50 border border-success-200 text-success-800 text-sm">
        <Lock className="w-4 h-4 text-success-600 flex-shrink-0" />
        <span>Templates are stored locally in your session. <strong>Your business data is never shared.</strong></span>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">

        {/* Template list */}
        <div className="lg:col-span-2 space-y-2">
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => handleSelect(t)}
              className={`w-full text-left rounded-xl border p-4 transition-all duration-150 flex items-start gap-3 group ${
                selected?.id === t.id
                  ? 'border-brand-300 bg-brand-50 dark:bg-brand-950/30 dark:border-brand-700'
                  : 'border-surface-border bg-surface hover:border-brand-200 hover:shadow-card-hover'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${t.iconBg}`}>
                <t.icon className={`w-4 h-4 ${t.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-ink truncate">{t.title}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-ink-tertiary">{t.category}</span>
                  {t.isCustom && (
                    <span className="text-xs bg-brand-50 text-brand-600 border border-brand-100 px-1.5 py-0.5 rounded-full font-medium">Custom</span>
                  )}
                </div>
              </div>
              {t.isCustom && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(t.id) }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-danger-50 text-ink-tertiary hover:text-danger-600 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </button>
          ))}

          {/* New template form */}
          {showNewForm && (
            <div className="rounded-xl border border-brand-200 bg-brand-50 dark:bg-brand-950/20 p-4 space-y-3">
              <p className="text-sm font-semibold text-ink">New Custom Template</p>
              <input
                className="input text-sm"
                placeholder="Template title..."
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
              />
              <textarea
                className="input text-sm font-mono resize-none"
                rows={6}
                placeholder="Write your template here..."
                value={newBody}
                onChange={e => setNewBody(e.target.value)}
              />
              <div className="flex gap-2">
                <button onClick={handleAddCustom} className="btn-primary btn-sm">Save Template</button>
                <button onClick={() => setShowNewForm(false)} className="btn-ghost btn-sm">Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Template viewer */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="card overflow-hidden h-full flex flex-col">
              {/* Card header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selected.iconBg}`}>
                    <selected.icon className={`w-4 h-4 ${selected.iconColor}`} />
                  </div>
                  {editing ? (
                    <input
                      className="input py-1 text-sm font-semibold w-48"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                    />
                  ) : (
                    <div>
                      <div className="text-sm font-semibold text-ink">{selected.title}</div>
                      <div className="text-xs text-ink-tertiary">{selected.category}</div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {editing ? (
                    <>
                      <button onClick={handleSaveEdit} className="btn-primary btn-sm gap-1.5">
                        {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                        {saved ? 'Saved!' : 'Save'}
                      </button>
                      <button onClick={() => setEditing(false)} className="btn-ghost btn-sm">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={handleCopy} className="btn-secondary btn-sm gap-1.5">
                        {copied ? <Check className="w-3.5 h-3.5 text-success-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                      <button onClick={handleEdit} className="btn-ghost btn-sm gap-1.5">
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Template body */}
              <div className="flex-1 p-5">
                {editing ? (
                  <textarea
                    className="input font-mono text-xs leading-relaxed resize-none w-full h-full min-h-[400px]"
                    value={editBody}
                    onChange={e => setEditBody(e.target.value)}
                  />
                ) : (
                  <pre className="text-xs leading-relaxed text-ink-secondary font-mono whitespace-pre-wrap bg-surface-secondary rounded-xl border border-surface-border p-4 overflow-auto max-h-[520px]">
                    {selected.body}
                  </pre>
                )}
              </div>

              {/* Tip */}
              {!editing && (
                <div className="px-5 pb-4">
                  <p className="text-xs text-ink-tertiary bg-surface-secondary rounded-lg px-3 py-2 border border-surface-border">
                    Replace all <span className="font-mono text-brand-600">[PLACEHOLDERS]</span> with your actual case details before submitting.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="card h-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 bg-surface-tertiary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-ink-tertiary" />
              </div>
              <h3 className="font-semibold text-ink mb-1">Select a template</h3>
              <p className="text-sm text-ink-secondary max-w-xs">Choose a template from the left to view, copy, or customize it for your dispute response.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
