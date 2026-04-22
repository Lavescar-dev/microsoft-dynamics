import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  DatabaseZap,
  LayoutDashboard,
  Loader2,
  Mail,
  ShieldCheck,
  User,
  Zap,
} from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import type { Locale } from '../i18n/messages';

// ─── Content ─────────────────────────────────────────────────────────────────

const CONTENT = {
  en: {
    back: 'Back to product intro',
    badge: 'Dynamics 365 Demo',
    title: 'Controlled access layer',
    subtitle:
      'Move from the public intro into the live CRM workspace through a guided handoff that keeps your selected module in focus.',
    formTitle: 'Open workspace',
    formDesc:
      'The access layer sets the session context before the live Dynamics 365 workspace opens.',
    fieldName: 'Full Name',
    fieldNamePlaceholder: 'Jane Smith',
    fieldEmail: 'Work Email',
    fieldEmailPlaceholder: 'jane@company.com',
    fieldOrg: 'Company or Team',
    fieldOrgPlaceholder: 'Contoso Ltd.',
    cta: 'Bootstrap Session',
    flowLabel: 'Flow',
    flowValue: 'Identity capture → session bootstrap → workspace handoff.',
    windowLabel: 'Window',
    windowValue: 'Single-session access designed for portfolio walkthroughs.',
    pathLabel: 'Recommended path',
    pathNodes: ['Dashboard', 'Leads', 'Opportunities', 'Accounts'],
    loadingTitle: 'Opening the workspace',
    loadingBody:
      'Your access profile and selected CRM surface are being locked before the live workspace opens.',
    loadingSteps: [
      {
        title: 'Access profile locked',
        body: 'Visitor identity and review context attached to the demo session.',
      },
      {
        title: 'Workspace context aligned',
        body: 'The selected CRM module surface is being prepared for the walkthrough.',
      },
      {
        title: 'Handoff complete',
        body: 'The live workspace opens as soon as the handoff finishes.',
      },
    ],
    errorFields: 'Complete all fields before opening the workspace.',
    errorEmail: 'Use a valid email address.',
    disclaimer: 'Interactive demo — not affiliated with Microsoft Corporation.',
  },
  tr: {
    back: 'Ürün tanıtımına dön',
    badge: 'Dynamics 365 Demo',
    title: 'Kontrollü erişim katmanı',
    subtitle:
      'Seçili modülü odakta tutan yönlendirilmiş bir geçiş ile genel tanıtımdan canlı CRM çalışma alanına geçin.',
    formTitle: 'Çalışma alanını aç',
    formDesc:
      'Erişim katmanı, canlı Dynamics 365 çalışma alanı açılmadan önce oturum bağlamını ayarlar.',
    fieldName: 'Ad Soyad',
    fieldNamePlaceholder: 'Ayşe Yılmaz',
    fieldEmail: 'İş E-postası',
    fieldEmailPlaceholder: 'ayse@sirket.com',
    fieldOrg: 'Şirket veya Ekip',
    fieldOrgPlaceholder: 'Contoso Ltd.',
    cta: 'Oturumu Başlat',
    flowLabel: 'Akış',
    flowValue: 'Kimlik yakalama → oturum başlatma → çalışma alanı devri.',
    windowLabel: 'Pencere',
    windowValue: 'Portföy turları için tasarlanmış tek oturumlu erişim.',
    pathLabel: 'Önerilen yol',
    pathNodes: ['Kontrol Paneli', 'Leadler', 'Fırsatlar', 'Hesaplar'],
    loadingTitle: 'Çalışma alanı açılıyor',
    loadingBody:
      'Erişim profiliniz ve seçili CRM yüzeyi, canlı çalışma alanı açılmadan önce kilitleniyor.',
    loadingSteps: [
      {
        title: 'Erişim profili kilitlendi',
        body: 'Ziyaretçi kimliği ve inceleme bağlamı demo oturumuna eklendi.',
      },
      {
        title: 'Çalışma alanı bağlamı hizalandı',
        body: 'Seçili CRM modülü yüzeyi tur için hazırlanıyor.',
      },
      {
        title: 'Devir tamamlandı',
        body: 'Devir tamamlanır tamamlanmaz canlı çalışma alanı açılacak.',
      },
    ],
    errorFields: 'Çalışma alanı açılmadan önce tüm alanları doldurun.',
    errorEmail: 'Geçerli bir e-posta adresi kullanın.',
    disclaimer: 'Etkileşimli demo — Microsoft Corporation ile bağlantısı yoktur.',
  },
} satisfies Record<Locale, unknown>;

type Content = (typeof CONTENT)['en'];

// ─── Loading Screen ───────────────────────────────────────────────────────────

function LoadingScreen({ c }: { c: Content }) {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timers = [
      setTimeout(() => setActiveStep(1), 700),
      setTimeout(() => setActiveStep(2), 1500),
      setTimeout(() => setActiveStep(3), 2200),
      setTimeout(() => navigate('/dashboard'), 2800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen flex-col items-center justify-center bg-[#050c1a] px-6"
    >
      <div className="w-full max-w-md">
        {/* Icon */}
        <div className="mb-8 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded"
            style={{ background: 'linear-gradient(135deg, #0B71C7 0%, #37BEF3 100%)' }}
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="0.5" fill="white" />
              <rect x="9" y="1" width="6" height="6" rx="0.5" fill="white" fillOpacity="0.7" />
              <rect x="1" y="9" width="6" height="6" rx="0.5" fill="white" fillOpacity="0.7" />
              <rect x="9" y="9" width="6" height="6" rx="0.5" fill="white" fillOpacity="0.4" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-semibold text-white">Dynamics 365</span>
            <span className="ml-2 rounded-full bg-[#0B71C7]/20 px-2 py-0.5 text-[10px] font-medium text-[#37BEF3]">
              Demo
            </span>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-white">{c.loadingTitle}</h2>
        <p className="mt-2 text-sm text-gray-400">{c.loadingBody}</p>

        {/* Steps */}
        <div className="mt-8 space-y-4">
          {c.loadingSteps.map((step, i) => {
            const done = activeStep > i;
            const active = activeStep === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: done || active ? 1 : 0.3, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="flex items-start gap-3"
              >
                <div className="mt-0.5 flex-shrink-0">
                  {done ? (
                    <CheckCircle2 size={16} className="text-[#37BEF3]" />
                  ) : active ? (
                    <Loader2 size={16} className="animate-spin text-[#0B71C7]" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-gray-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{step.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{step.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-8 h-1 w-full overflow-hidden rounded-full bg-gray-800">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #0B71C7 0%, #37BEF3 100%)' }}
            initial={{ width: '0%' }}
            animate={{ width: activeStep >= 3 ? '100%' : `${(activeStep / 3) * 85}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DemoAccess() {
  const { locale } = useLocale();
  const c = CONTENT[locale] as Content;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  useEffect(() => { nameRef.current?.focus(); }, []);

  function validate() {
    if (!name.trim() || !email.trim() || !org.trim()) {
      setError(c.errorFields);
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(c.errorEmail);
      return false;
    }
    return true;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
  }

  if (loading) return <LoadingScreen c={c} />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050c1a] px-6 py-12">
      <div className="w-full max-w-5xl">
      <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
      {/* Left column — form */}
      <div className="w-full lg:max-w-md lg:flex-shrink-0">
        {/* Back link */}
        <Link
          to="/"
          className="mb-10 flex w-fit items-center gap-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft size={13} />
          {c.back}
        </Link>

        {/* Logo + Badge */}
        <div className="mb-6 flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded"
            style={{ background: 'linear-gradient(135deg, #0B71C7 0%, #37BEF3 100%)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="0.5" fill="white" />
              <rect x="9" y="1" width="6" height="6" rx="0.5" fill="white" fillOpacity="0.7" />
              <rect x="1" y="9" width="6" height="6" rx="0.5" fill="white" fillOpacity="0.7" />
              <rect x="9" y="9" width="6" height="6" rx="0.5" fill="white" fillOpacity="0.4" />
            </svg>
          </div>
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ background: 'rgba(11,113,199,0.15)', color: '#37BEF3', border: '1px solid rgba(55,190,243,0.2)' }}
          >
            {c.badge}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-white">{c.title}</h1>
        <p className="mt-2 max-w-sm text-sm text-gray-400">{c.subtitle}</p>

        {/* Form card */}
        <div
          className="mt-8 rounded-xl p-6"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="mb-1 text-sm font-semibold text-white">{c.formTitle}</p>
          <p className="mb-5 text-xs text-gray-500">{c.formDesc}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-300">
                <User size={12} className="text-gray-500" />
                {c.fieldName}
              </label>
              <input
                ref={nameRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={c.fieldNamePlaceholder}
                className="w-full rounded-md px-3 py-2 text-sm text-white placeholder-gray-600 outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#0B71C7')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-300">
                <Mail size={12} className="text-gray-500" />
                {c.fieldEmail}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={c.fieldEmailPlaceholder}
                className="w-full rounded-md px-3 py-2 text-sm text-white placeholder-gray-600 outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#0B71C7')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            {/* Organization */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-300">
                <Building2 size={12} className="text-gray-500" />
                {c.fieldOrg}
              </label>
              <input
                type="text"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder={c.fieldOrgPlaceholder}
                className="w-full rounded-md px-3 py-2 text-sm text-white placeholder-gray-600 outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#0B71C7')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-400"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-md py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #0B71C7 0%, #37BEF3 100%)' }}
            >
              <Zap size={14} />
              {c.cta}
              <ArrowRight size={14} />
            </button>
          </form>
        </div>

        <p className="mt-6 text-xs text-gray-600">{c.disclaimer}</p>
      </div>

      {/* Right column — metadata */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:pt-16">
        <div className="max-w-sm space-y-8">
          {/* Metadata rows */}
          {[
            { icon: <DatabaseZap size={15} />, label: c.flowLabel, value: c.flowValue },
            { icon: <ShieldCheck size={15} />, label: c.windowLabel, value: c.windowValue },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex gap-4">
              <div
                className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded"
                style={{ background: 'rgba(11,113,199,0.15)', color: '#37BEF3' }}
              >
                {icon}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">{label}</p>
                <p className="mt-1 text-sm text-gray-300">{value}</p>
              </div>
            </div>
          ))}

          {/* Recommended path */}
          <div className="flex gap-4">
            <div
              className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded"
              style={{ background: 'rgba(11,113,199,0.15)', color: '#37BEF3' }}
            >
              <LayoutDashboard size={15} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">{c.pathLabel}</p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {c.pathNodes.map((node, i) => (
                  <span key={node} className="flex items-center gap-1.5">
                    <span
                      className="rounded px-2 py-0.5 text-xs font-medium text-white"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      {node}
                    </span>
                    {i < c.pathNodes.length - 1 && (
                      <ChevronRight size={11} className="text-gray-600" />
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            className="h-px w-full"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          />

          {/* Quick link */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Skip to workspace directly</span>
            <Link
              to="/dashboard"
              className="flex items-center gap-1 text-xs font-medium text-[#0B71C7] transition-colors hover:text-[#37BEF3]"
            >
              Open Dashboard <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}
