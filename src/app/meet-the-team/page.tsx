import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Meet the Team',
  description:
    'Meet the experienced roofing professionals at Vegas Born Roofing LLC. Our team brings over 100 combined years of commercial and residential roofing expertise to Las Vegas and surrounding areas.',
  openGraph: {
    title: 'Meet the Team | Vegas Born Roofing',
    description: 'Experienced roofing professionals serving Las Vegas since 2018.',
  },
};

const teamMembers = [
  {
    name: 'Jodd Friesz',
    role: 'Owner / Operator',
    image: '/images/team-jodd.png',
    bio: 'Originally from Flasher, North Dakota, Jodd served 6 years in the Army and Reserves before starting his roofing career at Dean Roofing in 1995 as an installation laborer. He advanced to estimator and project manager, then moved into commercial roofing. He co-founded Vegas Born Roofing in 2018 and is now the sole owner. Jodd emphasizes communication, teamwork, and accountability on every project.',
    quote: 'Success isn\'t just about what you accomplish in your life: it\'s about what you inspire others to do.',
  },
  {
    name: 'Hector Santiago',
    role: 'Estimator / Project Manager',
    bio: 'With over 20 years of roofing experience, Hector manages customer relationships, crew coordination, and project oversight. Known for his positive attitude and strong work ethic, he ensures every project runs smoothly from start to finish.',
  },
  {
    name: 'Luis Ordonez',
    role: 'Commercial Superintendent',
    bio: 'Luis began his roofing career in 1999 and has built extensive experience across residential and major commercial projects, including schools and resorts. His work ethic and attention to detail make him an invaluable leader on our commercial division.',
  },
  {
    name: 'Tommy Reiner',
    role: 'Residential Service Manager',
    bio: 'With over 10 years of roofing and construction experience, Tommy specializes in homeowner service and honest recommendations. He takes pride in making sure every residential customer feels confident in the work being done on their home.',
    quote: 'What have you done for somebody else today?',
  },
  {
    name: 'Albert Hernandez',
    role: 'SR. Project Manager / Estimator',
    bio: 'Albert joined Vegas Born Roofing in 2020, bringing deep experience across multiple roofing systems. He coordinates with general contractors and crews to ensure projects are completed on time and to specification.',
  },
  {
    name: 'Luis Jr. Ordonez',
    role: 'Project Manager / Estimator',
    bio: 'Starting in field installation, Luis Jr. developed his estimating and project management skills through hands-on experience. Known for his dependability and eagerness to learn, he continues to grow into a key member of our team.',
  },
  {
    name: 'Charlene Garrett',
    role: 'Accounting Controller',
    bio: 'Charlene has been with the company since its inception. She manages accounts receivable and payable, payroll, and employee administration. Her organization and attention to detail keep our operations running seamlessly.',
  },
  {
    name: 'Sharon Uechi',
    role: 'Administrative Support Specialist',
    bio: 'Sharon is the first point of contact for our customers. With a background in business, banking, travel, real estate, and insurance, she brings a wealth of professional experience to our front office operations.',
  },
  {
    name: 'Rich Friesz',
    role: 'Project Manager',
    bio: 'Rich joined the team in 2022, bringing over 20 years of construction industry experience. He works closely with property managers, contractors, and HOAs to deliver quality roofing solutions across the valley.',
  },
  {
    name: 'Arielle Serrano',
    role: 'Accounts Payable',
    bio: 'Arielle supports day-to-day operations by handling customer calls, scheduling, billing, and AIA coordination. Her efficiency and attention to detail keep our administrative processes running smoothly.',
  },
];

const memorial = {
  name: 'Joey Williams',
  role: 'Founding Partner',
  bio: 'A lifelong Las Vegas resident and roofing industry professional, Joey was a founding partner of Vegas Born Roofing and a devoted family man. His legacy lives on in the values and work ethic he instilled in our team.',
};

export default function MeetTheTeam() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: teamMembers.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Person',
        name: m.name,
        jobTitle: m.role,
        worksFor: { '@type': 'Organization', name: 'Vegas Born Roofing LLC' },
        description: m.bio,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      {/* Hero */}
      <section className="bg-[#111827] py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Meet the Team</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our team is made up of experienced roofing professionals who know how to get the job done
            right. Together we bring over 100 combined years of industry expertise.
          </p>
        </div>
      </section>

      {/* Owner spotlight */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-80 md:h-[450px] rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/images/team-jodd.png"
                alt="Jodd Friesz - Owner and Operator of Vegas Born Roofing LLC"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="text-[#b91c1c] font-semibold text-sm uppercase tracking-wider mb-2">
                Owner / Operator
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Jodd Friesz</h2>
              {teamMembers[0].quote && (
                <blockquote className="border-l-4 border-[#d4a843] pl-4 italic text-gray-500 mb-6">
                  &ldquo;{teamMembers[0].quote}&rdquo;
                </blockquote>
              )}
              <p className="text-gray-600 leading-relaxed">{teamMembers[0].bio}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Team Members</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.slice(1).map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="w-20 h-20 bg-[#111827] rounded-full flex items-center justify-center mb-5">
                  <span className="text-2xl font-bold text-[#d4a843]">
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-[#b91c1c] font-medium text-sm mb-4">{member.role}</p>
                {member.quote && (
                  <blockquote className="border-l-4 border-[#d4a843] pl-3 italic text-gray-500 text-sm mb-4">
                    &ldquo;{member.quote}&rdquo;
                  </blockquote>
                )}
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Memorial */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-gray-50 rounded-xl p-10 border border-gray-200">
            <p className="text-sm uppercase tracking-wider text-gray-400 mb-3">In Loving Memory</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{memorial.name}</h3>
            <p className="text-[#b91c1c] font-medium mb-4">{memorial.role}</p>
            <p className="text-gray-600 leading-relaxed">{memorial.bio}</p>
          </div>
        </div>
      </section>
    </>
  );
}
