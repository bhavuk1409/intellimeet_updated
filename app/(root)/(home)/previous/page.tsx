import CallList from "@/components/CallList";

const PreviousPage = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white p-4 md:p-6">
      <h1 className="text-3xl font-bold mt-2 mb-4">Previous Calls</h1>

      <div className="w-full">
        <CallList type="ended" />
      </div>
    </section>
  );
};

export default PreviousPage;
