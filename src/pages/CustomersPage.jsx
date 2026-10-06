import React, { useState } from 'react'
import ExportMenu from '../components/common/ExportMenu'
import { CloseIcon, PlusIcon, SearchIcon } from '../icons/FlowerIcons'

const steps = ['Profile', 'Address', 'Payment', 'Submission']

const initialCustomer = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  status: 'Active',
  address: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  paymentMethod: 'Credit Card',
  cardholder: '',
  cardLast4: '',
  expiryMonth: '12',
  expiryYear: String(new Date().getFullYear()),
}

const inputClass =
  'mt-1.5 w-full rounded-xl border border-slate-200 px-2.5 py-2 text-[10px] text-slate-700 outline-none focus:border-[#16A34A]'

function CustomerModal({ onClose, onSave }) {
  const [activeStep, setActiveStep] = useState('Profile')
  const [customer, setCustomer] = useState(initialCustomer)

  const updateCustomer = (field, value) => {
    setCustomer((current) => ({ ...current, [field]: value }))
  }

  const goNext = () => {
    const currentIndex = steps.indexOf(activeStep)
    if (currentIndex < steps.length - 1) setActiveStep(steps[currentIndex + 1])
  }

  const goPrevious = () => {
    const currentIndex = steps.indexOf(activeStep)
    if (currentIndex > 0) setActiveStep(steps[currentIndex - 1])
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (activeStep !== 'Submission') {
      goNext()
      return
    }
    if (!customer.firstName.trim() || !customer.lastName.trim() || !customer.email.trim() || !customer.phone.trim()) {
      setActiveStep('Profile')
      return
    }
    if (!customer.address.trim() || !customer.city.trim() || !customer.state.trim() || !customer.postalCode.trim() || !customer.country.trim()) {
      setActiveStep('Address')
      return
    }
    if (customer.paymentMethod === 'Credit Card' && (!customer.cardholder.trim() || !/^\d{4}$/.test(customer.cardLast4))) {
      setActiveStep('Payment')
      return
    }
    onSave(customer)
  }

  const handleStepSubmit = (event) => {
    event.preventDefault()
    if (activeStep === 'Submission') {
      handleSubmit(event)
      return
    }
    goNext()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-3">
      <form onSubmit={handleStepSubmit} className="relative w-full max-w-[420px] overflow-hidden rounded-md bg-white shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close customer form"
          className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <div className="flex overflow-x-auto border-b border-slate-200 px-4 pr-12">
          {steps.map((step) => (
            <button
              key={step}
              type="button"
              onClick={() => setActiveStep(step)}
              aria-current={activeStep === step ? 'step' : undefined}
              className={`shrink-0 border-b-2 px-3 py-3 text-[9px] font-semibold uppercase transition ${
                activeStep === step
                  ? 'border-[#16A34A] text-[#15803D]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {step}
            </button>
          ))}
        </div>

        <div className="max-h-[calc(100vh-130px)] overflow-y-auto px-5 py-4">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">{activeStep}</h2>

          {activeStep === 'Profile' && (
            <div className="space-y-3">
              <div className="flex justify-center py-1">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-slate-300 bg-slate-100 text-2xl text-slate-400">
                  <img src="/user-avatar.png" alt="" className="h-16 w-16 rounded-full object-cover" />
                  <label className="absolute -right-1 top-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-xs text-slate-600">
                    ✎
                    <input type="file" accept="image/*" className="sr-only" />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-[10px] text-slate-400">First Name<input required value={customer.firstName} onChange={(event) => updateCustomer('firstName', event.target.value)} className={inputClass} /></label>
                <label className="block text-[10px] text-slate-400">Last Name<input required value={customer.lastName} onChange={(event) => updateCustomer('lastName', event.target.value)} className={inputClass} /></label>
              </div>
              <label className="block text-[10px] text-slate-400">Email<input required type="email" value={customer.email} onChange={(event) => updateCustomer('email', event.target.value)} className={inputClass} /></label>
              <label className="block text-[10px] text-slate-400">Phone<input required type="tel" value={customer.phone} onChange={(event) => updateCustomer('phone', event.target.value)} className={inputClass} /></label>
              <label className="block text-[10px] text-slate-400">Status
                <select value={customer.status} onChange={(event) => updateCustomer('status', event.target.value)} className={inputClass}>
                  <option>Active</option><option>Blocked</option>
                </select>
              </label>
            </div>
          )}

          {activeStep === 'Address' && (
            <div className="space-y-3.5">
              <label className="block text-[10px] text-slate-400">
                Address Line 1
                <input required value={customer.address} onChange={(event) => updateCustomer('address', event.target.value)} className={inputClass} />
              </label>
              <label className="block text-[10px] text-slate-400">
                Address Line 2
                <input value={customer.addressLine2} onChange={(event) => updateCustomer('addressLine2', event.target.value)} placeholder="Optional" className={inputClass} />
              </label>
              <label className="block text-[10px] text-slate-400">
                City
                <input required value={customer.city} onChange={(event) => updateCustomer('city', event.target.value)} className={inputClass} />
              </label>
              <label className="block text-[10px] text-slate-400">
                Country
                <select required value={customer.country} onChange={(event) => updateCustomer('country', event.target.value)} className={`${inputClass} bg-white`}>
                  <option value="">Select country</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>India</option>
                  <option>Australia</option>
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-[10px] text-slate-400">
                  State/Region
                  <input required value={customer.state} onChange={(event) => updateCustomer('state', event.target.value)} className={inputClass} />
                </label>
                <label className="block text-[10px] text-slate-400">
                  Postcode
                  <input required value={customer.postalCode} onChange={(event) => updateCustomer('postalCode', event.target.value)} className={inputClass} />
                </label>
              </div>
            </div>
          )}

          {activeStep === 'Payment' && (
            <div className="space-y-4">
              <fieldset>
                <legend className="mb-2 text-[10px] font-medium text-slate-400">Choose payment method:</legend>
                <div className="grid grid-cols-2 gap-3">
                  {['Credit Card', 'PayPal'].map((method) => {
                    const isSelected = customer.paymentMethod === method
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => updateCustomer('paymentMethod', method)}
                        aria-pressed={isSelected}
                        className={`flex h-10 items-center gap-2 rounded-xl border px-2.5 text-left text-[10px] transition ${
                          isSelected
                            ? 'border-[#16A34A] text-slate-700'
                            : 'border-transparent bg-slate-50 text-slate-600 hover:border-slate-200'
                        }`}
                      >
                        <span className={`flex h-3 w-3 items-center justify-center rounded-sm border ${
                          isSelected ? 'border-[#16A34A] bg-[#16A34A] text-white' : 'border-slate-200 bg-white'
                        }`}>
                          {isSelected && <span className="text-[9px] leading-none">✓</span>}
                        </span>
                        {method}
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              {customer.paymentMethod === 'Credit Card' && (
                <div className="space-y-3.5">
                  <label className="block text-[10px] text-slate-400">
                    Card Number
                    <input
                      required
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={4}
                      pattern="[0-9]{4}"
                      placeholder="•••• - •••• - •••• - 1234"
                      value={customer.cardLast4}
                      onChange={(event) => updateCustomer('cardLast4', event.target.value.replace(/\D/g, '').slice(-4))}
                      className={inputClass}
                    />
                    <span className="mt-1 block text-[9px] text-slate-400">For safety, enter only the last 4 digits.</span>
                  </label>
                  <label className="block text-[10px] text-slate-400">
                    Card Holder
                    <input
                      required
                      autoComplete="cc-name"
                      value={customer.cardholder}
                      onChange={(event) => updateCustomer('cardholder', event.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-[10px] text-slate-400">
                      Month
                      <select
                        value={customer.expiryMonth}
                        onChange={(event) => updateCustomer('expiryMonth', event.target.value)}
                        className={`${inputClass} bg-white`}
                      >
                        {Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0')).map((month) => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-[10px] text-slate-400">
                      Year
                      <select
                        value={customer.expiryYear}
                        onChange={(event) => updateCustomer('expiryYear', event.target.value)}
                        className={`${inputClass} bg-white`}
                      >
                        {Array.from({ length: 15 }, (_, index) => new Date().getFullYear() + index).map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              )}
              {customer.paymentMethod === 'PayPal' && (
                <div className="rounded-xl bg-slate-50 p-3 text-[10px] leading-relaxed text-slate-500">
                  PayPal selected. Payment will be completed through PayPal when available.
                </div>
              )}
            </div>
          )}

          {activeStep === 'Submission' && (
            <div className="divide-y divide-slate-200 text-[10px] leading-relaxed text-slate-500">
              <section className="space-y-1 pb-3">
                <h3 className="mb-1 text-xs font-semibold text-slate-800">Profile Details</h3>
                <p>Name: <span className="text-slate-700">{customer.firstName} {customer.lastName}</span></p>
                <p>Email: <span className="text-slate-700">{customer.email}</span></p>
                <p>Phone: <span className="text-slate-700">{customer.phone}</span></p>
              </section>

              <section className="space-y-1 py-3">
                <h3 className="mb-1 text-xs font-semibold text-slate-800">Address Details</h3>
                <p>Address Line 1: <span className="text-slate-700">{customer.address}</span></p>
                {customer.addressLine2 && <p>Address Line 2: <span className="text-slate-700">{customer.addressLine2}</span></p>}
                <p>City: <span className="text-slate-700">{customer.city}</span></p>
                <p>Country: <span className="text-slate-700">{customer.country}</span></p>
                <p>State/Region: <span className="text-slate-700">{customer.state}</span></p>
                <p>Postcode: <span className="text-slate-700">{customer.postalCode}</span></p>
              </section>

              <section className="space-y-1 pt-3">
                <h3 className="mb-1 text-xs font-semibold text-slate-800">Payment Details</h3>
                {customer.paymentMethod === 'Credit Card' ? (
                  <>
                    <p>Card Number: <span className="text-slate-700">•••• - •••• - •••• - {customer.cardLast4 || '••••'}</span></p>
                    <p>Card Name: <span className="text-slate-700">{customer.cardholder || '—'}</span></p>
                    <p>Card Expiry: <span className="text-slate-700">{customer.expiryMonth}/{customer.expiryYear}</span></p>
                  </>
                ) : (
                  <p>Payment Method: <span className="text-slate-700">PayPal</span></p>
                )}
              </section>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
          {activeStep !== 'Profile' ? (
            <button type="button" onClick={goPrevious} className="rounded-lg border border-slate-200 px-4 py-2 text-[10px] font-medium text-slate-600 hover:bg-slate-50">
              Previous
            </button>
          ) : <span />}
          <button type="submit" className="rounded-lg bg-[#16A34A] px-5 py-2 text-[10px] font-bold text-white hover:bg-[#15803d]">
            {activeStep === 'Submission' ? 'Submit' : 'Next Step'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState([
    { id: 1, firstName: 'Regina', lastName: 'Cooper', email: 'regina_cooper@mail.com', phone: '(070) 4567-8800', status: 'Active', avatar: '/user-avatar.png' },
    { id: 2, firstName: 'Judith', lastName: 'Black', email: 'judith.black@mail.com', phone: '(070) 4567-8459', status: 'Active', avatar: '/user-avatar.png' },
    { id: 3, firstName: 'Ronald', lastName: 'Richards', email: 'ronald.richards@mail.com', phone: '(070) 4567-9221', status: 'Blocked', avatar: '/user-avatar.png' },
    { id: 4, firstName: 'Dustin', lastName: 'Williamson', email: 'dustin.w@mail.com', phone: '(070) 4567-0507', status: 'Active', avatar: '/user-avatar.png' },
    { id: 5, firstName: 'Calvin', lastName: 'Alexander', email: 'calvin.alexander@mail.com', phone: '(070) 4567-3791', status: 'Active', avatar: '/user-avatar.png' },
    { id: 6, firstName: 'Nathan', lastName: 'Hawkins', email: 'nathan.hawkins@mail.com', phone: '(070) 4567-1147', status: 'Active', avatar: '/user-avatar.png' },
  ])
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredCustomers = customers.filter((customer) =>
    `${customer.firstName} ${customer.lastName} ${customer.email} ${customer.phone}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  )

  const addCustomer = (customer) => {
    setCustomers((current) => [
      { ...customer, id: Date.now(), avatar: '/user-avatar.png' },
      ...current,
    ])
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">Customers</h1>
        <div className="flex items-center gap-3">
          <ExportMenu
            title="Customers"
            filename="customers"
            rows={filteredCustomers}
            columns={[
              { label: 'First Name', value: (customer) => customer.firstName },
              { label: 'Last Name', value: (customer) => customer.lastName },
              { label: 'Email', value: (customer) => customer.email },
              { label: 'Phone', value: (customer) => customer.phone },
              { label: 'Status', value: (customer) => customer.status },
              { label: 'Address', value: (customer) => [customer.address, customer.addressLine2, customer.city, customer.state, customer.postalCode, customer.country].filter(Boolean).join(', ') },
              { label: 'Payment Method', value: (customer) => customer.paymentMethod || '' },
            ]}
          />
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            aria-label="Add customer"
            title="Add customer"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#16A34A] text-white shadow-sm transition hover:bg-[#15803d]"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="space-y-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-card sm:p-6">
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search customers..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-[#B4F481]"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-2 py-3">Customer Name</th>
                <th className="px-2 py-3">Email</th>
                <th className="px-2 py-3">Phone</th>
                <th className="px-2 py-3">Date</th>
                <th className="px-2 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50">
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-2.5 font-semibold text-slate-800">
                      <img src={customer.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                      {customer.firstName} {customer.lastName}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-slate-500">{customer.email}</td>
                  <td className="px-2 py-3 text-slate-500">{customer.phone}</td>
                  <td className="px-2 py-3 text-slate-500">{customer.createdAt || '12.09.20'}</td>
                  <td className="px-2 py-3">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-semibold ${
                      customer.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr><td colSpan="5" className="px-2 py-8 text-center text-xs text-slate-400">No customers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && <CustomerModal onClose={() => setIsModalOpen(false)} onSave={addCustomer} />}
    </div>
  )
}
