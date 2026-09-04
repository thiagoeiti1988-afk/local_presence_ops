import { getDemoRepository } from "../../../lib/demo-repository";

export default async function LocationsPage() {
  const { location } = await getDemoRepository();

  return (
    <div>
      <h1>Locations</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Category</th>
            <th>Status</th>
            <th>Booking URL</th>
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
            <td>{location.bookingUrl ?? "— missing —"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
