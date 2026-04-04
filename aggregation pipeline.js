// Raw Material (Potatoes)
//         ↓
// Stage 1: FILTER    — Acche aalu chuno ($match)
//         ↓
// Stage 2: TRANSFORM — Chips shape mein kato ($project)
//         ↓
// Stage 3: PROCESS   — Fry karo ($addFields)
//         ↓
// Stage 4: GROUP     — Box mein pack karo ($group)
//         ↓
// Stage 5: LIMIT     — Sirf Large size do ($limit)
//         ↓
//     Final Output 🍟


// // ============================================
// //        AGGREGATION PIPELINE NOTES
// // ============================================

// // ── SAMPLE DATA ──────────────────────────────
// const students = [
//     { naam: "Rahul", class: 10, marks: 85, phone: "9999999" },
//     { naam: "Priya", class: 9,  marks: 90, phone: "8888888" },
//     { naam: "Amit",  class: 10, marks: 60, phone: "7777777" },
//     { naam: "Sneha", class: 9,  marks: 75, phone: "6666666" },
//     { naam: "Rohit", class: 10, marks: 95, phone: "5555555" },
// ]


// // ============================================
// // 1. $match — Filter karo
// // ============================================
// // "Sirf Class 10 ke students dikhao"

// { $match: { class: 10 } }

// // Output:
// // { naam: "Rahul", class: 10, marks: 85 }
// // { naam: "Amit",  class: 10, marks: 60 }
// // { naam: "Rohit", class: 10, marks: 95 }


// // ============================================
// // 2. $group — Group karo aur Calculate karo
// // ============================================
// // "Har class ke marks ka total kitna hai?"

// { 
//     $group: {
//         _id: "$class",                  // class ke hisaab se group karo
//         totalMarks: { $sum: "$marks" }, // marks jodo
//     }
// }

// // Output:
// // { _id: 10, totalMarks: 240 }
// // { _id: 9,  totalMarks: 165 }

// // $group ke saath use hone wale operators:
// // { $sum:   "$marks" }   // sabka total
// // { $avg:   "$marks" }   // average
// // { $max:   "$marks" }   // sabse zyada
// // { $min:   "$marks" }   // sabse kam
// // { $count: {}       }   // kitne students hain


// // ============================================
// // 3. $project — Sirf wahi dikhao jo chahiye
// // ============================================
// // "Sirf naam aur marks dikhao, phone hide karo"

// { 
//     $project: {
//         naam: 1,      // 1 = dikhao
//         marks: 1,     // 1 = dikhao
//         phone: 0,     // 0 = hide karo
//         _id: 0        // 0 = hide karo
//     }
// }

// // Output:
// // { naam: "Rahul", marks: 85 }
// // { naam: "Priya", marks: 90 }

// // Field ka naam badalna:
// {
//     $project: {
//         _id: 0,
//         studentName: "$naam",   // naam ko studentName se dikhao
//         marks: 1
//     }
// }

// // Naya field calculate karna (200 mein se percentage):
// {
//     $project: {
//         _id: 0,
//         naam: 1,
//         marks: 1,
//         percentage: {
//             $multiply: [
//                 { $divide: ["$marks", 200] },   // marks / 200
//                 100                              // × 100
//             ]
//         }
//     }
// }


// // ============================================
// // FULL PIPELINE — Teeno saath mein
// // ============================================
// // "Class 10 ka average nikalo, acche naam se dikhao"

// Student.aggregate([

//     // Step 1: Class 10 filter karo
//     { $match: { class: 10 } },

//     // Step 2: Group karke average nikalo
//     { 
//         $group: {
//             _id: "$class",
//             avgMarks: { $avg: "$marks" },
//             totalStudents: { $sum: 1 }
//         }
//     },

//     // Step 3: Output theek karo
//     { 
//         $project: {
//             _id: 0,                 // _id hide karo
//             class: "$_id",          // _id ko class naam do
//             avgMarks: 1,            // dikhao
//             totalStudents: 1        // dikhao
//         }
//     }

// ])

// // Step 1 Output:  Rahul-85, Amit-60, Rohit-95
// // Step 2 Output:  { _id: 10, avgMarks: 80, totalStudents: 3 }
// // Step 3 Output:  { class: 10, avgMarks: 80, totalStudents: 3 }


// // ============================================
// // QUICK REFERENCE
// // ============================================

// // $match    →  Filter karo         (SQL: WHERE)
// // $group    →  Group karo          (SQL: GROUP BY)
// // $project  →  Fields chuno/badlo  (SQL: SELECT)
// // $sort     →  Sort karo           (SQL: ORDER BY)
// // $limit    →  Kitne chahiye       (SQL: LIMIT)
// // $skip     →  Kitne skip karo     (SQL: OFFSET)
// // $lookup   →  Doosri collection   (SQL: JOIN)
// // $unwind   →  Array tod do
// // $addFields→  Naya field add karo

// // project ke andar:
// // 1        = dikhao
// // 0        = hide karo
// // "$field" = us field ki value lo