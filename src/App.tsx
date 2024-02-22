import { CreateDogForm } from "./Components/CreateDogForm";
import { Dogs } from "./Components/Dogs";
import { Section } from "./Components/Section";
import { useDogs } from "./contexts/dogs.context";

export function App() {

  const {activeSelector} = useDogs();
  
  return (
    <div className="App" style={{ backgroundColor: "skyblue" }}>
      <header>
        <h1>pup-e-picker (Functional)</h1>
      </header>

      <Section label={'Dogs: '}>
        {activeSelector === "createDog" ? (
          <CreateDogForm/>
        ) : (
          <Dogs/>
        )}
      </Section>
    </div>
  );
}

