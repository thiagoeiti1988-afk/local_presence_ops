import { getDemoRepository } from "../../../lib/demo-repository";

export default async function LocationsPage() {
  const { location } = await getDemoRepository();

  return (
    <div>
      <div className="page-header">
        <h1>Unidades</h1>
        <p>Uma linha por unidade física atendida. Cada uma carrega seu próprio score de auditoria.</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Endereço</th>
            <th>Categoria</th>
            <th>Status</th>
            <th>Link de agendamento</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{location.name}</td>
            <td>
              {location.address}, {location.city}/{location.region}
            </td>
            <td>{location.primaryCategory}</td>
            <td>{location.status}</td>
            <td>{location.bookingUrl ?? "— não configurado —"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
