import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('Seeding Leo Realty database...\n');

  // ─── Agents ───────────────────────────────────────────────────────────────
  console.log('Seeding agents...');
  const agentData = [
    {
      slug: 'leopold-evariste',
      name: 'Leopold Evariste',
      title: 'CEO & Founder',
      role: 'ceo' as const,
      phone: '(305) 705-2030',
      email: 'leopold@leorealtycapitalinvestments.com',
      bio: 'Leopold Evariste founded Leo Realty Capital Investments in 1992 with a mission to transform the South Florida real estate experience. His pioneering MR 2% commission model has saved clients millions while delivering white-glove service. With over 32 years of market expertise, Leopold has navigated every cycle of the South Florida market.',
      avatarUrl: '/team-leopold.jpg',
      specialties: ['Luxury Properties', 'Investment Properties', 'Commercial Real Estate'],
      yearsExperience: 32,
      isActive: true,
      displayOrder: 0,
    },
    {
      slug: 'joanne-evariste',
      name: 'Joanne Evariste',
      title: 'Office Manager',
      role: 'office_manager' as const,
      phone: '(305) 705-2030',
      email: 'joanne@leorealtycapitalinvestments.com',
      bio: 'Joanne Evariste is the backbone of Leo Realty operations, ensuring every transaction runs smoothly from start to finish.',
      avatarUrl: '/team-joanne.jpg',
      specialties: ['Operations', 'Client Relations', 'Transaction Coordination'],
      yearsExperience: 15,
      isActive: true,
      displayOrder: 1,
    },
    {
      slug: 'jean-samuel-luxama',
      name: 'Jean Samuel Luxama',
      title: 'Realtor & Loan Originator',
      role: 'realtor' as const,
      phone: '(305) 705-2030',
      email: 'jsluxama@leorealtycapitalinvestments.com',
      bio: 'Dual-licensed as both a Realtor and Loan Originator, Jean Samuel provides seamless service from property search to closing.',
      avatarUrl: '/team-jean-samuel.jpg',
      specialties: ['Residential Real Estate', 'FHA Loans', 'First-Time Buyers', 'Hometown Heroes'],
      yearsExperience: 8,
      isActive: true,
      displayOrder: 2,
    },
    {
      slug: 'olivier-desire',
      name: 'Olivier Desire',
      title: 'Loan Originator',
      role: 'loan_originator' as const,
      phone: '(305) 705-2030',
      email: 'olivier@leorealtycapitalinvestments.com',
      bio: 'Olivier Desire specializes in investment property financing and complex mortgage scenarios including DSCR and USDA programs.',
      avatarUrl: '/team-olivier.jpg',
      specialties: ['DSCR Loans', 'USDA Loans', 'Conventional Financing', 'Investment Properties'],
      yearsExperience: 10,
      isActive: true,
      displayOrder: 3,
    },
    {
      slug: 'daniel-calixte',
      name: 'Daniel Calixte',
      title: 'Loan Originator',
      role: 'loan_originator' as const,
      phone: '(305) 705-2030',
      email: 'daniel@leorealtycapitalinvestments.com',
      bio: 'Daniel Calixte is known for his deep knowledge of VA and FHA loan programs and his dedication to making mortgages stress-free.',
      avatarUrl: '/team-daniel.jpg',
      specialties: ['VA Loans', 'FHA Loans', 'Refinancing', 'Credit Improvement'],
      yearsExperience: 7,
      isActive: true,
      displayOrder: 4,
    },
    {
      slug: 'carly-cadet',
      name: 'Carly Cadet',
      title: 'Realtor Associate',
      role: 'realtor_associate' as const,
      phone: '(305) 705-2030',
      email: 'carly@leorealtycapitalinvestments.com',
      bio: 'Carly Cadet brings energy and market knowledge to every client relationship, specializing in residential homes and condos.',
      avatarUrl: '/team-carly.jpg',
      specialties: ['Residential Homes', 'Condominiums', 'First-Time Buyers', 'Rentals'],
      yearsExperience: 5,
      isActive: true,
      displayOrder: 5,
    },
  ];

  const insertedAgents: number[] = [];
  for (const agent of agentData) {
    try {
      const existing = await db.select().from(schema.agents).where(eq(schema.agents.slug, agent.slug)).limit(1);
      if (existing.length === 0) {
        const [inserted] = await db.insert(schema.agents).values(agent).returning({ id: schema.agents.id });
        insertedAgents.push(inserted.id);
        console.log(`  + ${agent.name}`);
      } else {
        insertedAgents.push(existing[0].id);
        console.log(`  ~ ${agent.name} (exists)`);
      }
    } catch (err) {
      console.error(`  ERROR: ${agent.name}`, err);
      insertedAgents.push(0);
    }
  }

  const [ceoId, , jslId, olivierId, , carlyId] = insertedAgents;

  // ─── Properties ───────────────────────────────────────────────────────────
  console.log('\nSeeding properties...');
  const propertyData = [
    {
      slug: 'luxury-waterfront-miami-beach',
      title: 'Luxury Waterfront Estate — Miami Beach',
      description: 'Stunning waterfront estate in the heart of Miami Beach featuring panoramic ocean views, chef\'s kitchen, and resort-style pool. This exceptional property represents the pinnacle of South Florida luxury living.',
      status: 'for_sale' as const,
      propertyType: 'residential' as const,
      price: '1250000',
      bedrooms: 5,
      bathrooms: 4,
      sqft: 3800,
      address: '123 Ocean Drive',
      city: 'Miami Beach',
      state: 'FL',
      zip: '33139',
      images: [
        { url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80', caption: 'Exterior view', order: 0 },
        { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', caption: 'Living room', order: 1 },
      ],
      features: ['Ocean Views', 'Private Pool', 'Chef\'s Kitchen', 'Smart Home', '3-Car Garage', 'Wine Cellar'],
      agentId: ceoId || null,
      isFeatured: true,
      isPublished: true,
      yearBuilt: 2018,
    },
    {
      slug: 'modern-brickell-condo',
      title: 'Modern Brickell Condo with Bay Views',
      description: 'Sleek and modern 2-bedroom condo in the heart of Brickell with stunning bay views. Building amenities include rooftop pool, fitness center, and 24/7 concierge.',
      status: 'for_sale' as const,
      propertyType: 'condo' as const,
      price: '485000',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      address: '456 Brickell Ave #2510',
      city: 'Miami',
      state: 'FL',
      zip: '33131',
      images: [
        { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', caption: 'City view', order: 0 },
      ],
      features: ['Bay Views', 'Rooftop Pool', 'Concierge', 'Gym', 'Valet Parking'],
      agentId: carlyId || null,
      isFeatured: true,
      isPublished: true,
      yearBuilt: 2020,
    },
    {
      slug: 'spacious-family-home-aventura',
      title: 'Spacious Family Home in Aventura',
      description: 'Beautiful single-family home in prestigious Aventura. Featuring an open floor plan, gourmet kitchen, private backyard, and top-rated school district.',
      status: 'for_sale' as const,
      propertyType: 'residential' as const,
      price: '680000',
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2600,
      address: '789 Aventura Blvd',
      city: 'Aventura',
      state: 'FL',
      zip: '33160',
      images: [
        { url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80', caption: 'Exterior', order: 0 },
      ],
      features: ['Private Backyard', 'Gourmet Kitchen', 'Open Floor Plan', 'Top Schools', '2-Car Garage'],
      agentId: jslId || null,
      isFeatured: true,
      isPublished: true,
      yearBuilt: 2015,
    },
    {
      slug: 'investment-multifamily-hialeah',
      title: 'Investment Multi-Family in Hialeah',
      description: 'Excellent investment opportunity — 6-unit multi-family property in high-demand Hialeah. Fully occupied with strong rental income and excellent ROI.',
      status: 'for_sale' as const,
      propertyType: 'multi_family' as const,
      price: '890000',
      bedrooms: 6,
      bathrooms: 6,
      sqft: 4200,
      address: '321 Palm Ave',
      city: 'Hialeah',
      state: 'FL',
      zip: '33010',
      images: [
        { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', caption: 'Exterior', order: 0 },
      ],
      features: ['6 Units', 'Fully Occupied', 'Strong Cash Flow', 'Parking', 'Recent Renovation'],
      agentId: olivierId || null,
      isFeatured: false,
      isPublished: true,
      yearBuilt: 2000,
    },
    {
      slug: 'cozy-doral-townhouse-rental',
      title: 'Cozy Doral Townhouse — For Rent',
      description: 'Beautiful 3-bedroom townhouse in gated Doral community. Includes washer/dryer, 2-car garage, community pool, and easy highway access.',
      status: 'for_rent' as const,
      propertyType: 'townhouse' as const,
      price: '3200',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800,
      address: '555 Doral Blvd',
      city: 'Doral',
      state: 'FL',
      zip: '33122',
      images: [
        { url: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&q=80', caption: 'Exterior', order: 0 },
      ],
      features: ['Gated Community', 'Community Pool', '2-Car Garage', 'Washer/Dryer', 'Pet-Friendly'],
      agentId: carlyId || null,
      isFeatured: false,
      isPublished: true,
      yearBuilt: 2012,
    },
  ];

  for (const prop of propertyData) {
    try {
      const existing = await db.select().from(schema.properties).where(eq(schema.properties.slug, prop.slug)).limit(1);
      if (existing.length === 0) {
        await db.insert(schema.properties).values(prop);
        console.log(`  + ${prop.title}`);
      } else {
        console.log(`  ~ ${prop.title} (exists)`);
      }
    } catch (err) {
      console.error(`  ERROR: ${prop.title}`, err);
    }
  }

  // ─── Blog Posts ───────────────────────────────────────────────────────────
  console.log('\nSeeding blog posts...');
  const blogData = [
    {
      slug: 'investing-in-real-estate',
      title: 'Investing in Real Estate: A Complete Guide',
      excerpt: 'Real estate remains one of the most powerful wealth-building tools. Learn everything you need to know about investing in South Florida.',
      content: `# Investing in Real Estate: A Complete Guide\n\nReal estate investment has long been one of the most reliable paths to building wealth...\n\n## Why South Florida?\n\nSouth Florida offers exceptional investment opportunities with strong appreciation, rental demand, and no state income tax.\n\n## Types of Investments\n\nSingle-family, multi-family, commercial, and short-term rentals each offer unique benefits.\n\nContact Leo Realty to discuss your investment goals today.`,
      coverImageUrl: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&q=80',
      authorId: ceoId || null,
      category: 'investing' as const,
      tags: ['investing', 'wealth', 'portfolio', 'south florida'],
      isPublished: true,
      publishedAt: new Date('2024-01-15'),
      readTimeMinutes: 8,
    },
    {
      slug: 'investment-properties-south-florida',
      title: 'Investment Properties in South Florida: 2024 Market Guide',
      excerpt: 'South Florida real estate continues to offer exceptional returns. Our 2024 guide covers the best markets, property types, and strategies.',
      content: `# Investment Properties in South Florida\n\nSouth Florida remains one of the hottest real estate markets in the US...\n\n## Top Markets\n\nMiami-Dade, Broward, and Palm Beach Counties all offer excellent opportunities.\n\n## Financing Your Investment\n\nLeo Realty's mortgage team offers DSCR loans, conventional investment loans, and portfolio loans.\n\nContact us for a free investment consultation.`,
      coverImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
      authorId: jslId || null,
      category: 'investing' as const,
      tags: ['south florida', 'investment', 'market update', 'returns'],
      isPublished: true,
      publishedAt: new Date('2024-02-20'),
      readTimeMinutes: 6,
    },
    {
      slug: 'hometown-heroes-program',
      title: 'Understanding the Hometown Heroes Housing Program',
      excerpt: 'Florida\'s Hometown Heroes program provides up to $35,000 in down payment assistance for frontline workers. Learn if you qualify.',
      content: `# Understanding the Hometown Heroes Program\n\nFlorida's Hometown Heroes Housing Program helps frontline workers buy their first home...\n\n## Who Qualifies?\n\nTeachers, nurses, law enforcement, firefighters, and many other community service professions.\n\n## Benefits\n\n- Up to 5% down payment assistance\n- Below-market interest rates\n- Deferred second mortgage\n\nContact Leo Realty's mortgage team to check your eligibility.`,
      coverImageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80',
      authorId: olivierId || null,
      category: 'mortgage_tips' as const,
      tags: ['hometown heroes', 'down payment assistance', 'first-time buyer', 'florida'],
      isPublished: true,
      publishedAt: new Date('2024-03-10'),
      readTimeMinutes: 5,
    },
  ];

  for (const post of blogData) {
    try {
      const existing = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.slug, post.slug)).limit(1);
      if (existing.length === 0) {
        await db.insert(schema.blogPosts).values(post);
        console.log(`  + ${post.title}`);
      } else {
        console.log(`  ~ ${post.title} (exists)`);
      }
    } catch (err) {
      console.error(`  ERROR: ${post.title}`, err);
    }
  }

  // ─── Testimonials ──────────────────────────────────────────────────────────
  console.log('\nSeeding testimonials...');
  const testimonialData = [
    { reviewerName: 'Sarah Johnson', reviewerRole: 'Tenant', rating: 5, reviewText: 'Leo Realty made finding my apartment incredibly easy. Truly professional service!', isFeatured: true, displayOrder: 0 },
    { reviewerName: 'Michael Smith', reviewerRole: 'First-Time Homebuyer', rating: 5, reviewText: 'Their MR 2% commission saved me thousands. I couldn\'t be happier with my new home!', isFeatured: true, displayOrder: 1 },
    { reviewerName: 'David Lee', reviewerRole: 'Business Owner', rating: 5, reviewText: 'Their 32 years of experience really shows. Found the perfect commercial location.', isFeatured: true, displayOrder: 2 },
    { reviewerName: 'Emily Chen', reviewerRole: 'Real Estate Investor', rating: 5, reviewText: 'The DSCR loan program was exactly what I needed to expand my rental portfolio.', isFeatured: true, displayOrder: 3 },
    { reviewerName: 'James Thompson', reviewerRole: 'Property Owner', rating: 5, reviewText: 'Sold my home in 21 days at asking price. Leo Realty is the gold standard.', isFeatured: true, displayOrder: 4 },
  ];

  for (const t of testimonialData) {
    try {
      const existing = await db.select().from(schema.testimonials).where(eq(schema.testimonials.reviewerName, t.reviewerName)).limit(1);
      if (existing.length === 0) {
        await db.insert(schema.testimonials).values(t);
        console.log(`  + ${t.reviewerName}`);
      } else {
        console.log(`  ~ ${t.reviewerName} (exists)`);
      }
    } catch (err) {
      console.error(`  ERROR: ${t.reviewerName}`, err);
    }
  }

  // ─── Site Settings ────────────────────────────────────────────────────────
  console.log('\nSeeding site settings...');
  const settingsData = [
    { key: 'company_name', value: 'Leo Realty Capital Investments', type: 'string' as const },
    { key: 'company_phone', value: '(305) 705-2030', type: 'string' as const },
    { key: 'company_email', value: 'Info@leorealtycapitalinvestments.com', type: 'string' as const },
    { key: 'company_address', value: '909 North Miami Beach Blvd, Suite 301A, North Miami Beach, FL', type: 'string' as const },
    { key: 'company_tagline', value: 'MR 2% | 32 Years In Business | No One Does It Better', type: 'string' as const },
    { key: 'company_motto', value: 'Mortgages Made Easy, Dreams Made Real', type: 'string' as const },
    { key: 'office_hours', value: 'Monday-Friday: 9:00 AM - 5:00 PM', type: 'string' as const },
  ];

  for (const setting of settingsData) {
    try {
      const existing = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.key, setting.key)).limit(1);
      if (existing.length === 0) {
        await db.insert(schema.siteSettings).values(setting);
        console.log(`  + ${setting.key}`);
      } else {
        console.log(`  ~ ${setting.key} (exists)`);
      }
    } catch (err) {
      console.error(`  ERROR: ${setting.key}`, err);
    }
  }

  console.log('\nSeed complete!');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
