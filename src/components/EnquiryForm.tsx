import React, { useEffect, useId, useState } from 'react';
import { CheckCircle2, Mail } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { trackAnalyticsEvent } from '../lib/analytics';
import { validateContactForm, type ValidationErrors } from '../utils/propertyFilters';

export type EnquiryFormMode = 'General Enquiry' | 'Property Enquiry' | 'Inspection Request';

interface EnquiryFormProps {
  mode: EnquiryFormMode;
  propertyRef?: string;
  propertyTitle?: string;
  sourcePage?: string;
  onModeChange?: (mode: EnquiryFormMode) => void;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  mode,
  propertyRef = '',
  propertyTitle = '',
  sourcePage = 'contact',
  onModeChange,
}) => {
  const { addEnquiry, siteConfig } = useAppState();
  const baseId = useId();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredWindow, setPreferredWindow] = useState('Weekday morning (9:00 AM – 12:00 PM)');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  useEffect(() => {
    setSubmittedRef(null);
  }, [mode, propertyRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateContactForm({ name, email, phone, message });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const created = addEnquiry({
      type: mode,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      propertyRef: propertyRef.trim() || undefined,
      propertyTitle: propertyTitle.trim() || undefined,
      preferredWindow: mode === 'Inspection Request' ? preferredWindow : undefined,
      message: message.trim(),
    });

    if (mode === 'Inspection Request') {
      trackAnalyticsEvent('inspection_request', {
        propertyRef,
        propertyTitle,
        sourcePage,
      });
    } else {
      trackAnalyticsEvent('property_enquiry', {
        propertyRef,
        propertyTitle,
        sourcePage,
      });
    }

    setSubmittedRef(created.id);

    if (siteConfig.contact.emailVerified && siteConfig.contact.emailHref) {
      const subject = `${mode}${propertyRef ? ` — ${propertyRef}` : ''}`;
      const body = [
        `Name: ${name.trim()}`,
        `Phone: ${phone.trim()}`,
        `Email: ${email.trim()}`,
        propertyRef ? `Property reference: ${propertyRef.trim()}` : '',
        propertyTitle ? `Property: ${propertyTitle.trim()}` : '',
        mode === 'Inspection Request' ? `Preferred timeframe: ${preferredWindow}` : '',
        '',
        message.trim(),
      ]
        .filter((line) => line !== '')
        .join('\n');

      window.location.href = `${siteConfig.contact.emailHref}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
    }

    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setErrors({});
  };

  return (
    <div className="border border-slate-200 bg-white rounded-2xl p-6 sm:p-8">
      {onModeChange && (
        <div
          className="inline-flex flex-wrap gap-1 p-1 bg-slate-100 rounded-xl mb-6"
          role="tablist"
          aria-label="Enquiry type"
        >
          {(['Property Enquiry', 'Inspection Request'] as EnquiryFormMode[]).map((tab) => {
            const active = mode === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onModeChange(tab)}
                className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#1E40AF] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      )}

      <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-[#EFF6FF] border border-blue-200/70 p-3.5 text-xs sm:text-sm text-slate-700">
        <Mail className="w-4 h-4 text-[#1E40AF] shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="font-semibold text-slate-900">Send your enquiry by email</p>
          <p className="mt-0.5 text-slate-600">
            Submit the form to prepare a message to {siteConfig.contact.emailDisplay} in your email app. Review it there, then press send.
          </p>
        </div>
      </div>

      {mode === 'Inspection Request' && (
        <p className="mb-5 text-sm text-slate-700 leading-relaxed">
          Online self-service scheduling is not automated. Submit your preferred timeframe below and a member of our staff will follow up directly to confirm your inspection date and time.
        </p>
      )}

      {propertyRef && (
        <div className="mb-5 pb-4 border-b border-slate-100 text-sm text-slate-700">
          <span className="text-slate-500">Property Reference: </span>
          <span className="font-mono font-semibold text-[#1E40AF] tabular-nums">{propertyRef}</span>
          {propertyTitle && <span className="text-slate-700"> — {propertyTitle}</span>}
        </div>
      )}

      {submittedRef ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 text-slate-800"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h4 className="text-base font-bold text-slate-900">
                {mode === 'Inspection Request'
                  ? 'Inspection request prepared'
                  : 'Enquiry email prepared'}
              </h4>
              <p className="mt-1 text-sm text-slate-700">
                Your email app should now be open with the details filled in. Review the message and press send to deliver it to our team. Reference: {submittedRef}.
              </p>
              <button
                type="button"
                onClick={() => setSubmittedRef(null)}
                className="mt-4 inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-800 hover:border-[#1E40AF] hover:text-[#1E40AF] transition-colors"
              >
                Prepare another enquiry
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor={`${baseId}-name`}
                className="block text-sm font-semibold text-slate-800 mb-1.5"
              >
                Full Name <span className="text-[#1E40AF]">*</span>
              </label>
              <input
                id={`${baseId}-name`}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sample Client"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? `${baseId}-name-err` : undefined}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1E40AF] focus:outline-none"
              />
              {errors.name && (
                <p id={`${baseId}-name-err`} className="mt-1 text-xs font-medium text-red-700">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={`${baseId}-phone`}
                className="block text-sm font-semibold text-slate-800 mb-1.5"
              >
                Phone Number <span className="text-[#1E40AF]">*</span>
              </label>
              <input
                id={`${baseId}-phone`}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +234 800 000 0000"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? `${baseId}-phone-err` : undefined}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1E40AF] focus:outline-none"
              />
              {errors.phone && (
                <p id={`${baseId}-phone-err`} className="mt-1 text-xs font-medium text-red-700">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor={`${baseId}-email`}
              className="block text-sm font-semibold text-slate-800 mb-1.5"
            >
              Email Address <span className="text-[#1E40AF]">*</span>
            </label>
            <input
              id={`${baseId}-email`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sample@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? `${baseId}-email-err` : undefined}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1E40AF] focus:outline-none"
            />
            {errors.email && (
              <p id={`${baseId}-email-err`} className="mt-1 text-xs font-medium text-red-700">
                {errors.email}
              </p>
            )}
          </div>

          {mode === 'Inspection Request' && (
            <div>
              <label
                htmlFor={`${baseId}-window`}
                className="block text-sm font-semibold text-slate-800 mb-1.5"
              >
                Preferred Inspection Timeframe
              </label>
              <select
                id={`${baseId}-window`}
                value={preferredWindow}
                onChange={(e) => setPreferredWindow(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:border-[#1E40AF] focus:outline-none"
              >
                <option value="Weekday morning (9:00 AM – 12:00 PM)">
                  Weekday morning (9:00 AM – 12:00 PM)
                </option>
                <option value="Weekday afternoon (12:00 PM – 4:00 PM)">
                  Weekday afternoon (12:00 PM – 4:00 PM)
                </option>
                <option value="Saturday appointment (By prior confirmation)">
                  Saturday appointment (By prior confirmation)
                </option>
              </select>
            </div>
          )}

          <div>
            <label
              htmlFor={`${baseId}-message`}
              className="block text-sm font-semibold text-slate-800 mb-1.5"
            >
              {mode === 'Inspection Request' ? 'Inspection Notes' : 'Enquiry Details'}{' '}
              <span className="text-[#1E40AF]">*</span>
            </label>
            <textarea
              id={`${baseId}-message`}
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                mode === 'Inspection Request'
                  ? 'Share any questions or preferred dates for our team to follow up...'
                  : 'Tell us what property type, location, or terms you are looking for...'
              }
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? `${baseId}-msg-err` : undefined}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1E40AF] focus:outline-none resize-y"
            />
            {errors.message && (
              <p id={`${baseId}-msg-err`} className="mt-1 text-xs font-medium text-red-700">
                {errors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#1E40AF] text-white text-sm font-semibold hover:bg-[#17358F] transition-colors cursor-pointer"
          >
            {mode === 'Inspection Request'
              ? 'Prepare Inspection Request'
              : 'Prepare Email Enquiry'}
          </button>
        </form>
      )}
    </div>
  );
};
