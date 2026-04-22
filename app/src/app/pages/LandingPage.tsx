import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { motion, useInView, useScroll, useTransform } from 'motion/react';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Box,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  Headphones,
  LayoutDashboard,
  Megaphone,
  ShoppingCart,
  Target,
  TrendingUp,
  Users,
  Wallet,
  Wrench,
  Zap,
} from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import type { Locale } from '../i18n/messages';
import {
  mockAccounts,
  mockCampaigns,
  mockCases,
  mockLeads,
  mockOpportunities,
  mockOrders,
} from '../data/mockData';

// ─── Data ─────────────────────────────────────────────────────────────────────

const totalPipeline = mockOpportunities.reduce((s, o) => s + o.amount, 0);
const activeLeads = mockLeads.filter((l) => l.status !== 'Unqualified').length;
const openCases = mockCases.filter((c) => c.status === 'Active').length;
const activeCampaigns = mockCampaigns.filter((c) => c.status === 'Active').length;
const activeAccounts = mockAccounts.filter((a) => a.status === 'Active').length;
const activeOrders = mockOrders.filter(
  (o) => o.status === 'Processing' || o.status === 'Shipped',
).length;

// ─── Bilingual Content ────────────────────────────────────────────────────────

const CONTENT = {
  en: {
    nav: {
      exploreDemo: 'Explore Demo',
      links: ['Features', 'Modules', 'Platform'],
    },
    hero: {
      tag: 'Enterprise CRM & ERP Platform',
      h1a: 'Connect your',
      h1b: 'entire business',
      h1c: 'in one platform.',
      subtitle:
        'From first contact to closed deal, field service to finance — Dynamics 365 unifies every team, process, and data point under a single roof.',
      ctaPrimary: 'Explore the Demo',
      ctaSecondary: 'See all modules',
      statsLabels: ['Modules', 'Entity types', 'Demo records'],
      cardTitle: 'Sales Hub — Live',
      pipelineLabel: 'Pipeline Value',
      floatCampaigns: 'Campaigns',
      floatOrders: 'Active Orders',
      rows: ['Active Leads', 'Open Cases', 'Active Accounts'],
    },
    features: {
      eyebrow: 'Capabilities',
      title: 'Built for every team.',
      subtitle:
        'One platform that brings together the tools each department needs — no more silos, no more switching between apps.',
      items: [
        {
          title: 'Sales Intelligence',
          description:
            'Full pipeline visibility from first lead to closed deal. Track opportunities, forecast revenue, and coach your team with built-in analytics.',
          bullets: ['Lead scoring & routing', 'Opportunity pipeline', 'Revenue forecasting'],
        },
        {
          title: 'Marketing Automation',
          description:
            'Orchestrate campaigns across email, social, and direct channels. Segment your audience and measure ROI — all in one place.',
          bullets: ['Multi-channel campaigns', 'Audience segmentation', 'Customer journey builder'],
        },
        {
          title: 'Customer Service',
          description:
            'Resolve cases faster with a unified agent workspace. Knowledge articles, SLAs, and queue management built in.',
          bullets: ['Case management', 'Knowledge base', 'Omnichannel queues'],
        },
        {
          title: 'Field Service',
          description:
            'Dispatch the right technician at the right time. Work orders, scheduling board, and real-time mobile access.',
          bullets: ['Work order management', 'Schedule optimization', 'Technician mobile app'],
        },
        {
          title: 'Finance & ERP',
          description:
            'From invoices to full ERP — manage your financial operations alongside your CRM data without switching tools.',
          bullets: ['Invoice & order tracking', 'Budget management', 'Business Central integration'],
        },
        {
          title: 'AI & Copilot',
          description:
            'Microsoft Copilot embedded throughout — summarize meetings, draft emails, surface insights, and predict outcomes.',
          bullets: ['AI-generated summaries', 'Predictive lead scoring', 'Natural language queries'],
        },
      ],
    },
    modules: {
      eyebrow: 'Platform',
      title: 'One platform, every role.',
      subtitle:
        "Whether you're in sales, support, or the C-suite — Dynamics 365 has a purpose-built module for your workflow.",
    },
    platform: {
      eyebrow: 'Demo Environment',
      title: 'Production-grade demo data,\nready to explore.',
      statsLabels: [
        'Pipeline value in demo data',
        'Records across all modules',
        'Entity types supported',
        'Role-specific modules',
      ],
      tags: [
        'Contacts & Accounts',
        'Leads & Opportunities',
        'Campaigns & Journeys',
        'Cases & Queues',
        'Invoices & Orders',
        'Work Orders',
        'Projects',
        'Employees',
      ],
    },
    cta: {
      title: 'See it in action.',
      subtitle: 'The full demo environment is ready — real data, real workflows, no login required.',
      btnPrimary: 'Open Dashboard',
      btnSecondary: 'Sales Hub',
    },
    footer: {
      disclaimer: 'Interactive demo — not affiliated with Microsoft Corporation.',
      enter: 'Enter Demo →',
    },
  },

  tr: {
    nav: {
      exploreDemo: "Demo'yu Keşfet",
      links: ['Özellikler', 'Modüller', 'Platform'],
    },
    hero: {
      tag: 'Kurumsal CRM & ERP Platformu',
      h1a: 'Tüm işletmenizi',
      h1b: 'tek platformda',
      h1c: 'birleştirin.',
      subtitle:
        'İlk temastan kapanan anlaşmaya, saha hizmetinden finansa kadar — Dynamics 365 her ekibi, süreci ve veriyi tek çatı altında toplar.',
      ctaPrimary: "Demo'yu Keşfet",
      ctaSecondary: 'Tüm modülleri gör',
      statsLabels: ['Modül', 'Varlık tipi', 'Demo kaydı'],
      cardTitle: 'Satış Merkezi — Canlı',
      pipelineLabel: 'Satış Hattı Değeri',
      floatCampaigns: 'Kampanya',
      floatOrders: 'Aktif Sipariş',
      rows: ['Aktif Lead', 'Açık Talep', 'Aktif Hesap'],
    },
    features: {
      eyebrow: 'Yetenekler',
      title: 'Her ekip için tasarlandı.',
      subtitle:
        'Her departmanın ihtiyaç duyduğu araçları bir araya getiren tek platform — artık silolar yok, uygulama geçişi yok.',
      items: [
        {
          title: 'Satış Zekası',
          description:
            'İlk leadden kapanan anlaşmaya tam boru hattı görünürlüğü. Fırsatları takip edin, gelir tahmini yapın ve ekibinizi yerleşik analizlerle geliştirin.',
          bullets: ['Lead puanlama & yönlendirme', 'Fırsat hattı', 'Gelir tahmini'],
        },
        {
          title: 'Pazarlama Otomasyonu',
          description:
            "E-posta, sosyal medya ve doğrudan kanallarda kampanyaları yönetin. Kitlenizi segmente edin ve yatırım getirisini tek yerden ölçün.",
          bullets: ['Çok kanallı kampanyalar', 'Kitle segmentasyonu', 'Müşteri yolculuğu oluşturucu'],
        },
        {
          title: 'Müşteri Hizmetleri',
          description:
            'Birleşik temsilci çalışma alanıyla vakaları daha hızlı çözün. Bilgi makaleleri, SLA yönetimi ve kuyruk yönetimi hazır.',
          bullets: ['Vaka yönetimi', 'Bilgi tabanı', 'Çok kanallı kuyruklar'],
        },
        {
          title: 'Saha Hizmeti',
          description:
            'Doğru teknisyeni doğru zamanda görevlendirin. İş emirleri, planlama panosu ve gerçek zamanlı mobil erişim.',
          bullets: ['İş emri yönetimi', 'Program optimizasyonu', 'Teknisyen mobil uygulaması'],
        },
        {
          title: 'Finans & ERP',
          description:
            "Faturadan tam ERP'ye — finansal operasyonlarınızı CRM verinizle yan yana yönetin, araç değiştirmeye gerek yok.",
          bullets: ['Fatura & sipariş takibi', 'Bütçe yönetimi', 'Business Central entegrasyonu'],
        },
        {
          title: 'YZ & Copilot',
          description:
            'Microsoft Copilot her yere gömülü — toplantı özetleri, e-posta taslakları, içgörüler ve sonuç tahminleri.',
          bullets: ['YZ destekli özetler', 'Öngörülü lead puanlaması', 'Doğal dil sorguları'],
        },
      ],
    },
    modules: {
      eyebrow: 'Platform',
      title: 'Tek platform, her rol.',
      subtitle:
        "Satışta, destekte veya yönetim kurulunda olun — Dynamics 365'in iş akışınız için özel bir modülü var.",
    },
    platform: {
      eyebrow: 'Demo Ortamı',
      title: 'Üretim kalitesinde demo verisi,\nkeşfetmeye hazır.',
      statsLabels: [
        'Demo verisindeki satış hattı değeri',
        'Tüm modüllerdeki kayıt sayısı',
        'Desteklenen varlık tipi',
        'Role özel modül',
      ],
      tags: [
        'Kişiler & Hesaplar',
        'Leadler & Fırsatlar',
        'Kampanyalar & Yolculuklar',
        'Talepler & Kuyruklar',
        'Faturalar & Siparişler',
        'İş Emirleri',
        'Projeler',
        'Çalışanlar',
      ],
    },
    cta: {
      title: 'Aksiyonda görün.',
      subtitle: 'Demo ortamı hazır — gerçek veri, gerçek iş akışı, giriş gerektirmez.',
      btnPrimary: 'Gösterge Panelini Aç',
      btnSecondary: 'Satış Merkezi',
    },
    footer: {
      disclaimer: 'Etkileşimli demo — Microsoft Corporation ile bağlantısı yoktur.',
      enter: "Demo'ya Gir →",
    },
  },
} satisfies Record<Locale, unknown>;

type Content = (typeof CONTENT)['en'];

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const staggerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

// ─── Navbar ───────────────────────────────────────────────────────────────────

const NAV_ANCHORS = ['#features', '#modules', '#platform'];

function Navbar({ c }: { c: Content['nav'] }) {
  const [scrolled, setScrolled] = useState(false);
  const { locale, setLocale } = useLocale();

  useEffect(() => {
    const el = document.getElementById('lp-scroll');
    if (!el) return;
    const handler = () => setScrolled(el.scrollTop > 40);
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  const textColor = scrolled ? '#444' : 'rgba(255,255,255,0.75)';

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : '1px solid transparent',
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-7 w-7 items-center justify-center rounded"
            style={{ background: 'linear-gradient(135deg, #0B71C7 0%, #37BEF3 100%)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="0.5" fill="white" />
              <rect x="9" y="1" width="6" height="6" rx="0.5" fill="white" fillOpacity="0.7" />
              <rect x="1" y="9" width="6" height="6" rx="0.5" fill="white" fillOpacity="0.7" />
              <rect x="9" y="9" width="6" height="6" rx="0.5" fill="white" fillOpacity="0.4" />
            </svg>
          </div>
          <div>
            <span
              className="text-sm font-semibold leading-none transition-colors"
              style={{ color: scrolled ? '#111' : '#fff' }}
            >
              Dynamics 365
            </span>
            <span
              className="block text-[10px] leading-none transition-colors"
              style={{ color: scrolled ? '#888' : 'rgba(255,255,255,0.6)' }}
            >
              Microsoft
            </span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="hidden items-center gap-7 md:flex">
          {c.links.map((label, i) => (
            <a
              key={label}
              href={NAV_ANCHORS[i]}
              className="text-sm font-medium transition-colors"
              style={{ color: textColor }}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(NAV_ANCHORS[i])?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right: lang toggle + CTA */}
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <div
            className="flex items-center overflow-hidden rounded text-xs font-semibold"
            style={{ border: scrolled ? '1px solid #ddd' : '1px solid rgba(255,255,255,0.25)' }}
          >
            {(['en', 'tr'] as Locale[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLocale(lang)}
                className="px-2.5 py-1 uppercase transition-colors"
                style={
                  locale === lang
                    ? { background: scrolled ? '#0B71C7' : 'rgba(255,255,255,0.25)', color: '#fff' }
                    : { background: 'transparent', color: textColor }
                }
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Explore CTA */}
          <Link to="/demo-access">
            <button
              className="flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold transition-all duration-200"
              style={
                scrolled
                  ? { background: '#0B71C7', color: '#fff' }
                  : {
                      background: 'rgba(255,255,255,0.15)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.3)',
                    }
              }
            >
              {c.exploreDemo}
              <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ c }: { c: Content['hero'] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #001535 0%, #002050 40%, #0B71C7 100%)' }}
    >
      {/* Grid overlay */}
      <motion.div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ y }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="hero-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </motion.div>

      {/* Glow blobs */}
      <div
        className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: '#37BEF3' }}
      />
      <div
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full opacity-15 blur-3xl"
        style={{ background: '#0B71C7' }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left: Text */}
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-xl">
            <motion.div variants={fadeUp}>
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
                style={{
                  background: 'rgba(55,190,243,0.15)',
                  color: '#37BEF3',
                  border: '1px solid rgba(55,190,243,0.3)',
                }}
              >
                <Zap size={10} />
                {c.tag}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-6 text-5xl font-bold leading-[1.1] text-white lg:text-6xl"
            >
              {c.h1a}{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #37BEF3, #94EFFF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {c.h1b}
              </span>
              <br />
              {c.h1c}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 text-lg leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              {c.subtitle}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/demo-access">
                <button
                  className="flex items-center gap-2 rounded px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
                  style={{ background: '#0B71C7' }}
                >
                  <LayoutDashboard size={15} />
                  {c.ctaPrimary}
                </button>
              </Link>
              <a
                href="#modules"
                className="flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ color: 'rgba(255,255,255,0.65)' }}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {c.ctaSecondary}
                <ChevronRight size={14} />
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 flex items-center gap-6">
              {(['20+', '19', '176+'] as const).map((val, i) => (
                <div key={i}>
                  <p className="text-2xl font-bold text-white">{val}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {c.statsLabels[i]}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Floating metric cards */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            className="relative hidden lg:block"
          >
            {/* Central card */}
            <div
              className="relative mx-auto w-full max-w-sm rounded-xl p-6"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="mb-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ background: '#7FBA00' }} />
                <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {c.cardTitle}
                </span>
              </div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {c.pipelineLabel}
              </p>
              <p className="mt-1 text-4xl font-bold text-white">
                ${(totalPipeline / 1_000_000).toFixed(1)}m
              </p>
              <div className="mt-4 space-y-2">
                {[activeLeads, openCases, activeAccounts].map((val, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded px-3 py-2"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      {c.rows[i]}
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: ['#37BEF3', '#F25022', '#7FBA00'][i] }}
                    >
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating accent cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -right-6 -top-6 rounded-lg px-4 py-3"
              style={{
                background: 'rgba(55,190,243,0.15)',
                border: '1px solid rgba(55,190,243,0.3)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{c.floatCampaigns}</p>
              <p className="text-xl font-bold" style={{ color: '#37BEF3' }}>{activeCampaigns}</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -bottom-4 -left-6 rounded-lg px-4 py-3"
              style={{
                background: 'rgba(127,186,0,0.15)',
                border: '1px solid rgba(127,186,0,0.3)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{c.floatOrders}</p>
              <p className="text-xl font-bold" style={{ color: '#7FBA00' }}>{activeOrders}</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24"
        style={{ background: 'linear-gradient(to bottom, transparent, #f5f5f5)' }}
      />
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

const FEATURE_ICONS = [TrendingUp, Megaphone, Headphones, Wrench, Wallet, Bot];
const FEATURE_COLORS = ['#0B71C7', '#37BEF3', '#F25022', '#FFB900', '#7FBA00', '#9B59B6'];

function Features({ c }: { c: Content['features'] }) {
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' });
  const gridInView = useInView(gridRef, { once: true, margin: '-60px' });

  return (
    <section id="features" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          ref={titleRef}
          initial="hidden"
          animate={titleInView ? 'visible' : 'hidden'}
          variants={stagger}
          className="mb-16 text-center"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: '#0B71C7' }}
          >
            {c.eyebrow}
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-3 text-4xl font-bold text-gray-900">
            {c.title}
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-xl text-gray-500">
            {c.subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          ref={gridRef}
          initial="hidden"
          animate={gridInView ? 'visible' : 'hidden'}
          variants={staggerFast}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {c.items.map((f, i) => {
            const Icon = FEATURE_ICONS[i];
            const color = FEATURE_COLORS[i];
            return (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="group rounded-xl border border-gray-100 bg-white p-6 transition-shadow hover:shadow-lg"
              >
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ background: `${color}18` }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 className="text-base font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{f.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle2 size={12} style={{ color, flexShrink: 0 }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Modules ──────────────────────────────────────────────────────────────────

const MODULE_DEFS = [
  { icon: TrendingUp, href: '/sales', color: '#0B71C7' },
  { icon: Megaphone, href: '/marketing', color: '#37BEF3' },
  { icon: Headphones, href: '/customer-service', color: '#F25022' },
  { icon: Wrench, href: '/field-service', color: '#FFB900' },
  { icon: Wallet, href: '/finance', color: '#7FBA00' },
  { icon: Box, href: '/supply-chain', color: '#37BEF3' },
  { icon: Briefcase, href: '/project-operations', color: '#0B71C7' },
  { icon: Building2, href: '/business-central', color: '#888' },
  { icon: Users, href: '/human-resources', color: '#7FBA00' },
  { icon: ShoppingCart, href: '/commerce', color: '#F25022' },
  { icon: BarChart3, href: '/reports', color: '#0B71C7' },
  { icon: Bot, href: '/copilot', color: '#9B59B6' },
];

const MODULE_LABELS = {
  en: [
    'Sales', 'Marketing', 'Customer Service', 'Field Service', 'Finance',
    'Supply Chain', 'Project Operations', 'Business Central', 'Human Resources',
    'Commerce', 'Reports', 'Copilot',
  ],
  tr: [
    'Satış', 'Pazarlama', 'Müşteri Hizmetleri', 'Saha Hizmeti', 'Finans',
    'Tedarik Zinciri', 'Proje Operasyonları', 'Business Central', 'İnsan Kaynakları',
    'Ticaret', 'Raporlar', 'Copilot',
  ],
};

function Modules({ c, locale }: { c: Content['modules']; locale: Locale }) {
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' });
  const gridInView = useInView(gridRef, { once: true, margin: '-60px' });
  const labels = MODULE_LABELS[locale];

  return (
    <section id="modules" className="py-24" style={{ background: '#f8f9fb' }}>
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          ref={titleRef}
          initial="hidden"
          animate={titleInView ? 'visible' : 'hidden'}
          variants={stagger}
          className="mb-14 text-center"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: '#0B71C7' }}
          >
            {c.eyebrow}
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-3 text-4xl font-bold text-gray-900">
            {c.title}
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-xl text-gray-500">
            {c.subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          ref={gridRef}
          initial="hidden"
          animate={gridInView ? 'visible' : 'hidden'}
          variants={staggerFast}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
          {MODULE_DEFS.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div key={m.href} variants={fadeUp}>
                <Link to={m.href} className="block">
                  <div className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 transition-all hover:border-[#0B71C7]/30 hover:shadow-sm">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
                      style={{ background: `${m.color}15` }}
                    >
                      <Icon size={16} style={{ color: m.color }} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {labels[i]}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Platform Stats ───────────────────────────────────────────────────────────

const STAT_VALUES = [
  `$${(totalPipeline / 1_000_000).toFixed(1)}m`,
  '176+',
  '19',
  '20+',
];

function PlatformStats({ c }: { c: Content['platform'] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [line1, line2] = c.title.split('\n');

  return (
    <section
      id="platform"
      className="py-24"
      style={{ background: 'linear-gradient(160deg, #001535 0%, #002050 60%, #0a2d6e 100%)' }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={stagger}
          className="text-center"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: '#37BEF3' }}
          >
            {c.eyebrow}
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-3 text-4xl font-bold text-white">
            {line1}
            <br />
            {line2}
          </motion.h2>

          <motion.div
            variants={staggerFast}
            className="mt-14 grid grid-cols-2 gap-8 lg:grid-cols-4"
          >
            {STAT_VALUES.map((val, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center">
                <p
                  className="text-5xl font-bold"
                  style={{
                    background: 'linear-gradient(90deg, #37BEF3, #94EFFF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {val}
                </p>
                <p className="mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {c.statsLabels[i]}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-16 flex flex-wrap justify-center gap-3">
            {c.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  background: 'rgba(55,190,243,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(55,190,243,0.2)',
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCta({ c }: { c: Content['cta'] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="bg-white py-24">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
        className="mx-auto max-w-3xl px-6 text-center"
      >
        <motion.h2 variants={fadeUp} className="text-4xl font-bold text-gray-900 lg:text-5xl">
          {c.title}
        </motion.h2>
        <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-lg text-lg text-gray-500">
          {c.subtitle}
        </motion.p>
        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/demo-access">
            <button
              className="flex items-center gap-2.5 rounded px-7 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #0B71C7 0%, #37BEF3 100%)' }}
            >
              <LayoutDashboard size={16} />
              {c.btnPrimary}
              <ArrowRight size={14} />
            </button>
          </Link>
          <Link to="/sales">
            <button className="flex items-center gap-2 rounded border border-gray-200 px-7 py-3.5 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50">
              <Target size={15} />
              {c.btnSecondary}
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ c }: { c: Content['footer'] }) {
  return (
    <footer className="border-t border-gray-100 bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <div
            className="flex h-6 w-6 items-center justify-center rounded"
            style={{ background: 'linear-gradient(135deg, #0B71C7, #37BEF3)' }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="0.5" fill="white" />
              <rect x="9" y="1" width="6" height="6" rx="0.5" fill="white" fillOpacity="0.7" />
              <rect x="1" y="9" width="6" height="6" rx="0.5" fill="white" fillOpacity="0.7" />
              <rect x="9" y="9" width="6" height="6" rx="0.5" fill="white" fillOpacity="0.4" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-800">Dynamics 365</span>
          <span className="text-xs text-gray-400">by Microsoft</span>
        </div>
        <p className="text-xs text-gray-400">{c.disclaimer}</p>
        <Link to="/demo-access" className="text-xs font-medium text-[#0B71C7] hover:underline">
          {c.enter}
        </Link>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const { locale } = useLocale();
  const c = CONTENT[locale] as Content;

  return (
    <div id="lp-scroll" className="h-screen overflow-y-auto">
      <Navbar c={c.nav} />
      <Hero c={c.hero} />
      <Features c={c.features} />
      <Modules c={c.modules} locale={locale} />
      <PlatformStats c={c.platform} />
      <FinalCta c={c.cta} />
      <Footer c={c.footer} />
    </div>
  );
}
