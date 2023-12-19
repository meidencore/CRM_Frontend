import { Form } from "@/components/ui/form";
import { ProformaScheme } from "@/lib/validators/proforma";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ProformaFormPersonnel } from "./ProformaFormPersonnel";
import { ProformaFormObservation } from "./ProformaFormObservations";
import { ProformaFormPackages } from "./ProformaFormPackages";
import { ProformaFormBasicInfo } from "./ProformaFormBasicInfo";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
interface Props {
  onSubmit: (data: z.infer<typeof ProformaScheme>) => void;
}

export function ProformaForm({ onSubmit }: Props) {
  const form = useForm<z.infer<typeof ProformaScheme>>({
    resolver: zodResolver(ProformaScheme),
    defaultValues: {
      invoice_number: "001",
      date: new Date().toLocaleDateString(),
      reference: "",
      prepared_by: "",
      required_by: "",
      approved_by: "Jhoel Fernández A.",
      email: "",
      phone_number: "",
      work_time: "",
      company: 0,
      type: "Basica",
      observations: [],
      package: [],
      personal_proyecto: [],
    },
  });

  function viewValues() {
    console.log(form.getValues());
  }

  return (
    <Form {...form}>
      <Button variant="outline" className="w-40" onClick={viewValues}>
preview de los valores
      </Button>
      <form id="add-proforma-form" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <ProformaFormBasicInfo form={form} />
          <ProformaFormPackages form={form} />
          <ProformaFormPersonnel form={form} />
          <ProformaFormObservation form={form} />
        </div>
      </form>
    </Form>
  );
}
