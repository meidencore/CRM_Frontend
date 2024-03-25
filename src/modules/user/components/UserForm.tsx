import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/lib/validators/user";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InputPassword } from "@/components/InputPassword";
import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/services/api";
import { toast } from "@/hooks/useToast";
import { useQueryClient } from "react-query";
import Dropzone from "react-dropzone";
import { Circle, MousePointerClick } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  setIsPending: (value: boolean) => void;
  setIsOpen: (value: boolean) => void;
}

interface FileWithPreview extends File {
  preview: string;
}


export function UserForm({ setIsPending, setIsOpen }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [files, setFiles] = useState<File| null>(null);
  const [fileError, setFileError] = useState("")
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      name: "",
      lastname: "",
      document_type: 1,
      document_number: "",
      phone: "",
      address: "",
      role: 1,
      image: null,
    },
  });

  //Esto es para poder subir las imagenes de perfil y que tengan un preview

  


  const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    try {
      setFile(null);
      const fileList = e.target.files;
      if(fileList && fileList.length > 0) {
        const selectedFile = fileList[0]
        const maxSize = 2 * 1024 * 1024
        if (selectedFile.size <= maxSize) {
          const previewUrl = URL.createObjectURL(selectedFile);
          setFile(selectedFile);
          setPreviewUrl(previewUrl);
          console.log(file)
        } else {
          setFileError("El archivo supera el tamaño máxmo permitido")
        }
      }

    } catch (error) {
      console.error('Error en el manejo del archivo:', error);
    }
  }

  useEffect(() => {
    console.log(file); // Imprime el valor actualizado de 'file' cada vez que cambia
  }, [file]);


  //Este es el dispatch

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    setIsPending(true);
    try {
      
      const formData = new FormData();
    if (file) {
      formData.append("image", file);
    }
    // Agrega los otros campos del formulario según sea necesario
    formData.append("username", values.username);
    formData.append("password", values.password);
    formData.append("email", values.email);
    formData.append("name", values.name);
    formData.append("lastname", values.lastname);
    formData.append("document_type", values.document_type.toString());
    formData.append("document_number", values.document_number);
    formData.append("phone", values.phone);
    formData.append("address", values.address);
    formData.append("role", values.role.toString());

    // Aquí, envías directamente el objeto formData, sin convertirlo a JSON
    const response = await api.post("/auth/register", formData, {
      headers: {
        // No necesitas especificar "Content-Type": "application/json",
        // El navegador establecerá automáticamente el Content-Type adecuado para FormData
      },
    });
    
      if (response.status >= 400) {
        toast({
          description: "Error al crear usuario",
          variant: "destructive",
        });
      } else {
        toast({ description: "Usuario creado correctamente" });
        queryClient.invalidateQueries("users");
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);
      toast({
        description: "Error al crear usuario",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    // Make sure to revoke the data uri to avoid memory leaks, will run on unmount
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [file]);

  return (
    <ScrollArea className="max-h-[550px] pl-4">
      <Form {...form}>
        <form
          id="add-user-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-7 w-[96%] p-[0.3rem]"
        >
    


            <FormLabel>Foto de Perfil</FormLabel> 
            <div className="relative">
            <label htmlFor="profile-picture-input" className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold py-1 px-2 rounded-lg cursor-pointer"
             style={{ marginLeft: "5px"}}>
              Seleccionar imagen
            </label>
            <input
              type="file"
              id="profile-picture-input"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <div className="w-1/2 flex flex-col h-[200px] w-[43%] relative">
            <div
              className="group h-full relative transition-colors duration-300 bg-background
              rounded-full text-center flex justify-center items-center overflow-hidden border-dashed hover:border-solid 
              border-2 border-accent hover:border-primary"
              id="profile-picture-circle"
            >
              <div
                className="absolute top-0 left-0 flex flex-col items-center justify-center gap-4 w-full h-full
                bg-foreground/30 dark:bg-background/30 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MousePointerClick className="h-18 w-18 text-white/50" />
                <p className="text-white/50 px-7">
                  Haga click en Seleccionar Imagen
                </p>
              </div>
              {previewUrl && (
                <img
                  src={previewUrl}
                  className="w-full h-full object-cover duration-700 ease-in-out"
                />
              )}
            </div>
            {previewUrl && (
              <button
                className="absolute top-1/3 left-56 w-full transform -translate-y-1/5 bg-blue-600 text-white px-6 py-2 rounded-lg"
                onClick={() => setFile(null)}
              >
                Quitar Imagen
              </button>
            )}
          </div>

          <FormLabel>
            {fileError && (
              <div className="mt-2 text-red-500 text-sm">{fileError}</div>
            )}
          </FormLabel>

          <div className="flex justify-between gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Nombres</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombres" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Apellidos</FormLabel>
                  <FormControl>
                    <Input placeholder="Apellidos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between gap-4">
            <FormField
              control={form.control}
              name="document_type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Tipo de documento</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue="1"
                  >
                    <FormControl>
                      <SelectTrigger
                        className={`${!field.value && "text-muted-foreground"
                          } hover:text-accent-foreground`}
                      >
                        <SelectValue placeholder="Seleccione un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">DNI</SelectItem>
                      <SelectItem value="2">Cedula</SelectItem>
                      <SelectItem value="3">Pasaporte</SelectItem>
                      <SelectItem value="4">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="document_number"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Nº identificación</FormLabel>
                  <FormControl>
                    <Input placeholder="número de documento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input placeholder="Dirección" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Numero</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      pattern="^\d{1,9}$"
                      placeholder="Numero de celular"
                      onInput={(e) =>
                      (e.currentTarget.value = e.currentTarget.value.replace(
                        /[^\d]/g,
                        ""
                      ))
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Tipo de usuario</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue="2"
                  >
                    <FormControl>
                      <SelectTrigger
                        className={`${!field.value && "text-muted-foreground"
                          } hover:text-accent-foreground`}
                      >
                        <SelectValue placeholder="Seleccione un un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Administrador</SelectItem>
                      <SelectItem value="2">Empleado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Usuario" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <InputPassword form={form} />
        </form>
      </Form>
    </ScrollArea>
  );
}
