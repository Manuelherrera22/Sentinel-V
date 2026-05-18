const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

const mockInmates = [
  { 
    inmate_number: 'INM-001', 
    first_name: 'Carlos',
    last_name: 'Mendoza', 
    block_location: 'Building 1', 
    cell_number: 'Dorm 5',
    security_level: 'Medium', 
    crimes: ['Armed Robbery', 'Assault'],
    detention_date: '2019-03-15',
    release_date: '2028-03-15',
    status: 'active',
    date_of_birth: '1985-11-22',
    gender: 'male',
  },
  { 
    inmate_number: 'INM-002', 
    first_name: 'Javier',
    last_name: 'Ramirez', 
    block_location: 'Building 2', 
    cell_number: 'Dorm 10',
    security_level: 'High', 
    crimes: ['Murder', 'Organized Crime', 'Extortion'],
    detention_date: '2015-08-10',
    release_date: '2045-08-10',
    status: 'active',
    date_of_birth: '1979-05-14',
    gender: 'male',
  },
  { 
    inmate_number: 'INM-003', 
    first_name: 'Roberto',
    last_name: 'Diaz', 
    block_location: 'Building 1', 
    cell_number: 'Dorm 11',
    security_level: 'Low', 
    crimes: ['Fraud', 'Embezzlement'],
    detention_date: '2022-01-20',
    release_date: '2027-01-20',
    status: 'active',
    date_of_birth: '1992-09-30',
    gender: 'male',
  },
];

const mockVisitors = [
  { identity_document: '12345678-9', first_name: 'Ana', last_name: 'Silva', document_image_url: 'https://i.pravatar.cc/150?img=5', is_approved: true },
  { identity_document: '98765432-1', first_name: 'Luis', last_name: 'Mendoza', document_image_url: 'https://i.pravatar.cc/150?img=11', is_approved: true },
  { identity_document: '56473829-0', first_name: 'Carmen', last_name: 'Rojas', document_image_url: 'https://i.pravatar.cc/150?img=9', is_approved: true },
  { identity_document: '10293847-5', first_name: 'Miguel', last_name: 'Diaz', document_image_url: 'https://i.pravatar.cc/150?img=12', is_approved: true },
];

const inmateVisitorsRelations = [
  { inmate_num: 'INM-001', visitor_docs: ['12345678-9', '98765432-1'], relation: ['Spouse', 'Son'] },
  { inmate_num: 'INM-002', visitor_docs: ['56473829-0'], relation: ['Mother'] },
  { inmate_num: 'INM-003', visitor_docs: ['10293847-5'], relation: ['Brother'] },
];

async function seed() {
  console.log('Seeding Database...');

  // 1. Inmates
  const { data: inmates, error: inmatesErr } = await supabase.from('inmates').upsert(mockInmates, { onConflict: 'inmate_number' }).select();
  if (inmatesErr) { console.error('Error inserting inmates', inmatesErr); return; }
  console.log('Inmates seeded.');

  // 2. Visitors
  const { data: visitors, error: visitorsErr } = await supabase.from('visitors').upsert(mockVisitors, { onConflict: 'identity_document' }).select();
  if (visitorsErr) { console.error('Error inserting visitors', visitorsErr); return; }
  console.log('Visitors seeded.');

  // 3. Inmate_Visitors
  for (const rel of inmateVisitorsRelations) {
    const inmate = inmates.find(i => i.inmate_number === rel.inmate_num);
    for (let i = 0; i < rel.visitor_docs.length; i++) {
      const doc = rel.visitor_docs[i];
      const relationText = rel.relation[i];
      const visitor = visitors.find(v => v.identity_document === doc);
      
      if (inmate && visitor) {
        await supabase.from('inmate_visitors').upsert({
          inmate_id: inmate.id,
          visitor_id: visitor.id,
          relationship: relationText
        }, { onConflict: 'inmate_id,visitor_id' });
      }
    }
  }
  console.log('Inmate-Visitor relations seeded.');
  console.log('Seed completed successfully!');
}

seed();
