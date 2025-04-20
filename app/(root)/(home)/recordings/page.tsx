import CallList from '@/components/CallList1';

const RecordingsPage = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white p-4 md:p-6">
      <h1 className="text-3xl font-bold mt-2 mb-4">Recordings</h1>

      <div className="w-full">
        <CallList type="recordings" />
      </div>
    </section>
  );
};

export default RecordingsPage;
