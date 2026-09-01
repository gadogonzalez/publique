import { LocationManager } from "@/components/admin/location-manager";
import { getAllLocations } from "@/lib/data/locations";

export default async function UbicacionesPage() {
  const locations = await getAllLocations();

  return (
    <div>
      <h1 className="mb-2 text-xl font-bold">Ubicaciones</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        País → Provincia → Departamento → Localidad. Agregá nuevas zonas a
        medida que Publique se expanda a otros departamentos o provincias.
      </p>
      <LocationManager locations={locations} />
    </div>
  );
}
