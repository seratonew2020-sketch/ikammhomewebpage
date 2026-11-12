export const LANGUAGES = [
  { code: 'th', label: 'ไทย', short: 'TH', flag: '🇹🇭' },
  { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧' },
  { code: 'zh', label: '中文', short: 'ZH', flag: '🇨🇳' },
]

export const I18N_DATA = {
  th: {
    brand: {
      name: 'iKamm Home Decor',
      subtitle: 'บทความไอเดียบิ้วอิน & ตกแต่งภายใน',
      pageTitle: 'iKamm Home Decor — บทความไอเดียออกแบบเฟอร์นิเจอร์บิ้วอิน & ตกแต่งภายใน',
    },
    nav: {
      articles: 'บทความ',
      compare: 'เปรียบเทียบวัสดุ',
      calculator: 'คำนวณวัสดุ',
      saved: 'ที่บันทึกไว้',
      openMenu: 'เปิดเมนู',
    },
    hero: {
      alt: 'งานออกแบบเฟอร์นิเจอร์บิ้วอินและตกแต่งภายใน iKamm Home Decor',
      badge: 'iKamm Home Decor • คลังบทความบิ้วอิน & ตกแต่งภายใน',
      title: 'บทความไอเดียออกแบบเฟอร์นิเจอร์บิ้วอิน & ตกแต่งภายในครบวงจร',
      desc: 'รวมเทคนิคออกแบบบิ้วอินสำหรับคอนโด บ้านเดี่ยว คลินิก และออฟฟิศ ตั้งแต่การเพิ่มพื้นที่เก็บของ สมาร์ทโฮม คิ้วสแตนเลส ไปจนถึงการเลือกวัสดุและฟิตติ้งที่ได้มาตรฐาน',
      featuredBtn: 'อ่านบทความแนะนำ (Day 1)',
      compareBtn: 'เทียบสเปกวัสดุ',
    },
    search: {
      placeholder: 'ค้นหาบทความ เช่น คอนโด Studio, Smart Home, Power Track, ตู้รองเท้า 360°, ครัว...',
      showingCount: (n) => `แสดง ${n} บทความ`,
      emptyTitle: 'ไม่พบบทความที่ตรงกับคำค้นหา',
      emptyDesc: 'ลองเปลี่ยนคำค้นหาหรือเลือกดูหมวดหมู่ทั้งหมด',
      resetBtn: 'แสดงบทความทั้งหมด',
      readArticle: 'อ่านบทความ',
      bookmarkAria: 'บันทึกบทความ',
    },
    categories: [
      { id: 'all', label: 'ทั้งหมด' },
      { id: 'structure', label: 'งานโครงสร้าง' },
      { id: 'wall', label: 'งานผนัง & อิฐ' },
      { id: 'roof', label: 'งานหลังคา' },
      { id: 'cement', label: 'ปูนซีเมนต์' },
      { id: 'rebar', label: 'เหล็กเสริม' },
    ],
    compare: {
      heading: 'เปรียบเทียบวัสดุก่อสร้างยอดนิยม',
      subheading: 'เลือกกลุ่มวัสดุเพื่อดูจุดเด่น ข้อจำกัด ความเหมาะสมกับงาน และคะแนนเปรียบเทียบ',
      tabs: {
        bricks: 'วัสดุก่อผนัง (อิฐ)',
        roofing: 'วัสดุมุงหลังคา',
        cement: 'ปูนซีเมนต์',
      },
      prosLabel: 'จุดเด่น:',
      consLabel: 'ข้อควรระวัง:',
      bestForLabel: 'เหมาะกับ:',
      scoreSuffix: '(คะแนนเปรียบเทียบ)',
      tableTopicHeader: 'หัวข้อเปรียบเทียบ',
    },
    calculator: {
      brickBadge: 'งานผนัง',
      brickTitle: 'คำนวณปริมาณอิฐก่อผนังเบื้องต้น',
      brickDesc: 'ประเมินจำนวนก้อน (รวมเผื่อเสียหาย 5%) และปูนที่แนะนำ',
      wallWidthLabel: 'ความยาวผนัง (ม.)',
      wallHeightLabel: 'ความสูงผนัง (ม.)',
      openingsLabel: 'หักประตู/หน้าต่าง (ตร.ม.)',
      brickTypeLabel: 'เลือกประเภทอิฐ',
      brickOptions: [
        { value: 'aac', title: 'อิฐมวลเบา (20×60 ซม. — ประมาณ 8.33 ก้อน/ตร.ม.)' },
        { value: 'block', title: 'อิฐบล็อก (19×39 ซม. — ประมาณ 12.5 ก้อน/ตร.ม.)' },
        { value: 'red', title: 'อิฐมอญก่อครึ่งแผ่น (ประมาณ 140 ก้อน/ตร.ม.)' },
      ],
      brickSpecs: {
        aac: { name: 'อิฐมวลเบา', perSqm: 8.33, mortar: 'ปูนก่อ-ฉาบสำหรับอิฐมวลเบาโดยเฉพาะ (ฉาบบางได้)' },
        block: { name: 'อิฐบล็อก', perSqm: 12.5, mortar: 'ปูนซีเมนต์ผสม (ก่อ-ฉาบ)' },
        red: { name: 'อิฐมอญก่อครึ่งแผ่น', perSqm: 140, mortar: 'ปูนซีเมนต์ผสม (ก่อ-ฉาบ) แนะนำแช่น้ำอิฐก่อนก่อ' },
      },
      netWallAreaLabel: 'พื้นที่ผนังสุทธิ:',
      sqmUnit: 'ตร.ม.',
      brickCountLabel: (name) => `จำนวน${name} (รวมเผื่อ 5%):`,
      brickUnit: 'ก้อน',
      recommendedMortarLabel: 'ปูนที่แนะนำ:',
      roofBadge: 'งานหลังคา',
      roofTitle: 'คำนวณพื้นที่หลังคาตามความลาดชัน',
      roofDesc: 'คำนวณพื้นที่ผืนหลังคาจริงจากพื้นที่แปลนและองศาความลาดเอียง',
      roofPlanLabel: 'พื้นที่แปลนหลังคา (ตร.ม.)',
      roofPitchLabel: (deg) => `ความลาดชันหลังคา (${deg}°)`,
      pitchLow: '3° (โมเดิร์น)',
      pitchMid: '25° (มาตรฐาน)',
      pitchHigh: '45° (จั่วสูง)',
      actualRoofAreaLabel: 'พื้นที่ผืนหลังคาจริง:',
      slopeFactorLabel: (deg) => `ตัวคูณความลาดชัน (1 / cos ${deg}°):`,
      roofRecLow: 'ความลาดชันต่ำ แนะนำ <strong>เมทัลชีท (บุฉนวน PU/PE)</strong> หรือ <strong>ไวนิล UPVC</strong> เพื่อลดความเสี่ยงน้ำย้อนตามรอยต่อ',
      roofRecMid: 'ความลาดชันปานกลาง ใช้ได้ทั้ง <strong>เมทัลชีท</strong>, <strong>ไวนิล</strong> และกระเบื้องบางรุ่นที่รองรับองศาต่ำ',
      roofRecHigh: 'ความลาดชันมาตรฐาน เหมาะกับ <strong>กระเบื้องคอนกรีต (ซีแพค)</strong>, <strong>เมทัลชีท</strong> และหลังคาบ้านทรงจั่ว/ปั้นหยา',
    },
    saved: {
      heading: 'บทความที่คุณบันทึกไว้',
      subheading: 'เก็บไว้อ่านทบทวนหรือเปิดดูเทียบสเปกหน้างานได้ทันที',
      clearAllBtn: 'ล้างรายการทั้งหมด',
      emptyTitle: 'ยังไม่มีบทความที่บันทึกไว้',
      emptyDesc: 'กดไอคอนบุ๊กมาร์กบนบทความที่สนใจเพื่อเก็บไว้อ่านภายหลัง',
      exploreBtn: 'ไปหน้าบทความ',
    },
    modal: {
      copySummary: 'คัดลอกสรุป',
      save: 'บันทึก',
      saved: 'บันทึกแล้ว ✓',
      closeAria: 'ปิดหน้าต่าง',
      recommendedMaterials: 'วัสดุแนะนำสำหรับงานนี้',
      sourcesLabel: 'แหล่งข้อมูลอ้างอิง:',
    },
    footer: {
      copyright: '© 2026 บริษัท อิคัม โฮม เดคคอร์ จำกัด (iKamm Home Decor Co., Ltd.) — บทความไอเดียออกแบบเฟอร์นิเจอร์บิ้วอิน & ตกแต่งภายใน',
      note: 'โทร: +66 99 086 9712 / +63 90 855 78763 | Line: 099 104 2639 | Service@ikammhomedecor.com | www.ikammhomedecor.com',
    },
    toasts: {
      saved: 'บันทึกบทความเรียบร้อย',
      removed: 'นำออกจากรายการที่บันทึกแล้ว',
      clearedAll: 'ล้างบทความที่บันทึกทั้งหมดแล้ว',
      copied: 'คัดลอกสรุปบทความแล้ว',
      copyFailed: 'ไม่สามารถคัดลอกอัตโนมัติได้',
    },
    svgLabels: {
      rebarTitle: 'เปรียบเทียบหน้าตัดและผิวเหล็กเสริม',
      rbTitle: 'เหล็กเส้นกลม (RB)',
      rbSub: 'เกรด SR24 | ทำเหล็กปลอก',
      dbTitle: 'เหล็กข้ออ้อย (DB)',
      dbSub: 'SD30/40/50 | เหล็กแกนหลัก',
      foundationTitle: 'องค์ประกอบฐานรากและคานคอดิน',
      pedestal: 'เสาตอม่อ',
      groundBeam: 'คานคอดิน',
      rcFooting: 'ฐานราก คสล.',
      leanConcrete: 'คอนกรีตหยาบ',
      checklistTitle: 'เช็กลิสต์ตรวจรับงานฉาบ',
      check1: 'ทาบสามเหลี่ยมปาดปูน เช็กดิ่ง-ฉาก',
      check2: 'เคาะผนังฟังเสียงโปร่ง ป้องกันปูนร่อน',
      check3: 'บ่มน้ำและรอผนังแห้งก่อนลงสีรองพื้น',
    },
    articles: {
      'cement-guide': {
        title: 'เจาะลึกปูนซีเมนต์ 5 ประเภท: เลือกใช้ให้ถูกกับงานโครงสร้างและงานก่อฉาบ',
        categoryId: 'cement',
        category: 'ปูนซีเมนต์',
        tags: ['งานโครงสร้าง', 'ปูนซีเมนต์', 'ปูนปอร์ตแลนด์', 'ปูนก่อฉาบ'],
        readTime: 'อ่าน 5 นาที',
        date: 'อัปเดต พ.ย. 2026',
        summary: 'ปูนซีเมนต์ไม่ได้ใช้แทนกันได้ทั้งหมด ทำความเข้าใจปูนซีเมนต์ปอร์ตแลนด์ทั้ง 5 ประเภทตามมาตรฐาน มอก. และปูนซีเมนต์ผสมสำหรับงานก่อ-ฉาบ เพื่อความแข็งแรงและลดปัญหารอยแตกร้าว',
        sections: [
          {
            heading: '1. ปูนซีเมนต์งานโครงสร้าง (ปูนซีเมนต์ปอร์ตแลนด์ 5 ประเภท)',
            body: 'ปูนซีเมนต์ปอร์ตแลนด์มีความแข็งแรงและรับน้ำหนักสูง ใช้กับงานโครงสร้างหลัก แบ่งเป็น 5 ประเภท ได้แก่ ประเภท 1 สำหรับงานโครงสร้างคอนกรีตเสริมเหล็กทั่วไป (เสา คาน พื้น ฐานราก), ประเภท 2 ทนซัลเฟตปานกลางและเกิดความร้อนปานกลาง, ประเภท 3 ให้กำลังอัดสูงเร็วสำหรับงานเร่งด่วนหรือแผ่นพื้นสำเร็จรูป, ประเภท 4 ความร้อนต่ำสำหรับงานคอนกรีตหลาขนาดใหญ่ เช่น เขื่อน และประเภท 5 ทนซัลเฟตสูง เหมาะกับพื้นที่ดินเค็มหรืออาคารริมทะเล',
          },
          {
            heading: '2. ปูนซีเมนต์ผสม สำหรับงานก่อและงานฉาบ',
            body: 'ปูนซีเมนต์ผสมมีกำลังอัดต่ำกว่าปูนงานโครงสร้าง จึงห้ามนำไปใช้เทเสาหรือคานรับน้ำหนัก แต่มีจุดเด่นคือเนื้อปูนเหนียว ลื่นมือ อุ้มน้ำดี และมีการหดตัวน้อยกว่า จึงเหมาะอย่างยิ่งสำหรับงานก่ออิฐและฉาบผนังให้เรียบเนียน ไม่แตกร้าวง่าย',
          },
          {
            heading: '3. ปูนซีเมนต์งานพิเศษ',
            body: 'เช่น ปูนซีเมนต์ขาวที่ควบคุมความคงที่ของสีเพื่องานตกแต่ง สถาปัตยกรรม หรือปูนซีเมนต์เฉพาะทางสำหรับงานขุดเจาะที่ต้องการคุณสมบัติต้านทานซัลเฟตและแรงดันสูง',
          },
        ],
        recommendations: [
          'งานเสา คาน พื้น คสล. บ้านพักอาศัยทั่วไป: เลือกปูนซีเมนต์ปอร์ตแลนด์ ประเภท 1',
          'งานก่ออิฐมอญ/อิฐบล็อกและฉาบผนัง: เลือกปูนซีเมนต์ผสม (ก่อ-ฉาบ) หรือปูนสำเร็จรูปสำหรับก่อ-ฉาบ',
          'งานก่อสร้างบ้านริมทะเลหรือดินเค็ม: เลือกปูนซีเมนต์ปอร์ตแลนด์ ประเภท 5 ทนทานซัลเฟต',
        ],
        sources: [
          { label: 'ไทวัสดุ: ปูนแบบไหน เหมาะกับงานแบบใดบ้าง', url: 'https://www.thaiwatsadu.com/th/articles/choose-right-cement-for-your-project' },
        ],
      },
      'brick-comparison': {
        title: 'เปรียบเทียบอิฐมอญ อิฐบล็อก และอิฐมวลเบา: เลือกแบบไหนให้บ้านเย็นและคุ้มค่า',
        categoryId: 'wall',
        category: 'งานผนัง & อิฐ',
        tags: ['งานผนัง & อิฐ', 'อิฐมอญ', 'อิฐมวลเบา', 'อิฐบล็อก'],
        readTime: 'อ่าน 6 นาที',
        date: 'อัปเดต พ.ย. 2026',
        summary: 'เจาะลึกข้อดี-ข้อเสียของวัสดุก่อผนัง 3 ยอดนิยม ทั้งด้านความแข็งแรง การกันความร้อน ความเร็วในการก่อสร้าง และต้นทุนปูนฉาบ เพื่อให้คุณเลือกได้เหมาะกับแต่ละห้องของบ้าน',
        sections: [
          {
            heading: 'อิฐมอญ (Red Brick)',
            body: 'จุดเด่นคือความแข็งแรงทนทาน เจาะแขวนเฟอร์นิเจอร์หนักอย่างตู้ลอยหรือเครื่องทำน้ำอุ่นได้ดี และทนความชื้นสูง แต่เนื่องจากก้อนเล็กและขนาดอาจคลาดเคลื่อนจากการเผา ทำให้ก่อช้าและต้องฉาบปูนหนาประมาณ 2–3 ซม.',
          },
          {
            heading: 'อิฐบล็อก (Concrete Block)',
            body: 'มีลักษณะเป็นสีเทาและมีรูกลวงตรงกลาง ก้อนใหญ่ทำให้ก่อผนังได้รวดเร็ว ราคาประหยัด หาซื้อง่าย และรูกลวงช่วยลดการถ่ายเทความร้อนได้ดีกว่าอิฐมอญระดับหนึ่ง นิยมใช้กับงานรั้ว อาคารโรงงาน หรือผนังทั่วไปที่เน้นประหยัดงบ',
          },
          {
            heading: 'อิฐมวลเบา (AAC Block)',
            body: 'ผลิตได้ขนาดมาตรฐานเท่ากันทุกก้อน ผิวเรียบ น้ำหนักเบา ช่วยลดภาระโครงสร้างบ้าน มีรูพรุนเล็กๆ กระจายตัวทำให้กันความร้อนและเก็บเสียงได้ดีเยี่ยม ก่อได้เร็วและฉาบปูนได้บาง แต่ต้องใช้ปูนก่อ-ฉาบเฉพาะสำหรับอิฐมวลเบาและใช้พุกเฉพาะเมื่อต้องการเจาะแขวนของหนัก',
          },
        ],
        recommendations: [
          'ผนังห้องนอนและห้องนั่งเล่นฝั่งรับแดด: แนะนำอิฐมวลเบา คู่กับปูนก่อ-ฉาบสำหรับอิฐมวลเบา',
          'ผนังห้องน้ำ ครัวปูน หรือจุดที่เจาะแขวนตู้หนัก: แนะนำอิฐมอญ',
          'กำแพงรั้วหรือผนังโรงรถที่เน้นประหยัดงบและก่อเร็ว: แนะนำอิฐบล็อก',
        ],
        sources: [
          { label: 'Smartblock: เปรียบเทียบคุณสมบัติอิฐมอญ อิฐบล็อก อิฐมวลเบา', url: 'https://www.smartblock.co.th/' },
          { label: 'Landy Home: เทียบอิฐมวลเบากับอิฐมอญ', url: 'https://www.landyhome.co.th/th/blog/lightweight-concrete-vs-red-brick' },
        ],
      },
      'roofing-guide': {
        title: 'เลือกวัสดุมุงหลังคา: เมทัลชีท vs กระเบื้องคอนกรีต vs ไวนิล แบบไหนดี',
        categoryId: 'roof',
        category: 'งานหลังคา',
        tags: ['งานหลังคา', 'เมทัลชีท', 'ซีแพค', 'ไวนิล'],
        readTime: 'อ่าน 5 นาที',
        date: 'อัปเดต พ.ย. 2026',
        summary: 'สรุปข้อดี-ข้อจำกัดของวัสดุมุงหลังคายอดนิยม 3 ชนิด ทั้งเรื่องน้ำหนัก โครงสร้างที่รองรับ เสียงเวลาฝนตก และการเลือกให้เข้ากับดีไซน์บ้านโมเดิร์นและบ้านทรงจั่ว',
        sections: [
          {
            heading: 'หลังคาเมทัลชีท (Metal Sheet)',
            body: 'แผ่นโลหะรีดลอนที่มีจุดเด่นด้านน้ำหนักเบา ติดตั้งรวดเร็ว และทำหลังคาความลาดชันต่ำ (สไตล์โมเดิร์น) ได้ดี รอยต่อน้อยลดโอกาสรั่วซึม ข้อจำกัดคือเสียงดังเมื่อฝนตกและนำความร้อน ซึ่งแก้ไขได้ด้วยการเลือกแบบบุฉนวน PU Foam หรือ PE',
          },
          {
            heading: 'กระเบื้องคอนกรีต (เช่น ซีแพคโมเนีย)',
            body: 'ผลิตจากคอนกรีต มีความสวยงาม หรูหรา แข็งแรง ทนทานต่อแรงลม และซับเสียงฝนตกได้ดีกว่าเมทัลชีท แต่มีน้ำหนักค่อนข้างมาก จึงต้องออกแบบโครงหลังคา (จันทัน แป เสา) ให้รับน้ำหนักได้อย่างเหมาะสม และต้องใช้ความลาดชันเพียงพอเพื่อป้องกันน้ำย้อน',
          },
          {
            heading: 'หลังคาไวนิล (UPVC Vinyl)',
            body: 'ผลิตจากพลาสติก UPVC โฟมชนิดแข็ง น้ำหนักเบา ทนต่อสภาพอากาศ ไม่ลามไฟ และเด่นมากเรื่องเสียงเบาแม้เจอฝนตกหนัก จึงนิยมมากสำหรับงานต่อเติมหลังคากันสาด โรงรถ หรือเทอเรสข้างบ้าน',
          },
        ],
        recommendations: [
          'บ้านทรงโมเดิร์นลาดเอียงต่ำหรือโกดัง: เมทัลชีทบุฉนวนกันความร้อน-ลดเสียง',
          'บ้านพักอาศัยทรงปั้นหยา/ทรงจั่วที่ต้องการความภูมิฐานและเงียบ: กระเบื้องคอนกรีต',
          'หลังคากันสาด โรงรถ หรือโซนซักล้างต่อเติม: หลังคาไวนิล UPVC',
        ],
        sources: [
          { label: 'Kacha: หลังคาเมทัลชีท ข้อดี-ข้อเสีย', url: 'https://www.kacha.co.th/articles/metal-sheet-roof/' },
          { label: 'Thai Plastwood: เปรียบเทียบเมทัลชีท vs ไวนิล', url: 'https://thaiplastwood.com/%E0%B8%A7%E0%B8%B1%E0%B8%AA%E0%B8%94%E0%B8%B8%E0%B8%A1%E0%B8%B8%E0%B8%87%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%B2/' },
        ],
      },
      'rebar-standards': {
        title: 'เหล็กเส้นกลม (RB) และเหล็กข้ออ้อย (DB) มาตรฐาน มอก. เลือกใช้ยังไงไม่ให้ผิดสเปก',
        categoryId: 'rebar',
        category: 'เหล็กเสริม',
        tags: ['เหล็กเสริม', 'งานโครงสร้าง', 'มอก.', 'RB', 'DB'],
        readTime: 'อ่าน 4 นาที',
        date: 'อัปเดต พ.ย. 2026',
        summary: 'ทำความรู้จักความแตกต่างระหว่างเหล็กเส้นกลม SR24 กับเหล็กข้ออ้อย SD30/SD40/SD50 พร้อมหน้าที่ในโครงสร้างคอนกรีตเสริมเหล็กและวิธีเช็กมาตรฐาน มอก.',
        sections: [
          {
            heading: 'เหล็กเส้นกลม (Round Bar : RB) — มาตรฐาน มอก. 20-2543',
            body: 'มีผิวเรียบกลม นิยมใช้ชั้นคุณภาพ SR24 โดยขนาด 6 มม. และ 9 มม. มักนำไปดัดเป็น "เหล็กปลอก" เพื่อรัดโครงเหล็กแกนในงานเสาและคาน ช่วยรับแรงเฉือนและยึดเหล็กหลักให้อยู่ในตำแหน่งที่ถูกต้อง',
          },
          {
            heading: 'เหล็กข้ออ้อย (Deformed Bar : DB) — มาตรฐาน มอก. 24-2559',
            body: 'มีบั้งนูนเป็นระยะสม่ำเสมอตลอดเส้น เพื่อเพิ่มแรงยึดเกาะระหว่างเหล็กกับเนื้อคอนกรีต มีหลายชั้นคุณภาพ เช่น SD30, SD40 และ SD50 ใช้เป็นเหล็กแกนหลักในการรับแรงดึงของฐานราก ตอม่อ เสา และคานโครงสร้าง',
          },
          {
            heading: 'ข้อควรระวังในการตรวจรับเหล็กหน้างาน',
            body: 'ควรตรวจสอบตราประทับ มอก. และรหัสชั้นคุณภาพที่ตัวเหล็กเส้น (เช่น SR24, SD40) รวมถึงขนาดเส้นผ่านศูนย์กลางให้ตรงตามแบบวิศวกรรม และระวังเหล็กที่ขึ้นสนิมขุมลึกจนกัดกร่อนเนื้อเหล็ก',
          },
        ],
        recommendations: [
          'งานเหล็กปลอกเสา-คาน และงานดัดงอทั่วไป: เหล็กเส้นกลม RB6 หรือ RB9 เกรด SR24',
          'งานเหล็กแกนเสา คาน ฐานรากบ้านและอาคาร: เหล็กข้ออ้อย DB12, DB16, DB20 เกรด SD40 ตามรายการคำนวณวิศวกร',
        ],
        sources: [
          { label: 'ไทวัสดุ: ประเภทและการเลือกใช้เหล็กเส้น', url: 'https://www.thaiwatsadu.com/th/articles/steel-bar-type-and-usage-by-tata' },
          { label: 'สมอ. (TISI): มาตรฐานเหล็กข้ออ้อย มอก. 24-2559', url: 'https://www.tisi.go.th/data/standard/fulltext/TIS-24-2559p.pdf' },
        ],
      },
      'foundation-basics': {
        title: 'ลำดับงานโครงสร้างพื้นฐาน: จากฐานราก ตอม่อ ถึงคานคอดิน',
        categoryId: 'structure',
        category: 'งานโครงสร้าง',
        tags: ['งานโครงสร้าง', 'ฐานราก', 'คอนกรีตเสริมเหล็ก'],
        readTime: 'อ่าน 5 นาที',
        date: 'อัปเดต พ.ย. 2026',
        summary: 'เข้าใจหัวใจของความมั่นคงตัวบ้าน ตั้งแต่การเตรียมดิน เทคอนกรีตหยาบ วางลูกปูนหนุนเหล็ก ไปจนถึงการบ่มคอนกรีตให้ได้กำลังอัดเต็มตามออกแบบ',
        sections: [
          {
            heading: '1. งานขุดดินและเทคอนกรีตหยาบ (Lean Concrete)',
            body: 'หลังขุดหลุมฐานรากหรือตัดหัวเสาเข็มแล้ว ควรเทคอนกรีตหยาบปรับระดับก้นหลุมก่อนวางตะแกรงเหล็กฐานราก เพื่อป้องกันความชื้นและสิ่งสกปรกจากดินปนเปื้อนเข้าสู่เนื้อคอนกรีตโครงสร้าง',
          },
          {
            heading: '2. การหนุนลูกปูน (Covering) และผูกเหล็ก',
            body: 'เหล็กเสริมต้องไม่วางติดดินหรือชิดไม้แบบโดยตรง ต้องใช้ลูกปูนหนุนให้มีระยะหุ้มคอนกรีตตามแบบ เพื่อป้องกันความชื้นซึมเข้าไปทำให้เหล็กเป็นสนิมและดันคอนกรีตแตกในอนาคต',
          },
          {
            heading: '3. การเทและบ่มคอนกรีต',
            body: 'ใช้ปูนซีเมนต์ปอร์ตแลนด์ ประเภท 1 (หรือประเภท 2/5 หากดินเค็มหรือน้ำใต้ดินมีซัลเฟตสูง) ระหว่างเทควรจี้คอนกรีตด้วยเครื่องจี้เขย่าเพื่อไล่ฟองอากาศ ลดปัญหาโพรง (Honeycomb) และบ่มชื้นต่อเนื่องหลังเทอย่างน้อย 7 วัน',
          },
        ],
        recommendations: [
          'คอนกรีตโครงสร้างฐานราก-คาน: ใช้ปูนซีเมนต์ปอร์ตแลนด์ ประเภท 1 หรือคอนกรีตผสมเสร็จกำลังอัดตามแบบวิศวกร',
          'อุปกรณ์เสริมจำเป็น: ลูกปูนหนุนเหล็ก (Spacer) ตามระยะหุ้มที่กำหนดในแบบ',
        ],
        sources: [
          { label: 'ไทวัสดุ: ปูนซีเมนต์งานโครงสร้าง 5 ประเภท', url: 'https://www.thaiwatsadu.com/th/articles/choose-right-cement-for-your-project' },
        ],
      },
      'plastering-checklist': {
        title: 'เช็กลิสต์ตรวจรับงานก่อฉาบและเตรียมผิวก่อนทาสีบ้าน',
        categoryId: 'wall',
        category: 'งานผนัง & อิฐ',
        tags: ['งานผนัง & อิฐ', 'ปูนซีเมนต์', 'ตรวจรับงาน'],
        readTime: 'อ่าน 4 นาที',
        date: 'อัปเดต พ.ย. 2026',
        summary: 'วิธีตรวจเช็กผนังก่อฉาบด้วยตนเองก่อนส่งมอบงวดงาน ตั้งแต่การเคาะฟังเสียงโพรง การเช็กดิ่ง-ฉาก ไปจนถึงการบ่มผนังฉาบเพื่อลดรอยแตกลายงา',
        sections: [
          {
            heading: '1. เช็กแนวผนัง ดิ่ง และความเรียบด้วยสามเหลี่ยมปาดปูน',
            body: 'ใช้ไม้สามเหลี่ยมหรือระดับน้ำทาบแนบผนังทั้งแนวตั้งและแนวนอน ไม่ควรมีช่องแสงลอดใต้ไม้เกินมาตรฐาน (โดยทั่วไปไม่เกิน 2–3 มม.) และมุมเสา-มุมหน้าต่างควรได้ฉากเรียบร้อย',
          },
          {
            heading: '2. เคาะฟังเสียงโปร่ง (ปูนร่อน)',
            body: 'ใช้ด้ามไขควงหรือไม้เคาะเบาๆ ให้ทั่วผนัง หากได้ยินเสียงก้องโปร่ง แสดงว่าปูนฉาบไม่ยึดเกาะกับอิฐ ควรให้ช่างสกัดซ่อมก่อนทาสี มิฉะนั้นสีจะพองลอกในภายหลัง',
          },
          {
            heading: '3. การบ่มผนังและการทิ้งระยะก่อนทาสี',
            body: 'หลังฉาบเสร็จควรรดน้ำบ่มผนังอย่างน้อย 3–5 วันเพื่อลดการแตกร้าวจากการหดตัว และรอให้ผนังแห้งสนิท (ค่าความชื้นเหมาะสม) ก่อนลงสีรองพื้นปูนใหม่เพื่อป้องกันสีด่างหรือลอกล่อน',
          },
        ],
        recommendations: [
          'งานฉาบอิฐมอญ/อิฐบล็อก: ใช้ปูนซีเมนต์ผสมหรือปูนฉาบสำเร็จรูปทั่วไป',
          'งานฉาบอิฐมวลเบา: ต้องใช้ปูนฉาบสำหรับอิฐมวลเบาโดยเฉพาะ เพื่อการยึดเกาะและลดการแตกร้าว',
          'สีรองพื้น: ใช้สีรองพื้นปูนใหม่กันด่างก่อนทาสีจริงเสมอ',
        ],
        sources: [
          { label: 'Adheseal: ข้อควรรู้เกี่ยวกับอิฐและงานฉาบ', url: 'https://adheseal.com/brick-block-ceramic/' },
        ],
      },
    },
    compareData: {
      bricks: {
        title: 'เปรียบเทียบวัสดุก่อผนัง: อิฐมอญ vs อิฐบล็อก vs อิฐมวลเบา',
        cards: [
          {
            name: 'อิฐมอญ (Red Brick)',
            badge: 'แข็งแรง เจาะแขวนดี',
            badgeColor: 'bg-orange-100 text-orange-800',
            pros: ['แข็งแรง ทนความชื้นดี', 'เจาะแขวนของหนักมั่นคง'],
            cons: ['ขนาดไม่เท่ากัน ต้องฉาบหนา 2-3 ซม.', 'ก่อช้า ค่าแรงสูงกว่า'],
            bestFor: 'ห้องน้ำ ห้องครัว จุดแขวนตู้หนัก',
          },
          {
            name: 'อิฐบล็อก (Concrete Block)',
            badge: 'ประหยัด ก่อไว',
            badgeColor: 'bg-slate-200 text-slate-800',
            pros: ['ราคาถูกที่สุด ก้อนใหญ่ก่อเร็ว', 'รูกลวงช่วยลดความร้อนได้บ้าง'],
            cons: ['รับแรงกระแทกและเจาะแขวนสู้ไม่ได้', 'ผิวหยาบ ใช้ปูนฉาบมากพอควร'],
            bestFor: 'กำแพงรั้ว โรงจอดรถ อาคารทั่วไป',
          },
          {
            name: 'อิฐมวลเบา (AAC Block)',
            badge: 'บ้านเย็น น้ำหนักเบา',
            badgeColor: 'bg-emerald-100 text-emerald-800',
            pros: ['กันความร้อนและเสียงดีเยี่ยม', 'ขนาดมาตรฐาน ฉาบบางได้ ประหยัดปูน'],
            cons: ['ต้องใช้ปูนก่อ-ฉาบเฉพาะทาง', 'แขวนของหนักต้องใช้พุกเฉพาะ'],
            bestFor: 'ห้องนอน ห้องนั่งเล่น ผนังรับแดด',
          },
        ],
        labels: ['กันความร้อน', 'ความเร็วติดตั้ง', 'ความประหยัดปูนฉาบ', 'ความแข็งแรงเจาะแขวน', 'น้ำหนักเบา'],
        datasets: [
          { label: 'อิฐมอญ', data: [4, 4, 4, 9, 3], color: '#EA580C' },
          { label: 'อิฐบล็อก', data: [6, 8, 6, 5, 6], color: '#64748B' },
          { label: 'อิฐมวลเบา', data: [9, 9, 9, 6, 10], color: '#059669' },
        ],
        rows: [
          ['ความเร็วในการก่อ', 'ช้า (ก้อนเล็ก)', 'เร็ว (ก้อนใหญ่)', 'เร็วมาก (ก้อนใหญ่เบา)'],
          ['ความหนาปูนฉาบ', 'หนา (~2–3 ซม.)', 'ปานกลาง', 'บาง (เรียบสม่ำเสมอ)'],
          ['การกันความร้อน', 'สะสมความร้อนปานกลาง', 'ดีปานกลาง (มีรูกลวง)', 'ดีเยี่ยม'],
          ['การเจาะแขวนของหนัก', 'ดีมาก (ใช้พุกทั่วไป)', 'ปานกลาง (ระวังรูกลวง)', 'ดี (ต้องใช้พุกเฉพาะ)'],
        ],
      },
      roofing: {
        title: 'เปรียบเทียบวัสดุมุงหลังคา: เมทัลชีท vs กระเบื้องคอนกรีต vs ไวนิล',
        cards: [
          {
            name: 'หลังคาเมทัลชีท',
            badge: 'น้ำหนักเบา ลาดต่ำได้',
            badgeColor: 'bg-sky-100 text-sky-800',
            pros: ['น้ำหนักเบา ติดตั้งไว รอยต่อน้อย', 'รองรับหลังคาองศาต่ำได้ดี'],
            cons: ['เสียงดังเมื่อฝนตก (ควรบุฉนวน)', 'นำความร้อนสูงหากไม่ติดฉนวน'],
            bestFor: 'บ้านโมเดิร์น โรงงาน กันสาด',
          },
          {
            name: 'กระเบื้องคอนกรีต (ซีแพค)',
            badge: 'หรูหรา แข็งแรง เงียบ',
            badgeColor: 'bg-amber-100 text-amber-800',
            pros: ['สวยงาม แข็งแรง ทนทานสูง', 'ซับเสียงฝนตกได้ดีกว่าโลหะ'],
            cons: ['น้ำหนักมาก โครงสร้างต้องแข็งแรง', 'ต้องมีความลาดชันเพียงพอ'],
            bestFor: 'บ้านทรงจั่ว ทรงปั้นหยา',
          },
          {
            name: 'หลังคาไวนิล (UPVC)',
            badge: 'เสียงเงียบ ไม่ลามไฟ',
            badgeColor: 'bg-indigo-100 text-indigo-800',
            pros: ['เสียงเบาแม้ฝนตกหนัก', 'น้ำหนักเบา ทนแดดฝน ไม่ลามไฟ'],
            cons: ['ราคาต่อ ตร.ม. สูงกว่าเมทัลชีททั่วไป', 'ช่วงแปต้องถี่ตามสเปกผู้ผลิต'],
            bestFor: 'ต่อเติมโรงรถ กันสาด ระเบียง',
          },
        ],
        labels: ['น้ำหนักเบา', 'ความเงียบเวลาฝนตก', 'ความเร็วติดตั้ง', 'รองรับองศาต่ำ', 'ความแข็งแรงทนลม'],
        datasets: [
          { label: 'เมทัลชีท (บุฉนวน)', data: [9, 6, 9, 10, 7], color: '#0284C7' },
          { label: 'กระเบื้องคอนกรีต', data: [3, 9, 5, 4, 10], color: '#D97706' },
          { label: 'ไวนิล UPVC', data: [9, 9, 8, 8, 7], color: '#4F46E5' },
        ],
        rows: [
          ['น้ำหนักต่อโครงสร้าง', 'เบามาก', 'หนัก (ต้องเสริมโครง)', 'เบา'],
          ['เสียงเมื่อฝนตก', 'ดัง (ดีขึ้นมากเมื่อบุ PU)', 'เงียบ', 'เงียบมาก'],
          ['ความลาดชันที่เหมาะสม', 'ต่ำได้ (ตั้งแต่ ~3–5° ขึ้นไป)', 'ปานกลาง-สูง (~17–40°)', 'ต่ำ-ปานกลาง'],
          ['การใช้งานยอดนิยม', 'บ้านโมเดิร์น หลังคาหลัก/ต่อเติม', 'หลังคาหลักบ้านพักอาศัย', 'กันสาด โรงรถ ต่อเติม'],
        ],
      },
      cement: {
        title: 'เปรียบเทียบปูนซีเมนต์ตามลักษณะงาน',
        cards: [
          {
            name: 'ปอร์ตแลนด์ ประเภท 1',
            badge: 'งานโครงสร้างหลัก',
            badgeColor: 'bg-rose-100 text-rose-800',
            pros: ['กำลังอัดสูง แข็งแรงทนทาน', 'เหมาะกับคอนกรีตเสริมเหล็กทั่วไป'],
            cons: ['ไม่เหมาะฉาบผนัง (หดตัวแตกร้าวง่าย)'],
            bestFor: 'เสา คาน พื้น ฐานรากทั่วไป',
          },
          {
            name: 'ปอร์ตแลนด์ ประเภท 5',
            badge: 'ทนซัลเฟต/น้ำเค็ม',
            badgeColor: 'bg-teal-100 text-teal-800',
            pros: ['ต้านทานเกลือซัลเฟตสูงมาก', 'ป้องกันโครงสร้างผุกร่อนจากไอเค็ม'],
            cons: ['ราคาสูงและเฉพาะทางกว่าประเภท 1'],
            bestFor: 'อาคารใกล้ทะเล พื้นที่ดินเค็ม',
          },
          {
            name: 'ปูนซีเมนต์ผสม (ก่อ-ฉาบ)',
            badge: 'งานสถาปัตยกรรม',
            badgeColor: 'bg-emerald-100 text-emerald-800',
            pros: ['เนื้อเหนียว ยึดเกาะดี ไม่หดตัวเร็ว', 'ลดปัญหารอยแตกร้าวงานฉาบ'],
            cons: ['กำลังอัดต่ำ ห้ามใช้เทเสา-คานรับน้ำหนัก'],
            bestFor: 'ก่ออิฐ ฉาบผนัง งานปูนขนาดเล็ก',
          },
        ],
        labels: ['กำลังอัดรับน้ำหนัก', 'ความเหนียวยึดเกาะ', 'ต้านทานซัลเฟต', 'ลดแตกร้าวงานฉาบ', 'ความคล่องตัวงานทั่วไป'],
        datasets: [
          { label: 'ปอร์ตแลนด์ ประเภท 1', data: [9, 6, 5, 4, 9], color: '#E11D48' },
          { label: 'ปอร์ตแลนด์ ประเภท 5', data: [9, 6, 10, 4, 6], color: '#0D9488' },
          { label: 'ปูนซีเมนต์ผสม', data: [4, 9, 4, 9, 9], color: '#10B981' },
        ],
        rows: [
          ['งานที่เหมาะสม', 'เสา คาน พื้น คสล.', 'โครงสร้างใกล้ทะเล/ดินเค็ม', 'ก่ออิฐ ฉาบผนัง'],
          ['กำลังอัดโครงสร้าง', 'สูง', 'สูง', 'ต่ำ (ไม่ใช้รับแรงหลัก)'],
          ['ระยะเวลาเซตตัว/หดตัว', 'แข็งตัวเร็ว กำลังสูง', 'แข็งตัวปานกลาง ทนเค็ม', 'พอเหมาะ ลดการแตกร้าว'],
          ['ข้อห้ามสำคัญ', 'ไม่ควรนำมาฉาบผนัง', 'ใช้เฉพาะสภาพแวดล้อมเหมาะสม', 'ห้ามใช้เทเสา คาน ฐานราก'],
        ],
      },
    },
  },

  en: {
    brand: {
      name: 'iKamm Home Decor',
      subtitle: '30 Built-In & Interior Ideas',
      pageTitle: 'iKamm Home Decor — 30 Built-In Furniture & Interior Design Ideas',
    },
    nav: {
      articles: 'Articles',
      compare: 'Compare Materials',
      calculator: 'Calculators',
      saved: 'Saved',
      openMenu: 'Open menu',
    },
    hero: {
      alt: 'iKamm Home Decor bespoke built-in furniture and modern interior architecture',
      badge: 'iKamm Home Decor • 30-Day Built-In Design Guide',
      title: '30 Built-In Furniture & Interior Design Ideas for Modern Living',
      desc: 'Explore 30 practical built-in interior concepts for studio condos, family homes, clinics, and offices — from Smart Home automation and 360° shoe cabinets to waterproof Plaswood and European hardware.',
      featuredBtn: 'Read Featured (Day 1)',
      compareBtn: 'Compare Specs',
    },
    search: {
      placeholder: 'Search 30 topics e.g. Studio condo, Smart Home, Power Track, 360° shoe cabinet, Kitchen...',
      showingCount: (n) => `Showing ${n} article${n === 1 ? '' : 's'}`,
      emptyTitle: 'No matching articles found',
      emptyDesc: 'Try adjusting your search keywords or selecting All Categories.',
      resetBtn: 'Show All Articles',
      readArticle: 'Read Article',
      bookmarkAria: 'Bookmark article',
    },
    categories: [
      { id: 'all', label: 'All' },
      { id: 'structure', label: 'Structural Work' },
      { id: 'wall', label: 'Walls & Bricks' },
      { id: 'roof', label: 'Roofing' },
      { id: 'cement', label: 'Cement' },
      { id: 'rebar', label: 'Steel Rebar' },
    ],
    compare: {
      heading: 'Compare Popular Construction Materials',
      subheading: 'Select a material category to compare key advantages, limitations, ideal applications, and performance ratings.',
      tabs: {
        bricks: 'Wall Bricks & Blocks',
        roofing: 'Roofing Materials',
        cement: 'Cement Types',
      },
      prosLabel: 'Pros:',
      consLabel: 'Considerations:',
      bestForLabel: 'Best for:',
      scoreSuffix: '(Performance Score / 10)',
      tableTopicHeader: 'Comparison Criteria',
    },
    calculator: {
      brickBadge: 'Wall Work',
      brickTitle: 'Wall Brick Quantity Estimator',
      brickDesc: 'Estimate brick count (including 5% wastage allowance) and recommended mortar type.',
      wallWidthLabel: 'Wall Length (m)',
      wallHeightLabel: 'Wall Height (m)',
      openingsLabel: 'Doors/Windows Area (sq.m.)',
      brickTypeLabel: 'Select Brick Type',
      brickOptions: [
        { value: 'aac', title: 'AAC Autoclaved Block (20×60 cm — ~8.33 blocks/sq.m.)' },
        { value: 'block', title: 'Hollow Concrete Block (19×39 cm — ~12.5 blocks/sq.m.)' },
        { value: 'red', title: 'Clay Red Brick Half-brick Wall (~140 bricks/sq.m.)' },
      ],
      brickSpecs: {
        aac: { name: 'AAC Blocks', perSqm: 8.33, mortar: 'Specialized AAC thin-bed adhesive & render mortar' },
        block: { name: 'Concrete Blocks', perSqm: 12.5, mortar: 'Masonry / Mixed Cement (General bricklaying & plastering)' },
        red: { name: 'Red Clay Bricks', perSqm: 140, mortar: 'Masonry / Mixed Cement (Soak bricks in water before laying)' },
      },
      netWallAreaLabel: 'Net Wall Area:',
      sqmUnit: 'sq.m.',
      brickCountLabel: (name) => `Estimated ${name} (+5% waste):`,
      brickUnit: 'pcs',
      recommendedMortarLabel: 'Recommended Mortar:',
      roofBadge: 'Roofing Work',
      roofTitle: 'Sloped Roof Area Calculator',
      roofDesc: 'Calculate actual roof surface area from flat plan area and roof pitch angle.',
      roofPlanLabel: 'Roof Plan Area (sq.m.)',
      roofPitchLabel: (deg) => `Roof Pitch Angle (${deg}°)`,
      pitchLow: '3° (Modern)',
      pitchMid: '25° (Standard)',
      pitchHigh: '45° (Steep Gable)',
      actualRoofAreaLabel: 'Actual Sloped Roof Area:',
      slopeFactorLabel: (deg) => `Slope Multiplier (1 / cos ${deg}°):`,
      roofRecLow: 'Low pitch angle: Recommended <strong>Insulated Metal Sheet (PU/PE)</strong> or <strong>UPVC Vinyl Roof</strong> to prevent water backflow at joints.',
      roofRecMid: 'Moderate pitch angle: Suitable for <strong>Metal Sheet</strong>, <strong>UPVC Vinyl</strong>, and low-pitch compatible roof tiles.',
      roofRecHigh: 'Standard/steep pitch: Ideal for <strong>Concrete Roof Tiles (CPAC Monier)</strong>, <strong>Metal Sheet</strong>, and gable/hip roofs.',
    },
    saved: {
      heading: 'Saved Articles',
      subheading: 'Quickly access your bookmarked guides and material specifications on site.',
      clearAllBtn: 'Clear All Saved',
      emptyTitle: 'No saved articles yet',
      emptyDesc: 'Click the bookmark icon on any article card to save it for later reading.',
      exploreBtn: 'Browse Articles',
    },
    modal: {
      copySummary: 'Copy Summary',
      save: 'Save',
      saved: 'Saved ✓',
      closeAria: 'Close modal',
      recommendedMaterials: 'Recommended Materials for This Task',
      sourcesLabel: 'Reference Sources:',
    },
    footer: {
      copyright: '© 2026 iKamm Home Decor Co., Ltd. — 30 Built-In Furniture & Interior Design Ideas',
      note: 'Tel: +66 99 086 9712 / +63 90 855 78763 | Line: 099 104 2639 | Service@ikammhomedecor.com | www.ikammhomedecor.com',
    },
    toasts: {
      saved: 'Article saved to bookmarks',
      removed: 'Removed from saved articles',
      clearedAll: 'Cleared all saved articles',
      copied: 'Article summary copied to clipboard',
      copyFailed: 'Unable to copy automatically',
    },
    svgLabels: {
      rebarTitle: 'Rebar Cross-Section & Surface Comparison',
      rbTitle: 'Round Bar (RB)',
      rbSub: 'Grade SR24 | Stirrups & Ties',
      dbTitle: 'Deformed Bar (DB)',
      dbSub: 'SD30/40/50 | Main Tension Rebar',
      foundationTitle: 'Foundation & Ground Beam Components',
      pedestal: 'Pedestal Column',
      groundBeam: 'Ground Beam',
      rcFooting: 'RC Footing',
      leanConcrete: 'Lean Concrete',
      checklistTitle: 'Plastering Inspection Checklist',
      check1: 'Check plumb, level & flatness with straightedge',
      check2: 'Tap wall surface to detect hollow spots',
      check3: 'Water-cure & let dry before applying primer',
    },
    articles: {
      'cement-guide': {
        title: 'In-Depth Guide to 5 Cement Types: Choosing the Right Cement for Structure vs Masonry',
        categoryId: 'cement',
        category: 'Cement',
        tags: ['Structural Work', 'Cement', 'Portland Cement', 'Masonry'],
        readTime: '5 min read',
        date: 'Updated Nov 2026',
        summary: 'Not all cements are interchangeable. Understand the 5 types of Portland cement under TIS standards and mixed masonry cement for durable structures and crack-free plastering.',
        sections: [
          {
            heading: '1. Structural Cement (5 Types of Portland Cement)',
            body: 'Portland cement offers high compressive strength for primary load-bearing structures: Type 1 for general reinforced concrete (columns, beams, slabs, footings); Type 2 for moderate sulfate resistance and moderate heat; Type 3 for high early strength (precast slabs, urgent repairs); Type 4 for low heat of hydration in mass concrete like dams; and Type 5 for high sulfate resistance in coastal or saline soil areas.',
          },
          {
            heading: '2. Mixed / Masonry Cement for Bricklaying & Plastering',
            body: 'Mixed cement has lower compressive strength than structural Portland cement and must never be used for load-bearing columns or beams. However, its smooth workability, water retention, and low shrinkage make it ideal for bricklaying and smooth, crack-resistant wall plastering.',
          },
          {
            heading: '3. Specialty Cements',
            body: 'Includes white Portland cement with controlled color consistency for architectural finishes, tile grouting, and terrazzo, as well as oil-well and high-pressure specialty cements.',
          },
        ],
        recommendations: [
          'General residential RC columns, beams & slabs: Use Ordinary Portland Cement Type 1',
          'Red brick / concrete block laying & wall plastering: Use Mixed Masonry Cement or pre-mixed plaster mortar',
          'Coastal buildings or high-sulfate saline soil: Use Sulfate-Resisting Portland Cement Type 5',
        ],
        sources: [
          { label: 'Thai Watsadu: Choosing the Right Cement for Your Project', url: 'https://www.thaiwatsadu.com/th/articles/choose-right-cement-for-your-project' },
        ],
      },
      'brick-comparison': {
        title: 'Red Clay Brick vs Concrete Block vs AAC Block: Best Choice for a Cool & Cost-Effective Home',
        categoryId: 'wall',
        category: 'Walls & Bricks',
        tags: ['Walls & Bricks', 'Red Brick', 'AAC Block', 'Concrete Block'],
        readTime: '6 min read',
        date: 'Updated Nov 2026',
        summary: 'Compare the pros and cons of the 3 most popular wall materials across strength, thermal insulation, installation speed, and plastering cost for every room in your house.',
        sections: [
          {
            heading: 'Red Clay Brick',
            body: 'Renowned for high durability, moisture resistance, and strong anchoring for heavy wall-mounted cabinets or water heaters. Because bricks are small and vary slightly from kiln firing, installation is slower and requires a thicker 2–3 cm plaster coat.',
          },
          {
            heading: 'Hollow Concrete Block',
            body: 'Large gray blocks with hollow cores that enable fast wall construction at the lowest material cost. The internal air cavities provide moderate heat reduction, making them popular for perimeter fences, warehouses, and budget walls.',
          },
          {
            heading: 'Autoclaved Aerated Concrete (AAC Block)',
            body: 'Manufactured to exact dimensions with smooth surfaces and lightweight micro-pores. AAC blocks reduce structural dead load, provide superior thermal and acoustic insulation, and allow fast thin-skim plastering—though they require dedicated AAC adhesive/plaster and specialized wall plugs for heavy loads.',
          },
        ],
        recommendations: [
          'Sun-facing bedrooms & living rooms: AAC Block paired with specialized AAC mortar',
          'Bathrooms, heavy Thai kitchens, or heavy wall-cabinet zones: Red Clay Brick',
          'Perimeter fences, garages & budget utility walls: Hollow Concrete Block',
        ],
        sources: [
          { label: 'Smartblock: Comparing Red Brick, Concrete Block & AAC', url: 'https://www.smartblock.co.th/' },
          { label: 'Landy Home: Lightweight Concrete vs Red Brick', url: 'https://www.landyhome.co.th/th/blog/lightweight-concrete-vs-red-brick' },
        ],
      },
      'roofing-guide': {
        title: 'Roofing Guide: Metal Sheet vs Concrete Tile vs UPVC Vinyl — Which Should You Choose?',
        categoryId: 'roof',
        category: 'Roofing',
        tags: ['Roofing', 'Metal Sheet', 'Concrete Tile', 'UPVC Vinyl'],
        readTime: '5 min read',
        date: 'Updated Nov 2026',
        summary: 'A complete breakdown of the top 3 roofing materials covering structural weight, rain noise, minimum slope requirements, and architectural compatibility.',
        sections: [
          {
            heading: 'Metal Sheet Roofing',
            body: 'Roll-formed steel sheets prized for ultra-light weight, rapid installation, and compatibility with low-slope modern roofs with minimal seams. Uninsulated sheets can be noisy in heavy rain and transfer heat, which is solved by specifying PU Foam or PE insulation backing.',
          },
          {
            heading: 'Concrete Roof Tiles (e.g., CPAC Monier)',
            body: 'Molded concrete tiles offering a classic, prestigious look, high wind resistance, and much quieter rain acoustics than bare metal. Because of their heavy weight, roof trusses, rafters, and columns must be engineered accordingly, and a sufficient roof pitch is required to prevent water backflow.',
          },
          {
            heading: 'UPVC Vinyl Roofing',
            body: 'Made from rigid unplasticized PVC foam, UPVC sheets are lightweight, weather-resistant, fire-retardant, and exceptionally quiet during heavy downpours—making them a favorite for carports, canopies, and patio extensions.',
          },
        ],
        recommendations: [
          'Low-slope modern homes or warehouses: PU/PE Insulated Metal Sheet',
          'Hip or gable residential homes prioritizing elegance and quietness: Concrete Roof Tiles',
          'Carports, awnings, and backyard extensions: UPVC Vinyl Roofing',
        ],
        sources: [
          { label: 'Kacha: Metal Sheet Roof Pros & Cons', url: 'https://www.kacha.co.th/articles/metal-sheet-roof/' },
          { label: 'Thai Plastwood: Metal Sheet vs UPVC Vinyl Comparison', url: 'https://thaiplastwood.com/%E0%B8%A7%E0%B8%B1%E0%B8%AA%E0%B8%94%E0%B8%B8%E0%B8%A1%E0%B8%B8%E0%B8%87%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%B2/' },
        ],
      },
      'rebar-standards': {
        title: 'Round Bar (RB) vs Deformed Bar (DB) TIS Standards: How to Specify & Inspect Rebar',
        categoryId: 'rebar',
        category: 'Steel Rebar',
        tags: ['Steel Rebar', 'Structural Work', 'TIS Standard', 'RB', 'DB'],
        readTime: '4 min read',
        date: 'Updated Nov 2026',
        summary: 'Learn the difference between SR24 round bars and SD30/SD40/SD50 deformed bars, their structural roles in reinforced concrete, and how to verify TIS markings on site.',
        sections: [
          {
            heading: 'Round Bar (RB) — TIS 20-2543 Standard',
            body: 'Smooth-surfaced circular steel bars typically produced in grade SR24. Common diameters like RB6 (6 mm) and RB9 (9 mm) are easily bent into stirrups and ties to hold main bars in place and resist shear forces in columns and beams.',
          },
          {
            heading: 'Deformed Bar (DB) — TIS 24-2559 Standard',
            body: 'Features transverse ribs along the bar to maximize mechanical bond with concrete. Available in strength grades SD30, SD40, and SD50, deformed bars serve as primary tension reinforcement in footings, pedestals, columns, and beams.',
          },
          {
            heading: 'On-Site Inspection Tips',
            body: 'Always verify the rolled-in TIS certification mark, manufacturer code, diameter, and grade stamp (e.g., SR24, SD40) against structural drawings, and reject bars with deep pitting corrosion.',
          },
        ],
        recommendations: [
          'Column/beam stirrups & general bending: Round Bar RB6 or RB9 (Grade SR24)',
          'Primary structural reinforcement in footings, columns & beams: Deformed Bar DB12, DB16, DB20 (Grade SD40 per engineer specs)',
        ],
        sources: [
          { label: 'Thai Watsadu: Steel Rebar Types & Applications', url: 'https://www.thaiwatsadu.com/th/articles/steel-bar-type-and-usage-by-tata' },
          { label: 'TISI: Deformed Steel Bar Standard TIS 24-2559', url: 'https://www.tisi.go.th/data/standard/fulltext/TIS-24-2559p.pdf' },
        ],
      },
      'foundation-basics': {
        title: 'Substructure Fundamentals: From Footings & Pedestals to Ground Beams',
        categoryId: 'structure',
        category: 'Structural Work',
        tags: ['Structural Work', 'Foundation', 'Reinforced Concrete'],
        readTime: '5 min read',
        date: 'Updated Nov 2026',
        summary: 'Understand the backbone of building stability—from excavation and lean concrete to concrete spacer blocks, vibration, and proper curing for full design strength.',
        sections: [
          {
            heading: '1. Excavation & Lean Concrete',
            body: 'After excavating footing pits and trimming pile heads, pour a leveling layer of lean concrete before placing the rebar mat. This prevents soil moisture and mud from contaminating the structural concrete.',
          },
          {
            heading: '2. Concrete Cover Spacers & Rebar Tying',
            body: 'Reinforcing steel must never rest directly on soil or touch formwork. Use concrete spacer blocks (covering) of the specified thickness so moisture cannot corrode the rebar and spall the concrete later.',
          },
          {
            heading: '3. Pouring, Vibrating & Curing Concrete',
            body: 'Use Type 1 Portland cement (or Type 2/5 in saline/sulfate soils). Consolidate concrete during pouring with a mechanical vibrator to eliminate honeycombing, and keep concrete moist-cured for at least 7 days.',
          },
        ],
        recommendations: [
          'Footings & ground beams: Type 1 Portland Cement or ready-mix concrete matching engineer strength specs',
          'Essential accessory: Concrete spacer blocks (Covering) sized for underground exposure',
        ],
        sources: [
          { label: 'Thai Watsadu: 5 Structural Cement Types', url: 'https://www.thaiwatsadu.com/th/articles/choose-right-cement-for-your-project' },
        ],
      },
      'plastering-checklist': {
        title: 'Wall Plastering Inspection Checklist & Surface Prep Before Painting',
        categoryId: 'wall',
        category: 'Walls & Bricks',
        tags: ['Walls & Bricks', 'Cement', 'Inspection'],
        readTime: '4 min read',
        date: 'Updated Nov 2026',
        summary: 'How to inspect plastered walls before signing off contractor milestones—checking plumb and flatness, tapping for hollow delamination, and curing walls before priming.',
        sections: [
          {
            heading: '1. Check Plumb, Level & Flatness with a Straightedge',
            body: 'Place an aluminum straightedge and spirit level vertically and horizontally across the wall. Gaps beneath the straightedge should not exceed 2–3 mm, and window/column corners should be crisp and square.',
          },
          {
            heading: '2. Tap Test for Hollow Spots (Delamination)',
            body: 'Gently tap across the wall with a screwdriver handle or wooden rod. A hollow echo indicates the plaster has detached from the brick substrate and must be chipped out and patched before painting.',
          },
          {
            heading: '3. Water Curing & Drying Before Primer',
            body: 'Spray water to cure newly plastered walls for 3–5 days to minimize shrinkage cracks, then allow the wall to dry thoroughly to safe moisture levels before applying alkali-resisting primer.',
          },
        ],
        recommendations: [
          'Plastering red brick / concrete block: Mixed masonry cement or standard pre-mixed render mortar',
          'Plastering AAC blocks: Dedicated AAC render mortar for proper bonding and crack prevention',
          'Primer coat: Always apply fresh-concrete alkali-resistant primer before topcoat paint',
        ],
        sources: [
          { label: 'Adheseal: Essential Brick & Plastering Tips', url: 'https://adheseal.com/brick-block-ceramic/' },
        ],
      },
    },
    compareData: {
      bricks: {
        title: 'Wall Materials: Red Clay Brick vs Concrete Block vs AAC Block',
        cards: [
          {
            name: 'Red Clay Brick',
            badge: 'Strong & Heavy Anchoring',
            badgeColor: 'bg-orange-100 text-orange-800',
            pros: ['High strength & moisture resistance', 'Securely holds heavy wall-mounted loads'],
            cons: ['Uneven sizes require thick 2–3 cm plaster', 'Slower laying & higher labor cost'],
            bestFor: 'Bathrooms, kitchens, heavy cabinet walls',
          },
          {
            name: 'Concrete Block',
            badge: 'Budget & Fast Laying',
            badgeColor: 'bg-slate-200 text-slate-800',
            pros: ['Lowest cost, large size lays quickly', 'Hollow core reduces heat moderately'],
            cons: ['Lower impact & anchor holding strength', 'Rough surface uses moderate plaster'],
            bestFor: 'Fences, garages, utility buildings',
          },
          {
            name: 'AAC Block',
            badge: 'Cool Home & Lightweight',
            badgeColor: 'bg-emerald-100 text-emerald-800',
            pros: ['Excellent thermal & sound insulation', 'Precise size allows thin-coat plaster'],
            cons: ['Requires specialized AAC mortar', 'Needs dedicated anchors for heavy loads'],
            bestFor: 'Bedrooms, living rooms, sun-facing walls',
          },
        ],
        labels: ['Heat Insulation', 'Installation Speed', 'Plaster Savings', 'Anchor Strength', 'Lightweight'],
        datasets: [
          { label: 'Red Brick', data: [4, 4, 4, 9, 3], color: '#EA580C' },
          { label: 'Concrete Block', data: [6, 8, 6, 5, 6], color: '#64748B' },
          { label: 'AAC Block', data: [9, 9, 9, 6, 10], color: '#059669' },
        ],
        rows: [
          ['Laying Speed', 'Slow (small units)', 'Fast (large units)', 'Very Fast (large & light)'],
          ['Plaster Thickness', 'Thick (~2–3 cm)', 'Medium', 'Thin (uniform surface)'],
          ['Thermal Insulation', 'Moderate heat retention', 'Fair (hollow cavity)', 'Excellent'],
          ['Heavy Wall Mounting', 'Excellent (standard plugs)', 'Fair (mind hollow core)', 'Good (use AAC plugs)'],
        ],
      },
      roofing: {
        title: 'Roofing Materials: Metal Sheet vs Concrete Tile vs UPVC Vinyl',
        cards: [
          {
            name: 'Metal Sheet Roof',
            badge: 'Lightweight & Low Slope',
            badgeColor: 'bg-sky-100 text-sky-800',
            pros: ['Ultra-lightweight, fast install, few seams', 'Supports low-slope modern roofs'],
            cons: ['Noisy in rain without insulation', 'Conducts heat if uninsulated'],
            bestFor: 'Modern homes, warehouses, awnings',
          },
          {
            name: 'Concrete Tile (CPAC)',
            badge: 'Classic, Strong & Quiet',
            badgeColor: 'bg-amber-100 text-amber-800',
            pros: ['Elegant appearance, high durability', 'Absorbs rain noise better than metal'],
            cons: ['Heavy weight requires strong roof frame', 'Needs adequate slope angle'],
            bestFor: 'Gable & hip residential homes',
          },
          {
            name: 'UPVC Vinyl Roof',
            badge: 'Quiet & Fire-Retardant',
            badgeColor: 'bg-indigo-100 text-indigo-800',
            pros: ['Very quiet even in heavy rain', 'Lightweight, weather & fire resistant'],
            cons: ['Higher cost per sq.m. than basic metal', 'Requires closer purlin spacing'],
            bestFor: 'Carports, canopies, patio extensions',
          },
        ],
        labels: ['Lightweight', 'Rain Quietness', 'Install Speed', 'Low-Slope Support', 'Wind Durability'],
        datasets: [
          { label: 'Metal Sheet (Insulated)', data: [9, 6, 9, 10, 7], color: '#0284C7' },
          { label: 'Concrete Tile', data: [3, 9, 5, 4, 10], color: '#D97706' },
          { label: 'UPVC Vinyl', data: [9, 9, 8, 8, 7], color: '#4F46E5' },
        ],
        rows: [
          ['Structural Weight', 'Very Light', 'Heavy (needs strong truss)', 'Light'],
          ['Rain Noise', 'Loud (much quieter with PU)', 'Quiet', 'Very Quiet'],
          ['Recommended Pitch', 'Low (~3–5° and up)', 'Medium–Steep (~17–40°)', 'Low–Medium'],
          ['Popular Applications', 'Modern roofs & extensions', 'Main house roofing', 'Carports, awnings, patios'],
        ],
      },
      cement: {
        title: 'Cement Comparison by Application',
        cards: [
          {
            name: 'Portland Cement Type 1',
            badge: 'Main Structure',
            badgeColor: 'bg-rose-100 text-rose-800',
            pros: ['High compressive strength & durability', 'Standard for reinforced concrete'],
            cons: ['Not suitable for wall plastering (shrinks)'],
            bestFor: 'Columns, beams, slabs, footings',
          },
          {
            name: 'Portland Cement Type 5',
            badge: 'Sulfate & Salt Resistant',
            badgeColor: 'bg-teal-100 text-teal-800',
            pros: ['Superior resistance to sulfate salts', 'Protects coastal structures from corrosion'],
            cons: ['Higher price & specialized use'],
            bestFor: 'Coastal buildings, saline soil areas',
          },
          {
            name: 'Mixed Cement (Masonry)',
            badge: 'Bricklaying & Plaster',
            badgeColor: 'bg-emerald-100 text-emerald-800',
            pros: ['Smooth, cohesive, low shrinkage', 'Reduces hairline cracks in plaster'],
            cons: ['Low compressive strength — never for beams/columns'],
            bestFor: 'Bricklaying, wall rendering, minor works',
          },
        ],
        labels: ['Compressive Strength', 'Workability & Adhesion', 'Sulfate Resistance', 'Crack Reduction', 'General Versatility'],
        datasets: [
          { label: 'Portland Type 1', data: [9, 6, 5, 4, 9], color: '#E11D48' },
          { label: 'Portland Type 5', data: [9, 6, 10, 4, 6], color: '#0D9488' },
          { label: 'Mixed Cement', data: [4, 9, 4, 9, 9], color: '#10B981' },
        ],
        rows: [
          ['Ideal Application', 'RC columns, beams, slabs', 'Coastal / saline foundations', 'Bricklaying & wall plastering'],
          ['Structural Strength', 'High', 'High', 'Low (non-load-bearing)'],
          ['Setting & Shrinkage', 'Fast setting, high strength', 'Moderate set, salt-resistant', 'Balanced set, low cracking'],
          ['Key Restriction', 'Do not use for wall plastering', 'Use where sulfate protection is needed', 'Never use for columns, beams or footings'],
        ],
      },
    },
  },

  zh: {
    brand: {
      name: 'iKamm Home Decor',
      subtitle: '30套全屋定制与室内设计灵感',
      pageTitle: 'iKamm Home Decor — 30套全屋定制家具与室内设计精选指南',
    },
    nav: {
      articles: '文章',
      compare: '建材对比',
      calculator: '用量计算',
      saved: '已收藏',
      openMenu: '打开菜单',
    },
    hero: {
      alt: 'iKamm Home Decor 现代全屋定制家具与室内装修设计',
      badge: 'iKamm Home Decor • 30天全屋定制设计宝典',
      title: '30套全屋定制家具与空间设计灵感：让家更大更好住',
      desc: '汇集单间公寓省空间、智能家居嵌入、360°旋转鞋柜、防水洗衣阳台、不锈钢轻奢收边及欧标五金选型等 30 篇实战干货。',
      featuredBtn: '阅读精选首篇 (Day 1)',
      compareBtn: '对比建材规格',
    },
    search: {
      placeholder: '搜索 30 个主题，如：单间公寓、智能家居、电力轨道、旋转鞋柜、厨房...',
      showingCount: (n) => `显示 ${n} 篇文章`,
      emptyTitle: '未找到匹配的文章',
      emptyDesc: '请尝试更换搜索关键词或选择查看“全部”分类',
      resetBtn: '显示全部文章',
      readArticle: '阅读全文',
      bookmarkAria: '收藏文章',
    },
    categories: [
      { id: 'all', label: '全部' },
      { id: 'structure', label: '结构工程' },
      { id: 'wall', label: '墙体与砖材' },
      { id: 'roof', label: '屋面工程' },
      { id: 'cement', label: '水泥材料' },
      { id: 'rebar', label: '钢筋材料' },
    ],
    compare: {
      heading: '热门建筑材料综合对比',
      subheading: '选择建材类别，查看核心优势、注意事项、适用场景及性能评分对比',
      tabs: {
        bricks: '砌墙砖材',
        roofing: '屋面材料',
        cement: '水泥类型',
      },
      prosLabel: '核心优势：',
      consLabel: '注意事项：',
      bestForLabel: '适用场景：',
      scoreSuffix: '（性能评分 / 满分10分）',
      tableTopicHeader: '对比项目',
    },
    calculator: {
      brickBadge: '墙体工程',
      brickTitle: '砌墙砖块用量快速估算',
      brickDesc: '估算所需砖块数量（含 5% 损耗余量）及推荐配套砂浆',
      wallWidthLabel: '墙体长度 (米)',
      wallHeightLabel: '墙体高度 (米)',
      openingsLabel: '扣除门窗面积 (㎡)',
      brickTypeLabel: '选择砖材类型',
      brickOptions: [
        { value: 'aac', title: '加气混凝土砌块 AAC (20×60 cm — 约 8.33 块/㎡)' },
        { value: 'block', title: '空心水泥砖 (19×39 cm — 约 12.5 块/㎡)' },
        { value: 'red', title: '传统红砖半砖墙 (约 140 块/㎡)' },
      ],
      brickSpecs: {
        aac: { name: '加气混凝土砌块', perSqm: 8.33, mortar: '加气块专用粘结剂与薄层抹灰砂浆（可薄抹灰）' },
        block: { name: '空心水泥砖', perSqm: 12.5, mortar: '混合水泥 / 砌筑抹灰砂浆' },
        red: { name: '红砖', perSqm: 140, mortar: '混合水泥砂浆（砌筑前建议先将红砖浇水湿润）' },
      },
      netWallAreaLabel: '净墙体面积：',
      sqmUnit: '㎡',
      brickCountLabel: (name) => `${name}数量（含 5% 损耗）：`,
      brickUnit: '块',
      recommendedMortarLabel: '推荐砂浆：',
      roofBadge: '屋面工程',
      roofTitle: '坡屋面实际面积计算器',
      roofDesc: '根据屋顶平面投影面积与倾斜角度计算实际屋面铺设面积',
      roofPlanLabel: '屋顶平面面积 (㎡)',
      roofPitchLabel: (deg) => `屋面坡度角 (${deg}°)`,
      pitchLow: '3° (现代平缓)',
      pitchMid: '25° (标准坡度)',
      pitchHigh: '45° (高耸尖顶)',
      actualRoofAreaLabel: '实际屋面面积：',
      slopeFactorLabel: (deg) => `坡度系数 (1 / cos ${deg}°)：`,
      roofRecLow: '低坡度屋面：推荐使用<strong>覆膜隔热彩钢瓦 (PU/PE)</strong> 或 <strong>UPVC 塑钢瓦</strong>，减少接缝雨水倒灌风险。',
      roofRecMid: '中等坡度：适用于<strong>彩钢瓦</strong>、<strong>UPVC 塑钢瓦</strong>及支持低坡度的屋面瓦。',
      roofRecHigh: '标准/大坡度：非常适合<strong>混凝土彩瓦 (CPAC)</strong>、<strong>彩钢瓦</strong>及传统双坡/四坡屋顶。',
    },
    saved: {
      heading: '您收藏的文章',
      subheading: '随时复习施工要点或在施工现场快速核对材料规格',
      clearAllBtn: '清空全部收藏',
      emptyTitle: '暂无收藏的文章',
      emptyDesc: '点击文章卡片上的书签图标即可保存文章以便日后阅读',
      exploreBtn: '浏览知识文章',
    },
    modal: {
      copySummary: '复制摘要',
      save: '收藏',
      saved: '已收藏 ✓',
      closeAria: '关闭窗口',
      recommendedMaterials: '本工程推荐建材',
      sourcesLabel: '参考资料来源：',
    },
    footer: {
      copyright: '© 2026 iKamm Home Decor 有限公司 — 30套全屋定制家具与室内设计指南',
      note: '电话: +66 99 086 9712 / +63 90 855 78763 | Line: 099 104 2639 | Service@ikammhomedecor.com | www.ikammhomedecor.com',
    },
    toasts: {
      saved: '已成功收藏文章',
      removed: '已从收藏列表中移除',
      clearedAll: '已清空所有收藏文章',
      copied: '已复制文章摘要到剪贴板',
      copyFailed: '无法自动复制，请手动选择复制',
    },
    svgLabels: {
      rebarTitle: '钢筋截面与表面特征对比',
      rbTitle: '光圆钢筋 (RB)',
      rbSub: 'SR24 级 | 用于箍筋与绑扎',
      dbTitle: '带肋螺纹钢 (DB)',
      dbSub: 'SD30/40/50 | 主受力纵筋',
      foundationTitle: '基础与地梁结构组成示意',
      pedestal: '短柱 (基础柱)',
      groundBeam: '地梁 (圈梁)',
      rcFooting: '钢筋混凝土承台',
      leanConcrete: '素混凝土垫层',
      checklistTitle: '墙面抹灰验收检查清单',
      check1: '用靠尺检查墙面垂直度、平整度与阴阳角',
      check2: '轻敲墙面听声，排查空鼓与脱层隐患',
      check3: '喷水养护并待墙面干透后再涂刷抗碱底漆',
    },
    articles: {
      'cement-guide': {
        title: '深度解析 5 类水泥：结构承重与砌筑抹灰如何正确选型',
        categoryId: 'cement',
        category: '水泥材料',
        tags: ['结构工程', '水泥材料', '波特兰水泥', '砌筑抹灰'],
        readTime: '阅读 5 分钟',
        date: '2026年11月更新',
        summary: '不同水泥不可随意混用。全面了解 TIS 标准下的 5 类波特兰水泥与砌筑抹灰混合水泥，确保结构稳固并预防墙面开裂。',
        sections: [
          {
            heading: '1. 结构工程水泥（5 大类波特兰水泥）',
            body: '波特兰水泥具有高抗压强度，专用于承重结构：1型用于普通钢筋混凝土工程（柱、梁、楼板、基础）；2型具中抗硫酸盐及中等水化热特性；3型为早强水泥，适用于抢修或预制板；4型为低热水泥，用于水坝等大体积混凝土；5型为高抗硫酸盐水泥，专为海边建筑或盐碱地设计。',
          },
          {
            heading: '2. 砌筑与抹灰专用混合水泥',
            body: '混合水泥的抗压强度低于结构水泥，严禁用于浇筑承重梁柱。但其浆体柔滑、保水性好、干缩率低，非常适合砌砖和墙面抹灰，能显著减少墙面龟裂。',
          },
          {
            heading: '3. 特种用途水泥',
            body: '例如色泽纯净稳定的白水泥（用于建筑装饰、瓷砖填缝、水磨石）以及具备耐高压抗腐蚀性能的特种工程水泥。',
          },
        ],
        recommendations: [
          '普通住宅钢筋混凝土柱、梁、楼板：选用 1 型普通波特兰水泥',
          '红砖/水泥砖砌筑与墙面抹灰：选用混合水泥（砌筑抹灰型）或成品预拌砂浆',
          '海滨建筑或高盐碱硫酸盐土质：选用 5 型抗硫酸盐波特兰水泥',
        ],
        sources: [
          { label: 'Thai Watsadu: 不同水泥适用工程指南', url: 'https://www.thaiwatsadu.com/th/articles/choose-right-cement-for-your-project' },
        ],
      },
      'brick-comparison': {
        title: '红砖、空心水泥砖与加气块对比：如何打造隔热凉爽又高性价比的住宅',
        categoryId: 'wall',
        category: '墙体与砖材',
        tags: ['墙体与砖材', '红砖', '加气块', '水泥砖'],
        readTime: '阅读 6 分钟',
        date: '2026年11月更新',
        summary: '全面对比三大主流砌墙材料的强度、隔热性能、施工速度及抹灰成本，帮您为家中不同房间匹配最合适的墙体材料。',
        sections: [
          {
            heading: '传统红砖 (Red Clay Brick)',
            body: '优势在于坚固耐用、防潮性好，非常适合钻孔挂载重型吊柜或热水器。但由于砖体较小且烧制尺寸存在公差，砌筑速度较慢，抹灰层通常需达 2–3 厘米厚。',
          },
          {
            heading: '空心水泥砖 (Concrete Block)',
            body: '灰白色大尺寸空心砌块，砌筑速度快、单价低廉且易于采购。中部空腔可起到一定的隔热作用，广泛用于围墙、厂房及注重预算的普通墙体。',
          },
          {
            heading: '加气混凝土砌块 / 轻质砖 (AAC Block)',
            body: '尺寸精准统一、表面平整、重量极轻，可大幅降低建筑结构荷载。内部均匀微孔提供卓越的隔热与隔音效果，施工快且支持薄抹灰；但需配合专用粘结砂浆，挂载重物时需使用加气块专用膨胀螺栓。',
          },
        ],
        recommendations: [
          '西晒卧室与客厅外墙：推荐加气混凝土砌块 (AAC) 搭配专用砌筑抹灰砂浆',
          '卫生间、重油烟厨房或需挂重型吊柜的墙面：推荐传统红砖',
          '庭院围墙、车库或追求低成本快速施工的墙体：推荐空心水泥砖',
        ],
        sources: [
          { label: 'Smartblock: 红砖、水泥砖与加气块性能对比', url: 'https://www.smartblock.co.th/' },
          { label: 'Landy Home: 轻质砖与红砖深度对比', url: 'https://www.landyhome.co.th/th/blog/lightweight-concrete-vs-red-brick' },
        ],
      },
      'roofing-guide': {
        title: '屋面材料选购指南：彩钢瓦 vs 混凝土瓦 vs UPVC 塑钢瓦哪个更好？',
        categoryId: 'roof',
        category: '屋面工程',
        tags: ['屋面工程', '彩钢瓦', '混凝土瓦', 'UPVC塑钢瓦'],
        readTime: '阅读 5 分钟',
        date: '2026年11月更新',
        summary: '总结三大主流屋面材料的优缺点，涵盖结构承重要求、雨天噪音表现、坡度限制以及现代风与传统坡屋顶的搭配建议。',
        sections: [
          {
            heading: '金属彩钢瓦 (Metal Sheet)',
            body: '压型金属板材，具有自重极轻、安装迅速、接缝少不易漏水等优点，且非常适合现代低坡度屋顶。单层铁皮在雨天噪音较大且易导热，建议选用附带 PU 发泡或 PE 隔音隔热层的复合彩钢瓦。',
          },
          {
            heading: '混凝土屋面瓦（如 CPAC 彩瓦）',
            body: '由高强混凝土模压而成，外观大气稳重、抗风性强，雨天隔音效果远优于裸金属瓦。但因其自重较大，需预先强化屋架（檩条、椽子、柱）承重设计，并保持足够屋面坡度以防雨水倒灌。',
          },
          {
            heading: 'UPVC 塑钢瓦 / 树脂瓦 (UPVC Vinyl)',
            body: '采用硬质发泡 UPVC 制成，质轻耐候、阻燃不助燃，最突出的优点是暴雨天依然极其安静，因此备受车棚、雨棚及庭院露台扩建工程青睐。',
          },
        ],
        recommendations: [
          '现代风低坡度住宅或厂房仓库：带 PU/PE 隔热降噪层的金属彩钢瓦',
          '追求典雅庄重与安静睡眠环境的坡屋顶住宅：混凝土彩瓦',
          '车库雨棚、露台遮阳棚或洗衣区扩建：UPVC 塑钢瓦',
        ],
        sources: [
          { label: 'Kacha: 彩钢瓦屋面优缺点解析', url: 'https://www.kacha.co.th/articles/metal-sheet-roof/' },
          { label: 'Thai Plastwood: 彩钢瓦 vs UPVC 塑钢瓦对比', url: 'https://thaiplastwood.com/%E0%B8%A7%E0%B8%B1%E0%B8%AA%E0%B8%94%E0%B8%B8%E0%B8%A1%E0%B8%B8%E0%B8%87%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%B2/' },
        ],
      },
      'rebar-standards': {
        title: '光圆钢筋 (RB) 与螺纹钢 (DB) 标准解析：如何按规范选型与现场验货',
        categoryId: 'rebar',
        category: '钢筋材料',
        tags: ['钢筋材料', '结构工程', 'TIS标准', 'RB', 'DB'],
        readTime: '阅读 4 分钟',
        date: '2026年11月更新',
        summary: '详解 SR24 光圆钢筋与 SD30/SD40/SD50 带肋螺纹钢的区别、在钢筋混凝土结构中的分工，以及施工现场核验 TIS 标识的方法。',
        sections: [
          {
            heading: '光圆钢筋 (Round Bar : RB) — TIS 20-2543 标准',
            body: '表面光滑呈圆形，常用强度等级为 SR24。常见直径 6mm (RB6) 与 9mm (RB9) 易于折弯加工，多用作梁柱中的“箍筋”，负责抗剪并固定主筋位置。',
          },
          {
            heading: '带肋螺纹钢 (Deformed Bar : DB) — TIS 24-2559 标准',
            body: '表面带有均匀分布的横肋，能大幅增强钢筋与混凝土之间的咬合握裹力。常见等级有 SD30、SD40 及 SD50，作为基础、短柱、框架柱和主梁的核心受拉纵筋。',
          },
          {
            heading: '施工现场钢筋验收要点',
            body: '进场时应核对钢筋表面的 TIS 认证印记、厂家代号、直径规格及强度等级标识（如 SR24、SD40）是否与结构施工图一致，并严禁使用出现严重坑蚀的生锈钢筋。',
          },
        ],
        recommendations: [
          '梁柱箍筋及一般折弯加工：选用 RB6 或 RB9 光圆钢筋（SR24 级）',
          '基础、柱、梁主受力纵筋：按结构工程师计算书选用 DB12、DB16、DB20 螺纹钢（SD40 级）',
        ],
        sources: [
          { label: 'Thai Watsadu: 建筑钢筋分类与选型指南', url: 'https://www.thaiwatsadu.com/th/articles/steel-bar-type-and-usage-by-tata' },
          { label: 'TISI: 泰国带肋钢筋标准 TIS 24-2559', url: 'https://www.tisi.go.th/data/standard/fulltext/TIS-24-2559p.pdf' },
        ],
      },
      'foundation-basics': {
        title: '基础结构施工全流程：从独立基础、短柱到地梁',
        categoryId: 'structure',
        category: '结构工程',
        tags: ['结构工程', '基础工程', '钢筋混凝土'],
        readTime: '阅读 5 分钟',
        date: '2026年11月更新',
        summary: '读懂房屋稳固的核心环节：从基坑开挖、浇筑素混凝土垫层、放置保护层垫块，到混凝土振捣与保湿养护的完整标准流程。',
        sections: [
          {
            heading: '1. 基坑开挖与素混凝土垫层 (Lean Concrete)',
            body: '基坑开挖或截桩头后，应在绑扎基础钢筋网前先浇筑一层素混凝土垫层找平，防止地下潮气与泥土污染结构混凝土。',
          },
          {
            heading: '2. 混凝土保护层垫块 (Covering) 与钢筋绑扎',
            body: '钢筋网严禁直接贴地或紧靠模板，必须使用水泥垫块垫出规范要求的保护层厚度，防止地下水汽渗入导致钢筋锈蚀膨胀撑裂混凝土。',
          },
          {
            heading: '3. 混凝土浇筑振捣与养护',
            body: '选用 1 型波特兰水泥（盐碱地或高硫酸盐环境选用 2/5 型）。浇筑时应使用插入式振捣棒充分振捣排出气泡，避免蜂窝麻面，并在浇筑后持续保湿养护至少 7 天。',
          },
        ],
        recommendations: [
          '基础与地梁结构混凝土：选用 1 型波特兰水泥或符合设计标号的商品混凝土',
          '必备辅材：符合图纸保护层厚度要求的混凝土垫块 (Spacer)',
        ],
        sources: [
          { label: 'Thai Watsadu: 5 大结构水泥选型指南', url: 'https://www.thaiwatsadu.com/th/articles/choose-right-cement-for-your-project' },
        ],
      },
      'plastering-checklist': {
        title: '墙面砌筑抹灰验收清单与涂刷乳胶漆前的基层处理',
        categoryId: 'wall',
        category: '墙体与砖材',
        tags: ['墙体与砖材', '水泥材料', '工程验收'],
        readTime: '阅读 4 分钟',
        date: '2026年11月更新',
        summary: '分期验收前必看的墙面自检方法：如何用靠尺检查垂直平整度、敲击排查空鼓，以及抹灰后的洒水养护与底漆施工时机。',
        sections: [
          {
            heading: '1. 用铝合金靠尺检查垂直度、平整度与阴阳角',
            body: '将靠尺或水平尺紧贴墙面进行垂直和水平方向检查，尺底漏光缝隙通常不应超过 2–3 毫米，柱角与窗框阴阳角应方正顺直。',
          },
          {
            heading: '2. 敲击听声排查空鼓（砂浆脱层）',
            body: '使用螺丝刀手柄或小木槌轻敲墙面各处，若发出空洞回音，说明抹灰层与砖体未粘牢，必须督促工人在刷漆前凿除重抹，否则日后极易起泡掉皮。',
          },
          {
            heading: '3. 洒水养护与涂刷底漆前的干燥期',
            body: '抹灰完成后应连续洒水养护 3–5 天以减少收缩裂缝，随后等待墙体彻底干透（含水率达标），再涂刷抗碱封闭底漆，防止漆面发花或剥落。',
          },
        ],
        recommendations: [
          '红砖/水泥砖抹灰：使用混合水泥砂浆或通用成品抹灰砂浆',
          '加气块 (AAC) 抹灰：必须使用加气块专用抹灰砂浆，确保粘结力并防裂',
          '底漆工序：涂刷面漆前务必先涂刷一遍新墙抗碱底漆',
        ],
        sources: [
          { label: 'Adheseal: 砖墙砌筑与抹灰关键要点', url: 'https://adheseal.com/brick-block-ceramic/' },
        ],
      },
    },
    compareData: {
      bricks: {
        title: '墙体材料对比：红砖 vs 空心水泥砖 vs 加气块',
        cards: [
          {
            name: '传统红砖 (Red Brick)',
            badge: '坚固耐用 挂重物强',
            badgeColor: 'bg-orange-100 text-orange-800',
            pros: ['结构致密坚固、耐潮湿', '钻孔安装重型吊柜非常稳固'],
            cons: ['尺寸公差大，需厚抹灰 2–3 cm', '砌筑慢、人工成本较高'],
            bestFor: '卫生间、厨房、需挂重型吊柜墙面',
          },
          {
            name: '空心水泥砖 (Concrete Block)',
            badge: '经济实惠 砌筑快',
            badgeColor: 'bg-slate-200 text-slate-800',
            pros: ['单价最低，大块砌筑速度快', '中空结构具备一定隔热效果'],
            cons: ['抗冲击与挂重能力较弱', '表面粗糙，抹灰砂浆耗量中等'],
            bestFor: '庭院围墙、车库、普通厂房建筑',
          },
          {
            name: '加气混凝土砌块 (AAC)',
            badge: '隔热凉爽 质地轻盈',
            badgeColor: 'bg-emerald-100 text-emerald-800',
            pros: ['隔热保温与隔音性能极佳', '尺寸精准平整，可薄抹灰省料'],
            cons: ['必须使用专用砌筑与抹灰砂浆', '挂重物需使用专用膨胀锚栓'],
            bestFor: '卧室、客厅、西晒外墙',
          },
        ],
        labels: ['隔热性能', '施工速度', '节省抹灰砂浆', '打孔挂重强度', '轻量化程度'],
        datasets: [
          { label: '红砖', data: [4, 4, 4, 9, 3], color: '#EA580C' },
          { label: '空心水泥砖', data: [6, 8, 6, 5, 6], color: '#64748B' },
          { label: '加气块 (AAC)', data: [9, 9, 9, 6, 10], color: '#059669' },
        ],
        rows: [
          ['砌筑速度', '慢（块体小）', '快（块体大）', '极快（块大且轻）'],
          ['抹灰层厚度', '厚（约 2–3 cm）', '中等', '薄（墙面平整度高）'],
          ['隔热性能', '中等（易蓄热）', '良好（带中空孔洞）', '优异（微孔隔热）'],
          ['重物挂载能力', '极佳（普通膨胀栓即可）', '一般（需避开空腔）', '良好（需用专用锚栓）'],
        ],
      },
      roofing: {
        title: '屋面材料对比：彩钢瓦 vs 混凝土彩瓦 vs UPVC 塑钢瓦',
        cards: [
          {
            name: '金属彩钢瓦',
            badge: '自重极轻 适合低坡度',
            badgeColor: 'bg-sky-100 text-sky-800',
            pros: ['重量轻、安装快、接缝极少', '完美支持现代低坡度屋顶'],
            cons: ['雨天声音较大（建议加隔音层）', '未贴隔热层时导热较快'],
            bestFor: '现代风住宅、厂房、雨棚',
          },
          {
            name: '混凝土瓦 (CPAC)',
            badge: '典雅庄重 坚固安静',
            badgeColor: 'bg-amber-100 text-amber-800',
            pros: ['外观高档美观、抗风耐久度高', '雨天隔音表现明显优于金属瓦'],
            cons: ['自重很大，屋架结构需加固', '要求足够的排水坡度'],
            bestFor: '传统双坡顶、四坡顶住宅',
          },
          {
            name: 'UPVC 塑钢瓦',
            badge: '雨天静音 阻燃耐候',
            badgeColor: 'bg-indigo-100 text-indigo-800',
            pros: ['暴雨天依然非常安静', '质轻耐晒耐腐蚀、阻燃安全'],
            cons: ['每平米单价高于普通彩钢瓦', '檩条间距需按厂家规范加密'],
            bestFor: '车库扩建、遮阳雨棚、露台',
          },
        ],
        labels: ['轻量化', '雨天静音度', '安装速度', '低坡度适应性', '抗风坚固度'],
        datasets: [
          { label: '彩钢瓦（带隔热层）', data: [9, 6, 9, 10, 7], color: '#0284C7' },
          { label: '混凝土瓦', data: [3, 9, 5, 4, 10], color: '#D97706' },
          { label: 'UPVC 塑钢瓦', data: [9, 9, 8, 8, 7], color: '#4F46E5' },
        ],
        rows: [
          ['对结构荷载影响', '极轻', '重（需加强屋架）', '轻'],
          ['雨天噪音表现', '较响（覆 PU 层后大幅改善）', '安静', '非常安静'],
          ['适宜屋面坡度', '支持低坡度（约 3–5° 起）', '中高坡度（约 17–40°）', '低至中等坡度'],
          ['常见应用场景', '现代住宅主屋顶/扩建', '住宅主屋面', '车棚、雨棚、庭院扩建'],
        ],
      },
      cement: {
        title: '不同工程用途水泥性能对比',
        cards: [
          {
            name: '1 型波特兰水泥',
            badge: '主体承重结构',
            badgeColor: 'bg-rose-100 text-rose-800',
            pros: ['抗压强度高、坚固耐久', '各类钢筋混凝土结构通用'],
            cons: ['不适合用于墙面抹灰（易收缩开裂）'],
            bestFor: '柱、梁、楼板、通用基础',
          },
          {
            name: '5 型波特兰水泥',
            badge: '抗硫酸盐/耐海水腐蚀',
            badgeColor: 'bg-teal-100 text-teal-800',
            pros: ['抗硫酸盐侵蚀能力极强', '保护沿海建筑结构免受盐雾腐蚀'],
            cons: ['价格较高，属特种针对性水泥'],
            bestFor: '海滨建筑、盐碱硫酸盐土质区',
          },
          {
            name: '混合水泥（砌筑抹灰）',
            badge: '建筑砌筑与装饰',
            badgeColor: 'bg-emerald-100 text-emerald-800',
            pros: ['浆体柔滑粘结力强、不易快干收缩', '大幅减少抹灰层龟裂问题'],
            cons: ['抗压强度低，严禁用于承重梁柱'],
            bestFor: '砌砖、墙面抹灰、小型修补工程',
          },
        ],
        labels: ['抗压承重能力', '柔滑度与粘结性', '抗硫酸盐腐蚀', '抹灰防裂表现', '日常施工通用性'],
        datasets: [
          { label: '1 型波特兰水泥', data: [9, 6, 5, 4, 9], color: '#E11D48' },
          { label: '5 型波特兰水泥', data: [9, 6, 10, 4, 6], color: '#0D9488' },
          { label: '混合水泥', data: [4, 9, 4, 9, 9], color: '#10B981' },
        ],
        rows: [
          ['适用工程范围', '钢筋混凝土柱、梁、板', '沿海/盐碱地地下结构', '砌筑砖墙、墙面抹灰'],
          ['结构抗压强度', '高', '高', '低（不可用于主要承重）'],
          ['凝结与收缩特性', '凝结快、早期及后期强度高', '凝结适中、耐盐蚀', '凝结平缓、减少收缩裂缝'],
          ['重要使用禁忌', '不宜用于大面积墙面抹灰', '按环境需求针对性选用', '严禁用于浇筑柱、梁、基础'],
        ],
      },
    },
  },
}

export function getLocalizedArticleSvg(type, svgLabels) {
  const L = svgLabels || I18N_DATA.th.svgLabels
  if (type === 'rebar') {
    return `
      <svg viewBox="0 0 400 260" class="w-full h-full bg-slate-800" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="260" fill="#1E293B"/>
        <text x="28" y="38" fill="#FBBF24" font-size="14" font-weight="bold">${L.rebarTitle}</text>
        <!-- RB -->
        <rect x="28" y="65" width="344" height="65" rx="10" fill="#334155"/>
        <circle cx="72" cy="97" r="18" fill="#94A3B8" stroke="#E2E8F0" stroke-width="2"/>
        <rect x="112" y="87" width="120" height="20" rx="10" fill="#94A3B8"/>
        <text x="248" y="93" fill="#FFFFFF" font-size="13" font-weight="bold">${L.rbTitle}</text>
        <text x="248" y="112" fill="#CBD5E1" font-size="11">${L.rbSub}</text>
        <!-- DB -->
        <rect x="28" y="150" width="344" height="72" rx="10" fill="#334155"/>
        <circle cx="72" cy="186" r="20" fill="#64748B" stroke="#F59E0B" stroke-width="2.5" stroke-dasharray="5 3"/>
        <rect x="112" y="175" width="120" height="22" rx="4" fill="#64748B"/>
        <path d="M124 175v22M140 175v22M156 175v22M172 175v22M188 175v22M204 175v22M220 175v22" stroke="#F59E0B" stroke-width="2.5"/>
        <text x="248" y="182" fill="#FFFFFF" font-size="13" font-weight="bold">${L.dbTitle}</text>
        <text x="248" y="201" fill="#FDE68A" font-size="11">${L.dbSub}</text>
      </svg>`
  }
  if (type === 'foundation') {
    return `
      <svg viewBox="0 0 400 260" class="w-full h-full bg-stone-100" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="260" fill="#F5F5F4"/>
        <rect x="0" y="160" width="400" height="100" fill="#D6D3D1"/>
        <text x="24" y="34" fill="#1E293B" font-size="14" font-weight="bold">${L.foundationTitle}</text>
        <!-- Ground line -->
        <line x1="20" y1="160" x2="380" y2="160" stroke="#78716C" stroke-width="2" stroke-dasharray="6 4"/>
        <!-- Column & Neck -->
        <rect x="175" y="65" width="50" height="135" fill="#94A3B8" stroke="#475569" stroke-width="2"/>
        <!-- Ground Beam -->
        <rect x="45" y="128" width="310" height="32" fill="#CBD5E1" stroke="#475569" stroke-width="2"/>
        <!-- Footing -->
        <rect x="125" y="195" width="150" height="34" rx="3" fill="#64748B" stroke="#334155" stroke-width="2"/>
        <!-- Lean concrete -->
        <rect x="115" y="229" width="170" height="12" fill="#475569"/>
        <!-- Labels -->
        <text x="235" y="95" fill="#1E293B" font-size="11" font-weight="bold">${L.pedestal}</text>
        <text x="55" y="148" fill="#1E293B" font-size="11" font-weight="bold">${L.groundBeam}</text>
        <text x="285" y="216" fill="#1E293B" font-size="11" font-weight="bold">${L.rcFooting}</text>
        <text x="292" y="239" fill="#475569" font-size="10">${L.leanConcrete}</text>
      </svg>`
  }
  return `
    <svg viewBox="0 0 400 260" class="w-full h-full bg-amber-50" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="260" fill="#FFFBEB"/>
      <rect x="30" y="32" width="340" height="196" rx="14" fill="#FFFFFF" stroke="#FDE68A" stroke-width="2"/>
      <text x="54" y="68" fill="#92400E" font-size="15" font-weight="bold">${L.checklistTitle}</text>
      <g transform="translate(54, 90)">
        <rect width="20" height="20" rx="5" fill="#D97706"/>
        <path d="M5 10l3.5 3.5L15 7" stroke="#FFF" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <text x="30" y="15" fill="#334155" font-size="12.5">${L.check1}</text>
      </g>
      <g transform="translate(54, 130)">
        <rect width="20" height="20" rx="5" fill="#D97706"/>
        <path d="M5 10l3.5 3.5L15 7" stroke="#FFF" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <text x="30" y="15" fill="#334155" font-size="12.5">${L.check2}</text>
      </g>
      <g transform="translate(54, 170)">
        <rect width="20" height="20" rx="5" fill="#D97706"/>
        <path d="M5 10l3.5 3.5L15 7" stroke="#FFF" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <text x="30" y="15" fill="#334155" font-size="12.5">${L.check3}</text>
      </g>
    </svg>`
}

