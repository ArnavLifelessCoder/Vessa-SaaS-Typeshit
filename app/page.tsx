import Link from 'next/link'
import { Icon, LogoMark } from '@/components/Icon'
import { Reveal } from '@/components/Reveal'
import { ScrollProgress } from '@/components/ScrollProgress'
import { tools } from '@/lib/tools'
import { plans } from '@/lib/plans'
import styles from './page.module.css'

const steps = [
  {
    title: 'Create your workspace',
    body: 'Sign up in under a minute. No credit card required to start on the free plan.',
  },
  {
    title: 'Choose a tool',
    body: 'Pick any of the nine purpose-built AI tools from a single, unified dashboard.',
  },
  {
    title: 'Ship the result',
    body: 'Paste your input, run the analysis, and get production-ready output in seconds.',
  },
]

const stats = [
  { num: `${tools.length}`, label: 'AI tools' },
  { num: '10x', label: 'Faster workflows' },
  { num: '₹799', label: 'Starting price' },
  { num: '99.9%', label: 'Uptime target' },
]

const metrics = [
  { num: `${tools.length}`, label: 'Specialized AI tools' },
  { num: '250K+', label: 'Documents & drafts processed' },
  { num: '18K+', label: 'Hours saved for users' },
  { num: '4.9/5', label: 'Average user rating' },
]

export default function LandingPage() {
  return (
    <div className={styles.landing}>
      <ScrollProgress />
      <div className={styles.ambient} aria-hidden="true">
        <div className={`${styles.ambientOrb} ${styles.ambientOrb1}`} />
        <div className={`${styles.ambientOrb} ${styles.ambientOrb2}`} />
      </div>

      {/* --- Navbar --- */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            <LogoMark size={30} />
            <span>Vessa</span>
          </Link>
          <div className={styles.navLinks}>
            <a href="#tools">Tools</a>
            <a href="#how-it-works">How it works</a>
            <a href="#pricing">Pricing</a>
            <Link href="/login" className={styles.navLogin}>Log in</Link>
            <Link href="/signup" className="btn btn-primary btn-sm">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* --- Hero --- */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true">
          <div className={`${styles.heroOrb} ${styles.heroOrb1}`} />
          <div className={`${styles.heroOrb} ${styles.heroOrb2}`} />
          <div className={styles.heroGrid} />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.pulseDot} />
            {tools.length} AI tools, one workspace
          </div>
          <h1 className={styles.heroTitle}>
            The AI workspace that
            <br />
            <span className={styles.heroGradient}>runs your business</span>
          </h1>
          <p className={styles.heroDesc}>
            Review contracts, repurpose content, automate client workflows, draft replies,
            build proposals, optimize for search, review code, and more. {tools.length} specialized
            AI tools, one clean dashboard.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/signup" className="btn btn-primary btn-lg">
              Start free <Icon name="arrowRight" size={18} />
            </Link>
            <a href="#tools" className="btn btn-secondary btn-lg">
              Explore the tools
            </a>
          </div>
          <div className={styles.heroStats}>
            {stats.map((s, i) => (
              <div key={s.label} className={styles.statItem}>
                {i > 0 && <span className={styles.statDivider} aria-hidden="true" />}
                <div className={styles.stat}>
                  <span className={styles.statNum}>{s.num}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Tools --- */}
      <section className={styles.tools} id="tools">
        <div className="container">
          <Reveal className={styles.sectionHead}>
            <span className="section-label">The toolkit</span>
            <h2>
              {tools.length} tools. <span className="text-gradient">One workspace.</span>
            </h2>
            <p className={styles.sectionDesc}>
              Every tool is built to solve one specific, high-value business problem. No generic
              chatbot — just focused output you can ship.
            </p>
          </Reveal>
          <div className={styles.toolGrid}>
            {tools.map((tool, i) => (
              <Reveal key={tool.id} delay={(i % 3) * 90}>
                <article className={styles.toolCard}>
                  <div className={styles.toolIcon}>
                    <Icon name={tool.icon} size={22} />
                  </div>
                  <div className={styles.toolMeta}>
                    <h3>{tool.name}</h3>
                    <span className="badge badge-neutral">{tool.category}</span>
                  </div>
                  <p className={styles.toolDesc}>{tool.description}</p>
                  <ul className={styles.toolFeatures}>
                    {tool.features.map((f) => (
                      <li key={f}>
                        <Icon name="check" size={15} className={styles.checkIcon} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- Metrics --- */}
      <section className={styles.metrics}>
        <div className="container">
          <Reveal className={styles.sectionHead}>
            <span className="section-label">By the numbers</span>
            <h2>
              Built for <span className="text-gradient">real output</span>
            </h2>
          </Reveal>
          <div className={styles.metricsGrid}>
            {metrics.map((m, i) => (
              <Reveal key={m.label} delay={i * 90}>
                <div className={styles.metricCard}>
                  <span className={styles.metricNum}>{m.num}</span>
                  <span className={styles.metricLabel}>{m.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className={styles.poweredBy}>
            <span className={styles.pulseDot} />
            Powered by frontier AI models
          </Reveal>
        </div>
      </section>

      {/* --- How it works --- */}
      <section className={styles.howItWorks} id="how-it-works">
        <div className="container">
          <Reveal className={styles.sectionHead}>
            <span className="section-label">Get started</span>
            <h2>
              Up and running in <span className="text-gradient">three steps</span>
            </h2>
          </Reveal>
          <div className={styles.stepsGrid}>
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 110}>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>{i + 1}</div>
                  <h4>{step.title}</h4>
                  <p>{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- Pricing --- */}
      <section className={styles.pricing} id="pricing">
        <div className="container">
          <Reveal className={styles.sectionHead}>
            <span className="section-label">Pricing</span>
            <h2>
              Simple, honest <span className="text-gradient">pricing</span>
            </h2>
            <p className={styles.sectionDesc}>
              Start free, upgrade when you need more. No hidden fees, cancel anytime.
            </p>
          </Reveal>
          <div className={styles.pricingGrid}>
            {plans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 100}>
                <div
                  className={`${styles.pricingCard} ${plan.popular ? styles.pricingPopular : ''}`}
                >
                  {plan.popular && <div className={styles.popularBadge}>Most popular</div>}
                  <div className={styles.pricingHeader}>
                    <h4>{plan.name}</h4>
                    <p className={styles.planDesc}>{plan.description}</p>
                    <div className={styles.pricingPrice}>
                      <span className={styles.priceAmount}>{plan.priceLabel}</span>
                      <span className={styles.pricePeriod}>{plan.period}</span>
                    </div>
                  </div>
                  <ul className={styles.pricingFeatures}>
                    {plan.features.map((f) => (
                      <li key={f}>
                        <Icon name="check" size={16} className={styles.checkIcon} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className={`btn btn-${plan.variant}`}
                    style={{ width: '100%' }}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className={styles.cta}>
        <div className="container">
          <Reveal className={styles.ctaCard}>
            <h2>
              Ready to <span className="text-gradient">10x your workflow?</span>
            </h2>
            <p>
              Join the professionals using Vessa to save hours every week across contracts,
              content, and client operations.
            </p>
            <Link href="/signup" className="btn btn-primary btn-lg">
              Start free <Icon name="arrowRight" size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <span className={styles.logo}>
                <LogoMark size={28} />
                <span>Vessa</span>
              </span>
              <p>The AI workspace for modern business.</p>
            </div>
            <div className={styles.footerLinks}>
              <div>
                <h5>Product</h5>
                <a href="#tools">Tools</a>
                <a href="#pricing">Pricing</a>
                <Link href="/login">Log in</Link>
              </div>
              <div>
                <h5>Tools</h5>
                {tools.slice(0, 4).map((t) => (
                  <Link key={t.id} href={t.href}>{t.name}</Link>
                ))}
              </div>
              <div>
                <h5>More tools</h5>
                {tools.slice(4).map((t) => (
                  <Link key={t.id} href={t.href}>{t.name}</Link>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>© 2026 Vessa. All rights reserved.</p>
            <p>Built for professionals who ship.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
