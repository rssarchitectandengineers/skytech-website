const https = require('https');

const key = 'sb_publishable_Psu9GXnSc_MXGNgQxP6-Dg_W14RBCVq';
const urlBase = 'https://fzfdddlkclluqpiyjrtx.supabase.co/rest/v1';

const projects = [
  {
    id: 'prj-1',
    title: 'The Rajmahal Commercial Complex',
    category: 'commercial',
    category_name: 'Commercial',
    location: 'Jaipur, Rajasthan',
    image_url: 'assets/images/project-commercial.jpg',
    area: '145,000 sq ft',
    floors: 'G + 12 Floors',
    system: 'Earthquake-Resistant RCC Frame with Post-Tensioned Slabs',
    steel_savings: '14.2% Steel Optimization (₹18.4 Lakhs Saved)',
    description: 'A landmark commercial mixed-use retail and corporate tower engineered strictly to IS 1893:2016 seismic criteria and IS 13920 ductile detailing.',
    status: 'published',
    submitted_by: 'Owner'
  },
  {
    id: 'prj-2',
    title: 'RIICO Heavy PEB Industrial Shed',
    category: 'industrial',
    category_name: 'Industrial',
    location: 'Sitapura Industrial Area, Jaipur',
    image_url: 'assets/images/project-industrial.jpg',
    area: '85,000 sq ft',
    floors: 'Clear Height: 11.5m',
    system: 'Clear-Span Pre-Engineered Steel Frame with EOT Crane Girders (15T)',
    steel_savings: '18.7% Tonnage Reduction via Built-Up Tapered Sections',
    description: 'Custom engineered industrial manufacturing plant featuring a 36-meter clear span without intermediate columns.',
    status: 'published',
    submitted_by: 'Owner'
  },
  {
    id: 'prj-3',
    title: 'Aravalli Greens Luxury Residential Villas',
    category: 'residential',
    category_name: 'Residential',
    location: 'Mansarovar Extension, Jaipur',
    image_url: 'assets/images/project-residential.jpg',
    area: '42,000 sq ft (12 Villas)',
    floors: 'Basement + G + 2 Floors',
    system: 'Monolithic RCC Beam-Column Frame with Flat Plates',
    steel_savings: '12.8% Cement & Rebar Efficiency',
    description: 'A boutique gated villa enclave designed with cantilevered balconies, column-free internal living spaces, and optimized structural wall arrangements.',
    status: 'published',
    submitted_by: 'Owner'
  },
  {
    id: 'prj-4',
    title: 'St. Xavier Modern Academic Campus',
    category: 'institutional',
    category_name: 'Institutional',
    location: 'Ajmer Road, Jaipur',
    image_url: 'assets/images/project-institutional.jpg',
    area: '120,000 sq ft',
    floors: 'G + 4 Floors + Auditorium',
    system: 'Heavy RCC Frame with Large-Span Prestressed Auditorium Beams',
    steel_savings: '16.5% Material Savings on Framing',
    description: 'Multi-storey institutional campus accommodating 2,500 students with large-span lecture halls, laboratories, and an acoustically optimized column-free auditorium.',
    status: 'published',
    submitted_by: 'Owner'
  },
  {
    id: 'prj-5',
    title: 'Overhead Highway RCC Foot Overbridge',
    category: 'infrastructure',
    category_name: 'Infrastructure',
    location: 'Tonk Road Highway Junction, Jaipur',
    image_url: 'assets/images/project-infrastructure.jpg',
    area: 'Span: 48 meters',
    floors: 'Pedestrian Truss + Pier Cap',
    system: 'Composite Steel-Concrete Girder on Cylindrical RCC Piers',
    steel_savings: 'Zero Rework with Precision BBS',
    description: 'Municipal pedestrian infrastructure bridging a high-traffic 6-lane national highway corridor with composite steel-concrete superstructure.',
    status: 'published',
    submitted_by: 'Owner'
  }
];

const blogs = [
  {
    title: 'How Re-Engineering Approved Drawings Trims 15-25% Steel Tonnage',
    slug: 'how-re-engineering-approved-drawings-trims-15-25-steel-tonnage',
    category: 'Value Engineering',
    excerpt: 'Discover how structural optimization algorithms and IS 456/13920 re-auditing reduce unnecessary rebar congestion without compromising building safety.',
    content: 'Value engineering in civil structures is not about cutting corners—it is about rigorous mathematical optimization per IS 456:2000 and IS 13920:2016 ductile detailing standards. Often, conventional drawing offices apply conservative safety factors repeatedly across every beam, column, and foundation node. By applying 3D finite element re-analysis in ETABS, structural engineers can identify redundant rebar congestion, streamline bar diameters, and deliver genuine 15% to 25% material savings for developers while maintaining safety factors above municipal bylaws.',
    read_time: '6 min read',
    image_url: 'assets/images/about-engineers.webp',
    status: 'published',
    submitted_by: 'Owner'
  },
  {
    title: 'Demystifying IS 1893:2016: Seismic Design Criteria for North India',
    slug: 'demystifying-is-1893-2016-seismic-design-criteria-north-india',
    category: 'Structural Standards',
    excerpt: 'A technical deep-dive into seismic coefficient method, response spectrum analysis, and foundation soil factor adjustments across Zone II to IV.',
    content: 'Rajasthan spans across Seismic Zone II and III, requiring careful response reduction factor (R) evaluation and soil-structure interaction. This technical overview highlights key parameters: zone factor (Z), importance factor (I), and spectral acceleration coefficients (Sa/g). Proper adherence ensures multi-storey RCC framed structures sustain horizontal earthquake accelerations with zero catastrophic failure risk.',
    read_time: '8 min read',
    image_url: 'assets/images/01-residential-building-3d-model.webp',
    status: 'published',
    submitted_by: 'Owner'
  },
  {
    title: 'PEB vs Conventional Steel: Cost & Speed Comparison for Warehouses',
    slug: 'peb-vs-conventional-steel-cost-speed-comparison-warehouses',
    category: 'Industrial Design',
    excerpt: 'Compare fabrication timelines, foundation loads, crane girder provisions, and total project lifecycle costs for industrial sheds.',
    content: 'When planning an industrial shed or logistics warehouse in Sitapura or Vishwakarma industrial areas, choosing between Pre-Engineered Buildings (PEB) and conventional structural steel shapes makes a 20-30% difference in initial capex and delivery timeline. PEB frames leverage tapered built-up sections with high-strength steel (345 MPa), reducing overall dead load on foundations and speeding up erection to under 90 days.',
    read_time: '5 min read',
    image_url: 'assets/images/hero-slide-5.webp',
    status: 'published',
    submitted_by: 'Owner'
  }
];

function postData(endpoint, items) {
  const data = JSON.stringify(items);
  const req = https.request(`${urlBase}/${endpoint}`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': 'Bearer ' + key,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    }
  }, (res) => {
    console.log(`Seeded ${endpoint} -> status:`, res.statusCode);
  });
  req.on('error', e => console.error(e));
  req.write(data);
  req.end();
}

postData('projects', projects);
postData('blogs', blogs);

