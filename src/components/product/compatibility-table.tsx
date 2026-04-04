import type { Tables } from "@/types/database";

type CompatibilityTableProps = {
  rows: Tables<"vehicle_compatibilities">[];
};

export function CompatibilityTable({ rows }: CompatibilityTableProps) {
  if (!rows.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay compatibilidades registradas para este producto.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Marca</th>
            <th className="px-3 py-2 text-left font-medium">Modelo</th>
            <th className="px-3 py-2 text-left font-medium">Años</th>
            <th className="px-3 py-2 text-left font-medium">Motor</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t">
              <td className="px-3 py-2">{row.make}</td>
              <td className="px-3 py-2">{row.model}</td>
              <td className="px-3 py-2">
                {row.year_start}
                {row.year_end != null ? ` – ${row.year_end}` : "+"}
              </td>
              <td className="px-3 py-2 text-muted-foreground">
                {row.engine ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
