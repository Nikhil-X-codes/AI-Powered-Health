-- AddUniqueConstraint on medicines table for (prescription_id, medicine_name)
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_prescription_id_medicine_name_key" UNIQUE ("prescription_id", "medicine_name");
