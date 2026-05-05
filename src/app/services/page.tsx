import Nav from '@/components/Nav';
import { prisma } from '@/lib/prisma';

export default async function Page() {
  const services = await prisma.service.findMany({ orderBy: { id: 'desc' } });

  return (
    <div>
      <Nav />
      <div className='p-4 grid md:grid-cols-2 gap-4'>
        <form className='card space-y-2' action='/api/services' method='post'>
          <h2 className='font-semibold'>Add Service</h2>
          <input className='input' name='name' placeholder='Service name' required />
          <input className='input' name='category' placeholder='Category' required />
          <textarea className='input' name='description' placeholder='Description' />
          <input className='input' name='basePrice' type='number' step='0.01' placeholder='Base price optional' />
          <label><input type='checkbox' name='active' defaultChecked /> Active</label>
          <button className='btn block'>Save</button>
        </form>
        <div className='card space-y-2'>
          {services.map((s) => (
            <div className='border rounded p-2' key={s.id}>
              <p>{s.name} ({s.category})</p>
              <p className='text-sm text-gray-500'>{s.active ? 'Active' : 'Inactive'}</p>
              <div className='flex gap-2 mt-2'>
                <form action='/api/services' method='post'>
                  <input type='hidden' name='action' value='toggle' />
                  <input type='hidden' name='id' value={s.id} />
                  <input type='hidden' name='current' value={String(s.active)} />
                  <button className='px-2 py-1 text-xs bg-gray-200 rounded'>Toggle</button>
                </form>
                <form action='/api/services' method='post'>
                  <input type='hidden' name='action' value='delete' />
                  <input type='hidden' name='id' value={s.id} />
                  <button className='px-2 py-1 text-xs bg-red-100 text-red-700 rounded'>Delete</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
