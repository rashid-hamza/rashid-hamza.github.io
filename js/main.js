(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IMG = n => `assets/photos/${n}.jpg`;
  const ARROW = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10m0 0L8.5 3.5M13 8l-4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const PROJECTS = [
    {
      k: 'agri', title: 'AgriGuard', name: 'AgriGuard: Autonomous Pest-Deterrent System',
      kicker: 'Autonomous pest-deterrent system',
      org: 'IEEE First-Year Council', loc: 'Athens, GA', date: 'Sept 2026 - Present', team: 'Team of 4',
      skills: ['Raspberry Pi', 'OpenCV', 'Computer vision', 'Servo control', 'I2C / PWM', 'Time-of-flight sensing', 'GPIO relay control'],
      sum: 'Raspberry Pi and OpenCV system that detects pests, aims a pan-and-tilt nozzle, ranges the target and fires a short water burst.',
      next: 'UGA Fabricate · $10K startup competition',
      imgs: ['agriguard-closed', 'agriguard-raised'], fit: 'contain',
      bullets: [
        'Collaborating in a team of 4 as a part of UGA IEEE’s First Year Council to develop AgriGuard, an autonomous pest-deterrent system using a Raspberry Pi and OpenCV vision pipeline targeting 15 FPS and 85% detection precision under controlled lighting.',
        'The system drives 2 pan-and-tilt servos through an I2C PWM controller to align the spray nozzle within 5 degrees of each detected target, keeping aim accurate and repeatable across the camera’s entire field of view.',
        'Integrating a nozzle-mounted time-of-flight sensor to range targets from 0.5 to 1.5 meters with a target distance error under 5 cm, then switching a GPIO-controlled relay to fire a DC water pump in approximately 500 ms bursts.',
        'The system targets successful hits in 70 of 100 trials across repeated test runs, validating the complete detect-range-fire loop end to end.',
        'Preparing to submit AgriGuard to UGA Fabricate, a business startup competition, to compete for $10,000.'
      ]
    },
    {
      k: 'drive', title: 'DriveAble', name: 'DriveAble: Pneumatic Racing Seat',
      kicker: 'Pneumatic racing seat',
      org: 'UGAHacks CADathon', loc: 'Athens, GA', date: 'Oct 2026', team: 'Team of 3',
      skills: ['Autodesk Fusion 360', 'Computer-Aided Design (CAD)', 'Pneumatic systems', 'Mechanism design'],
      sum: 'Two-stage pneumatic seat that retracts the driver’s legs, then lifts the seat, for safer entry and exit by drivers with limited lower-body mobility.',
      more: ['frederic-sausset'],
      imgs: ['driveable-frame', 'driveable-seat', 'driveable-piston', 'driveable-section-view', 'driveable-leg-cradle', 'driveable-seat-lift', 'driveable-piston-wireframe', 'driveable-logo', 'driveable-team'],
      links: [['Watch the video', 'https://www.youtube.com/watch?v=coxjNwQhH2g']],
      bullets: [
        'Designed a two-stage pneumatic racing seat system in Autodesk Fusion 360 during a 36-hour CADathon, improving vehicle accessibility for drivers with limited lower-body mobility.',
        'Led the design and integration of the pneumatic piston system, engineering a sequential lifting mechanism that retracts the driver’s legs before seat elevation to address footbox clearance constraints and enable safer entry and emergency exit.',
        'Collaborated in a team of 3 to integrate 2 pneumatic actuators, a dual-rail lifting carriage, and an assisted leg cradle, inspired by quadriplegic racer <a href="https://www.24h-lemans.com/en/news/frederic-sausset-and-the-24-hours-of-le-mans-the-flame-still-burns-brightly-56777" target="_blank" rel="noopener">Frédéric Sausset</a>, who competed in the 24 Hours of Le Mans using an adapted racing system.'
      ]
    },
    {
      k: 'cred', title: 'Credit Scoring Platform', name: 'Credit Scoring Platform for Egypt',
      kicker: 'Fintech platform for Egypt',
      org: 'KSU Fintech Hackathon', loc: 'Kennesaw, GA', date: 'Mar 2026', place: '2nd of 40 teams', team: 'Team of 3',
      skills: ['Python', 'Flask', 'Pandas', 'OpenCV', 'DeepFace', 'Arya.ai ID API'],
      sum: 'Proof-of-concept platform that pairs e-wallet data with government ID verification to assess credit access for underbanked users in Egypt.',
      imgs: ['credit-scoring-app', 'credit-scoring-logo', 'credit-scoring-award', 'credit-scoring-hackathon', 'credit-scoring-group'],
      bullets: [
        'Placed 2nd of 40 teams at a Kennesaw State University Fintech Hackathon developing a proof-of-concept fintech platform using Python, Flask, and Pandas to pair e-wallet data with secure government ID verification for assessing credit access among historically underbanked users in Egypt.',
        'Integrated the live Egypt National ID API from Arya.ai for identity verification and used OpenCV with DeepFace for facial matching against the ID photo.',
        'The credit-scoring component was a theoretical, rules-based demonstration, while encryption and KYC compliance were identified as required hardening steps for a full real-world production deployment beyond the scope of the initial prototype.'
      ]
    },
    {
      k: 'tree', title: 'LED Christmas Tree', name: 'LED Christmas Tree: 3D Transistor Flasher',
      kicker: '3D flashing LED circuit',
      org: 'Personal build', date: '2025',
      sum: 'Hand-soldered three-board LED tree where two three-transistor oscillators flash 36 LEDs in a rotating pattern under a steady top light.',
      skills: ['Through-hole soldering', 'PCB assembly', 'NPN transistor switching', 'RC timing', 'LED current limiting', 'Component polarity'],
      imgs: ['led-tree-assembled', 'led-tree-kit'], fit: 'contain', circuit: 'led-tree-schematic',
      bullets: [
        'Hand-soldered a three-board 3D LED Christmas tree kit, assembling 37 red, yellow, and green LEDs, 6 S9014 NPN transistors, 13 resistors, and 6 electrolytic capacitors onto double-sided PCBs that slot together into a freestanding tree.',
        'Built two identical three-transistor ring oscillators in which 4.7 kΩ base resistors and 47 µF coupling capacitors set the timing that switches three groups of six LEDs on and off in a rotating sequence.',
        'Slotted the two tree boards together crosswise and mounted them on a base board with a self-locking power switch, a 3.5 mm DC jack for 5 V USB power, and a 4.5 V 3xAA battery holder.'
      ],
      parts: [
        ['S9014 NPN transistors (Q1-Q3 on each tree board)', 'Each one switches a group of six LEDs on and off. The three are wired in a ring, so a transistor turning on briefly shuts off the next one, which passes the flash around the tree.'],
        ['47 µF 16 V electrolytic capacitors (C1-C3)', 'Link each transistor to the next one in the ring. The time a capacitor takes to recharge is how long the next transistor stays off, so these set the speed of the pattern.'],
        ['4.7 kΩ base resistors (R1, R3, R5)', 'Feed a small current into each transistor’s base and recharge the capacitors. With the 47 µF capacitors they give a time constant of about 0.22 s, which sets the flash rate.'],
        ['100 Ω resistors (R2, R4, R6)', 'Each one sits between a group of six LEDs and its transistor and limits the current through the group, so neither the LEDs nor the transistor are overloaded.'],
        ['37 LEDs (D1-D18 on each board, D19 on top)', 'Red, yellow and green 3 mm LEDs. Each tree board holds 18 in three groups of six, one color per group, and each group shares one transistor, which is what creates the chasing pattern. Board B has the colors shifted one group over from board A.'],
        ['Top LED D19 with 4.7 kΩ resistor R7', 'A red LED on board A wired from the supply through its own resistor to ground instead of through a transistor, so the light on top stays on while the rest of the tree flashes.'],
        ['5.8 mm self-locking push switch (S1)', 'Turns the whole tree on and off from the base.'],
        ['3.5 mm DC jack (J1) and USB cable', 'Lets the tree run from any 5 V USB port.'],
        ['3xAA battery holder', 'Supplies 4.5 V for cordless use. It mounts under the base with two 8 mm M2 screws and nuts.'],
        ['Three PCBs (A, B and C)', 'A and B are the two halves of the tree and slot together crosswise to make it 3D. C is the base that carries the power, the switch and both halves.']
      ]
    },
    {
      k: 'vex', title: 'Disc-Golf Launcher', name: 'VEX Disc-Golf Launch Robot',
      kicker: 'Closed-loop flywheel robot',
      org: 'VEX Robotics · Technology Student Association', loc: 'Martinez, GA', date: 'Fall 2022', place: '2nd at Georgia state',
      skills: ['VEXcode', 'Closed-loop RPM control', 'Quadrature encoder', 'Motor wiring', 'VEX Motor Controller 29'],
      sum: 'Flywheel launcher subsystem for a disc-golf robot, using encoder feedback for consistent long-range shots.',
      imgs: ['vex-arena', 'vex-spin-up'],
      bullets: [
        'Designed and wired a disc-golf robot’s flywheel launcher subsystem, driving 2 393 motors through VEX Motor Controller 29s from a 7.2V NiMH battery pack to generate consistent long-range disc launch velocity and accurate, repeatable launches.',
        'Programmed flywheel speed control in VEXcode using a quadrature shaft encoder for closed-loop RPM feedback, reducing shot-distance variance and contributing to a 2nd-place finish at the Georgia state competition against teams from across the state of Georgia.'
      ]
    },
    {
      k: 'path', title: 'Accessible Pathway', name: 'Accessible Walking-Path Prototype',
      kicker: 'Recycled pathway slabs for trail access',
      org: 'STEAMIFY Engineering Competition · Augusta University', loc: 'Augusta, GA', date: 'Mar 2022', place: '1st place', team: 'Team of 2',
      skills: ['Fusion 360', 'Concrete casting', 'Recycled materials', 'Fabrication', 'Hand tools'],
      sum: 'Walking-path prototype for Augusta’s Savannah River Trail, cast from concrete mixed with recycled polystyrene trays.',
      imgs: ['pathway-fence', 'pathway-concrete'],
      bullets: [
        'Collaborated on a team of 2 to engineer an accessible walking-path prototype for Augusta’s Savannah River Trail, fabricating pathway slabs by combining concrete with recycled polystyrene cafeteria lunch trays to create a durable, mobility-friendly surface.',
        'Used Fusion 360 to model an integrated emergency-kit enclosure and constructed a supporting wooden fence structure with hand tools to incorporate the kit alongside the pathway.',
        'Combined recycled materials and hands-on fabrication to develop a practical trail-safety solution for elderly and mobility-limited visitors, earning 1st place in the STEAMIFY Engineering Competition at Augusta University.'
      ]
    }
  ];

  const WORK = [
    {
      logo: 'uga-engineering', dark: true, k: 'ra', t: 'Undergraduate Research Assistant', o: 'AI in Engineering · UGA Cultivate Lab', p: 'Athens, GA', d: 'Oct 2026 - Present',
      bullets: [
        'Conducting undergraduate research under Dr. Sarah Jane Bork at UGA’s Cultivate Lab to advance AI integration in electrical and computer engineering education through curriculum development.',
        'Leading part of the redesign of the ECSE 1100 (Intro to Electrical & Computer Systems) course aiming to strengthen AI literacy and problem-solving skills for a potential 350+ students annually.',
        'Collaborating with 2 undergraduate researchers to redesign 3 lectures, 2 laboratory assignments, and the semester project, while developing pre- and post-assessments to evaluate changes in student competencies and interests.'
      ]
    },
    {
      logo: 'schoolhouse', k: 'sat', t: 'SAT Tutor', o: 'Independent / Schoolhouse.world (Khan Academy)', p: 'Remote', d: '2025 - Present',
      bullets: [
        'Independently tutor students in SAT preparation while also tutoring through Schoolhouse.world, a free online learning platform founded by Sal Khan of Khan Academy.',
        'Provide personalized instruction in math and reading, focusing on problem-solving strategies and areas for improvement.',
        'Helped one student improve their SAT score from 1100 to 1300 in one month.'
      ]
    },
    {
      logo: 'the-groundsman', k: 'gr', t: 'Groundskeeping Crew', o: 'The Groundsman, The Masters Tournament', p: 'Augusta, GA', d: 'Apr 2026',
      bullets: [
        'Operated golf carts and transported equipment throughout the course during the annual Masters Tournament, supporting daily grounds and event operations.',
        'Collaborated with a team in a fast-paced environment, using strong communication, reliability, and time management to keep operations running efficiently.',
        'Dedicated over 100 hours across a demanding seven-day workweek, contributing to the logistics and groundskeeping operations of one of the world’s premier sporting events.'
      ]
    }
  ];

  const EDU = [
    {
      logo: 'uga', k: 'uga', t: 'University of Georgia', o: 'B.S. Electrical & Electronics Engineering', p: 'Athens, GA', d: 'Aug 2026 - Dec 2029',
      bullets: [
        'College of Engineering, Bachelor of Science in Electrical and Electronics Engineering.',
        'Relevant coursework: Physics, Intro to Electrical & Computer Systems Engineering, Biometric Systems.',
        'Activities and societies: UGA Institute of Electrical and Electronics Engineers (IEEE), First-Year Council.'
      ]
    },
    {
      logo: 'lakeside-high-school', k: 'lhs', t: 'Lakeside High School', o: 'High School Diploma', p: 'Martinez, GA', d: 'Aug 2022 - May 2026',
      bullets: [
        'Investment Club (Founder & President), Muslim Student Association (Officer), Technology Student Association (VEX Robotics), CyberPatriot, Future Problem Solving International, Future Business Leaders of America (FBLA), National Honor Society, National Technical Honor Society, Rho Kappa.'
      ]
    }
  ];

  const CERTS = [
    { t: 'DEC x University of Georgia AI Literacy for All', o: 'Digital Education Council · Credential ID trkyk6kuhm', p: 'Certificate', d: 'Oct 2026', logo: 'digital-education-council' },
    { t: 'Google AI Professional Certificate', o: 'Google', p: 'Certificate', d: 'Oct 2026', logo: 'google' },
    { t: 'Cyber Security: Beginner to Expert', o: 'Udemy', p: 'Course', d: '2023', logo: 'cybersecurity-course', dark: true }
  ];

  const ORGS = [
    {
      k: 'ieee', t: 'IEEE', role: 'First-Year Council', d: 'Sep 2026 - Present', tag: 'UGA', logo: 'uga-ieee',
      p: 'Designing AgriGuard with a team of first-year engineers.',
      name: 'IEEE First-Year Council', meta: 'Sep 2026 - Present · UGA College of Engineering',
      bullets: [
        'Collaborating with a team of first-year engineering students to design and develop a technical project addressing a real-world problem.',
        'Contributing to AgriGuard, an autonomous pest-deterrent system integrating computer vision, sensors, embedded systems, and motor control.',
        'Applying engineering principles through hands-on prototyping, testing, and system integration.'
      ]
    },
    {
      k: 'cp', t: 'CyberPatriot', role: 'Team Captain · Platinum Tier', d: '2020 - 2026', tag: 'AFA', logo: 'cyberpatriot',
      p: 'The Air & Space Forces Association’s national youth cyber defense competition.',
      name: 'AFA CyberPatriot', meta: 'Team Captain · Lakeside High & Stallings Island Middle School · Martinez, GA · 2020 - 2026',
      bullets: [
        'Captained teams in the Air & Space Forces Association’s CyberPatriot National Youth Cyber Education Program.',
        'Achieved Platinum Tier all six years, ranking in the top 30% at State by securing Windows and Linux systems and analyzing network traffic with Wireshark in timed, multi-round team competitions.',
        'Built hands-on experience in system hardening, networking, threat analysis, and scripting in Batch, PowerShell and Bash.'
      ]
    },
    {
      k: 'fps', t: 'Future Problem Solving', role: 'Team Captain', d: '2019 - 2026', tag: 'FPSPI', logo: 'future-problem-solving',
      p: 'A worldwide competition where teams solve future global issues.',
      name: 'Future Problem Solving', meta: 'Team Captain · Sep 2019 - May 2026',
      bullets: [
        'Captained the team to 2nd place in Global Issues at the 2026 State Competition, reframing AI-based classroom surveillance into a supportive, student-facing study tool.',
        'Competed at the 2026 Future Problem Solving International Conference after qualifying at the state level, while also judging local mock competitions.',
        'First competed in 2019, qualifying for the International Conference at UMass Amherst and placing Top 20 among nearly 2,000 students from over 14 countries.'
      ]
    },
    {
      k: 'wh', t: 'Wharton Global Youth', role: 'Founder & President', d: '2024 - 2026', tag: 'Investment Club', logo: 'wharton-global-youth',
      p: 'Founded Lakeside’s investment club for the Wharton investing competition and grew it to 80 members.',
      name: 'Wharton Global Youth Program', meta: 'Founder & President, Lakeside High School Chapter · Sep 2024 - May 2026',
      bullets: [
        'Founded and led the Lakeside High School Investment Club to compete in the Wharton Global High School Investment Competition, hosted by the Wharton School at the University of Pennsylvania, with nearly 2,000 teams worldwide.',
        'Grew the club to 80 members and organized 60 students across 10 teams to analyze markets, develop investment strategies, and manage virtual portfolios.',
        'Led weekly meetings and mentored members on investing, portfolio management, and financial analysis.'
      ]
    }
  ];

  const GALLERY = [
    { img: 'credit-scoring-group', cap: ['KSU Fintech Hackathon', 'Mar 2026'], x: 5, y: 2, w: 31, ar: 2.17, s: .14, cls: 'm-wide' },
    { quote: 'Scientists study the world as it is; engineers create the world that <em>has never been.</em>', by: 'Theodore von Kármán', x: 42, y: 5, w: 22, s: -.08 },
    { img: 'vex-arena', cap: ['VEX Robotics · Spin Up', '2022'], x: 70, y: 2, w: 22, ar: 1.48, s: .2, mono: true },
    { img: 'pathway-fence', cap: ['STEAMIFY · 1st place', 'Mar 2022'], x: 9, y: 24, w: 30, ar: 1.43, s: -.1, cls: 'm-wide' },
    { img: 'ieee-first-year-council', cap: ['IEEE First-Year Council', '2026'], x: 50, y: 25, w: 29, ar: 1.465, s: .16 },
    { img: 'credit-scoring-hackathon', cap: ['Building Mezan', 'KSU · 2026'], x: 3, y: 46, w: 25, ar: 2.17, s: .08, mono: true },
    { img: 'driveable-team', cap: ['UGAHacks CADathon', 'Oct 2026'], x: 33, y: 47, w: 25, ar: 1.5, s: -.12 },
    { img: 'pathway-concrete', cap: ['Recycled-tray concrete', '2022'], x: 66, y: 46, w: 22, ar: 1.43, s: .18, mono: true },
    { img: 'cadathon-paper-airplanes', cap: ['UGAHacks CADathon · Paper airplane contest', 'Oct 2026'], x: 10, y: 64, w: 26, ar: 1.5, s: -.08 },
    { img: 'credit-scoring-award', cap: ['2nd of 40 teams', 'Mar 2026'], x: 50, y: 69, w: 31, ar: 2.17, s: .12, cls: 'm-wide' }
  ];

  const KEYWORDS = [
    'Embedded Systems · Computer Vision ·',
    'Circuit Design · Robotics · Motor Control ·',
    'Python · OpenCV · Raspberry Pi ·',
    'Sensors · PCB Layout · Multisim ·',
    'Fusion 360 · Wireshark · Cybersecurity ·'
  ];
  const BAND = ['Python', 'OpenCV', 'Raspberry Pi', 'Arduino', 'PCB layout', 'Multisim', 'Fusion 360', 'I2C · PWM · SPI', 'Oscilloscopes', 'Wireshark', 'DeepFace', 'Flask'];

  // resistor, capacitor, diode, inductor, battery, ground
  const SYM = [
    'M0 12h9l3-7 4 14 4-14 4 14 4-14 4 14 3-7h9',
    'M0 12h20M20 3v18M28 3v18M28 12h20',
    'M0 12h15M15 4v16l17-8zM32 4v16M32 12h16',
    'M0 12h8a5 5 0 0 1 10 0a5 5 0 0 1 10 0a5 5 0 0 1 10 0h10',
    'M0 12h17M17 3v18M23 7v10M29 3v18M35 7v10M35 12h13',
    'M24 1v9M12 10h24M16 15h16M20 20h8'
  ];
  // bold numbers in text, but not years or part numbers
  const boldNums = html => html.replace(/(<[^>]+>)|([^<]+)/g, (m, tag, text) => tag || text.replace(/\$?\d+(?:,\d{3})*(?:\.\d+)?(?:\+|%|st|nd|rd|th|K)?/g, (n, i, s) => {
    const before = s.slice(0, i), after = s.slice(i + n.length);
    if (/[\w./-]$/.test(before) || /^\w/.test(after)) return n;
    if (/^(19|20)\d\d$/.test(n)) return n;
    if (/(ECSE|Fusion|Controller) $/.test(before) || /^ (motors|Hours of)/.test(after)) return n;
    return `<b>${n}</b>`;
  }));

  const sym = i => `<svg class="sym" viewBox="0 0 48 24" aria-hidden="true"><path d="${SYM[i % SYM.length]}"/></svg>`;

  $('#heroRows').innerHTML = KEYWORDS.map((t, i) => `<div class="row ${i % 2 ? 'row--sans' : 'row--alt'}">${`<span>${t}</span>`.repeat(5)}</div>`).join('');
  const bandHTML = BAND.map((t, i) => `<span>${t} ${sym(i)}</span>`).join('');
  $('#band').innerHTML = bandHTML + bandHTML;

  $('#galleryInner').innerHTML = GALLERY.map(g => {
    const pos = `--x:${g.x}%;--y:${g.y}%;--w:${g.w}vw`;
    if (g.quote) return `<blockquote class="g-quote" data-speed="${g.s}" style="${pos}"><p>${g.quote}</p><small>${g.by}</small></blockquote>`;
    return `<figure class="g-item ${g.mono ? 'is-mono' : ''} ${g.cls || ''}" data-speed="${g.s}" style="${pos};--ar:${g.ar}"><figcaption><span>${g.cap[0]}</span><span>${g.cap[1]}</span></figcaption><div class="ph"><img src="${IMG(g.img)}" alt="${g.cap[0]}" loading="lazy" decoding="async"></div></figure>`;
  }).join('');

  $('#workTrack').insertAdjacentHTML('beforeend', PROJECTS.map((p, i) => `
    <article class="proj" data-k="${p.k}">
      <div class="proj__media">
        <div class="proj__reel">${p.imgs.map((n, j) => `<img class="slide${j ? '' : ' is-on'}${p.fit === 'contain' ? ' is-render' : ''}" src="${IMG(n)}" alt="${p.name}, photo ${j + 1}" ${i > 1 ? 'loading="lazy"' : ''} decoding="async">`).join('')}</div>
        <span class="proj__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        ${p.imgs.length > 1 ? `<div class="proj__dots" aria-hidden="true">${p.imgs.map((_, j) => `<i class="${j ? '' : 'is-on'}"></i>`).join('')}</div>
        <div class="proj__nav"><button class="prev" aria-label="Previous photo"><svg viewBox="0 0 16 16"><path d="M13 8H3m0 0 4.5-4.5M3 8l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="next" aria-label="Next photo">${ARROW}</button></div>` : ''}
      </div>
      <div class="proj__body">
        <div class="proj__meta"><span>${p.org}</span><span>${p.date}</span></div>
        <h3 class="proj__title">${p.title}</h3>
        <p class="proj__kicker">${p.kicker}</p>
        <p class="proj__sum">${boldNums(p.sum)}</p>
        <dl class="proj__specs">
          ${p.place ? `<div class="spec"><dt>Place</dt><dd class="spec__place">${p.place}</dd></div>` : ''}
          ${p.next ? `<div class="spec"><dt>Up next</dt><dd class="spec__place">${p.next}</dd></div>` : ''}
          <div class="spec"><dt>Skills</dt><dd><ul class="proj__skills">${p.skills.map(s => `<li>${s}</li>`).join('')}</ul></dd></div>
        </dl>
        <button class="btn btn--solid proj__more" data-open="${p.k}"><span>Details</span><i>${ARROW}</i></button>
      </div>
    </article>`).join(''));

  const xrow = (r, open = true) => {
    const logo = r.logo ? `<span class="xrow__logo${r.dark ? ' is-dark' : ''}"><img src="assets/logos/${r.logo}.png" alt="" loading="lazy"></span>` : '';
    const inner = `<span class="xrow__date">${r.d}</span><span class="xrow__main${logo ? ' has-logo' : ''}">${logo}<span><span class="xrow__t">${r.t}</span><span class="xrow__o">${r.o}</span></span></span><span class="xrow__p">${r.p}</span>`;
    return open
      ? `<button class="xrow" data-open="${r.k}">${inner}<span class="xrow__a">${ARROW}</span></button>`
      : `<div class="xrow">${inner}<span></span></div>`;
  };
  $('#xpWork').innerHTML = WORK.map(r => xrow(r)).join('');
  $('#xpEdu').innerHTML = EDU.map(r => xrow(r)).join('');
  $('#xpCert').innerHTML = CERTS.map(r => xrow(r, false)).join('');

  $('#orgGrid').innerHTML = ORGS.map(o => `
    <button class="org" data-open="${o.k}">
      <div class="org__top"><span>${o.tag}</span><span>${o.d}</span></div>
      <div class="org__art"><img src="assets/logos/${o.logo}.png" alt="${o.name} logo" loading="lazy"></div>
      <div class="org__name">${o.t}</div>
      <div class="org__role">${o.role}</div>
      <p class="org__p">${boldNums(o.p)}</p>
      <div class="org__more"><span>Details</span><i>→</i></div>
    </button>`).join('');

  // circuit board background tile
  const PCB = (() => {
    const S = 1024, K = 2, g = 16, N = S / g;
    let seed = 2029;
    const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const ri = (a, b) => a + (rnd() * (b - a + 1) | 0);
    const occ = new Uint8Array(N * N);
    const I = (x, y) => (((y % N) + N) % N) * N + (((x % N) + N) % N);
    const free = (x, y) => !occ[I(x, y)];
    const mark = (x, y) => { occ[I(x, y)] = 1; };
    const D = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
    const traces = [], vias = [], pads = [], chips = [], parts = [];

    const walk = (pts, d, n) => {
      let [x, y] = pts[pts.length - 1], moved = 0;
      for (let i = 0; i < n; i++) {
        const nx = x + D[d][0], ny = y + D[d][1];
        if (!free(nx, ny)) break;
        if (d % 2 && !free(nx, y) && !free(x, ny)) break;
        x = nx; y = ny; mark(x, y); moved++;
      }
      if (moved) pts.push([x, y]);
      return moved;
    };
    const areaFree = (x, y, w, h) => {
      for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (!free(i, j)) return false;
      return true;
    };

    // chips
    for (let c = 0; c < 7; c++) {
      const w = ri(4, 8), h = ri(3, 5);
      for (let tries = 0; tries < 40; tries++) {
        const cx = ri(0, N - 1), cy = ri(0, N - 1);
        if (!areaFree(cx - 1, cy - 5, w + 3, h + 11)) continue;
        for (let j = 0; j <= h; j++) for (let i = 0; i <= w; i++) mark(cx + i, cy + j);
        chips.push({ cx, cy, w, h });
        const n = w - 1, dl = ri(2, 4);
        [[cy, 6, rnd() < .5 ? 5 : 7], [cy + h, 2, rnd() < .5 ? 3 : 1]].forEach(([py, dir, turn]) => {
          const leftFirst = turn === 5 || turn === 3;
          for (let k = 0; k < n; k++) {
            const px = cx + 1 + k, i = leftFirst ? k : n - 1 - k;
            pads.push([px, py + (dir === 6 ? -.5 : .5), 'pin']);
            const pts = [[px, py]];
            walk(pts, dir, 1 + i); walk(pts, turn, dl); walk(pts, dir, ri(2, 9));
            if (pts.length > 1) { traces.push(pts); vias.push(pts[pts.length - 1]); }
          }
        });
        break;
      }
    }
    // smd resistors and caps
    for (let c = 0; c < 16; c++) {
      const x = ri(0, N - 1), y = ri(0, N - 1), hz = rnd() < .6;
      if (!areaFree(x - 1, y - 1, hz ? 5 : 3, hz ? 3 : 5)) continue;
      const a = [x, y], b = hz ? [x + 2, y] : [x, y + 2];
      mark(...a); mark(...b); mark(hz ? x + 1 : x, hz ? y : y + 1);
      parts.push([a, b, hz]);
      [[a, hz ? 4 : 6], [b, hz ? 0 : 2]].forEach(([p, d]) => {
        const pts = [p.slice()];
        walk(pts, d, ri(2, 6)); walk(pts, (d + (rnd() < .5 ? 1 : 7)) % 8, ri(2, 5)); walk(pts, d, ri(1, 6));
        if (pts.length > 1) { traces.push(pts); vias.push(pts[pts.length - 1]); }
      });
    }
    for (let t = 0; t < 260; t++) {
      const x = ri(0, N - 1), y = ri(0, N - 1);
      if (!free(x, y)) continue;
      mark(x, y);
      const pts = [[x, y]];
      let d = ri(0, 3) * 2;
      const segs = ri(2, 5);
      for (let s = 0; s < segs; s++) {
        if (!walk(pts, d, ri(2, 10))) break;
        d = (d + (rnd() < .5 ? 1 : 7)) % 8;
      }
      if (pts.length > 1) {
        traces.push(pts);
        vias.push(pts[pts.length - 1]);
        if (rnd() < .45) pads.push([pts[0][0], pts[0][1], 'sq']); else vias.push(pts[0]);
      }
    }

    // traces and pads are drawn on separate layers so they can be colored differently
    const layer = () => {
      const c = document.createElement('canvas');
      c.width = c.height = S * K;
      const x = c.getContext('2d');
      x.strokeStyle = x.fillStyle = '#fff';
      x.lineCap = 'round';
      x.lineJoin = 'round';
      return [c, x];
    };
    const [tCv, t] = layer(), [pCv, pc] = layer();
    const P = v => (v + .5) * g;
    // draw 3x3 copies so the tile wraps cleanly
    for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
      t.setTransform(K, 0, 0, K, ox * S * K, oy * S * K);
      pc.setTransform(K, 0, 0, K, ox * S * K, oy * S * K);
      t.lineWidth = 1.7;
      t.beginPath();
      traces.forEach(pts => { t.moveTo(P(pts[0][0]), P(pts[0][1])); for (let i = 1; i < pts.length; i++) t.lineTo(P(pts[i][0]), P(pts[i][1])); });
      t.stroke();
      pc.lineWidth = 2;
      pc.beginPath();
      vias.forEach(([x, y]) => { pc.moveTo(P(x) + 3.6, P(y)); pc.arc(P(x), P(y), 3.6, 0, Math.PI * 2); });
      pc.stroke();
      pads.forEach(([x, y, k]) => { const s = k === 'pin' ? [5, 7] : [7, 7]; pc.fillRect(P(x) - s[0] / 2, P(y) - s[1] / 2, s[0], s[1]); });
      chips.forEach(({ cx, cy, w, h }) => {
        t.lineWidth = 1.5;
        t.strokeRect(P(cx) + 2, P(cy) + 2, w * g - 4, h * g - 4);
        t.globalAlpha = .22;
        t.fillRect(P(cx) + 2, P(cy) + 2, w * g - 4, h * g - 4);
        t.globalAlpha = 1;
        t.beginPath(); t.arc(P(cx) + 9, P(cy) + 9, 2.4, 0, Math.PI * 2); t.fill();
      });
      parts.forEach(([a, b, hz]) => {
        pc.fillRect(P(a[0]) - 4, P(a[1]) - 4, 8, 8);
        pc.fillRect(P(b[0]) - 4, P(b[1]) - 4, 8, 8);
        t.lineWidth = 1.2;
        if (hz) t.strokeRect(P(a[0]) - 6, P(a[1]) - 6.5, 2 * g + 12, 13);
        else t.strokeRect(P(a[0]) - 6.5, P(a[1]) - 6, 13, 2 * g + 12);
      });
    }
    const root = document.documentElement.style;
    root.setProperty('--pcb', `url(${tCv.toDataURL('image/png')})`);
    root.setProperty('--pcb-pads', `url(${pCv.toDataURL('image/png')})`);
    return { traces: tCv, pads: pCv };
  })();

  function splitWords(root) {
    const out = [];
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(p => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            const inner = document.createElement('span');
            w.className = 'w';
            inner.textContent = p;
            w.appendChild(inner);
            out.push(inner);
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(root);
    return out;
  }

  let hero = null;
  try { hero = window.HeroGL && HeroGL.create($('#heroGL'), { portrait: 'assets/headshot.webp', host: $('#hero'), traces: PCB.traces, pads: PCB.pads, tile: 1024 }); }
  catch (e) { console.warn(e); }
  if (!hero) document.documentElement.classList.add('no-gl');

  const hasGsap = !!window.gsap;
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: .095, smoothWheel: true });
    if (hasGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const loop = t => { lenis.raf(t); requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    }
    lenis.stop();
  }

  // pinned sections live inside a .pin-spacer, so scroll to that instead
  const scrollTarget = el => el.parentElement && el.parentElement.classList.contains('pin-spacer') ? el.parentElement : el;
  const scrollToEl = sel => {
    const el = typeof sel === 'string' ? $(sel) : sel;
    if (!el) return;
    const t = scrollTarget(el);
    if (lenis) lenis.scrollTo(t, { duration: 1.6, easing: x => 1 - Math.pow(1 - x, 4) });
    else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  // menu
  const menu = $('#menu'), menuBtn = $('#menuBtn'), hdr = $('#hdr');
  let menuOpen = false;
  function setMenu(open) {
    if (open === menuOpen) return;
    menuOpen = open;
    document.body.classList.toggle('is-menu', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', !open);
    updHdr();
    if (!hasGsap) {
      menu.style.visibility = open ? 'visible' : 'hidden';
      menu.style.clipPath = open ? 'inset(0)' : '';
      return;
    }
    if (open) {
      lenis && lenis.stop();
      gsap.set(menu, { visibility: 'visible' });
      gsap.fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .9, ease: 'expo.inOut' });
      gsap.fromTo($$('.menu__links a', menu), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: .06, delay: .35 });
      gsap.fromTo('.menu__foot', { opacity: 0 }, { opacity: 1, duration: .8, delay: .6 });
    } else {
      gsap.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: .8, ease: 'expo.inOut', onComplete: () => gsap.set(menu, { visibility: 'hidden' }) });
      lenis && lenis.start();
    }
  }
  menuBtn.addEventListener('click', () => setMenu(!menuOpen));

  // power button turns the lights off and back on
  const power = $('#powerBtn'), page = document.documentElement;
  let wakeTimer = 0;
  power.addEventListener('click', () => {
    const off = !page.classList.contains('is-off');
    clearTimeout(wakeTimer);
    page.classList.toggle('is-off', off);
    page.classList.toggle('is-waking', !off);
    if (!off) wakeTimer = setTimeout(() => page.classList.remove('is-waking'), 700);
    power.setAttribute('aria-pressed', off);
    power.setAttribute('aria-label', off ? 'Turn the lights on' : 'Turn the lights off');
  });

  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-scroll]');
    if (!a) return;
    e.preventDefault();
    const href = a.getAttribute('href');
    const go = () => scrollToEl(href === '#top' ? document.body : href);
    if (menuOpen) { setMenu(false); setTimeout(go, 450); } else go();
  });

  // details drawer
  const drawer = $('#drawer'), panel = $('#drawerPanel');
  const DETAILS = {};
  PROJECTS.forEach(p => DETAILS[p.k] = {
    kicker: p.place ? 'Project · ' + p.place : 'Project', title: p.title, meta: [p.org, p.loc, p.date, p.team].filter(Boolean).join(' · '),
    bullets: p.bullets, parts: p.parts, circuit: p.circuit, imgs: [...p.imgs, ...(p.more || [])], fit: p.fit, links: p.links, skills: p.skills
  });
  WORK.forEach(r => DETAILS[r.k] = { kicker: 'Experience', title: r.t, meta: [r.o, r.p, r.d].join(' · '), bullets: r.bullets });
  EDU.forEach(r => DETAILS[r.k] = { kicker: 'Education', title: r.t, meta: [r.o, r.p, r.d].join(' · '), bullets: r.bullets });
  ORGS.forEach(o => DETAILS[o.k] = { kicker: 'Leadership · ' + o.role, title: o.name, meta: o.meta, bullets: o.bullets });
  let lastFocus = null, drawerOpen = false;
  const isPhone = () => matchMedia('(max-width: 600px)').matches;

  function openDrawer(k) {
    const d = DETAILS[k];
    if (!d) return;
    lastFocus = document.activeElement;
    $('#dKicker').textContent = d.kicker;
    $('#dTitle').innerHTML = d.title;
    $('#dMeta').textContent = d.meta;
    $('#dList').innerHTML = d.bullets.map(b => `<li>${boldNums(b)}</li>`).join('');
    $('#dLinks').innerHTML = (d.links || []).map(([l, h]) => `<a class="btn btn--solid" href="${h}" target="_blank" rel="noopener"><span>${l}</span><i>↗</i></a>`).join('');
    $('#dMedia').innerHTML = (d.imgs || []).map(n => `<img src="${IMG(n)}" alt="" loading="lazy"${d.fit === 'contain' ? ' class="is-render"' : ''}>`).join('');
    const circuit = d.circuit ? `assets/photos/${d.circuit}.png` : '';
    $('#dParts').innerHTML = (circuit ? `<p class="label">Circuit</p><a class="drawer__circuit" href="${circuit}" target="_blank" rel="noopener"><img src="${circuit}" alt="Circuit diagram of tree board A" loading="lazy"></a><p class="drawer__note">Tree board A. Board B is the same circuit without D19 and R7.</p>` : '') +
      (d.parts ? '<p class="label">Parts and what they do</p><dl>' + d.parts.map(([n, r]) => `<div><dt>${n}</dt><dd>${boldNums(r)}</dd></div>`).join('') + '</dl>' : '');
    $('#dTags').textContent = d.skills ? 'Skills: ' + d.skills.join(' · ') : '';
    panel.scrollTop = 0;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    drawerOpen = true;
    lenis && lenis.stop();
    if (hasGsap) {
      gsap.to('#drawerBg', { opacity: 1, duration: .6, ease: 'power2.out' });
      gsap.fromTo(panel, isPhone() ? { yPercent: 110, xPercent: 0 } : { xPercent: 110, yPercent: 0 }, { xPercent: 0, yPercent: 0, duration: .9, ease: 'expo.out' });
      gsap.fromTo($$('.drawer__panel > *:not(.drawer__close)'), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'expo.out', stagger: .05, delay: .15 });
    } else {
      $('#drawerBg').style.opacity = 1;
    }
    setTimeout(() => $('#drawerClose').focus({ preventScroll: true }), 50);
  }
  function closeDrawer() {
    if (!drawerOpen) return;
    drawerOpen = false;
    const done = () => {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      lastFocus && lastFocus.focus({ preventScroll: true });
    };
    if (hasGsap) {
      gsap.to('#drawerBg', { opacity: 0, duration: .5 });
      gsap.to(panel, { ...(isPhone() ? { yPercent: 110 } : { xPercent: 110 }), duration: .7, ease: 'expo.inOut', onComplete: done });
    } else done();
    lenis && !menuOpen && lenis.start();
  }
  document.addEventListener('click', e => { const b = e.target.closest('[data-open]'); if (b) openDrawer(b.dataset.open); });
  $('#drawerClose').addEventListener('click', closeDrawer);
  $('#drawerBg').addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (drawerOpen) closeDrawer(); else if (menuOpen) setMenu(false); }
    if (e.key === 'Tab' && drawerOpen) {
      const f = $$('button, a[href]', panel);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  // project slideshows
  const SLIDE_MS = 3600, HOLD_MS = 10000;
  const carousels = $$('.proj').map(card => {
    const slides = $$('.slide', card), dots = $$('.proj__dots i', card), media = $('.proj__media', card);
    if (slides.length < 2) return null;
    const c = { card, i: 0, next: 0 };
    c.go = n => {
      slides[c.i].classList.remove('is-on'); dots[c.i] && dots[c.i].classList.remove('is-on');
      c.i = (n + slides.length) % slides.length;
      slides[c.i].classList.add('is-on'); dots[c.i] && dots[c.i].classList.add('is-on');
    };
    const touched = step => { c.go(c.i + step); c.next = Date.now() + HOLD_MS; };
    $('.prev', card).addEventListener('click', () => touched(-1));
    $('.next', card).addEventListener('click', () => touched(1));
    let startX = null;
    media.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') startX = e.clientX; });
    media.addEventListener('pointercancel', () => { startX = null; });
    media.addEventListener('pointerup', e => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) touched(dx < 0 ? 1 : -1);
    });
    return c;
  }).filter(Boolean);
  // auto-advance the slideshow that is on screen
  setInterval(() => {
    const now = Date.now();
    carousels.forEach(c => {
      const r = c.card.getBoundingClientRect();
      const seen = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) / (r.width * r.height || 1);
      if (seen < .05) { if (c.i) c.go(0); c.next = 0; return; }
      if (seen < .35 || reduce || document.hidden || drawerOpen) return;
      if (!c.next) c.next = now + SLIDE_MS;
      else if (now >= c.next) { c.go(c.i + 1); c.next = now + SLIDE_MS; }
    });
  }, 250);

  // scroll progress rail
  const RAIL = [['#about', 'About'], ['#projects', 'Projects'], ['#experience', 'Experience'], ['#leadership', 'Leadership'], ['#contact', 'Contact']];
  const rail = $('#rail');
  rail.innerHTML = '<i class="rail__track"></i><i class="rail__fill" id="railFill"></i><i class="rail__head" id="railHead"></i>' +
    RAIL.map(([h, l], i) => `<a class="rail__pad" href="${h}" data-scroll aria-label="${l}"><i></i><span>${String(i + 1).padStart(2, '0')} · ${l}</span></a>`).join('');
  const railPads = $$('.rail__pad', rail), railFill = $('#railFill'), railHead = $('#railHead');
  let railMax = 1;
  function updRail() {
    const f = Math.min(1, Math.max(0, scrollY / railMax));
    railFill.style.transform = `scaleY(${f})`;
    railHead.style.top = (f * 100) + '%';
    railPads.forEach(p => p.classList.toggle('is-on', f >= (p._f || 0) - .002));
  }
  function layoutRail() {
    railMax = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    railPads.forEach((pad, i) => {
      const t = scrollTarget($(RAIL[i][0]));
      pad._f = Math.min(1, Math.max(0, (t.getBoundingClientRect().top + scrollY) / railMax));
      pad.style.top = (pad._f * 100) + '%';
    });
    updRail();
  }
  addEventListener('load', layoutRail);
  addEventListener('resize', layoutRail);

  // match the header to the background behind it
  let hdrDark = false;
  function luminance(el) {
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const m = getComputedStyle(n).backgroundColor.match(/[\d.]+/g);
      if (m && (m.length < 4 || +m[3] > .5)) return (.299 * m[0] + .587 * m[1] + .114 * m[2]) / 255;
    }
    return 1;
  }
  function updHdr() {
    hdr.classList.toggle('is-dark', menuOpen || hdrDark);
    rail.classList.toggle('is-dark', hdrDark);
  }
  function checkHdr() {
    const el = document.elementsFromPoint(Math.min(56, innerWidth * .1), 44).find(e => !hdr.contains(e));
    hdrDark = el ? luminance(el) < .45 : false;
    updHdr();
  }
  let lastY = -1;
  (function loop() {
    if (scrollY !== lastY) { lastY = scrollY; checkHdr(); updRail(); }
    requestAnimationFrame(loop);
  })();
  addEventListener('resize', () => { lastY = -1; });

  if (!hasGsap) {
    $('#loader').remove();
    document.body.classList.remove('is-loading');
    if (hero) hero.ready.then(() => { hero.set('reveal', 1); hero.set('fade', 1); hero.start(); });
    $$('.sigwrap').forEach(s => s.style.setProperty('--p', 1));
    return;
  }

  const splits = new Map();
  $$('[data-split]').forEach(el => splits.set(el, splitWords(el)));
  const nameWords = splits.get($('.hero__name'));
  gsap.set($$('[data-fade]'), { opacity: 0, y: 14 });
  gsap.set(nameWords, { yPercent: 115 });

  // loader
  const loader = $('#loader');
  const minLoad = new Promise(r => setTimeout(r, reduce ? 0 : 1250));
  const assets = Promise.race([
    Promise.all([document.fonts ? document.fonts.ready : null, hero ? hero.ready.catch(() => null) : null]),
    new Promise(r => setTimeout(r, 4000))
  ]);
  if (!reduce) {
    gsap.to('#loaderBar', { scaleX: 1, duration: 1.2, ease: 'power2.inOut' });
  }

  Promise.all([minLoad, assets]).then(() => {
    ScrollTrigger.refresh();
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    if (!reduce) {
      tl.to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, 0)
        .fromTo('#heroGL', { scale: 1.08 }, { scale: 1, duration: 2 }, .35)
        .to(nameWords, { yPercent: 0, duration: 1.3, stagger: .08 }, .75)
        .to($$('[data-fade]'), { opacity: 1, y: 0, duration: 1.2, stagger: .08 }, 1)
        .fromTo('.hdr', { yPercent: -100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.2 }, .8);
    } else {
      gsap.set(nameWords, { yPercent: 0 });
      gsap.set($$('[data-fade]'), { opacity: 1, y: 0 });
    }
    tl.add(() => {
      loader.remove();
      document.body.classList.remove('is-loading');
      lenis && lenis.start();
      }, reduce ? 0 : 1.15);
    if (hero) {
      hero.start();
      setTimeout(() => hero.intro(reduce ? null : gsap), reduce ? 0 : 450);
    }
  });

  // hero photo shrinks into the signature card
  const heroInner = $('#heroInner'), heroSig = $('#heroSig');
  const shrink = { p: 0 };
  function cardBox() {
    const W = innerWidth, H = heroInner.offsetHeight;
    const cw = heroSig.offsetWidth / 1.4, ch = cw / 1.42;
    let ph, bottom;
    if (hero) { ph = hero.rect[3] * H; bottom = H * (1 + -hero.rect[1]); }
    else { const f = $('.hero__fallback'); ph = f.offsetHeight; bottom = f.offsetTop + ph; }
    const s = Math.min(1, Math.max(ch / (ph * .6), cw / W));
    return { W, H, cw, ch, s, cx: W / 2, cy: bottom - ph * .6 };
  }
  function applyShrink() {
    const b = cardBox(), p = shrink.p;
    if (!p) { heroInner.style.transform = heroInner.style.clipPath = ''; return; }
    const hw = b.cw / 2 / b.s, hh = b.ch / 2 / b.s;
    heroInner.style.transformOrigin = `${b.cx}px ${b.cy}px`;
    heroInner.style.transform = `translate3d(0, ${(b.H / 2 - b.cy) * p}px, 0) scale(${1 + (b.s - 1) * p})`;
    heroInner.style.clipPath = `inset(${(b.cy - hh) * p}px ${(b.W - b.cx - hw) * p}px ${(b.H - b.cy - hh) * p}px ${(b.cx - hw) * p}px round ${3 / b.s * p}px)`;
  }
  const rowW = el => el.scrollWidth;
  const heroTl = gsap.timeline({
    scrollTrigger: { trigger: '#hero', start: 'top top', end: () => '+=' + Math.round(innerHeight * 1.6), scrub: true, pin: true, anticipatePin: 1, invalidateOnRefresh: true, onRefresh: applyShrink }
  });
  $$('#heroRows .row').forEach((r, i) => {
    const a = [.06, .3, .12, .26, .02][i % 5], b = i % 2 ? a - .16 : a + .16;
    heroTl.fromTo(r, { x: () => -rowW(r) * a }, { x: () => -rowW(r) * b, ease: 'none', duration: 1 }, 0);
  });
  heroTl
    .to('#heroUi', { opacity: 0, y: -40, ease: 'none', duration: .12 }, 0)
    .to(shrink, { p: 1, ease: 'power2.inOut', duration: .42, onUpdate: applyShrink }, .04)
    .fromTo('#heroSig', { '--p': 0 }, { '--p': 1, ease: 'power1.inOut', duration: .36 }, .54);
  if (hero) heroTl.fromTo(hero.state, { grey: 0, fx: 1 }, { grey: 1, fx: 0, ease: 'none', duration: .3 }, .2);
  else heroTl.fromTo(heroInner, { filter: 'grayscale(0)' }, { filter: 'grayscale(1)', ease: 'none', duration: .3 }, .2);
  addEventListener('resize', applyShrink);

  splits.forEach((words, el) => {
    if (words === nameWords) return;
    gsap.fromTo(words, { yPercent: 115 }, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: .07, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });
  $$('[data-reveal]').forEach(el => {
    gsap.fromTo(el, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  // gallery
  const mm = gsap.matchMedia();
  const gallery = $('#gallery');
  $$('.g-item .ph').forEach(ph => {
    gsap.fromTo(ph, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.out', scrollTrigger: { trigger: ph, start: 'top 92%', once: true } });
    gsap.fromTo($('img', ph), { scale: 1.28, yPercent: -6 }, { scale: 1.06, yPercent: 6, ease: 'none', scrollTrigger: { trigger: ph, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  $$('.g-quote').forEach(q => gsap.fromTo(q, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: q, start: 'top 88%', once: true } }));
  mm.add('(min-width: 900px)', () => {
    $$('[data-speed]', gallery).forEach(el => {
      const s = parseFloat(el.dataset.speed) || 0;
      gsap.fromTo(el, { y: () => innerHeight * s * .45 }, { y: () => -innerHeight * s * .45, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
    });
  });

  // projects scroll sideways on desktop
  mm.add('(min-width: 900px)', () => {
    const track = $('#workTrack');
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    const tw = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: '#projects', start: 'top top', end: () => '+=' + Math.round(dist() * .5), scrub: true, pin: true, anticipatePin: 1, invalidateOnRefresh: true }
    });
    gsap.to('#workBar', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '#projects', start: 'top top', end: () => '+=' + Math.round(dist() * .5), scrub: true, invalidateOnRefresh: true } });
    $$('.proj').forEach(card => {
      gsap.fromTo($('.proj__reel', card), { xPercent: -5 }, { xPercent: 5, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } });
      gsap.fromTo($('.proj__num', card), { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, ease: 'expo.out', duration: 1.2, scrollTrigger: { trigger: card, containerAnimation: tw, start: 'left 75%', once: true } });
    });
  });
  mm.add('(max-width: 899px)', () => {
    $$('.proj').forEach(card => gsap.fromTo(card, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 90%', once: true } }));
  });

  $$('.xrow').forEach(r => gsap.fromTo(r, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: r, start: 'top 92%', once: true } }));

  $$('.org').forEach((o, i) => gsap.fromTo(o, { opacity: 0, y: 70 }, {
    opacity: 1, y: 0, duration: 1.3, delay: (i % 4) * .08, ease: 'expo.out',
    scrollTrigger: { trigger: o, start: 'top 90%', once: true }
  }));

  // skills band speeds up with scroll velocity
  const band = $('#band');
  let bandX = 0, vel = 0;
  gsap.ticker.add((t, dt) => {
    vel += ((lenis ? lenis.velocity : 0) - vel) * .1;
    const w = band.scrollWidth / 2;
    bandX -= (dt / 16.67) * (.9 + Math.abs(vel) * .35) * (vel < -.5 ? -1 : 1);
    if (bandX <= -w) bandX += w;
    if (bandX > 0) bandX -= w;
    band.style.transform = `translate3d(${bandX}px,0,0)`;
  });

  gsap.fromTo('#footSig', { '--p': 0 }, { '--p': 1, duration: 2.2, ease: 'power2.inOut', scrollTrigger: { trigger: '#footSig', start: 'top 80%', once: true } });

  ScrollTrigger.addEventListener('refresh', () => { lastY = -1; layoutRail(); });
  addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
