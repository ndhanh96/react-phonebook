import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [name, setName] = useState([]);
  const [all, setAll] = useState([]);
  const [isClicked, setClicked] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/persons/")
      .then((res) => res.json())
      .then((res) => {
        res.map((person) => {
          setName((oldName) => [
            ...oldName,
            { id: person.id, name: person.name, number: person.number },
          ]);
        });
      });
  }, []);

  const showALL = () => {
    setName((name) => all);
    setClicked(!isClicked);
  };

  return (
    <div>
      {name.map((n) => (
        <div key={n.id}>
          <p>
            {n.name} {n.number}
          </p>
          {isClicked ? (
            <FilterMe
              setAll={setAll}
              setName={setName}
              name={name}
              isClicked={isClicked}
              setClicked={setClicked}
              id={n.id}
            />
          ) : (
            <></>
          )}
        </div>
      ))}
      {!isClicked ? <button onClick={showALL}>Show ALL</button> : <></>}
      <FormSender setName={setName} />
    </div>
  );
}

function FilterMe({ id, name, isClicked, setClicked, setAll, setName }) {
  function handleChange() {
    setClicked(!isClicked);
    setAll((all) => name);
    setName((name) => name.filter((n) => n.id === id));
  }
  return <button onClick={handleChange}>Click me</button>;
}

function FormSender({ setName }) {
  const [nameData, setNameData] = useState("");
  const [numberData, setNumberData] = useState("");

  async function postData(url, data) {
    console.log(url);
    try {
      const response = await axios.post(url, data);
      console.log(response.data);
      setName((oldName) => [
        ...oldName,
        {
          id: response.data.id,
          name: response.data.name,
          number: response.data.number,
        },
      ]);
    } catch (err) {
      console.log(err);
    }
  }

  function handleSubmit(e) {
    if (nameData && numberData) {
      postData("http://localhost:3001/api/persons/", {
        name: nameData,
        number: numberData,
      });
    } else {
      alert("missing name and number");
    }
    setNameData("");
    setNumberData("");
    e.preventDefault();
  }

  function handleNameChange(e) {
    setNameData(e.target.value);
  }

  function handleNumberChange(e) {
    setNumberData(e.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input value={nameData} onChange={handleNameChange} type="text" />
      </label>
      <label>
        Number:
        <input value={numberData} onChange={handleNumberChange} type="text" />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}

export default App;
