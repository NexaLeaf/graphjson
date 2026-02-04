import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Home(): JSX.Element {
  return (
    <Layout title="GraphJSON" description="Type-safe GraphQL query building for TypeScript">
      <main style={{ padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <h1>GraphJSON</h1>
          <p>Type-safe GraphQL query building and execution for TypeScript.</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link className="button button--primary" to="/getting-started">
              Get Started
            </Link>
            <Link className="button button--secondary" to="/json-dsl-reference">
              JSON DSL Reference
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
