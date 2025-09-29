import type {ComponentType, ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureIconProps = {className?: string};

type FeatureItem = {
  title: string;
  Icon: ComponentType<FeatureIconProps>;
  description: ReactNode;
};

const ArchitectureIcon = ({className}: FeatureIconProps) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    role="img"
    aria-label="Architecture diagram"
  >
    <rect x="6" y="10" width="18" height="44" rx="3" fill="#2563eb" />
    <rect x="40" y="10" width="18" height="30" rx="3" fill="#38bdf8" />
    <path d="M24 20h16v8H24z" fill="#1d4ed8" />
    <path d="M24 36h16v8H24z" fill="#1e293b" />
  </svg>
);

const DevelopmentIcon = ({className}: FeatureIconProps) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    role="img"
    aria-label="Development tooling"
  >
    <rect x="8" y="12" width="48" height="36" rx="4" fill="#0f172a" />
    <path d="M8 20h48" stroke="#1f2937" strokeWidth="4" />
    <polyline
      points="22,30 18,34 22,38"
      fill="none"
      stroke="#38bdf8"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="42,30 46,34 42,38"
      fill="none"
      stroke="#38bdf8"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="28" y="28" width="8" height="12" rx="1" fill="#f8fafc" />
  </svg>
);

const OperationsIcon = ({className}: FeatureIconProps) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    role="img"
    aria-label="Operations status"
  >
    <circle cx="32" cy="32" r="24" fill="#0f766e" />
    <path
      d="M20 34l8 8 16-20"
      fill="none"
      stroke="#ecfeff"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="32" cy="32" r="12" fill="none" stroke="#14b8a6" strokeWidth="4" />
  </svg>
);

const FeatureList: FeatureItem[] = [
  {
    title: 'Architecture & Rendering',
    Icon: ArchitectureIcon,
    description: (
      <>
        Understand how the marketing and microsite apps share layouts, ISR, and
        Supabase-backed data flows.{' '}
        <Link to="/docs/architecture">Read the architecture guide</Link> to see
        the recommended patterns.
      </>
    ),
  },
  {
    title: 'Local Development',
    Icon: DevelopmentIcon,
    description: (
      <>
        Get your environment running quickly with shared workspace commands,
        Supabase tooling, and app-specific scripts outlined in the{' '}
        <Link to="/docs/development">development guide</Link>.
      </>
    ),
  },
  {
    title: 'Supabase & Operations',
    Icon: OperationsIcon,
    description: (
      <>
        Coordinate schema updates, CI workflows, and remote ops handoffs using the{' '}
        <Link to="/docs/supabase">Supabase</Link>, <Link to="/docs/ci">CI</Link>,
        and <Link to="/docs/remote-operations">remote operations</Link> manuals.
      </>
    ),
  },
];

function Feature({title, Icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Icon className={styles.featureIcon} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
