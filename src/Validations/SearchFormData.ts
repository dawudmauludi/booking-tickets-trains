import { z } from "zod";

export const searchSchema = z.object({
  origin: z.string().min(1, "Stasiun asal wajib diisi"),
  destination: z.string().min(1, "Stasiun tujuan wajib diisi"),
  date: z.string().min(1, "Tanggal wajib diisi"),
  adults: z.number().min(1, "Minimal 1 penumpang dewasa"),
  infants: z.number().min(0).max(10),
})
.refine(data => data.origin !== data.destination, {
  message: "Stasiun asal dan tujuan tidak boleh sama",
  path: ["destination"]
})
.refine(data => data.infants <= data.adults, {
  message: "Jumlah bayi tidak boleh melebihi dewasa",
  path: ["infants"]
});


export type SearchFormData = z.infer<typeof searchSchema>;
