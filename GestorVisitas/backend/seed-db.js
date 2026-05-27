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
  { identity_document: '12345678-9', first_name: 'Ana', last_name: 'Silva', document_image_url: 'https://i.pravatar.cc/150?img=5', is_approved: true, status: 'active', date_of_birth: '1988-04-12', civil_status: 'Married', zip_code: '6014', residential_address: 'Jagobiao Mandaue City', visitor_type: 'Spouse', citizenship: 'Filipino', gender: 'Female' },
  { identity_document: '98765432-1', first_name: 'Luis', last_name: 'Mendoza', document_image_url: 'https://i.pravatar.cc/150?img=11', is_approved: true, status: 'active', date_of_birth: '2005-11-20', civil_status: 'Single', zip_code: '6000', residential_address: 'Cebu City', visitor_type: 'Son', citizenship: 'Filipino', gender: 'Male' },
  { identity_document: '56473829-0', first_name: 'Ma. Lourdes', last_name: 'Abasolo', document_image_url: 'https://i.pravatar.cc/150?img=9', is_approved: true, status: 'active', date_of_birth: '1959-02-06', civil_status: 'Married', zip_code: '6014', residential_address: 'Jagobiao Mandaue City', visitor_type: 'Mother', citizenship: 'Filipino', gender: 'Female' },
  { identity_document: '10293847-5', first_name: 'Miguel', last_name: 'Diaz', document_image_url: 'https://i.pravatar.cc/150?img=12', is_approved: true, status: 'active', date_of_birth: '1995-07-30', civil_status: 'Single', zip_code: '6014', residential_address: 'Mandaue City', visitor_type: 'Brother', citizenship: 'Filipino', gender: 'Male' },
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

  // 4. Visits Schedule and Blacklist History
  const visitorLourdes = visitors.find(v => v.identity_document === '56473829-0');
  const inmateJavier = inmates.find(i => i.inmate_number === 'INM-002');
  
  if (visitorLourdes && inmateJavier) {
    console.log('Seeding historical records for Ma. Lourdes Abasolo...');
    
    // Clean old records first
    await supabase.from('visits_schedule').delete().eq('visitor_id', visitorLourdes.id);
    await supabase.from('blacklist_history').delete().eq('visitor_id', visitorLourdes.id);

    // Visits Schedule
    const { error: visitErr } = await supabase.from('visits_schedule').insert([
      { inmate_id: inmateJavier.id, visitor_id: visitorLourdes.id, scheduled_time: '2026-05-02T09:57:38Z', time_out: '2026-05-02T10:21:48Z', jail_assignment: 'DANAO CITY JAIL - MD', status: 'completed' },
      { inmate_id: inmateJavier.id, visitor_id: visitorLourdes.id, scheduled_time: '2025-03-23T09:48:47Z', time_out: '2025-03-23T10:59:02Z', jail_assignment: 'DANAO CITY JAIL - MD', status: 'completed' }
    ]);
    if (visitErr) console.error('Error inserting visits schedule', visitErr);

    // Blacklist History
    const { error: blackErr } = await supabase.from('blacklist_history').insert([
      { visitor_id: visitorLourdes.id, date_issued: '2023-01-15', date_from: '2023-01-15', date_to: '2023-07-15', remarks: 'Violation of dress code', status: 'expired' }
    ]);
    if (blackErr) console.error('Error inserting blacklist history', blackErr);
  }
  console.log('Seed completed successfully!');
}

seed();
