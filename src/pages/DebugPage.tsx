import { DataProvider, useData, resolveVariables } from '../templates/core/DataContext';

const DebugConsumer = () => {
  const { data } = useData();
  const template = "Teacher: {subjects.{selectedSubject}[0].teacher}";
  const resolved = resolveVariables(template, data);

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">Debug Consumer</h3>
      <div className="mb-2">
        <strong>Data Keys:</strong> {Object.keys(data).join(', ')}
      </div>
      <div className="mb-2">
        <strong>Selected Subject:</strong> {data.selectedSubject}
      </div>
      <div className="mb-2">
        <strong>Template:</strong> {template}
      </div>
      <div className="mb-2">
        <strong>Resolved:</strong> <span className={resolved.includes('{') ? 'text-red-500' : 'text-green-500'}>{resolved}</span>
      </div>
      <pre className="bg-gray-100 p-2 text-xs overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

const DebugPage = () => {
  const sampleData = {
    selectedSubject: "Mathematics",
    subjects: {
      Mathematics: [
        { teacher: "Mr. Rajesh Kumar", class: "10" }
      ],
      English: [
        { teacher: "Ms. Anita Sharma", class: "9" }
      ]
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Variable Resolution Debugger</h1>

      <div className="grid gap-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Direct Function Call</h2>
          <div className="p-4 bg-gray-50 rounded">
            Result: {resolveVariables("Teacher: {subjects.{selectedSubject}[0].teacher}", sampleData)}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. Via Context</h2>
          <DataProvider initialData={sampleData}>
            <DebugConsumer />
          </DataProvider>
        </section>
      </div>
    </div>
  );
};

export default DebugPage;
