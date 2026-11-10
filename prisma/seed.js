const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  {
    categoryCode: 'communication',
    categoryName: 'Komunikasi',
    description: 'Cara kalian mengekspresikan pikiran, perasaan, dan harapan satu sama lain.',
    displayOrder: 1,
  },
  {
    categoryCode: 'financial',
    categoryName: 'Finansial',
    description: 'Pandangan kalian mengenai pengelolaan uang, tabungan, dan masa depan keuangan.',
    displayOrder: 2,
  },
  {
    categoryCode: 'family',
    categoryName: 'Keluarga & Anak',
    description: 'Harapan dan nilai-nilai seputar pengasuhan anak dan hubungan keluarga besar.',
    displayOrder: 3,
  },
  {
    categoryCode: 'lifestyle',
    categoryName: 'Gaya Hidup',
    description: 'Keseimbangan antara kebersamaan, hobi, rutinitas harian, dan ruang pribadi.',
    displayOrder: 4,
  },
  {
    categoryCode: 'future',
    categoryName: 'Visi Masa Depan',
    description: 'Arah hidup, cita-cita jangka panjang, serta dukungan terhadap ambisi masing-masing.',
    displayOrder: 5,
  },
  {
    categoryCode: 'emotional',
    categoryName: 'Kebutuhan Emosional',
    description: 'Bahasa kasih, perhatian, dan cara kalian saling memberikan rasa aman dan dicintai.',
    displayOrder: 6,
  },
  {
    categoryCode: 'conflict',
    categoryName: 'Manajemen Konflik',
    description: 'Bagaimana kalian merespons perbedaan pendapat, meredakan emosi, dan mencari solusi.',
    displayOrder: 7,
  },
];

const questions = [
  // Communication (5)
  {
    questionCode: 'Q01',
    categoryCode: 'communication',
    questionOrder: 1,
    questionText: 'Saya lebih suka membicarakan masalah secara langsung daripada memendamnya.',
  },
  {
    questionCode: 'Q02',
    categoryCode: 'communication',
    questionOrder: 2,
    questionText: 'Saya merasa penting untuk saling memberikan kabar sepanjang hari.',
  },
  {
    questionCode: 'Q03',
    categoryCode: 'communication',
    questionOrder: 3,
    questionText: 'Saya nyaman menyampaikan sesuatu yang tidak saya sukai dari pasangan.',
  },
  {
    questionCode: 'Q04',
    categoryCode: 'communication',
    questionOrder: 4,
    questionText: 'Saya lebih suka menyelesaikan kesalahpahaman secepat mungkin daripada menunggu suasana membaik.',
  },
  {
    questionCode: 'Q05',
    categoryCode: 'communication',
    questionOrder: 5,
    questionText: 'Saya merasa pasangan perlu mendengarkan terlebih dahulu sebelum memberikan solusi ketika saya sedang bercerita.',
  },

  // Financial (5)
  {
    questionCode: 'Q06',
    categoryCode: 'financial',
    questionOrder: 6,
    questionText: 'Saya merasa penting memiliki tabungan pribadi meskipun sudah memiliki pasangan.',
  },
  {
    questionCode: 'Q07',
    categoryCode: 'financial',
    questionOrder: 7,
    questionText: 'Saya lebih suka merencanakan pengeluaran besar bersama pasangan sebelum mengambil keputusan.',
  },
  {
    questionCode: 'Q08',
    categoryCode: 'financial',
    questionOrder: 8,
    questionText: 'Saya merasa penting memiliki target investasi atau tabungan jangka panjang bersama.',
  },
  {
    questionCode: 'Q09',
    categoryCode: 'financial',
    questionOrder: 9,
    questionText: 'Saya nyaman jika pasangan mengetahui kondisi keuangan saya secara terbuka, termasuk utang dan kewajiban finansial.',
  },
  {
    questionCode: 'Q10',
    categoryCode: 'financial',
    questionOrder: 10,
    questionText: 'Saya lebih memilih mengutamakan keamanan finansial daripada meningkatkan gaya hidup ketika penghasilan bertambah.',
  },

  // Family & Children (4)
  {
    questionCode: 'Q11',
    categoryCode: 'family',
    questionOrder: 11,
    questionText: 'Saya ingin memiliki anak dalam kehidupan pernikahan.',
  },
  {
    questionCode: 'Q12',
    categoryCode: 'family',
    questionOrder: 12,
    questionText: 'Saya merasa keputusan mengenai pola asuh anak harus dibicarakan dan disepakati bersama.',
  },
  {
    questionCode: 'Q13',
    categoryCode: 'family',
    questionOrder: 13,
    questionText: 'Saya ingin tetap memiliki waktu berkualitas dengan pasangan meskipun sudah memiliki anak.',
  },
  {
    questionCode: 'Q14',
    categoryCode: 'family',
    questionOrder: 14,
    questionText: 'Saya merasa penting menetapkan batasan yang sehat antara kehidupan rumah tangga dan keluarga besar.',
  },

  // Lifestyle Compatibility (4)
  {
    questionCode: 'Q15',
    categoryCode: 'lifestyle',
    questionOrder: 15,
    questionText: 'Saya lebih suka menghabiskan waktu luang bersama pasangan daripada melakukan aktivitas sendiri.',
  },
  {
    questionCode: 'Q16',
    categoryCode: 'lifestyle',
    questionOrder: 16,
    questionText: 'Saya menikmati aktivitas baru seperti traveling, mencoba makanan, atau mengeksplorasi tempat baru bersama pasangan.',
  },
  {
    questionCode: 'Q17',
    categoryCode: 'lifestyle',
    questionOrder: 17,
    questionText: 'Saya merasa penting memiliki rutinitas dan kebiasaan sehari-hari yang teratur.',
  },
  {
    questionCode: 'Q18',
    categoryCode: 'lifestyle',
    questionOrder: 18,
    questionText: 'Saya membutuhkan waktu pribadi untuk menjalankan hobi atau aktivitas sendiri meskipun sedang berada dalam hubungan.',
  },

  // Future Vision (4)
  {
    questionCode: 'Q19',
    categoryCode: 'future',
    questionOrder: 19,
    questionText: 'Saya ingin memiliki tujuan finansial bersama pasangan untuk 5–10 tahun ke depan.',
  },
  {
    questionCode: 'Q20',
    categoryCode: 'future',
    questionOrder: 20,
    questionText: 'Saya bersedia mempertimbangkan perubahan kota atau negara jika hal tersebut memberikan peluang lebih baik bagi keluarga.',
  },
  {
    questionCode: 'Q21',
    categoryCode: 'future',
    questionOrder: 21,
    questionText: 'Saya ingin pasangan saya tetap mendukung perkembangan karier dan ambisi pribadi saya.',
  },
  {
    questionCode: 'Q22',
    categoryCode: 'future',
    questionOrder: 22,
    questionText: 'Saya merasa penting memiliki gambaran yang sama mengenai kehidupan yang ingin kami bangun di masa depan.',
  },

  // Emotional Needs (4)
  {
    questionCode: 'Q23',
    categoryCode: 'emotional',
    questionOrder: 23,
    questionText: 'Saya membutuhkan ungkapan kasih sayang secara verbal dari pasangan.',
  },
  {
    questionCode: 'Q24',
    categoryCode: 'emotional',
    questionOrder: 24,
    questionText: 'Saya merasa diperhatikan ketika pasangan mengingat hal-hal kecil tentang diri saya.',
  },
  {
    questionCode: 'Q25',
    categoryCode: 'emotional',
    questionOrder: 25,
    questionText: 'Saya membutuhkan dukungan emosional dari pasangan ketika sedang menghadapi masa sulit.',
  },
  {
    questionCode: 'Q26',
    categoryCode: 'emotional',
    questionOrder: 26,
    questionText: 'Saya merasa penting untuk tetap menjaga romantisme meskipun hubungan sudah berlangsung lama.',
  },

  // Conflict Management (4)
  {
    questionCode: 'Q27',
    categoryCode: 'conflict',
    questionOrder: 27,
    questionText: 'Saya bisa mengakui kesalahan dan meminta maaf ketika memang melakukan kesalahan.',
  },
  {
    questionCode: 'Q28',
    categoryCode: 'conflict',
    questionOrder: 28,
    questionText: 'Saya lebih memilih mencari solusi bersama daripada berusaha membuktikan siapa yang benar.',
  },
  {
    questionCode: 'Q29',
    categoryCode: 'conflict',
    questionOrder: 29,
    questionText: 'Saya membutuhkan waktu sendiri untuk menenangkan diri sebelum membicarakan konflik yang terjadi.',
  },
  {
    questionCode: 'Q30',
    categoryCode: 'conflict',
    questionOrder: 30,
    questionText: 'Saya percaya bahwa perbedaan pendapat dapat diselesaikan tanpa harus saling menyakiti.',
  },
];

async function main() {
  console.log('Seeding categories and questions...');

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { categoryCode: cat.categoryCode },
      update: {
        categoryName: cat.categoryName,
        description: cat.description,
        displayOrder: cat.displayOrder,
      },
      create: cat,
    });
  }

  const categoryRecords = await prisma.category.findMany();
  const categoryMap = Object.fromEntries(categoryRecords.map((c) => [c.categoryCode, c.id]));

  for (const q of questions) {
    const categoryId = categoryMap[q.categoryCode];
    if (!categoryId) continue;

    await prisma.question.upsert({
      where: { questionCode: q.questionCode },
      update: {
        questionText: q.questionText,
        questionOrder: q.questionOrder,
        categoryId: categoryId,
        isActive: true,
      },
      create: {
        questionCode: q.questionCode,
        questionText: q.questionText,
        questionOrder: q.questionOrder,
        categoryId: categoryId,
        isActive: true,
      },
    });
  }

  console.log(`Seeded ${categories.length} categories and ${questions.length} questions successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
